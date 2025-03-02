/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';

interface UserState {
  user: Record<string, any> | null;
  setUser: (user: Record<string, any>) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
