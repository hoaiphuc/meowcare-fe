import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../axiosClient";
import axios from "axios";
import { UserState, UserType } from "@/app/constants/types/homeType";
import { RootState } from "../store";

// Thunk để lấy thông tin người dùng
export const fetchUserProfile = createAsyncThunk<
  UserType,
  void,
  { rejectValue: string }
>("/auth", async (_, thunkAPI) => {
  try {
    const response = await axiosClient("auth/test");
    // console.log(response);

    return response.data as UserType;
  } catch (error) {
    let errorMessage = "Đã xảy ra lỗi không xác định";
    if (axios.isAxiosError(error)) {
      // Truy cập dữ liệu phản hồi từ server
      errorMessage = error.response?.data || error.message;
    } else if (error instanceof Error) {
      // Xử lý các lỗi khác
      errorMessage = error.message;
    }
    return thunkAPI.rejectWithValue(errorMessage);
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
    const response = await axiosClient.put(`/user/${userId}`, updatedData);
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
    // Có thể thêm các reducer sync nếu cần
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

export default userSlice.reducer;
