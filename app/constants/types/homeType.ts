export type UserType = {
  userId: number;
  userName: string;
  password: string;
  avatar: string;
  url: string;
  introduce: string;
  position: string;
  email: string;
  phoneNumber: number;
  roleName: string;
  status: number;
};

export interface UserLocal {
  data: {
    data: {
      userId: number;
      roleName: string;
      token: string;
    };
  };
}
