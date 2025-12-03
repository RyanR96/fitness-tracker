import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateWorkoutModal from "./CreateWorkoutModal";
import StartWorkoutModal from "./StartWorkoutModal";
import WorkoutHistoryModal from "./WorkoutHistoryModal";
import TrackWeight from "./TrackWeight";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.workoutCompleted) {
      toast.success("Workout succesfully completed");
    }
    if (location.state?.loginSuccesful) {
      toast.success("Logged in succesfully ");
    }
    history.replaceState({}, document.title);
  }, [location.state]);

  const [isCreateWorkoutModalOpen, setIsCreateWorkoutModalOpen] =
    useState(false);

  const [isStartWorkoutModalOpen, setIsStartWorkoutModalOpen] = useState(false);

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {" "}
      {/* flex flex-col and flex-1 later on ensures is 100% height (for when I forget) */}
      <div
        className="h-[50vh] bg-no-repeat bg-cover bg-center flex flex-col items-center justify-center text-white"
        style={{
          backgroundImage: `url(https://cdn.pixabay.com/photo/2016/01/08/01/53/gymer-1126999_960_720.jpg)`,
        }}
      >
        <div>
          <h1>HELLOHELLOHELLOHELLOHELLOHELLOHELLO</h1>
        </div>
      </div>
      <div className=" bg-gray-900 text-white p-10 flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {/* Card 1*/}
          <div className="bg-[#2A2A2A] rounded-xl p-6 text-white text-center">
            <h3 className="text-xl font-bold mb-1">Create a Workout</h3>
            <p className="text-sm text-gray-400 mb-4">
              Create a workout from our list of exercises
            </p>
            <button
              onClick={() => setIsCreateWorkoutModalOpen(true)}
              className="bg-green-500 text-black px-6 py 2 rounded-full font-semibold hover:bg-green-300"
            >
              Create Workout
            </button>
          </div>
          {/* Card 2*/}
          <div className="bg-[#2A2A2A] rounded-xl p-6 text-white text-center">
            <h3 className="text-xl font-bold mb-1">Start a Workout</h3>
            <p className="text-sm text-gray-400 mb-4">
              Start a workout from a list of your workouts
            </p>
            <button
              onClick={() => setIsStartWorkoutModalOpen(true)}
              className="bg-green-500 text-black px-6 py 2 rounded-full font-semibold hover:bg-green-300"
            >
              Start Workout
            </button>
          </div>
          {/* Card 3*/}

          <div className="bg-[#2A2A2A] rounded-xl p-6 text-white text-center">
            <h3 className="text-xl font-bold mb-1">Workout History</h3>
            <p className="text-sm text-gray-400 mb-4">
              Check your previous completed workouts
            </p>
            <button
              className="bg-green-500 text-black px-6 py 2 rounded-full font-semibold hover:bg-green-300"
              onClick={() => setIsHistoryOpen(true)}
            >
              Workout history
            </button>
          </div>

          {/* Card 3*/}
          <div className="bg-[#2A2A2A] rounded-xl p-6 text-white text-center">
            <h3 className="text-xl font-bold mb-1">Track your weight</h3>
            <p className="text-sm text-gray-400 mb-4">
              Track your own weight in chart form
            </p>
            <button
              className="bg-green-500 text-black px-6 py 2 rounded-full font-semibold hover:bg-green-300"
              onClick={() => navigate("/trackWeight")}
            >
              Track weight
            </button>
          </div>
        </div>
      </div>
      <CreateWorkoutModal
        isOpen={isCreateWorkoutModalOpen}
        onClose={() => setIsCreateWorkoutModalOpen(false)}
      />
      <StartWorkoutModal
        isOpen={isStartWorkoutModalOpen}
        onClose={() => setIsStartWorkoutModalOpen(false)}
      />
      <WorkoutHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
    </div>
  );
}

export default Dashboard;
