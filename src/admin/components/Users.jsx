import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { usersFetchSuccess } from "../../redux/adminUsersSlicer";
import UserCard from "./UserCard";
import { Link } from "react-router-dom";

const Users = () => {
  const { users } = useSelector((store) => store.users);

  const dispatch = useDispatch();

  const fetchUsers = async () => {
    const { data } = await axios.get("/api/v1/admin/users/all");
    //console.log(data);
    dispatch(usersFetchSuccess(data));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  console.log(users);

  return (
    <div>
      <h2>Manage Users</h2>
      <div>
        <Link to="/new_user" className="link_class">
          Create New User
        </Link>
      </div>

      <table className="table table-bordered table-striped table-hover table-responsive-xl">
        <thead className="thead-dark">
          <tr>
            <th>User Id</th>
            <th>Photo</th>
            <th>Email</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Roles</th>
            <th>Enabled</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => (
            <tr>
              <td>{user.id}</td>
              <td>{user.photo}</td>
              <td>{user.username}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.roles?.map((role) => role.roleName + " ")}</td>
              <td>{user.enabled ? "active" : "not-active"}</td>
              <td>Edit &nbsp; Delete </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
