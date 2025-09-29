import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handlesubmit = async e => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        throw new Error("Error when logging in");
      }

      const data = await res.json();
      console.log(data);
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Fetch failed", err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-4xl grid grid-cols-1 md:grid-cols-2">
        <div className="p-12 md:p-28 flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-6 text-center">Login Page</h1>
          <form className="space-y-4 text-center" onSubmit={handlesubmit}>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent focus:ring-green-500"
            ></input>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent focus:ring-green-500"
            ></input>
            <button
              className="bg-green-500 text-black px-6 py 2 rounded-full font-semibold hover:bg-green-300 w-full"
              type="submit"
            >
              Login
            </button>
          </form>
          <button className="mt-4 text-sm text-gray-500 hover:underline self-start">
            Create Account
          </button>
        </div>
        <div className="hidden md:block">
          <img
            className=" w-full h-full object-cover rounded-lg"
            src="https://cdn.pixabay.com/photo/2016/01/08/01/53/gymer-1126999_960_720.jpg"
          ></img>
        </div>
      </div>
    </div>
  );
}

export default Login;
