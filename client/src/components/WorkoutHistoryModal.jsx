import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function WorkoutHistoryModal(props) {
  const { isOpen, workouts, completedWorkouts, onClose } = props;

  const navigate = useNavigate();
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [selectedCompletedWorkout, setSelectedCompletedWorkout] =
    useState(null);

  const handleWorkoutClick = workout => {
    if (selectedWorkout?.id === workout.id) {
      setSelectedWorkout(null);
    } else {
      setSelectedWorkout(workout);
    }
  };

  //if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 border-2 border-dashed border-red-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          <motion.div
            className="bg-white p-6 rounded shadow-lg lg:max-w-[50%] border-2 border-dashed border-blue-500"
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            exit={{ y: 50 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-center">
              View workout history
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:h-[40vh]">
              {/**Left side of the column */}
              <div className="border p-4 rounded overflow-auto col-span-1">
                <h2 className="text-xl font-semibold mb-4 text-center">
                  Filter by workout
                </h2>
                {workouts.length === 0 ? (
                  <p>No workouts to filter from</p>
                ) : (
                  <ul className="space-y-2">
                    {workouts.map(workout => (
                      <li key={workout.id}>
                        <button
                          onClick={() => handleWorkoutClick(workout)}
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
              <div className="border p-4 rounded overflow-hidden col-span-2">
                <h2 className="text-xl font-semibold mb-4 text-center ">
                  Workout history
                </h2>
                {selectedWorkout ? (
                  <ul className="space-y-2 max-h-64 overflow-y-auto">
                    {completedWorkouts
                      .filter(cw => cw.workout.id === selectedWorkout.id)
                      .map(cw => (
                        <li
                          key={cw.id}
                          className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 ${
                            selectedCompletedWorkout?.id === cw.id
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 hover:bg-gray-200"
                          }`}
                          onClick={() => setSelectedCompletedWorkout(cw)}
                        >
                          {cw.workout.name} -{" "}
                          {new Date(cw.date).toLocaleDateString()}
                        </li>
                      ))}
                  </ul>
                ) : completedWorkouts && completedWorkouts.length > 0 ? (
                  <ul className="space-y-2 max-h-64 overflow-y-auto">
                    {completedWorkouts.map(cw => (
                      <li
                        key={cw.id}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 ${
                          selectedCompletedWorkout?.id === cw.id
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 hover:bg-gray-200"
                        }`}
                        onClick={() => {
                          setSelectedCompletedWorkout(cw), console.log(cw);
                        }}
                      >
                        {" "}
                        {cw.workout.name} -{" "}
                        {new Date(cw.date).toLocaleDateString()}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">
                    Complete a workout for it to appear here!
                  </p>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-between gap-4">
              <button
                className="bg-green-500 text-black px-6 py 2 rounded-full font-semibold hover:bg-green-300"
                onClick={() => {
                  if (selectedCompletedWorkout) {
                    navigate(
                      `/completedWorkout/${selectedCompletedWorkout.id}`,
                      {
                        state: { workout: selectedCompletedWorkout },
                      }
                    );
                  }
                }}
              >
                View
              </button>

              <button
                className="bg-green-500 text-black px-6 py 2 rounded-full font-semibold hover:bg-green-300 "
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default WorkoutHistoryModal;
