import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  format,
  startOfWeek,
  startOfMonth,
  endOfMonth,
  addDays,
  addWeeks,
  addMonths,
  subWeeks,
  subMonths,
  isToday,
  isSameMonth,
  eachDayOfInterval,
} from "date-fns";
import { ChevronLeft, ChevronRight, Plus, X, Clock, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CalendarView, MealType, MealSlot } from "@/lib/types";
import { cn, generateId } from "@/lib/utils";
import { useMealPlanStore } from "@/lib/stores/mealPlanStore";
import { useRecipeStore } from "@/lib/stores/recipeStore";

const mealTypeLabels: Record<MealType, { label: string; icon: string; color: string }> = {
  breakfast: { label: "Breakfast", icon: "🌅", color: "bg-amber-100 border-amber-200 text-amber-700" },
  lunch: { label: "Lunch", icon: "☀️", color: "bg-orange-100 border-orange-200 text-orange-700" },
  dinner: { label: "Dinner", icon: "🌙", color: "bg-blue-100 border-blue-200 text-blue-700" },
  snack: { label: "Snack", icon: "🍿", color: "bg-green-100 border-green-200 text-green-700" },
};

export function MealCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>("week");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<MealType>("breakfast");
  const [isAddingMeal, setIsAddingMeal] = useState(false);

  const { mealPlan, addMealSlot, removeMealSlot } = useMealPlanStore();
  const { recipes, getRecipeById } = useRecipeStore();

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  const navigatePrev = () => {
    if (view === "day") setCurrentDate(addDays(currentDate, -1));
    else if (view === "week") setCurrentDate(subWeeks(currentDate, 1));
    else setCurrentDate(subMonths(currentDate, 1));
  };

  const navigateNext = () => {
    if (view === "day") setCurrentDate(addDays(currentDate, 1));
    else if (view === "week") setCurrentDate(addWeeks(currentDate, 1));
    else setCurrentDate(addMonths(currentDate, 1));
  };

  const handleAddMeal = (recipeId: string) => {
    if (!selectedDate) return;

    const newSlot: MealSlot = {
      id: generateId(),
      date: selectedDate,
      mealType: selectedMealType,
      recipeId,
      servings: 2,
    };

    addMealSlot(newSlot);
    setIsAddingMeal(false);
    setSelectedDate(null);
  };

  const getMealsForDate = (date: string) => {
    return mealPlan.filter((m) => m.date === date);
  };

  const renderDayCell = (date: Date, isCompact = false) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const dayMeals = getMealsForDate(dateStr);
    const isCurrentDay = isToday(date);
    const isCurrentMonth = isSameMonth(date, currentDate);

    return (
      <div
        key={dateStr}
        className={cn(
          "rounded-xl transition-all cursor-pointer group",
          isCompact ? "p-2" : "p-3 min-h-[120px]",
          isCurrentDay && "ring-2 ring-primary bg-primary/5",
          !isCurrentMonth && "opacity-40",
          "hover:bg-muted"
        )}
        onClick={() => {
          setSelectedDate(dateStr);
          setIsAddingMeal(true);
        }}>
        <div className='flex items-center justify-between mb-2'>
          <span className={cn("text-sm font-bold", isCurrentDay ? "text-primary" : "text-foreground")}>
            {format(date, isCompact ? "d" : "EEE d")}
          </span>
          <button
            className='opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full bg-primary text-primary-foreground'
            onClick={(e) => {
              e.stopPropagation();
              setSelectedDate(dateStr);
              setIsAddingMeal(true);
            }}>
            <Plus className='w-3 h-3' />
          </button>
        </div>
        <div className='space-y-1'>
          {dayMeals.map((meal) => {
            const recipe = getRecipeById(meal.recipeId);
            const mealInfo = mealTypeLabels[meal.mealType];

            return (
              <div
                key={meal.id}
                className={cn("group/meal relative text-xs p-1.5 rounded-lg border transition-all", mealInfo.color)}
                onClick={(e) => e.stopPropagation()}>
                <div className='flex items-center gap-1'>
                  <span className='text-sm'>{mealInfo.icon}</span>
                  <span className='font-medium truncate flex-1'>{recipe?.name || "Unknown"}</span>
                  <button
                    className='opacity-0 group-hover/meal:opacity-100 transition-opacity'
                    onClick={() => removeMealSlot(meal.id)}>
                    <X className='w-3 h-3' />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const days = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

    return <div className='grid grid-cols-7 gap-2'>{days.map((date) => renderDayCell(date))}</div>;
  };

  const renderDayView = () => {
    const dateStr = format(currentDate, "yyyy-MM-dd");
    const dayMeals = getMealsForDate(dateStr);

    return (
      <div className='space-y-4'>
        {(["breakfast", "lunch", "dinner"] as MealType[]).map((mealType) => {
          const meal = dayMeals.find((m) => m.mealType === mealType);
          const recipe = meal ? getRecipeById(meal.recipeId) : null;
          const mealInfo = mealTypeLabels[mealType];

          return (
            <Card key={mealType} className='overflow-hidden'>
              <CardHeader className={cn("py-3", mealInfo.color)}>
                <CardTitle className='text-base flex items-center gap-2'>
                  <span className='text-xl'>{mealInfo.icon}</span>
                  {mealInfo.label}
                </CardTitle>
              </CardHeader>
              <CardContent className='p-4'>
                {recipe ? (
                  <div className='flex items-start justify-between gap-4'>
                    <div className='flex-1'>
                      <h4 className='font-semibold text-foreground'>{recipe.name}</h4>
                      <p className='text-sm text-muted-foreground mt-1'>{recipe.description}</p>
                      <div className='flex items-center gap-4 mt-3 text-sm text-muted-foreground'>
                        <span className='flex items-center gap-1'>
                          <Clock className='w-4 h-4' />
                          {(recipe.prepTime || 0) + (recipe.cookTime || 0)} min
                        </span>
                        <span className='flex items-center gap-1'>
                          <Users className='w-4 h-4' />
                          {meal?.servings} servings
                        </span>
                      </div>
                    </div>
                    <div className='text-right'>
                      <p className='text-lg font-bold text-primary'>{recipe.macros.calories} cal</p>
                      <p className='text-xs text-muted-foreground'>{recipe.macros.protein}g protein</p>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='mt-2 text-destructive hover:text-destructive'
                        onClick={() => meal && removeMealSlot(meal.id)}>
                        <X className='w-4 h-4 mr-1' />
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className='text-center py-4'>
                    <p className='text-muted-foreground mb-3'>No meal planned</p>
                    <Button
                      variant='outline'
                      onClick={() => {
                        setSelectedDate(dateStr);
                        setSelectedMealType(mealType);
                        setIsAddingMeal(true);
                      }}>
                      <Plus className='w-4 h-4 mr-2' />
                      Add {mealInfo.label}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  const renderMonthView = () => {
    const days = eachDayOfInterval({
      start: startOfWeek(monthStart, { weekStartsOn: 1 }),
      end: endOfMonth(addDays(monthEnd, 7)),
    });
    const weeks: Date[][] = [];

    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return (
      <div className='space-y-1'>
        {/* Day headers */}
        <div className='grid grid-cols-7 gap-1 mb-2'>
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div key={day} className='text-center text-xs font-medium text-muted-foreground py-2'>
              {day}
            </div>
          ))}
        </div>
        {/* Calendar grid */}
        {weeks.slice(0, 6).map((week, i) => (
          <div key={i} className='grid grid-cols-7 gap-1'>
            {week.map((date) => renderDayCell(date, true))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className='space-y-6 md:ml-48'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h1 className='font-display text-2xl md:text-3xl font-bold text-foreground'>Meal Plan</h1>
          <p className='text-muted-foreground'>
            {view === "day" && format(currentDate, "EEEE, MMMM d, yyyy")}
            {view === "week" &&
              `Week of ${format(weekStart, "MMM d")} - ${format(addDays(weekStart, 6), "MMM d, yyyy")}`}
            {view === "month" && format(currentDate, "MMMM yyyy")}
          </p>
        </div>

        <div className='flex items-center gap-2'>
          {/* View Selector */}
          <div className='flex bg-muted rounded-lg p-1'>
            {(["day", "week", "month"] as CalendarView[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-md transition-all capitalize",
                  view === v ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}>
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className='flex items-center justify-between'>
        <Button variant='outline' size='sm' onClick={navigatePrev}>
          <ChevronLeft className='w-4 h-4 mr-1' />
          Prev
        </Button>
        <Button variant='ghost' size='sm' onClick={() => setCurrentDate(new Date())}>
          Today
        </Button>
        <Button variant='outline' size='sm' onClick={navigateNext}>
          Next
          <ChevronRight className='w-4 h-4 ml-1' />
        </Button>
      </div>

      {/* Calendar View */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={`${view}-${currentDate.toISOString()}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}>
          <Card className='p-4'>
            {view === "day" && renderDayView()}
            {view === "week" && renderWeekView()}
            {view === "month" && renderMonthView()}
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Add Meal Dialog */}
      <Dialog open={isAddingMeal} onOpenChange={setIsAddingMeal}>
        <DialogContent className='max-w-md max-h-[80vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Add Meal</DialogTitle>
          </DialogHeader>

          <div className='space-y-4'>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Date</label>
              <p className='text-muted-foreground'>
                {selectedDate ? format(new Date(selectedDate), "EEEE, MMMM d, yyyy") : "-"}
              </p>
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium'>Meal Type</label>
              <Select value={selectedMealType} onValueChange={(v) => setSelectedMealType(v as MealType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(mealTypeLabels).map(([key, { label, icon }]) => (
                    <SelectItem key={key} value={key}>
                      <span className='flex items-center gap-2'>
                        <span>{icon}</span>
                        {label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium'>Select Recipe</label>
              <div className='space-y-2 max-h-64 overflow-y-auto'>
                {recipes.map((recipe) => (
                  <button
                    key={recipe.id}
                    onClick={() => handleAddMeal(recipe.id)}
                    className='w-full text-left p-3 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='font-medium'>{recipe.name}</p>
                        <p className='text-xs text-muted-foreground'>
                          {recipe.macros.calories} cal · {recipe.macros.protein}g protein
                        </p>
                      </div>
                      <div className='flex gap-1'>
                        {recipe.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className='text-xs px-2 py-0.5 rounded-full bg-sage-100 text-sage-600'>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
