import { create } from 'zustand';

const useAuthStore = create((set) => ({
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,

  setTokens: (access, refresh) =>
    set({ accessToken: access, refreshToken: refresh, isAuthenticated: true }),

  logout: () =>
    set({ accessToken: null, refreshToken: null, isAuthenticated: false }),
}));

export default useAuthStore;