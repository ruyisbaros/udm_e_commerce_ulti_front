import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import {
  getWillUpdateId,
  isUpdate,
  usersFetchSuccess,
} from "../../../redux/adminUsersSlicer";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Users = () => {
  const { users } = useSelector((store) => store.users);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [alert, setAlert] = useState(false);
  const [isComfirm, setIsComfirm] = useState(false);
  const [deletedUserInfo, setDeletedUserInfo] = useState({
    id: null,
    firstName: "",
  });

  const fetchUsers = async () => {
    const { data } = await axios.get("/api/v1/admin/users/all");
    //console.log(data);
    dispatch(usersFetchSuccess(data));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  console.log(users);

  //DELETE USER!
  const getDeleteUserInfo = async (id, firstName) => {
    setAlert(true);
    setDeletedUserInfo({ ...deletedUserInfo, id: id, firstName: firstName });
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `/api/v1/admin/users/delete_user/${deletedUserInfo.id}`
      );
      toast.success("User has been deleted successufully");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
    setAlert(false);
  };

  const handleEnableDisable = async (id) => {
    try {
      await axios.put(`/api/v1/admin/users/user_enabled_disabled/${id}`);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="users_container">
      <h2>Manage Users</h2>
      <div>
        <Link
          onClick={() => dispatch(isUpdate(false))}
          to="/user_ops"
          className="link_class"
        >
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
              {/* <td>{user.photo}</td> */}
              <td>
                <img
                  className="avatar"
                  src={user.profileImage.imageUrl}
                  alt="photoname"
                />
              </td>
              <td>{user.username}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.roles?.map((role) => role.roleName + " ")}</td>
              <td className="text-center">
                {user.enabled ? (
                  <i
                    onClick={() => handleEnableDisable(user.id)}
                    className="fa-solid fa-check-circle icon_green"
                  ></i>
                ) : (
                  <i
                    onClick={() => handleEnableDisable(user.id)}
                    className="fa-solid fa-check-circle icon_dark"
                  ></i>
                )}
              </td>
              <td className="text-center d-flex justify-content-around border-bottom-0">
                <Link
                  onClick={() => {
                    dispatch(isUpdate(true));
                    dispatch(getWillUpdateId(user.id));
                  }}
                  to="/user_ops"
                >
                  <i className="fa-solid fa-pen-to-square icon_green"></i>
                </Link>

                <i
                  onClick={() => getDeleteUserInfo(user.id, user.firstName)}
                  className="fa-solid fa-trash icon_red"
                ></i>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {alert && (
        <div className="warning_box-delete">
          <p>
            Are you sure do you want to delete " {deletedUserInfo.firstName} "
            with " {deletedUserInfo.id} " ID
          </p>
          <div className="text-center">
            <button
              onClick={handleDelete}
              className="btn btn-primary m-4"
              type="submit"
            >
              Yes
            </button>
            <button
              onClick={() => setAlert(false)}
              className="btn btn-danger"
              type="button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
