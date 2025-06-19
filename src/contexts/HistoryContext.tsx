
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface DayData {
  date: string;
  caloriesConsumed: number;
  caloriesBurned: number;
  calorieTarget: number;
  waterIntake: number;
  waterTarget: number;
  workoutsToday: number;
  mealsLogged: number;
  workouts: Array<{ type: string; duration: number; calories: number; time: string }>;
  meals: Array<{ name: string; calories: number; mealType: string; time: string }>;
}

export interface HistoryContextType {
  currentDay: DayData;
  history: DayData[];
  updateCurrentDay: (updates: Partial<DayData>) => void;
  addWorkout: (workout: { type: string; duration: number; calories: number }) => void;
  addMeal: (meal: { name: string; calories: number; mealType: string }) => void;
  addWater: () => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

const getToday = () => new Date().toISOString().split('T')[0];

const createEmptyDay = (date: string): DayData => ({
  date,
  caloriesConsumed: 0,
  caloriesBurned: 0,
  calorieTarget: 2200,
  waterIntake: 0,
  waterTarget: 8,
  workoutsToday: 0,
  mealsLogged: 0,
  workouts: [],
  meals: []
});

export const HistoryProvider = ({ children }: { children: ReactNode }) => {
  const [currentDay, setCurrentDay] = useState<DayData>(() => {
    const today = getToday();
    const saved = localStorage.getItem(`fitcal-day-${today}`);
    return saved ? JSON.parse(saved) : createEmptyDay(today);
  });

  const [history, setHistory] = useState<DayData[]>(() => {
    const saved = localStorage.getItem('fitcal-history');
    return saved ? JSON.parse(saved) : [];
  });

  // Check for day change and reset if needed
  useEffect(() => {
    const checkDayChange = () => {
      const today = getToday();
      if (currentDay.date !== today) {
        // Save current day to history if it has any activity
        if (currentDay.workoutsToday > 0 || currentDay.mealsLogged > 0 || currentDay.waterIntake > 0) {
          const newHistory = [currentDay, ...history].slice(0, 30); // Keep last 30 days
          setHistory(newHistory);
          localStorage.setItem('fitcal-history', JSON.stringify(newHistory));
        }
        
        // Reset to new day
        const newDay = createEmptyDay(today);
        setCurrentDay(newDay);
        localStorage.setItem(`fitcal-day-${today}`, JSON.stringify(newDay));
      }
    };

    checkDayChange();
    const interval = setInterval(checkDayChange, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [currentDay, history]);

  // Save current day to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(`fitcal-day-${currentDay.date}`, JSON.stringify(currentDay));
  }, [currentDay]);

  const updateCurrentDay = (updates: Partial<DayData>) => {
    setCurrentDay(prev => ({ ...prev, ...updates }));
  };

  const addWorkout = (workout: { type: string; duration: number; calories: number }) => {
    const workoutWithTime = { ...workout, time: new Date().toISOString() };
    setCurrentDay(prev => ({
      ...prev,
      caloriesBurned: prev.caloriesBurned + workout.calories,
      workoutsToday: prev.workoutsToday + 1,
      workouts: [...prev.workouts, workoutWithTime]
    }));
  };

  const addMeal = (meal: { name: string; calories: number; mealType: string }) => {
    const mealWithTime = { ...meal, time: new Date().toISOString() };
    setCurrentDay(prev => ({
      ...prev,
      caloriesConsumed: prev.caloriesConsumed + meal.calories,
      mealsLogged: prev.mealsLogged + 1,
      meals: [...prev.meals, mealWithTime]
    }));
  };

  const addWater = () => {
    setCurrentDay(prev => ({
      ...prev,
      waterIntake: Math.min(prev.waterIntake + 1, prev.waterTarget)
    }));
  };

  return (
    <HistoryContext.Provider value={{
      currentDay,
      history,
      updateCurrentDay,
      addWorkout,
      addMeal,
      addWater
    }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
};
