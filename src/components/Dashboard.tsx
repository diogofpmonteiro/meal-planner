import { motion } from "framer-motion";
import { format, startOfWeek, addDays, isToday } from "date-fns";
import { CalendarDays, ChefHat, ShoppingCart, ChevronRight, Plus, Flame, Beef } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MealType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/stores/authStore";
import { useMealPlanStore } from "@/lib/stores/mealPlanStore";
import { useRecipeStore } from "@/lib/stores/recipeStore";
import { useShoppingStore } from "@/lib/stores/shoppingStore";

const mealTypeIcons: Record<MealType, string> = {
  breakfast: "🌅",
  lunch: "☀️",
  dinner: "🌙",
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function Dashboard() {
  const { currentUser } = useAuthStore();
  const { mealPlan } = useMealPlanStore();
  const { recipes } = useRecipeStore();
  const { shoppingList, generateShoppingList } = useShoppingStore();

  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });

  // Get this week's meals
  const thisWeekMeals = mealPlan.filter((meal) => {
    const mealDate = new Date(meal.date);
    const weekEnd = addDays(weekStart, 7);
    return mealDate >= weekStart && mealDate < weekEnd;
  });

  // Today's meals
  const todayStr = format(today, "yyyy-MM-dd");
  const todayMeals = mealPlan.filter((m) => m.date === todayStr);

  // Calculate weekly macros
  const weeklyMacros = thisWeekMeals.reduce(
    (acc, meal) => {
      const recipe = recipes.find((r) => r.id === meal.recipeId);
      if (recipe) {
        const multiplier = meal.servings / recipe.servings;
        acc.calories += recipe.macros.calories * multiplier;
        acc.protein += recipe.macros.protein * multiplier;
        acc.carbs += recipe.macros.carbs * multiplier;
        acc.fats += recipe.macros.fats * multiplier;
      }
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 },
  );

  // Generate shopping list for the week if empty
  const handleGenerateList = () => {
    const endDate = format(addDays(weekStart, 6), "yyyy-MM-dd");
    generateShoppingList(format(weekStart, "yyyy-MM-dd"), endDate);
  };

  const unpurchasedItems = shoppingList.filter((item) => !item.purchased);

  return (
    <motion.div variants={containerVariants} initial='hidden' animate='show' className='space-y-6 md:ml-48'>
      {/* Welcome Header */}
      <motion.div variants={itemVariants} className='space-y-1'>
        <h1 className='font-display text-2xl md:text-3xl font-bold text-foreground'>
          Welcome back, {currentUser?.name || "Chef"}! 👋
        </h1>
        <p className='text-muted-foreground'>{format(today, "EEEE, MMMM d")} — Let's plan some delicious meals</p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={itemVariants} className='grid grid-cols-2 md:grid-cols-4 gap-3'>
        <Card className='bg-linear-to-br from-primary/10 to-primary/5 border-primary/20'>
          <CardContent className='p-4'>
            <div className='flex items-center gap-3'>
              <div className='p-2 rounded-lg bg-primary/20'>
                <CalendarDays className='w-5 h-5 text-primary' />
              </div>
              <div>
                <p className='text-2xl font-bold text-foreground'>{thisWeekMeals.length}</p>
                <p className='text-xs text-muted-foreground'>Meals Planned</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='bg-linear-to-br from-terracotta-50 to-terracotta-100/50 border-terracotta-100'>
          <CardContent className='p-4'>
            <div className='flex items-center gap-3'>
              <div className='p-2 rounded-lg bg-terracotta-500/20'>
                <ChefHat className='w-5 h-5 text-terracotta-500' />
              </div>
              <div>
                <p className='text-2xl font-bold text-foreground'>{recipes.length}</p>
                <p className='text-xs text-muted-foreground'>Recipes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='bg-linear-to-br from-sage-50 to-sage-100/50 border-sage-100'>
          <CardContent className='p-4'>
            <div className='flex items-center gap-3'>
              <div className='p-2 rounded-lg bg-sage-500/20'>
                <Flame className='w-5 h-5 text-sage-500' />
              </div>
              <div>
                <p className='text-2xl font-bold text-foreground'>{Math.round(weeklyMacros.calories)}</p>
                <p className='text-xs text-muted-foreground'>Weekly Cal</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='bg-linear-to-br from-cream-100 to-cream-200/50 border-cream-200'>
          <CardContent className='p-4'>
            <div className='flex items-center gap-3'>
              <div className='p-2 rounded-lg bg-terracotta-500/20'>
                <Beef className='w-5 h-5 text-terracotta-500' />
              </div>
              <div>
                <p className='text-2xl font-bold text-foreground'>{Math.round(weeklyMacros.protein)}g</p>
                <p className='text-xs text-muted-foreground'>Weekly Protein</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Today's Meals */}
      <motion.div variants={itemVariants}>
        <Card className='overflow-hidden'>
          <CardHeader className='pb-3'>
            <div className='flex items-center justify-between'>
              <CardTitle className='text-lg font-semibold flex items-center gap-2'>
                <span className='text-xl'>🍽️</span>
                Today's Meals
              </CardTitle>
              <Link to='/calendar'>
                <Button variant='ghost' size='sm' className='text-primary'>
                  View All
                  <ChevronRight className='w-4 h-4 ml-1' />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className='pb-4'>
            {todayMeals.length === 0 ? (
              <div className='text-center py-8'>
                <p className='text-muted-foreground mb-4'>No meals planned for today</p>
                <Link to='/calendar'>
                  <Button className='bg-primary hover:bg-primary/90'>
                    <Plus className='w-4 h-4 mr-2' />
                    Add Meal
                  </Button>
                </Link>
              </div>
            ) : (
              <div className='space-y-3'>
                {(["breakfast", "lunch", "dinner"] as MealType[]).map((mealType) => {
                  const meal = todayMeals.find((m) => m.mealType === mealType);
                  const recipe = meal ? recipes.find((r) => r.id === meal.recipeId) : null;

                  return (
                    <div
                      key={mealType}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl transition-colors",
                        meal ? "bg-sage-50 border border-sage-100" : "bg-muted/50 border border-dashed border-border",
                      )}>
                      <span className='text-2xl'>{mealTypeIcons[mealType]}</span>
                      <div className='flex-1'>
                        <p className='text-xs uppercase tracking-wide text-muted-foreground font-medium'>{mealType}</p>
                        {recipe ? (
                          <p className='font-medium text-foreground'>{recipe.name}</p>
                        ) : (
                          <p className='text-muted-foreground text-sm'>Not planned</p>
                        )}
                      </div>
                      {recipe && (
                        <div className='text-right text-xs text-muted-foreground'>
                          <p>{recipe.macros.calories} cal</p>
                          <p>{recipe.macros.protein}g protein</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Week Overview */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className='pb-3'>
            <div className='flex items-center justify-between'>
              <CardTitle className='text-lg font-semibold flex items-center gap-2'>
                <span className='text-xl'>📅</span>
                This Week
              </CardTitle>
              <Link to='/calendar'>
                <Button variant='ghost' size='sm' className='text-primary'>
                  Full Calendar
                  <ChevronRight className='w-4 h-4 ml-1' />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-7 gap-1 md:gap-2'>
              {Array.from({ length: 7 }).map((_, i) => {
                const date = addDays(weekStart, i);
                const dateStr = format(date, "yyyy-MM-dd");
                const dayMeals = mealPlan.filter((m) => m.date === dateStr);
                const isCurrentDay = isToday(date);

                return (
                  <Link
                    key={dateStr}
                    to='/calendar'
                    className={cn(
                      "p-2 md:p-3 rounded-xl text-center transition-all hover:bg-muted",
                      isCurrentDay && "bg-primary/10 ring-2 ring-primary",
                    )}>
                    <p className='text-xs text-muted-foreground font-medium'>{format(date, "EEE")}</p>
                    <p className={cn("text-lg font-bold", isCurrentDay ? "text-primary" : "text-foreground")}>
                      {format(date, "d")}
                    </p>
                    <div className='flex justify-center gap-0.5 mt-1'>
                      {dayMeals.map((meal) => (
                        <div
                          key={meal.id}
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            meal.mealType === "breakfast" && "bg-amber-400",
                            meal.mealType === "lunch" && "bg-orange-400",
                            meal.mealType === "dinner" && "bg-blue-400",
                          )}
                        />
                      ))}
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Shopping List Preview */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className='pb-3'>
            <div className='flex items-center justify-between'>
              <CardTitle className='text-lg font-semibold flex items-center gap-2'>
                <ShoppingCart className='w-5 h-5 text-primary' />
                Shopping List
              </CardTitle>
              <Link to='/shopping'>
                <Button variant='ghost' size='sm' className='text-primary'>
                  View All
                  <ChevronRight className='w-4 h-4 ml-1' />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {shoppingList.length === 0 ? (
              <div className='text-center py-6'>
                <p className='text-muted-foreground mb-4'>No shopping list generated yet</p>
                <Button onClick={handleGenerateList} className='bg-primary hover:bg-primary/90'>
                  <ShoppingCart className='w-4 h-4 mr-2' />
                  Generate from Meal Plan
                </Button>
              </div>
            ) : (
              <div className='space-y-4'>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-muted-foreground'>{unpurchasedItems.length} items remaining</span>
                  <span className='text-primary font-medium'>
                    {shoppingList.length - unpurchasedItems.length}/{shoppingList.length} done
                  </span>
                </div>
                <div className='space-y-2'>
                  {unpurchasedItems.slice(0, 5).map((item) => (
                    <div key={item.id} className='flex items-center gap-3 p-2 rounded-lg bg-muted/50'>
                      <div className='w-2 h-2 rounded-full bg-primary' />
                      <span className='flex-1 text-sm font-medium'>{item.name}</span>
                      <span className='text-xs text-muted-foreground'>
                        {item.quantity} {item.unit}
                      </span>
                    </div>
                  ))}
                  {unpurchasedItems.length > 5 && (
                    <p className='text-sm text-muted-foreground text-center pt-2'>
                      +{unpurchasedItems.length - 5} more items
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
