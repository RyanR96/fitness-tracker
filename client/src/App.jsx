import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import StartWorkout from "./components/StartWorkout";
import CompletedWorkoutHistory from "./components/CompletedWorkoutHistory";
import TrackWeight from "./components/TrackWeight";
import Navbar from "./components/Navbar";
import Layout from "./components/Layout";
import NotFound from "./components/NotFound";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />}></Route>
        {/**<Route path="/login" element={<Login />}></Route>  */}

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />}></Route>

          <Route path="/workout/:id" element={<StartWorkout />}></Route>

          <Route
            path="/completedWorkout/:id"
            element={<CompletedWorkoutHistory />}
          ></Route>
          <Route path="/trackWeight" element={<TrackWeight />}></Route>
          <Route
            path="*"
            element={<NotFound message="Page not found" />}
          ></Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
