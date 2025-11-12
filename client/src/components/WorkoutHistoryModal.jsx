import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import { useEffect } from "react";

function WorkoutHistoryModal(props) {
  //const { isOpen, workouts, completedWorkouts, onClose } = props;
  const { isOpen, onClose } = props;

  const navigate = useNavigate();
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [selectedCompletedWorkout, setSelectedCompletedWorkout] =
    useState(null);
  const [workouts, setWorkouts] = useState(null);
  const [completedWorkouts, setCompletedWorkouts] = useState(null);
  const [error, setError] = useState("");

  const handleWorkoutClick = workout => {
    if (selectedWorkout?.id === workout.id) {
      setSelectedWorkout(null);
    } else {
      setSelectedWorkout(workout);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [workoutRes, completedRes] = await Promise.all([
          fetch("http://localhost:3000/api/workouts/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch("http://localhost:3000/api/completedWorkouts/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        if (!workoutRes.ok || !completedRes.ok) {
          throw new Error(
            `Failed to retrieve data. Workouts status: ${workoutRes.status} Completed status: ${completedRes.status}`
          );
        }
        const [workoutData, completedData] = await Promise.all([
          workoutRes.json(),
          completedRes.json(),
        ]);

        console.log("Workout data for HistoryModal is:", workoutData);
        setWorkouts(workoutData);
        console.log("CW data for HistoryModal is:", completedData);
        setCompletedWorkouts(completedData);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };
    fetchData();
  }, [isOpen]);

  const triggerError = message => {
    setError("");
    requestAnimationFrame(() => {
      setError(message);
    });
  };

  // Creates deleteWorkout button, if a deleted workout exists
  const workoutsArray = workouts || [];
  const completedArray = completedWorkouts || [];
  const hasDeleted = completedArray.some(cw => cw.workout === null);
  /** Could put this in a useMemo, not needed as data is so small but could be interesting learning */
  const combinedWorkouts = [
    ...workoutsArray,
    ...(hasDeleted
      ? [{ id: "deleted-workouts", name: "Deleted workouts" }]
      : []),
  ];

  const filterByWorkout = selectedWorkout
    ? completedWorkouts.filter(cw => {
        if (selectedWorkout.id === "deleted-workouts")
          return cw.workout === null;
        return cw.workout && cw.workout.id === selectedWorkout.id;
      })
    : [];
  /** This code exact same as one above, just helped me visualise it better in an If statement sometimes.
  let filteredByWorkout = [];
  if (selectedWorkout) {
    filteredByWorkout = completedWorkouts.filter(cw => {
      if (selectedWorkout.id === "deleted-workouts") return cw.workout === null;
      return cw.workout && cw.workout.id === selectedWorkout.id;
    });
  }
*/
  //if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          <motion.div
            className="bg-white p-6 rounded-2xl shadow-xl max-w-3xl w-full h-[80vh] sm:h-[505px] overflow-hidden flex flex-col"
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            exit={{ y: 50 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-center">
              View workout history
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 overflow-hidden justify-center h-full">
              {/**Left side of the column */}
              <div className="border p-4 rounded overflow-auto col-span-1 sm:col-span-1 custom-scrollbar">
                <h2 className="text-xl font-semibold mb-4 text-center">
                  Filter by workout
                </h2>
                {combinedWorkouts.length === 0 ? (
                  <p className="text-gray-500">No workouts to filter from</p>
                ) : (
                  <ul className="space-y-2 ">
                    {combinedWorkouts.map(workout => (
                      <li key={workout.id}>
                        <button
                          onClick={() => handleWorkoutClick(workout)}
                          className={`w-full text-left px-4 py-2 rounded-lg hover:shadow-lg transitions-colors duration-182 ${
                            selectedWorkout?.id === workout.id
                              ? "bg-green-500 text-white"
                              : "bg-gray-100 hover:bg-green-200"
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
              <div className="border p-4 rounded col-span-1 sm:col-span-2 overflow-auto custom-scrollbar">
                <h2 className="text-xl font-semibold mb-4 text-center ">
                  Workout history
                </h2>
                {selectedWorkout ? (
                  filterByWorkout.length > 0 ? (
                    <ul className="space-y-2">
                      {filterByWorkout.map(cw => (
                        <li key={cw.id}>
                          <button
                            className={`w-full text-left px-4 py-2 rounded-lg hover:shadow-lg transitions-colors duration-182 ${
                              selectedCompletedWorkout?.id === cw.id
                                ? "bg-green-500 text-white"
                                : "bg-gray-100 hover:bg-green-200"
                            }`}
                            onClick={() => setSelectedCompletedWorkout(cw)}
                          >
                            {cw.workout ? cw.workout.name : "Deleted Workout"} -{" "}
                            {new Date(cw.date).toLocaleDateString()}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">
                      Complete a workout for it to appear here!
                    </p>
                  )
                ) : completedWorkouts && completedWorkouts.length > 0 ? (
                  <ul className="space-y-2">
                    {completedWorkouts.map(cw => (
                      <li key={cw.id}>
                        <button
                          className={`w-full text-left px-4 py-2 rounded-lg hover:shadow-lg transitions-colors duration-182 ${
                            selectedCompletedWorkout?.id === cw.id
                              ? "bg-green-500 text-white"
                              : "bg-gray-100 hover:bg-green-200"
                          }`}
                          onClick={() => {
                            setSelectedCompletedWorkout(cw), console.log(cw);
                          }}
                        >
                          {" "}
                          {/** Can add cw.workoutName if I decide to do a snapshot later on */}
                          {cw.workout ? cw.workout.name : "Deleted Workout"} -{" "}
                          {new Date(cw.date).toLocaleDateString()}
                        </button>
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
            <motion.p
              className="text-red-500 text-sm mt-1 min-h-[18px] font-bold"
              key={error}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, x: [0, -8, 8, -6, 6, -4, 4, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: easeInOut }}
            >
              {error || ""}
            </motion.p>
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
                  } else {
                    triggerError("Please select a completed workout");
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
