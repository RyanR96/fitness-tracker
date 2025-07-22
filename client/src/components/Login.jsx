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
    <div className="loginPage">
      <h1>Login Page</h1>
      <form onSubmit={handlesubmit}>
        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Username"
        ></input>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
        ></input>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
