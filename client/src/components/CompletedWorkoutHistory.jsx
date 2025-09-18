import { useLocation } from "react-router-dom";
import { useEffect } from "react";

function CompletedWorkoutHistory() {
  const location = useLocation();

  const completedWorkout = location.state?.workout;

  useEffect(() => {
    console.log(completedWorkout);
  }, [completedWorkout]);

  return (
    <div>
      <h1>Test</h1>
    </div>
  );
}

export default CompletedWorkoutHistory;
