import { useState, useEffect } from "react";

function StartWorkoutModal(props) {
  const { isOpen, onClose } = props;

  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    setWorkouts([
      { id: 1, name: "Push day" },
      { id: 2, name: "Leg day" },
      { id: 3, name: "Pull day" },
    ]);
  }, []);

  if (!isOpen) return null;

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
              <ul>
                {workouts.map(ex => (
                  <li
                    key={ex.id}
                    className="flex justify-between items-center py-1"
                  >
                    {ex.name}
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
            <ul>
              <li>Test</li>
            </ul>
          </div>
        </div>
        <div className="mt-6 flex justify-between gap-4">
          <button className="bg-green-500 text-black px-6 py 2 rounded-full font-semibold hover:bg-green-300">
            Start Workout
          </button>

          <button
            className="bg-green-500 text-black px-6 py 2 rounded-full font-semibold hover:bg-green-300"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default StartWorkoutModal;
