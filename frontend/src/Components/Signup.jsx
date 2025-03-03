import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import validator from "validator";
import { gql, useMutation } from "@apollo/client";
const SIGNUP_MUTATION = gql`
  mutation Signup($name: String!, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;
export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [isValidName, setIsValidName] = useState(true);
  const [signup, { loading }] = useMutation(SIGNUP_MUTATION);
  useEffect(() => {
    setIsValidName(name.trim().length > 0);
    setIsValidEmail(validator.isEmail(email));
    setIsValidPassword(
      validator.isStrongPassword(password, {
        minLength: 8,
        minUppercase: 1,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    );
  }, [email, password, name]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!isValidName) {
      setError("Name cannot be empty.");
      return;
    }
    if (!isValidEmail) {
      setError("Invalid email format.");
      return;
    }
    if (!isValidPassword) {
      setError("Password must be strong (8+ chars, 1 uppercase, 1 number, 1 symbol).");
      return;
    }
    try {
      const { data } = await signup({ variables: { name, email, password } });
      if (data?.signup?.token) {
        localStorage.setItem("token", data.signup.token);
        setSuccess("Signup successful! Redirecting...");
        // setTimeout(() => {
        //   window.location.href = "/dashboard"; 
        // }, 2000);
      }
    } catch (err) {
      if (err.message.includes("Email already exists")) {
        setError("Email already exists. Please use a different email.");
      } else {
        setError("Signup failed. Please try again.");
      }
    }
  };
  return (
    <div className="d-flex justify-content-center bg-light">
      <div className="card p-4 shadow" style={{ width: "24rem" }}>
        <h2 className="text-center mb-3">Sign Up</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {!isValidName && name && <small className="text-danger">Name cannot be empty.</small>}
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {!isValidEmail && email && <small className="text-danger">Invalid email format.</small>}
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {!isValidPassword && password && (
              <small className="text-danger">
                Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.
              </small>
            )}
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
