import React, { useState } from "react";
import { supabase } from "../auth/supabase";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle the login or signup depending on state
  const handleAuth = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      if (isSignUp) {
        // If it's a sign-up request
        const { user, error } = await supabase.auth.signUp({ email, password });

        if (error) throw error;

        alert("Account created successfully!");
        window.location.href = "/login"; // Redirect to login page after sign up
      } else {
        // If it's a login request
        const { user, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) throw error;

        window.location.href = "/dashboard"; // Redirect to dashboard on successful login
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>{isSignUp ? "Create Account" : "Log In"}</h2>

      <form onSubmit={handleAuth}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: "10px", margin: "10px" }}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: "10px", margin: "10px" }}
          />
        </div>
        <div>
          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : isSignUp ? "Sign Up" : "Login"}
          </button>
        </div>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <p>
        {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
        <button onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? "Login" : "Create one"}
        </button>
      </p>
    </div>
  );
}

export default Login;
