import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { fetchRoles } from "../../redux/adminRolesSlicer";

import "./componentStyle.css";
import { addNewUser } from "../../redux/adminUsersSlicer";

const CreateUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { users } = useSelector((store) => store.users);
  const { rolesContext } = useSelector((store) => store.rolesContext);

  /* const [userRoles, setUserRoles] = useState([]); */

  const [newUser, setNewUser] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    roles: [],
    isEnabled: false,
    photos: "",
  });

  const { roles } = newUser;

  const handleRole = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setNewUser({ ...newUser, roles: [...roles, value] });
    } else {
      setNewUser({ ...newUser, roles: roles.filter((e) => e !== value) });
    }
  };

  const handleInput = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  /* const handleRoles=(e)=>{
    setNewUser({...newUser,...newUser.roles,e.target.value})
  } */

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await axios.post("/api/v1/admin/users/create_user", {
      ...newUser,
    });
    console.log(data);
    dispatch(addNewUser(data));
    setNewUser({
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      roles: [],
      isEnabled: false,
      photos: "",
    });
    navigate("/users");
  };

  useEffect(() => {
    const getRoles = async () => {
      const { data } = await axios.get("/api/v1/admin/users/get_roles");
      console.log(data);
      dispatch(fetchRoles(data));
    };
    getRoles();
  }, []);

  console.log(newUser);

  return (
    <div>
      <h2 className="text-center m-2">Create New User</h2>

      <form
        style={{ maxWidth: "50vw", margin: "30px auto" }}
        className="border border-secondary rounded p-3"
        onSubmit={handleSubmit}
      >
        <div>
          <div className="form-group row">
            <label className="col-sm-4 col-form-label" htmlFor="">
              Email:
            </label>
            <div className="col-sm-8">
              <input
                type="email"
                className="form-control"
                required
                placeholder="User e-mail"
                name="email"
                value={newUser.email}
                onChange={handleInput}
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-4 col-form-label" htmlFor="">
              First Name:
            </label>
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control"
                required
                placeholder="User First Name"
                name="firstName"
                value={newUser.firstName}
                onChange={handleInput}
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-4 col-form-label" htmlFor="">
              Last Name:
            </label>
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control"
                required
                placeholder="User Last Name"
                name="lastName"
                value={newUser.lastName}
                onChange={handleInput}
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-4 col-form-label" htmlFor="">
              Password:
            </label>
            <div className="col-sm-8">
              <input
                type="password"
                minLength={4}
                className="form-control"
                required
                placeholder="User Password"
                name="password"
                value={newUser.password}
                onChange={handleInput}
              />
            </div>
          </div>

          <div className="form-group row">
            <label className="col-sm-4 col-form-label" htmlFor="">
              Roles:
            </label>
            <div className="col-sm-8 mt-3">
              {rolesContext?.map((role) => (
                <div className="admin_create_box">
                  <div>
                    <input
                      type="checkbox"
                      minLength={4}
                      //name="roles"
                      value={role.roleName}
                      onChange={handleRole}
                    />
                  </div>
                  <div className="admin_create_field">
                    <p>{role.roleName}</p>
                    <small>{role.description}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <button className="btn btn-primary m-4" type="submit">
              Create
            </button>
            <button className="btn btn-danger" type="button">
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateUser;
