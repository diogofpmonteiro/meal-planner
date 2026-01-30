import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ShoppingItem } from "../types";
import { useMealPlanStore } from "./mealPlanStore";
import { useRecipeStore } from "./recipeStore";

interface ShoppingStore {
  shoppingList: ShoppingItem[];
  generateShoppingList: (startDate: string, endDate: string) => void;
  toggleItemPurchased: (id: string) => void;
  addManualItem: (item: Omit<ShoppingItem, "id" | "purchased" | "recipeIds">) => void;
  removeShoppingItem: (id: string) => void;
  clearPurchasedItems: () => void;
}

export const useShoppingStore = create<ShoppingStore>()(
  persist(
    (set, get) => ({
      shoppingList: [],

      generateShoppingList: (startDate, endDate) => {
        const mealPlan = useMealPlanStore.getState().mealPlan;
        const recipes = useRecipeStore.getState().recipes;

        const start = new Date(startDate);
        const end = new Date(endDate);

        const relevantMeals = mealPlan.filter((m) => {
          const mealDate = new Date(m.date);
          return mealDate >= start && mealDate <= end;
        });

        const ingredientMap = new Map<string, ShoppingItem>();

        relevantMeals.forEach((meal) => {
          const recipe = recipes.find((r) => r.id === meal.recipeId);
          if (!recipe) return;

          const multiplier = meal.servings / recipe.servings;

          recipe.ingredients.forEach((ing) => {
            const key = `${ing.name.toLowerCase()}-${ing.unit}`;
            if (ingredientMap.has(key)) {
              const existing = ingredientMap.get(key)!;
              existing.quantity += ing.quantity * multiplier;
              if (!existing.recipeIds.includes(recipe.id)) existing.recipeIds.push(recipe.id);
            } else {
              ingredientMap.set(key, {
                id: Math.random().toString(36).substring(2, 11),
                name: ing.name,
                quantity: ing.quantity * multiplier,
                unit: ing.unit,
                category: ing.category,
                purchased: false,
                recipeIds: [recipe.id],
              });
            }
          });
        });

        set({ shoppingList: Array.from(ingredientMap.values()) });
      },

      toggleItemPurchased: (id) =>
        set({
          shoppingList: get().shoppingList.map((item) =>
            item.id === id ? { ...item, purchased: !item.purchased } : item,
          ),
        }),

      addManualItem: (item) =>
        set({
          shoppingList: [
            ...get().shoppingList,
            { ...item, id: Math.random().toString(36).substring(2, 11), purchased: false, recipeIds: [] },
          ],
        }),

      removeShoppingItem: (id) => set({ shoppingList: get().shoppingList.filter((item) => item.id !== id) }),

      clearPurchasedItems: () => set({ shoppingList: get().shoppingList.filter((item) => !item.purchased) }),
    }),
    { name: "shopping-storage" },
  ),
);
