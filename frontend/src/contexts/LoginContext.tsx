// AuthContext.tsx
import React, {createContext, useState, useEffect, ReactNode} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {UserInfo, LoginContextType} from './UserContext';

export const LoginContext = createContext<LoginContextType | undefined>(
  undefined,
);

interface LoginProviderProps {
  children: ReactNode;
}

export const LoginProvider: React.FC<LoginProviderProps> = ({children}) => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    businessId: null,
    userId: null,
    userRole: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  const login = async (
    businessId: string,
    userId: string,
    userRole: string,
  ) => {
    const userInfo = {businessId, userId, userRole};
    setUserInfo(userInfo);
    await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
  };

  const logout = async () => {
    setUserInfo({businessId: null, userId: null, userRole: null});
    await AsyncStorage.removeItem('userInfo');
  };

  const isLoggedIn = async () => {
    try {
      const userInfoString = await AsyncStorage.getItem('userInfo');
      if (userInfoString) {
        const userInfo: UserInfo = JSON.parse(userInfoString);
        setUserInfo(userInfo);
      }
    } catch (e) {
      console.log(`isLoggedIn error: ${e}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <LoginContext.Provider value={{userInfo, isLoading, login, logout}}>
      {children}
    </LoginContext.Provider>
  );
};
