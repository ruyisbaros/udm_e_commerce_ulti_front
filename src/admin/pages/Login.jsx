import React, { useEffect, useState } from "react";
import Logo from "../../utils/images/ShopmeAdminSmall.png";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  userLoggedFinish,
  userLoggedStart,
  userLoggedSucces,
} from "../../redux/loggedInUserSlicer";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    currentUserEmail,
    currentUserImage,
    currentUserRoles,
    token,
    logging,
  } = useSelector((store) => store.currentUser);
  const [loggedUser, setLoggedUser] = useState({ email: "", password: "" });

  const handleInput = (e) => {
    setLoggedUser({ ...loggedUser, [e.target.name]: e.target.value });
  };
  //console.log(loggedUser);
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      dispatch(userLoggedStart());

      const { data } = await axios.post("/api/v1/auth/login", {
        ...loggedUser,
      });

      dispatch(userLoggedFinish());
      //console.log(data);
      dispatch(
        userLoggedSucces({
          email: data.email,
          token: data.jwtToken,
          roles: data.roles,
          profileImage: data.profileImage,
        })
      );
      localStorage.setItem("token", data.jwtToken);
      localStorage.setItem("email", data.email);
      localStorage.setItem(
        "roles",
        data.roles.map((r) => r.roleName)
      );
      localStorage.setItem("profileImage", data.profileImage.imageUrl);
      localStorage.setItem("firstName", data.firstName);
      toast.success(`welcome ${localStorage.getItem("email")}`);
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.log(error.response.data.message);
      dispatch(userLoggedFinish());
      toast.error("Wrong credentials");
    }
  };
  /*  console.log(
    currentUserEmail,
    currentUserImage,
    currentUserRoles,
    token,
    logging
  ); */

  return (
    <div className="users_login">
      <form onSubmit={handleLogin}>
        <h2>
          <img src={Logo} alt="logo" />
        </h2>
        <input
          type="email"
          required
          name="email"
          placeholder="Email..."
          value={loggedUser.email}
          onChange={handleInput}
        />
        <input
          type="password"
          required
          name="password"
          placeholder="Password..."
          value={loggedUser.password}
          onChange={handleInput}
        />
        {/* <div className="remember_me">
          <label htmlFor="remember">Remember me: </label>
          <input type="checkbox" name="remember" id="remember" />
        </div> */}
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
