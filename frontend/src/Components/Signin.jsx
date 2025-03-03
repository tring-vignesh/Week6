import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "bootstrap/dist/css/bootstrap.min.css";
import { gql, useMutation } from "@apollo/client";
const SIGNIN_MUTATION = gql`
  mutation Signin($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [signin, { loading }] = useMutation(SIGNIN_MUTATION);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all details.");
      return;
    }
  
    try {
      const { data } = await signin({ variables: { email, password } });
      console.log(data);
      if (data && data.signin) {
        localStorage.setItem("token", data.signin.token);
        localStorage.setItem("user", JSON.stringify(data.signin.user));
        setError("");
        navigate("/dashboard"); 
      }
    } catch (err) {
      setError(err.message || "Invalid email or password.");
    }

  };

  return (
    <div className="d-flex justify-content-center  bg-light">
      <div className="card p-4 shadow" style={{ width: "24rem" }}>
        <h2 className="text-center mb-3">Sign In</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
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
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
