import { useNavigate } from "react-router-dom";
import { useState } from "react";


function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful:", data);

        localStorage.setItem("token", data.token);

        navigate("/products");
      } else {
        console.error("Login failed:", data);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <>
      <h1>Login Page</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>
    </>
  );
}

export default Login;