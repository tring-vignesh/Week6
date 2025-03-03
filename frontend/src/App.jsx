import { ApolloProvider } from "@apollo/client";
import client from "./apolloClient.js"; 
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./Components/Navbar.jsx"; 
import Home from "./Components/Home.jsx";
import SignIn from "./Components/Signin.jsx";
import SignUp from "./Components/Signup.jsx";
import Dashboard from "./Components/DashBoard.jsx";
import EditPersona from "./Components/EditPersona.jsx";
import AddPersona from "./Components/AddPersona.jsx";
const isAuthenticated = () => !!localStorage.getItem("token");
const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/signin" replace />;
};
function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Navbar /> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
          <Route path="/addpersona" element={<ProtectedRoute element={<AddPersona />} />} />
          <Route path="/editpersona/:index" element={<ProtectedRoute element={<EditPersona />} />} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;
