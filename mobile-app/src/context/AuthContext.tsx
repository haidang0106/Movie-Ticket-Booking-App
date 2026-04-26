import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { loadAuthSession, clearAuthSession, saveAuthSession } from '../utils/token';
import { customerService } from '../services/customerService';
import { authService } from '../services/authService';

interface AuthState {
  user: any;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  setSession: (accessToken: string, refreshToken: string, user: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,
  setSession: async () => {},
  logout: async () => {},
  refreshProfile: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const bootstrapAsync = async () => {
      let accessToken = null;
      let user = null;
      let isAuthenticated = false;

      try {
        const session = await loadAuthSession();
        if (session.accessToken) {
          accessToken = session.accessToken;
          // Attempt to fetch fresh profile
          const profileRes = await customerService.getProfile();
          if (profileRes.success) {
            user = profileRes.data;
            isAuthenticated = true;
          } else {
             // Let interceptor handle refresh if it was 401
             // If completely failed, session will be cleared by interceptor
          }
        }
      } catch (e) {
        // Restoring token failed
        console.log('Failed to restore token', e);
      }

      setState({
        user,
        accessToken,
        isAuthenticated,
        isLoading: false,
      });
    };

    bootstrapAsync();
  }, []);

  const setSession = async (accessToken: string, refreshToken: string, user: any) => {
    await saveAuthSession(accessToken, refreshToken, user);
    setState({
      user,
      accessToken,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const logout = async () => {
    setState({ ...state, isLoading: true });
    try {
      const session = await loadAuthSession();
      if (session.refreshToken) {
         await authService.logout(session.refreshToken);
      }
    } catch (e) {
      console.log('Logout API error', e);
    }
    await clearAuthSession();
    setState({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const refreshProfile = async () => {
    try {
      const profileRes = await customerService.getProfile();
      if (profileRes.success) {
        setState((prev) => ({ ...prev, user: profileRes.data }));
      }
    } catch (e) {
      console.log('Refresh profile failed', e);
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, setSession, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
