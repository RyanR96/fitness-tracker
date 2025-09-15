import { useNavigate } from "react-router-dom";
import { useState } from "react";

function WorkoutHistoryModal(props) {
  const { isOpen, workouts, completedWorkouts, onClose } = props;

  const navigate = useNavigate();
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 border-2 border-dashed border-red-500">
      <div className="bg-white p-6 rounded shadow-lg max-w-[50%] border-2 border-dashed border-blue-500">
        <h2 className="text-xl font-semibold mb-4 text-center">
          View workout history
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/**Left side of the column */}
          <div className="border p-4 rounded overflow-auto col-span-1">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Filter by workout
            </h2>
            <p>Test</p>
          </div>

          {/**Right side of the column */}
          <div className="border p-4 rounded overflow-auto col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Workout history
            </h2>
            <p>
              Want this to be wider
              araaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaea
            </p>
          </div>
        </div>
        <div className="mt-6 flex justify-between gap-4">
          <button className="bg-green-500 text-black px-6 py 2 rounded-full font-semibold hover:bg-green-300">
            View
          </button>

          <button
            className="bg-green-500 text-black px-6 py 2 rounded-full font-semibold hover:bg-green-300 "
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default WorkoutHistoryModal;
