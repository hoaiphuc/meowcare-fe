export type UserType = {
  id: number;
  username: string;
  password: string;
  avatar: string;
  url: string;
  introduce: string;
  position: string;
  email: string;
  phoneNumber: string;
  roleName: string;
  status: number;
};

export interface UserState {
  userProfile: UserType | null;
  loading: boolean;
  error: string | null;
}

export interface UserLocal {
  // data: {
  data: {
    userId: number;
    // roleName: string;
    token: string;
    // };
    roles: [
      {
        name: string;
        description: string;
      }
    ];
  };
}

export type ProfileSidebarItem = {
  title: string;
  path: string;
  icon?: JSX.Element;
};
