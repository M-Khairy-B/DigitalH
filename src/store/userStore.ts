import { create } from "zustand";

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
