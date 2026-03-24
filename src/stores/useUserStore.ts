import { create } from "zustand";

interface UserState {
  user: { id: string } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: UserState["user"]) => void;
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
