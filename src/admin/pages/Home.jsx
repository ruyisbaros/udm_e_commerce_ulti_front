import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("email")) {
      setEmail(localStorage.getItem("email"));
    }
    if (localStorage.getItem("profileImage")) {
      setProfileImage(localStorage.getItem("profileImage"));
    }
    if (localStorage.getItem("roles")) {
      setRoles(localStorage.getItem("roles").split(","));
    }
    if (localStorage.getItem("firstName")) {
      setFirstName(localStorage.getItem("firstName"));
    }
  }, []);
  return (
    <div>
      <h2>Page Control Panel</h2>
      <span>Welcome</span>{" "}
      <Link to={`/users/${email}`}>{firstName.toUpperCase()}</Link>{" "}
      <span>Roles: </span>
      {roles?.map((r, i) => (
        <span key={i}>{r} | </span>
      ))}
    </div>
  );
};

export default Home;
