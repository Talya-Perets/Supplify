export interface UserInfo {
  businessId: string | null;
  userId: string | null;
  userRole: string | null;
}

export interface LoginContextType {
  userInfo: UserInfo;
  isLoading: boolean;
  login: (
    businessId: string,
    userId: string,
    userRole: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
}
