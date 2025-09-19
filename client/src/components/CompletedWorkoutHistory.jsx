import { useLocation } from "react-router-dom";
import { useEffect } from "react";

function CompletedWorkoutHistory() {
  const location = useLocation();

  const completedWorkout = location.state?.workout;

  useEffect(() => {
    console.log(completedWorkout);
  }, [completedWorkout]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col">
      <h1 className="text 3x1 font-bold mb-2 text-center">Workout History</h1>
      <div className="flex-1 flex flex-col md:flex-row gap-6  border-2 border-dashed border-blue-500 ">
        <div className="flex-1 bg-gray-200 p-6 rounded shadow">
          <h2 className="text-2x1 font-semibold mb-4 text-center">
            {completedWorkout.workout.name} {completedWorkout.date}
          </h2>

          {completedWorkout.exercises.map(exercise => (
            <div key={exercise.id} className="mb-6">
              <h2 className="text-lg font-semibold mb-2 text-center p-5">
                {exercise.exerciseTemplateName}:
              </h2>
              <ul className="space-y-1">
                {exercise.sets.map((set, i) => (
                  <li
                    key={i}
                    className="p-2 bg-gray-100 rounded flex flex-wrap justify-around"
                  >
                    <span className="p-2 ">
                      <strong>Set {i + 1}:</strong>
                    </span>
                    <span className="p-2">
                      {set.Weight}kg x {set.reps} reps
                    </span>
                    <span className="p-2">Form: {set.formRating}</span>
                    <span className="p-2">
                      {set.dropSet ? "Dropset" : "Normal"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CompletedWorkoutHistory;
