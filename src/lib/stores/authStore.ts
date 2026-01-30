import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types";
import { mockUsers } from "../mockData";

interface AuthStore {
  currentUser: User | null;
  login: (email: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      currentUser: null,

      login: (email) => {
        const user = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (user) {
          set({ currentUser: user });
          return true;
        }
        const newUser: User = {
          id: Math.random().toString(36).substring(2, 11),
          name: email.split("@")[0],
          email,
        };
        set({ currentUser: newUser });
        return true;
      },

      logout: () => set({ currentUser: null }),
    }),
    { name: "user-storage" },
  ),
);
