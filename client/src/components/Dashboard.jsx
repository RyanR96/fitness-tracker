import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateWorkoutModal from "./CreateWorkoutModal";
import StartWorkoutModal from "./StartWorkoutModal";
import WorkoutHistoryModal from "./WorkoutHistoryModal";
import TrackWeight from "./TrackWeight";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";

function Dashboard() {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const [isCreateWorkoutModalOpen, setIsCreateWorkoutModalOpen] =
    useState(false);

  const [isStartWorkoutModalOpen, setIsStartWorkoutModalOpen] = useState(false);

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [introText, setIntroText] = useState("");
  const [username, setUsername] = useState(null);

  useEffect(() => {
    if (location.state?.workoutCompleted) {
      toast.success("Workout succesfully completed");
    }
    if (location.state?.loginSuccesful) {
      toast.success("Logged in succesfully ");
    }
    history.replaceState({}, document.title);
  }, [location.state]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch user data`);
        }

        const data = await res.json();

        setUsername(data.username);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!username) return;
    const text = `Welcome to MyFitnessApp ${username}, your fitness journey begins here`;
    let i = 0;

    const interval = setInterval(() => {
      setIntroText(text.slice(0, i + 1));
      i++;
      if (i === text.length) clearInterval(interval);
    }, 40);

    return () => clearInterval(interval);
  }, [username]);

  return (
    <div className="min-h-[calc(100vh-72px)] flex flex-col">
      {" "}
      {/* flex flex-col and flex-1 later on ensures is 100% height (for when I forget) */}
      <div
        className="relative h-[50vh] bg-no-repeat bg-cover bg-center flex flex-col items-center justify-center text-white"
        style={{
          backgroundImage: `url(https://cdn.pixabay.com/photo/2016/01/08/01/53/gymer-1126999_960_720.jpg)`,
        }}
      >
        <div className="max-w-[600px] px-4 text-center">
          <h1 className="text-3xl font-bold text-white [text-shadow:_0_2px_8px_rgba(0,0,0,0.7)]">
            {introText}
          </h1>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from transparent to-gray-200" />
      </div>
      <div className=" bg-gray-200 flex-1 p-10">
        {/* BG used to be gray-800 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mt-5">
          {/* Card 1*/}
          <div className="bg-[#2A2A2A] rounded-xl p-6 text-white text-center flex flex-col h-full">
            <h3 className="text-xl font-bold mb-1 min-h-[48px] leading-none ">
              Create a Workout
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Create a workout from our list of exercises
            </p>
            <button
              onClick={() => setIsCreateWorkoutModalOpen(true)}
              className="h-13 w-full max-w-[350px] mx-auto bg-green-500 text-black px-6 py-1 rounded-full font-semibold hover:bg-green-300 mt-auto"
            >
              Create Workout
            </button>
          </div>
          {/* Card 2*/}
          <div className="bg-[#2A2A2A] rounded-xl p-6 text-white text-center flex flex-col h-full">
            <h3 className="text-xl font-bold mb-1 min-h-[48px] leading-none">
              Start a Workout
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Start a workout from a list of your workouts
            </p>
            <button
              onClick={() => setIsStartWorkoutModalOpen(true)}
              className="h-13 w-full max-w-[350px] mx-auto bg-green-500 text-black px-6 py-1 rounded-full font-semibold hover:bg-green-300 mt-auto"
            >
              Start Workout
            </button>
          </div>
          {/* Card 3*/}

          <div className="bg-[#2A2A2A] rounded-xl p-6 text-white text-center flex flex-col h-full">
            <h3 className="text-xl font-bold mb-1 min-h-[48px] leading-none">
              Workout History
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Check previous completed workouts
            </p>
            <button
              className="h-13 w-full max-w-[350px] mx-auto bg-green-500 text-black px-6 py-1 rounded-full font-semibold hover:bg-green-300 mt-auto"
              onClick={() => setIsHistoryOpen(true)}
            >
              Workout history
            </button>
          </div>

          {/* Card 4*/}
          <div className="bg-[#2A2A2A] rounded-xl p-6 text-white text-center flex flex-col h-full">
            <h3 className="text-xl font-bold mb-1 min-h-[48px] leading-none">
              Track your weight
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Track your own weight in chart form
            </p>
            <button
              className="h-13 w-full max-w-[350px] mx-auto bg-green-500 text-black px-6 py-1 rounded-full font-semibold hover:bg-green-300 mt-auto"
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
