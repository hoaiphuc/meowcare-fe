export type UserType = {
  fullName: string;
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

export type PetProfile = {
  id: string;
  description: string;
  petName: string;
  species: string;
  breed: string;
  age: number;
  gender: string;
  weight: number;
  specialNeeds: string;
  vaccinationStatus: true;
  vaccinationInfo: string;
  microchipNumber: string;
  medicalConditions: string;
  profilePicture: string;
  status: number;
};

export type CatSitter = {
  fullName: string;
  id: string;
  bio: string;
  experience: string;
  skill: string;
  rating: number;
  location: string;
  environment: string;
  maximumQuantity: number;
  user: {
    email: string;
    password: string;
    fullName: string;
    avatar: string;
    phoneNumber: string;
    dob: Date;
    gender: string;
    address: string;
  };
};
