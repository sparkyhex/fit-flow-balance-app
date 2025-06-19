
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus, Target, Activity, Apple, Droplets } from "lucide-react";
import WorkoutModal from "@/components/WorkoutModal";
import MealModal from "@/components/MealModal";

const Index = () => {
  const [workoutModalOpen, setWorkoutModalOpen] = useState(false);
  const [mealModalOpen, setMealModalOpen] = useState(false);
  
  // Mock data - in a real app, this would come from state management/database
  const [dailyStats, setDailyStats] = useState({
    caloriesConsumed: 1650,
    caloriesBurned: 450,
    calorieTarget: 2200,
    waterIntake: 6,
    waterTarget: 8,
    workoutsToday: 2,
    mealsLogged: 3
  });

  const remainingCalories = dailyStats.calorieTarget - dailyStats.caloriesConsumed + dailyStats.caloriesBurned;
  const calorieProgress = (dailyStats.caloriesConsumed / dailyStats.calorieTarget) * 100;
  const waterProgress = (dailyStats.waterIntake / dailyStats.waterTarget) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">FitCal</h1>
          <p className="text-gray-600">Fitness + Calorie Tracker</p>
        </div>

        {/* Daily Overview Card */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Today's Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{dailyStats.caloriesConsumed}</div>
                <div className="text-sm text-gray-600">Consumed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{dailyStats.caloriesBurned}</div>
                <div className="text-sm text-gray-600">Burned</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{remainingCalories}</div>
              <div className="text-sm text-gray-600">Calories Remaining</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Calorie Goal Progress</span>
                <span>{Math.round(calorieProgress)}%</span>
              </div>
              <Progress value={calorieProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={() => setWorkoutModalOpen(true)}
            className="h-20 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            <div className="text-center">
              <Activity className="h-6 w-6 mx-auto mb-1" />
              <div className="text-sm">Log Workout</div>
            </div>
          </Button>
          
          <Button 
            onClick={() => setMealModalOpen(true)}
            className="h-20 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          >
            <div className="text-center">
              <Apple className="h-6 w-6 mx-auto mb-1" />
              <div className="text-sm">Log Meal</div>
            </div>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white/60 backdrop-blur-sm border-0">
            <CardContent className="p-4 text-center">
              <Activity className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">{dailyStats.workoutsToday}</div>
              <div className="text-sm text-gray-600">Workouts Today</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/60 backdrop-blur-sm border-0">
            <CardContent className="p-4 text-center">
              <Apple className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">{dailyStats.mealsLogged}</div>
              <div className="text-sm text-gray-600">Meals Logged</div>
            </CardContent>
          </Card>
        </div>

        {/* Water Intake */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-blue-500" />
              Water Intake
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{dailyStats.waterIntake} / {dailyStats.waterTarget} glasses</span>
                <span>{Math.round(waterProgress)}%</span>
              </div>
              <Progress value={waterProgress} className="h-2" />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setDailyStats(prev => ({ ...prev, waterIntake: prev.waterIntake + 1 }))}
                className="w-full mt-2"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Glass
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <WorkoutModal 
        open={workoutModalOpen} 
        onOpenChange={setWorkoutModalOpen}
        onWorkoutLogged={(calories) => {
          setDailyStats(prev => ({
            ...prev,
            caloriesBurned: prev.caloriesBurned + calories,
            workoutsToday: prev.workoutsToday + 1
          }));
        }}
      />
      
      <MealModal 
        open={mealModalOpen} 
        onOpenChange={setMealModalOpen}
        onMealLogged={(calories) => {
          setDailyStats(prev => ({
            ...prev,
            caloriesConsumed: prev.caloriesConsumed + calories,
            mealsLogged: prev.mealsLogged + 1
          }));
        }}
      />
    </div>
  );
};

export default Index;
