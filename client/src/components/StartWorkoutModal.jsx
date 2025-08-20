import { useState, useEffect } from "react";

function StartWorkoutModal(props) {
  const { isOpen, onClose } = props;

  const [workouts, setWorkouts] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  useEffect(() => {
    setWorkouts([
      { id: 1, name: "Push day", exercises: ["Bench press", "overhead Press"] },
      { id: 2, name: "Leg day", exercises: ["Dips", "overhead Press"] },
      {
        id: 3,
        name: "Pull day",
        exercises: ["Tricep", "overhead Press", "test"],
      },
    ]);
  }, []);

  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
    setSelectedWorkout(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Start Workout
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/**Left side of the column */}
          <div className="border p-4 rounded overflow-auto">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Select Workout
            </h2>
            {workouts.length === 0 ? (
              <p>No workouts created, please create a workout</p>
            ) : (
              <ul className="space-y-2">
                {workouts.map(workout => (
                  <li key={workout.id}>
                    <button
                      onClick={() => setSelectedWorkout(workout)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 ${
                        selectedWorkout?.id === workout.id
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {workout.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/**Right side of the column */}
          <div className="border p-4 rounded overflow-auto">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Exercises
            </h2>
            {selectedWorkout ? (
              <ul className="space-y-2 max-h-64 overflow-y-auto">
                {selectedWorkout.exercises.map(ex => (
                  <li key={ex} className="p-2 bg-gray-100 rounded-md shadow-sm">
                    {ex}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">
                Select a workout to see it's exercises
              </p>
            )}
          </div>
        </div>
        <div className="mt-6 flex justify-between gap-4">
          <button className="bg-green-500 text-black px-6 py 2 rounded-full font-semibold hover:bg-green-300">
            Start Workout
          </button>

          <button
            className="bg-green-500 text-black px-6 py 2 rounded-full font-semibold hover:bg-green-300"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default StartWorkoutModal;
