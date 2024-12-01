import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../axiosClient";
import axios from "axios";
import { UserState, UserType } from "@/app/constants/types/homeType";
import { RootState } from "../store";
import { toast } from "react-toastify";

// Thunk để lấy thông tin người dùng
export const fetchUserProfile = createAsyncThunk<
  UserType,
  void,
  { rejectValue: string }
>("/auth", async (_, thunkAPI) => {
  try {
    const response = await axiosClient("auth/info");
    return response.data as UserType;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      try {
        // Get tokens from localStorage
        const refreshToken = localStorage.getItem("refreshToken");
        const authToken = localStorage.getItem("authToken");

        if (!refreshToken || !authToken) {
          return thunkAPI.rejectWithValue("Missing tokens for refresh");
        }

        // Refresh tokens
        const refreshResponse = await axiosClient.post("auth/refresh", {
          refreshToken,
          authToken,
        });

        const { newAuthToken, newRefreshToken } = refreshResponse.data;

        // Store new tokens in localStorage
        localStorage.setItem("authToken", newAuthToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        // Retry original request with new token
        // axiosClient.defaults.headers.common[
        //   "Authorization"
        // ] = `Bearer ${newAuthToken}`;
        const retryResponse = await axiosClient("auth/info");
        return retryResponse.data as UserType;
      } catch (refreshError) {
        let refreshErrorMessage = "Token refresh failed";
        if (axios.isAxiosError(refreshError)) {
          refreshErrorMessage =
            refreshError.response?.data || refreshError.message;
        }
        return thunkAPI.rejectWithValue(refreshErrorMessage);
      }
    } else {
      let errorMessage = "An unexpected error occurred";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data || error.message;
      }
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
});

// Thunk để cập nhật thông tin người dùng
export const updateUserProfile = createAsyncThunk<
  UserType,
  Partial<UserType>,
  { rejectValue: string }
>("user", async (updatedData, thunkAPI) => {
  const state = thunkAPI.getState() as RootState;
  const userId = state.user.userProfile?.id;

  if (!userId) {
    return thunkAPI.rejectWithValue("Không tìm thấy ID người dùng");
  }

  try {
    const response = await axiosClient.put(`/users/${userId}`, updatedData);
    console.log(response);

    if (response.status === 200) {
      toast.success("Cập nhật hồ sơ thành công");
    }
    return response.data as UserType;
  } catch (error) {
    let errorMessage = "Đã xảy ra lỗi không xác định";
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

const initialState: UserState = {
  userProfile: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Xử lý fetchUserProfile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userProfile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Không thể lấy thông tin người dùng";
      })
      // Xử lý updateUserProfile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userProfile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Không thể cập nhật thông tin người dùng";
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
