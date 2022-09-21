import React from "react";
import { Link } from "react-router-dom";
import Logo from "../utils/images/ShopmeAdminSmall.png";

const NavbarGeneral = () => {
  return (
    <div className="nav_box">
      <nav className="nav_custom navbar d-flex navbar-expand-lg bg-dark navbar-dark align-items-center justify-content-between">
        <div>
          <Link className="link_class" to="">
            <img src={Logo} alt="Logo" />
          </Link>
          <button
            type="button"
            className="navbar-toggler"
            data-toggle="collapse"
            data-target="#topNavBar"
          >
            {" "}
            <span className="navbar-toggler-icon bg-dark "></span>
          </button>
        </div>
        <div className="" id="topNavBar">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/register" className="link_class nav-link">
                Register
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/login" className="link_class nav-link">
                Login
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/brands" className="link_class nav-link">
                <img src="" alt="" />
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default NavbarGeneral;
