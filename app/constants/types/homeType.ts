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
  address: string;
};

export type FormRegister = {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  status: string;
};

export interface UserState {
  userProfile: UserType | null;
  loading: boolean;
  error: string | null;
}

export interface UserLocal {
  id: string;
  token: string;
  roles: [
    {
      roleName: string;
      description: string;
    }
  ];
  sitterProfile: CatSitter;
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
  id: string;
  avatar: string;
  fullName: string;
  bio: string;
  experience: string;
  sitterId: string;
  skill: string;
  rating: number;
  location: string;
  environment: string;
  maximumQuantity: number;
  status: string;
  latitude: number;
  longitude: number;
  profilePictures: [ProfilePicture];
};

export type ProfilePicture = {
  id: string;
  imageName: string;
  imageUrl: string;
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
  name: string;
  serviceType: string;
  type: string;
  actionDescription: string;
  price: number;
  endTime: number;
  startTime: number;
  isBasicService: boolean;
  isNew: boolean;
  isDeleted: boolean;
};

export type ConfigService = {
  id: string;
  ceilPrice: number;
  floorPrice: number;
  name: string;
  actionDescription: string;
  isBasicService: boolean | null;
  serviceType: string;
};

export interface Role {
  id: string;
  roleName: string;
}

export type Orders = {
  id: string;
  totalPages: number;
  totalElements: number;
  pageable: {
    paged: true;
    pageNumber: number;
    pageSize: number;
    offset: number;
    sort: [
      {
        direction: string;
        nullHandling: string;
        ascending: true;
        property: string;
        ignoreCase: true;
      }
    ];
    unpaged: true;
  };
  size: number;
  content: [Order];
  number: number;
  sort: [
    {
      direction: string;
      nullHandling: string;
      ascending: true;
      property: string;
      ignoreCase: boolean;
    }
  ];
  numberOfElements: 0;
  first: true;
  last: true;
  empty: true;
};

export type Order = {
  id: string;
  time: string;
  startDate: Date;
  endDate: Date;
  numberOfPet: number;
  name: string;
  phoneNumber: string;
  address: string;
  note: string;
  paymentStatus: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    email: string;
    fullName: string;
    avatar: string;
    phoneNumber: string;
    dob: Date;
    gender: string;
    address: string;
  };
  sitter: {
    id: string;
    email: string;
    fullName: string;
    avatar: string;
    phoneNumber: string;
    dob: Date;
    gender: string;
    address: string;
  };
  bookingDetailWithPetAndServices: [
    {
      id: string;
      quantity: number;
      status: number;
      createdAt: Date;
      updatedAt: Date;
      pet: {
        description: string;
        petName: string;
        breed: string;
        age: number;
        gender: string;
        weight: number;
        profilePicture: string;
        status: number;
      };
      service: {
        id: string;
        serviceName: string;
        otherName: string;
        additionDescription: string;
        serviceType: string;
        actionDescription: string;
        price: number;
      };
    }
  ];
};

export type CareSchedules = {
  id: string;
  tasks: Task[];
  startTime: Date;
  endTime: Date;
  sessionNotes: string;
  photoUrl: string;
  videoCallUrl: string;
  reportIssue: string;
  status: string;
};

export type Task = {
  id: string;
  description: string;
  startTime: Date;
  endTime: Date;
  status: number;
  createdAt: Date;
  updatedAt: Date;
  haveEvidence: boolean;
  petProfile: PetProfile;
};

// export type pet = {
//   id: string;
//   description: string;
//   petName: string;
//   species: string;
//   breed: string;
//   age: number;
//   gender: string;
//   weight: number;
//   specialNeeds: string;
//   vaccinationStatus: true;
//   vaccinationInfo: string;
//   microchipNumber: string;
//   medicalConditions: string;
//   profilePicture: string;
//   status: number;
// };
export type TaskEvidence = {
  id: string;
  photoUrl: string;
  videoUrl: string;
  comment: string;
};

export type Quiz = {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  quizQuestions: [QuizQuestions];
};

export type QuizQuestions = {
  id: string;
  questionText: string;
  questionType: string;
  quizAnswers: [
    {
      id: string;
      answerText: string;
      isCorrect: boolean;
    }
  ];
};

export type QuizResult = {
  score: number;
};

export type Report = {
  id: string;
  userId: string;
  reportTypeId: string;
  reason: string;
  description: string;
};

export type Transactions = {
  totalPages: number;
  totalElements: number;
  pageable: {
    paged: true;
    pageNumber: number;
    pageSize: number;
    offset: number;
    sort: [
      {
        direction: string;
        nullHandling: string;
        ascending: true;
        property: string;
        ignoreCase: true;
      }
    ];
    unpaged: true;
  };
  size: number;
  number: number;
  sort: [
    {
      direction: string;
      nullHandling: string;
      ascending: true;
      property: string;
      ignoreCase: boolean;
    }
  ];
  numberOfElements: 0;
  first: true;
  last: true;
  empty: true;
  content: [Transaction];
};

export type Transaction = {
  id: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  transactionType: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  fromUserId: string;
  toUserId: string;
  fromUserEmail: string;
  toUserEmail: string;
  fromUserWalletHistoryAmount: number;
  toUserWalletHistoryAmount: number;
};

export type Notification = {
  id: string;
  userId: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  createdAt: Date;
};

export type RequestWithdrawal = {
  userId: string;
  balance: number;
  bankNumber: string;
  fullName: string;
  bankName: string;
};
