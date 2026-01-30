import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Recipe } from "../types";
import { mockRecipes } from "../mockData";

interface RecipeStore {
  recipes: Recipe[];
  addRecipe: (recipe: Recipe) => void;
  updateRecipe: (id: string, recipe: Partial<Recipe>) => void;
  deleteRecipe: (id: string) => void;
  getRecipeById: (id: string) => Recipe | undefined;
}

export const useRecipeStore = create<RecipeStore>()(
  persist(
    (set, get) => ({
      recipes: mockRecipes,

      addRecipe: (recipe) => set({ recipes: [...get().recipes, recipe] }),

      updateRecipe: (id, updates) =>
        set({
          recipes: get().recipes.map((r) => (r.id === id ? { ...r, ...updates } : r)),
        }),

      deleteRecipe: (id) =>
        set({
          recipes: get().recipes.filter((r) => r.id !== id),
        }),

      getRecipeById: (id) => get().recipes.find((r) => r.id === id),
    }),
    { name: "recipe-storage" },
  ),
);
