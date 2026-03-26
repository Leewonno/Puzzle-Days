import { create } from "zustand";

export interface AppUser {
  id: string;
  email: string | null;
  name: string | null;
  avatar: string | null;
}

interface UserState {
  user: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: AppUser | null) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  clearUser: () => set({ user: null, isAuthenticated: false }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
