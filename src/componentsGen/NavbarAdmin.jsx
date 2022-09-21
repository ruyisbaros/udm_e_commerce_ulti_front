import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Logo from "../utils/images/ShopmeAdminSmall.png";
import avatar from "../utils/images/default-user.png";

const Navbar = () => {
  /* const { currentUserEmail, currentUserImage } = useSelector(
    (store) => store.currentUser
  ); */
  //console.log(currentUserEmail, currentUserImage);
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState("");
  //const [roles, setRoles] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("email")) {
      setEmail(localStorage.getItem("email"));
    }
    if (localStorage.getItem("profileImage")) {
      setProfileImage(localStorage.getItem("profileImage"));
    }
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("roles");
    localStorage.removeItem("profileImage");
    window.location.reload();
  };

  return (
    <div>
      {/* <form
        action="logout"
        method="post"
        hidden={true}
        name="logoutForm"
      ></form> */}
      <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
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
        <div className="collapse navbar-collapse" id="topNavBar">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/users" className="link_class nav-link">
                Users
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/categories" className="link_class nav-link">
                Categories
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/brands" className="link_class nav-link">
                Brands
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/products" className="link_class nav-link">
                Products
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/customers" className="link_class nav-link">
                Customers
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/orders" className="link_class nav-link">
                Orders
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/shippings" className="link_class nav-link">
                Shippings
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/sales" className="link_class nav-link">
                Sales Report
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/articles" className="link_class nav-link">
                Articles
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/settings" className="link_class nav-link">
                Settings
              </Link>
            </li>
          </ul>
        </div>
        <ul className="logged_user_info">
          <li className="nav-item">
            <img
              className="logged_user_image"
              src={profileImage ? profileImage : avatar}
              alt=""
            />
          </li>
          <li className="nav-item">
            <span className="logged_user_email">{email} </span>
          </li>
          <li className="nav-item dropdown">
            <span
              data-toggle="dropdown"
              className="logged_user_email dropdown-toggle"
            ></span>
            <div className="dropdown-menu">
              <span onClick={handleLogout} className="dropdown-item">
                Logout
              </span>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
