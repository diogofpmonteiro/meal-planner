import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MealSlot } from "../types";
import { mockMealPlan } from "../mockData";

interface MealPlanStore {
  mealPlan: MealSlot[];
  addMealSlot: (slot: MealSlot) => void;
  removeMealSlot: (id: string) => void;
  updateMealSlot: (id: string, slot: Partial<MealSlot>) => void;
  getMealsForDate: (date: string) => MealSlot[];
  getMealsForWeek: (startDate: string) => MealSlot[];
}

export const useMealPlanStore = create<MealPlanStore>()(
  persist(
    (set, get) => ({
      mealPlan: mockMealPlan,

      addMealSlot: (slot) => set({ mealPlan: [...get().mealPlan, slot] }),

      removeMealSlot: (id) => set({ mealPlan: get().mealPlan.filter((m) => m.id !== id) }),

      updateMealSlot: (id, updates) =>
        set({
          mealPlan: get().mealPlan.map((m) => (m.id === id ? { ...m, ...updates } : m)),
        }),

      getMealsForDate: (date) => get().mealPlan.filter((m) => m.date === date),

      getMealsForWeek: (startDate) => {
        const start = new Date(startDate);
        const end = new Date(start);
        end.setDate(end.getDate() + 7);
        return get().mealPlan.filter((m) => {
          const mealDate = new Date(m.date);
          return mealDate >= start && mealDate < end;
        });
      },
    }),
    { name: "mealplan-storage" }
  )
);
