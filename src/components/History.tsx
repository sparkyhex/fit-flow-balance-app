
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Activity, Apple, Droplets, Target } from "lucide-react";
import { useHistory, DayData } from "@/contexts/HistoryContext";

const History = () => {
  const { history } = useHistory();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateStr === today.toISOString().split('T')[0]) return 'Today';
    if (dateStr === yesterday.toISOString().split('T')[0]) return 'Yesterday';
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getDayStats = (day: DayData) => {
    const remainingCalories = day.calorieTarget - day.caloriesConsumed + day.caloriesBurned;
    const calorieProgress = Math.min((day.caloriesConsumed / day.calorieTarget) * 100, 100);
    const waterProgress = (day.waterIntake / day.waterTarget) * 100;
    return { remainingCalories, calorieProgress, waterProgress };
  };

  if (history.length === 0) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            History
          </CardTitle>
          <CardDescription>
            Your past activities will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-8">
            No history yet. Keep tracking to build your journey! 📈
          </p>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            History
          </CardTitle>
          <CardDescription>
            Your fitness journey over time
          </CardDescription>
        </CardHeader>
      </Card>

      {history.map((day) => {
        const { remainingCalories, calorieProgress, waterProgress } = getDayStats(day);
        
        return (
          <Card key={day.date} className="bg-white/90 backdrop-blur-sm border-0 shadow-md">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{formatDate(day.date)}</CardTitle>
                <div className="flex gap-2">
                  {day.workoutsToday > 0 && (
                    <Badge variant="outline" className="text-blue-600 border-blue-300">
                      <Activity className="h-3 w-3 mr-1" />
                      {day.workoutsToday}
                    </Badge>
                  )}
                  {day.mealsLogged > 0 && (
                    <Badge variant="outline" className="text-green-600 border-green-300">
                      <Apple className="h-3 w-3 mr-1" />
                      {day.mealsLogged}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-green-600">{day.caloriesConsumed}</div>
                  <div className="text-xs text-gray-600">Consumed</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-orange-600">{day.caloriesBurned}</div>
                  <div className="text-xs text-gray-600">Burned</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-600">
                    {remainingCalories > 0 ? remainingCalories : 0}
                  </div>
                  <div className="text-xs text-gray-600">Remaining</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Calorie Goal</span>
                  <span>{Math.round(calorieProgress)}%</span>
                </div>
                <Progress value={calorieProgress} className="h-2" />
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-cyan-500" />
                  <span>Water: {day.waterIntake}/{day.waterTarget}</span>
                </div>
                <span className="text-cyan-600">{Math.round(waterProgress)}%</span>
              </div>

              {day.workouts.length > 0 && (
                <div className="border-t pt-3">
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                    <Activity className="h-3 w-3" />
                    Workouts
                  </h4>
                  <div className="space-y-1">
                    {day.workouts.map((workout, idx) => (
                      <div key={idx} className="flex justify-between text-xs text-gray-600">
                        <span>{workout.type}</span>
                        <span>{workout.calories} cal</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {day.meals.length > 0 && (
                <div className="border-t pt-3">
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                    <Apple className="h-3 w-3" />
                    Meals
                  </h4>
                  <div className="space-y-1">
                    {day.meals.slice(0, 3).map((meal, idx) => (
                      <div key={idx} className="flex justify-between text-xs text-gray-600">
                        <span>{meal.name}</span>
                        <span>{meal.calories} cal</span>
                      </div>
                    ))}
                    {day.meals.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{day.meals.length - 3} more meals
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default History;
