import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { context } from "../Context/Provider";
const NavBar = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(context);
  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("token");
    navigate("/login");
    // Perform any other necessary cleanup or redirect logic
  };

  return (
    <div className="nav-bar">
      <ul className="nav-ul">
        <li>
          <Link to="/">Dashboard</Link>
        </li>
      </ul>
      <button onClick={handleLogout} type="button" className="btn-logout">
        Logout
      </button>
    </div>
  );
};

export default NavBar;
