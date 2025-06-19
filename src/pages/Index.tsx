
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Plus, Target, Activity, Apple, Droplets, Trophy, Flame, Calendar, TrendingUp, History as HistoryIcon } from "lucide-react";
import WorkoutModal from "@/components/WorkoutModal";
import MealModal from "@/components/MealModal";
import History from "@/components/History";
import { toast } from "@/hooks/use-toast";
import { useHistory } from "@/contexts/HistoryContext";

const Index = () => {
  const [workoutModalOpen, setWorkoutModalOpen] = useState(false);
  const [mealModalOpen, setMealModalOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  const { currentDay, addWorkout, addMeal, addWater } = useHistory();

  // Enhanced stats with streaks and achievements
  const [achievements] = useState([
    { id: 1, name: "First Workout", description: "Complete your first workout", unlocked: true, icon: "🏆" },
    { id: 2, name: "Water Warrior", description: "Drink 8 glasses of water", unlocked: false, icon: "💧" },
    { id: 3, name: "Week Strong", description: "7-day workout streak", unlocked: true, icon: "🔥" },
    { id: 4, name: "Calorie Counter", description: "Log 10 meals", unlocked: true, icon: "📱" }
  ]);

  const remainingCalories = currentDay.calorieTarget - currentDay.caloriesConsumed + currentDay.caloriesBurned;
  const calorieProgress = Math.min((currentDay.caloriesConsumed / currentDay.calorieTarget) * 100, 100);
  const waterProgress = (currentDay.waterIntake / currentDay.waterTarget) * 100;
  
  // Static values for demo - in real app these would come from history analysis
  const weeklyProgress = 71; // 5 out of 7 days
  const streak = 7;
  const level = 3;

  // Motivational messages based on progress
  const getMotivationalMessage = () => {
    if (calorieProgress >= 90) return "Amazing! You're crushing your goals! 🎉";
    if (calorieProgress >= 70) return "Great progress! Keep it up! 💪";
    if (calorieProgress >= 50) return "You're doing well! Stay consistent! 🌟";
    return "Let's get started on your fitness journey! 🚀";
  };

  const handleWorkoutLogged = (type: string, duration: number, calories: number) => {
    addWorkout({ type, duration, calories });
    
    toast({
      title: "Workout Logged! 🔥",
      description: `Great job! You burned ${calories} calories with ${type}.`,
    });
  };

  const handleMealLogged = (name: string, calories: number, mealType: string) => {
    addMeal({ name, calories, mealType });
    
    toast({
      title: "Meal Logged! 🍎",
      description: `Added ${name} (${calories} calories) to your ${mealType}.`,
    });
  };

  const handleWaterAdded = () => {
    if (currentDay.waterIntake < currentDay.waterTarget) {
      addWater();
      
      if (currentDay.waterIntake + 1 === currentDay.waterTarget) {
        toast({
          title: "Hydration Goal Achieved! 💧",
          description: "You've reached your daily water intake goal!",
        });
      }
    }
  };

  if (showHistory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 p-4">
        <div className="max-w-md mx-auto space-y-6">
          {/* Header with back button */}
          <div className="text-center py-6">
            <div className="flex items-center justify-between mb-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowHistory(false)}
                className="bg-white/90"
              >
                ← Back
              </Button>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                Level {level}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Your Journey
            </h1>
            <p className="text-gray-600">Track your progress over time</p>
          </div>

          <History />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Enhanced Header with Level and Streak */}
        <div className="text-center py-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              FitCal
            </h1>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              Level {level}
            </Badge>
          </div>
          <p className="text-gray-600 mb-2">Fitness + Calorie Tracker</p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-orange-600">
              <Flame className="h-4 w-4" />
              <span className="font-semibold">{streak} day streak</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowHistory(true)}
              className="flex items-center gap-1 text-blue-600 hover:bg-blue-50"
            >
              <HistoryIcon className="h-4 w-4" />
              <span>History</span>
            </Button>
          </div>
        </div>

        {/* Motivational Message */}
        <Card className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <p className="font-medium">{getMotivationalMessage()}</p>
          </CardContent>
        </Card>

        {/* Enhanced Daily Overview Card */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Today's Progress
            </CardTitle>
            <CardDescription>
              Keep up the momentum! You're doing great.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 animate-pulse">
                  {currentDay.caloriesConsumed}
                </div>
                <div className="text-sm text-gray-600">Consumed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 animate-pulse">
                  {currentDay.caloriesBurned}
                </div>
                <div className="text-sm text-gray-600">Burned</div>
              </div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">
                {remainingCalories > 0 ? remainingCalories : 0}
              </div>
              <div className="text-sm text-gray-600">Calories Remaining</div>
              {remainingCalories <= 0 && (
                <Badge className="mt-2 bg-green-500">Goal Achieved! 🎉</Badge>
              )}
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Daily Goal Progress</span>
                <span className="font-semibold">{Math.round(calorieProgress)}%</span>
              </div>
              <Progress value={calorieProgress} className="h-3 transition-all duration-500" />
              
              <div className="flex justify-between text-sm">
                <span>Weekly Goal Progress</span>
                <span className="font-semibold">{Math.round(weeklyProgress)}%</span>
              </div>
              <Progress value={weeklyProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Quick Actions with Gradients */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={() => setWorkoutModalOpen(true)}
            className="h-24 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 hover:from-blue-600 hover:via-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            <div className="text-center">
              <Activity className="h-7 w-7 mx-auto mb-1" />
              <div className="text-sm font-semibold">Log Workout</div>
              <div className="text-xs opacity-90">Burn calories</div>
            </div>
          </Button>
          
          <Button 
            onClick={() => setMealModalOpen(true)}
            className="h-24 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 hover:from-green-600 hover:via-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            <div className="text-center">
              <Apple className="h-7 w-7 mx-auto mb-1" />
              <div className="text-sm font-semibold">Log Meal</div>
              <div className="text-xs opacity-90">Track nutrition</div>
            </div>
          </Button>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-blue-100 to-blue-50 border-blue-200 shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-4 text-center">
              <Activity className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-blue-700">{currentDay.workoutsToday}</div>
              <div className="text-sm text-blue-600">Workouts Today</div>
              {currentDay.workoutsToday > 0 && (
                <Badge variant="outline" className="mt-1 border-blue-300 text-blue-600">
                  On Fire! 🔥
                </Badge>
              )}
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-100 to-green-50 border-green-200 shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-4 text-center">
              <Apple className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-green-700">{currentDay.mealsLogged}</div>
              <div className="text-sm text-green-600">Meals Logged</div>
              {currentDay.mealsLogged >= 3 && (
                <Badge variant="outline" className="mt-1 border-green-300 text-green-600">
                  Great! ✨
                </Badge>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Water Intake with Animation */}
        <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-cyan-500" />
              Hydration Station
            </CardTitle>
            <CardDescription>
              Stay hydrated for peak performance! 💪
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{currentDay.waterIntake} / {currentDay.waterTarget} glasses</span>
                <span className="font-semibold text-cyan-600">{Math.round(waterProgress)}%</span>
              </div>
              <Progress value={waterProgress} className="h-3 transition-all duration-500" />
              
              {/* Water glasses visualization */}
              <div className="flex justify-center gap-1 py-2">
                {Array.from({ length: currentDay.waterTarget }, (_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-6 rounded-b-lg border-2 transition-all duration-300 ${
                      i < currentDay.waterIntake
                        ? 'bg-cyan-400 border-cyan-500 animate-pulse'
                        : 'bg-gray-100 border-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleWaterAdded}
                disabled={currentDay.waterIntake >= currentDay.waterTarget}
                className="w-full mt-2 bg-cyan-50 hover:bg-cyan-100 border-cyan-300 text-cyan-700 transform hover:scale-105 transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-1" />
                {currentDay.waterIntake >= currentDay.waterTarget ? "Goal Achieved! 🎉" : "Add Glass"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Achievements Section */}
        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              Achievements
            </CardTitle>
            <CardDescription>
              Unlock badges as you progress! 🏆
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-3 rounded-lg border-2 text-center transition-all duration-200 ${
                    achievement.unlocked
                      ? 'bg-yellow-100 border-yellow-300 shadow-md'
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <div className="text-2xl mb-1">{achievement.icon}</div>
                  <div className="text-xs font-semibold">{achievement.name}</div>
                  <div className="text-xs text-gray-600 mt-1">{achievement.description}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <WorkoutModal 
        open={workoutModalOpen} 
        onOpenChange={setWorkoutModalOpen}
        onWorkoutLogged={handleWorkoutLogged}
      />
      
      <MealModal 
        open={mealModalOpen} 
        onOpenChange={setMealModalOpen}
        onMealLogged={handleMealLogged}
      />
    </div>
  );
};

export default Index;
