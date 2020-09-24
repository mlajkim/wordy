export type Props = {
  profile: profile;
  words: any;
  isSandbox: boolean;
  page: any;
  modal: any;
  snackbar: any;
  isDataLoading: boolean;
  setProfile: (arg0: any) => void;
  setWords: (arg0: any) => void;
  setSandbox: (arg0: boolean) => void;
  setPage: (arg0: any) => void;
  setModal: (arg0: any) => void;
  setSnackbar: (arg0: any) => void;
  setDataLoading: (arg0: boolean) => void;
}

export type profile = {
  isSignedIn: boolean;
  UNIQUE_ID: string;
  typeOfLogIn: string; 
  userInfo: userInfo;
  subInfo: any;
}

export type userInfo = {
  _id: string;
  status: string,
  typeOfLogIn: string,
  federalId: string, // Google's googleId;
  email: string,
  familyName: string,
  givenName: string,
  profileImgUrl: string,
  subscription: string,
  readPatch: string,
  joinedDate: string,
  lastUsed: string,
  promotedDate: string,
  lastTransactionID: string,
}

