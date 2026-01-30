import { create } from "zustand";
import supabase from "../supabase";
import type { User } from "@supabase/supabase-js";

interface AuthStore {
  user: User | null;
  loading: boolean;
  error: string | null;
  loginMagicLink: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => {
  // Listen to auth state changes
  supabase.auth.onAuthStateChange((_event, session) => {
    set({ user: session?.user ?? null });
  });

  return {
    user: null,
    loading: false,
    error: null,

    loginMagicLink: async (email: string) => {
      set({ loading: true, error: null });
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: "http://localhost:5173/" },
      });
      if (error) set({ error: error.message });
      set({ loading: false });
    },

    logout: async () => {
      await supabase.auth.signOut();
      set({ user: null });
    },

    fetchUser: async () => {
      const { data } = await supabase.auth.getUser();
      set({ user: data.user ?? null });
    },
  };
});
