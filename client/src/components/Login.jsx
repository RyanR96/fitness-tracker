import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateAccountModal from "./CreateAccountModal";
import { motion, AnimatePresence, easeInOut } from "framer-motion";

function Login() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [loginError, setLoginError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlesubmit = async e => {
    e.preventDefault();
    setLoginError("");

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error when logging in");
      }
      console.log(data);
      localStorage.setItem("token", data.token);
      navigate("/dashboard", {
        state: { loginSuccesful: true },
      });
    } catch (err) {
      console.error("Fetch failed", err);
      requestAnimationFrame(() => {
        setLoginError(
          err.message === "Failed to fetch"
            ? "Server did not respond. Please try again later"
            : err.message
        );
      });
    }
  };

  const handleAutofill = async () => {
    setUsername("");
    setPassword("");

    const typeWriter = async (text, state) => {
      for (let i = 0; i <= text.length; i++) {
        state(text.slice(0, i));
        await new Promise(res => setTimeout(res, 100));
      }
    };

    await typeWriter("ryan", setUsername);
    await typeWriter("123", setPassword);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 relative ">
      <div className="absolute top-4 left-4 bg-white/70 border border-gray-300 rounded-xl shadow-sm p-3 space-y-1 px-5">
        <h1 className="font-bold">Dummy account:</h1>
        <p className="">Username: ryan</p>
        <p>Password: 123</p>
        <button
          onClick={handleAutofill}
          className="bg-green-500 text-black rounded-full font-semibold hover:bg-green-300 w-full mt-1"
        >
          Autofill
        </button>
      </div>
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2">
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
              className="bg-green-500 text-black px-6 py-2 rounded-full font-semibold hover:bg-green-300 w-full"
              type="submit"
            >
              Login
            </button>
          </form>

          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 text-sm text-gray-500 hover:underline self-start"
          >
            Create Account
          </button>

          <motion.p
            className="text-red-500 text-sm mt-2 min-h-[40px] font-bold"
            key={loginError}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, x: [0, -8, 8, -6, 6, -4, 4, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: easeInOut }}
          >
            {loginError || ""}
          </motion.p>
        </div>
        <div className="hidden sm:block">
          <img
            className=" w-full h-full object-cover rounded-lg"
            src="https://cdn.pixabay.com/photo/2016/01/08/01/53/gymer-1126999_960_720.jpg"
          ></img>
        </div>
      </div>
      <CreateAccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default Login;
