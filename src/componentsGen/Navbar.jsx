import React from "react";
import { Link } from "react-router-dom";
import Logo from "../utils/images/ShopmeAdminSmall.png";

const Navbar = () => {
  return (
    <div>
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
      </nav>
    </div>
  );
};

export default Navbar;
