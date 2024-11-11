export type UserType = {
  fullName: string;
  id: string;
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
  gender: string;
};

export interface UserState {
  userProfile: UserType | null;
  loading: boolean;
  error: string | null;
}

export interface UserLocal {
  id: number;
  token: string;
  roles: [
    {
      roleName: string;
      description: string;
    }
  ];
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

export type SideNavItem = {
  title: string;
  path: string;
  icon?: JSX.Element;
  subMenu?: boolean;
  subMenuItems?: SideNavItem[];
};

export type Service = {
  id: string;
  serviceName: string;
  serviceType: string;
  actionDescription: string;
  price: number;
  duration: number;
  startTime: number;
  isBasicService: boolean;
};

export type ConfigService = {
  id: string;
  ceilPrice: number;
  floorPrice: number;
  name: string;
  isBasicService: boolean | null;
};

export interface Role {
  id: string;
  roleName: string;
}

export type Order = {
  id: string;
  time: number;
  startDate: number;
  endDate: number;
  numberOfPet: number;
  name: string;
  phoneNumber: string;
  address: string;
  paymentStatus: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  note: string;
  bookingDetails: string;
  bookingDetailWithPetAndServices: [
    {
      id: string;
      quantity: number;
      pet: {
        id: string;
        description: string;
        petName: string;
        breed: string;
        age: string;
        gender: string;
        weight: string;
        profilePicture: string;
        status: string;
        createdAt: string;
        updatedAt: string;
        medicalConditions: [];
      };
      service: {
        id: string;
        serviceName: string;
        serviceType: string;
        actionDescription: string;
        price: string;
        duration: string;
        startTime: number;
        status: number;
        configServiceId: string;
      };
    }
  ];
  sitterId: string;
  user: {
    id: string;
    email: number;
    password: string;
    fullName: number;
    avatar: string;
    phoneNumber: string;
    dob: number;
    gender: string;
    address: string;
    registrationDate: string;
    status: number;
  };
  sitter: {
    id: number;
    email: number;
    password: string;
    fullName: number;
    avatar: string;
    phoneNumber: string;
    dob: number;
    gender: string;
    address: string;
    registrationDate: string;
    status: number;
  };
};
