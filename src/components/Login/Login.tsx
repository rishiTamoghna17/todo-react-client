import React, { ChangeEvent, FormEvent, useContext, useState } from "react";
import "./Login.css";
import { context } from "../Context//Provider";
import { useNavigate } from "react-router-dom";
import { User, ValidationResult, loginValidation } from "../../actions/loginValidation";
export default function Login() {
  const { dispatch } = useContext(context);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationResult: ValidationResult = loginValidation(email, password);

    if (validationResult.success) {
      setError("");
      const user: User = validationResult.user!;
      dispatch({ type: "LOGIN", payload: user });
      localStorage.setItem("token", user.token);
      navigate("/");
      console.log("Login successful");
    } else {
      setError(error);
    }
  };

  return (
    <div className="card">
      <div className="card-content">
        <h2 className="card-title">Log In Here</h2>
        <form className="form-data" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              placeholder="test@example.com"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              placeholder="Minimum 10 characters required"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="button">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}