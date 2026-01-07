import { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  Reorder,
  LayoutGroup,
  easeInOut,
} from "framer-motion";
import { toast } from "sonner";

function CreateWorkoutModal(props) {
  const API_URL = import.meta.env.VITE_API_URL;
  const { isOpen, onClose } = props;
  const [fetchedExercises, setfetchedExercises] = useState([]);
  const [allExercises, setAllExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState([]);
  const [workoutName, setWorkoutName] = useState("");
  const [error, setError] = useState("");
  const [searchExercises, setSearchExercises] = useState("");

  useEffect(() => {
    //setAllExercises(["Bench Press", "Overhead Press", "Push ups"]);

    const fetchExercises = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/workouts/exerciseName`, {
          method: "GET",
          headers: { Authorization: `bearer ${token}` },
        });

        if (!res.ok) throw new Error("failed to get exercises");

        const data = await res.json();
        console.log("data is :", data);
        setfetchedExercises(data);
        setAllExercises(data);
        console.log("All exercises state is:", allExercises);
      } catch (err) {
        console.error("Error fetching exercises", err);
        setError(err.message);

        //maybe set a state with the message and render it?
      }
    };
    fetchExercises();
  }, []);

  //if (!isOpen) return null;

  const searchedExercises = allExercises.filter(ex =>
    ex.name.toLowerCase().includes(searchExercises.toLowerCase())
  );

  const addExercise = ex => {
    if (!selectedExercise.includes(ex)) {
      setSelectedExercise(prev => [...prev, ex]);
      setAllExercises(prev => prev.filter(e => e.id !== ex.id));
    }
  };

  const removeExercise = ex => {
    setSelectedExercise(selectedExercise.filter(exercise => exercise !== ex));
    setAllExercises(prev => [...prev, ex].sort((a, b) => a.id - b.id));
  };

  const handleCreate = async () => {
    setError("");
    if (selectedExercise.length === 0) {
      requestAnimationFrame(() => {
        setError("Please select at least one exercise");
      });

      return;
    }

    if (workoutName.length <= 0) {
      requestAnimationFrame(() => {
        setError("Please enter a workout name");
      });

      return;
    }

    try {
      const workoutData = {
        name: workoutName,
        exerciseTemplateName: selectedExercise.map(ex => ex.name),
      };
      console.log(JSON.stringify(workoutData, null, 2));
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/workouts`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `bearer ${token}`,
        },
        body: JSON.stringify({
          name: workoutName,
          exerciseTemplateName: selectedExercise.map(ex => ex.name),
        }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create workout");
      }

      const data = await res.json();
      setWorkoutName("");
      setSelectedExercise([]);
      onClose();
      setError("");
      setSearchExercises("");
      setAllExercises([...fetchedExercises]);
      console.log("Workout created with data:", data);
      toast.success("Workout succesfully created");
    } catch (err) {
      console.error("Error creating workout", err.message);
      setError(err.message);
      toast.error(
        err.message === "Failed to fetch"
          ? "Server did not respond. Please try again later"
          : err.message
      );

      console.log(error);
    }

    //console.log("Create workout:", workoutName, selectedExercise);
  };

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
            <h2 className="md:text-xl text-lg font-semibold mb-4 text-center">
              Create Workout
            </h2>
            <LayoutGroup>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 overflow-hidden justify-center h-full">
                {/**Left side of the column */}
                <div className="border p-4 rounded overflow-auto custom-scrollbar sm:col-span-1">
                  <input
                    placeholder="Enter workout name"
                    type="text"
                    value={workoutName}
                    onChange={e => setWorkoutName(e.target.value)}
                    className="w-full px-3 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2"
                  />
                  {/** Could actually remove the hidden overflow here, not sure what looks better? */}
                  <div className="relative flex-1 overflow-hidden">
                    {selectedExercise.length === 0 ? (
                      <p className="text-gray-500">No exercises selected</p>
                    ) : (
                      <Reorder.Group
                        axis="y"
                        values={selectedExercise}
                        onReorder={setSelectedExercise}
                        className="space-y-2"
                      >
                        {selectedExercise.map(ex => (
                          <Reorder.Item
                            key={ex.id}
                            value={ex}
                            layoutId={ex.id}
                            className="rounded-xl flex justify-between items-center  md:px-4 md:py-2 px-1 py-1 bg-gray-100 rounded shadow-sm cursor-grab actve:cursor-grabbing"
                            dragConstraints={{ top: 0, bottom: 0 }}
                            whileTap={{ scale: 0.96 }}
                          >
                            {ex.name}
                            <button
                              className="text-red-500 hover:text-red-700"
                              onClick={() => removeExercise(ex)}
                            >
                              X
                            </button>
                          </Reorder.Item>
                        ))}
                      </Reorder.Group>
                    )}
                  </div>
                </div>

                {/**Right side of the column */}
                <div className="border  p-4 rounded overflow-y-auto custom-scrollbar sm:col-span-2">
                  <h2 className="md:text-xl text-lg font-semibold mb-4 text-center">
                    Exercises
                  </h2>
                  <input
                    type="text"
                    placeholder="Search exercise"
                    value={searchExercises}
                    onChange={e => setSearchExercises(e.target.value)}
                    className="w-full px-3 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2"
                  />
                  <ul className="grid grid-cols-2 gap-2 overflow-y">
                    {searchedExercises.map(ex => (
                      <motion.li
                        className="bg-gray-100 shadow rounded-xl hover:shadow-lg hover:bg-green-200 transitions-colors duration-182 transition cursor-pointer  md:px-4 md:py-2 px-1 py-1 rounded "
                        key={ex.id}
                        layoutId={ex.id}
                        transition={{ duration: 0 }}
                        onClick={() => addExercise(ex)}
                        whileTap={{ scale: 0.96 }}
                      >
                        {ex.name}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </LayoutGroup>

            <motion.p
              className="text-red-500 text-sm mt-2 min-h-[18px] font-bold"
              key={error}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, x: [0, -8, 8, -6, 6, -4, 4, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: easeInOut }}
            >
              {error || ""}
            </motion.p>

            <div className="mt-2 flex justify-between gap-2">
              <button
                className="bg-green-500 text-black px-6 py-1 rounded-full font-semibold hover:bg-green-300"
                onClick={handleCreate}
              >
                Create
              </button>

              <button
                className="bg-green-500 text-black px-6 py-1 rounded-full font-semibold hover:bg-green-300"
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

export default CreateWorkoutModal;
