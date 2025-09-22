import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import StartWorkout from "./components/StartWorkout";
import CompletedWorkoutHistory from "./components/CompletedWorkoutHistory";
import TrackWeight from "./components/TrackWeight";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        ></Route>

        <Route
          path="/workout/:id"
          element={
            <ProtectedRoute>
              <StartWorkout />
            </ProtectedRoute>
          }
        ></Route>

        <Route
          path="/completedWorkout/:id"
          element={
            <ProtectedRoute>
              <CompletedWorkoutHistory />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/trackWeight"
          element={
            <ProtectedRoute>
              <TrackWeight />
            </ProtectedRoute>
          }
        ></Route>
      </Routes>
    </div>
  );
}

export default App;
