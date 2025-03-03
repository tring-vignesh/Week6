import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useLocation,useNavigate } from "react-router-dom";
const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const handleLogout = () => {
    sessionStorage.removeItem("loggedInUser"); 
    localStorage.removeItem("loggedInUser"); 
    navigate("/signin"); 
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">Tringapps</Link>
        <div className="ml-auto">
          {location.pathname !== "/dashboard" && !location.pathname.startsWith("/editpersona/") &&!location.pathname.startsWith("/addpersona")? (
            <>
              <Link className="btn btn-primary mx-2" to="/signin">Sign In</Link>
              <Link className="btn btn-primary" to="/signup">Sign Up</Link>
            </>
          ) : (
            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
