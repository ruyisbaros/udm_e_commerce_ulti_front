import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { isUpdate, usersFetchSuccess } from "../../../redux/adminUsersSlicer";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const Users = () => {
  const { users } = useSelector((store) => store.users);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [alert, setAlert] = useState(false);
  const [deletedUserInfo, setDeletedUserInfo] = useState({
    id: null,
    firstName: "",
  });

  //Pagination Sorting
  const [totalPages, setTotalPages] = useState();
  const [pageNumber, setpageNumber] = useState(1);
  const [pageSize, setpageSize] = useState(5);
  const [sortingValue, setsortingValue] = useState("asc");
  const [pageEmpty, setPageEmpty] = useState(false);
  const [isFirstPage, setIsFirstPage] = useState(false);
  const [isLastPage, setIsLastPage] = useState(false);

  const fetchUsers = async () => {
    const { data } = await axios.get(
      `/api/v1/admin/users/all?pageSize=${pageSize}&pageNo=${pageNumber}&sorting=${sortingValue}`
    );
    console.log(data);
    setTotalPages(data.totalPages);
    setPageEmpty(data.empty);
    setIsFirstPage(data.first);
    setIsLastPage(data.last);
    dispatch(usersFetchSuccess(data.content));
  };

  useEffect(() => {
    fetchUsers();
  }, [pageNumber, pageSize]);

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
            <tr key={user.id}>
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
                <Link to={`/update_user/${user.id}`}>
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
      <div className="page_actions">
        <div className="page_selections">
          <label htmlFor="">Page Size:</label>
          <input
            defaultValue={null}
            type="text"
            onChange={(e) => setpageSize(e.target.value)}
          />
        </div>
        <div className="the_pages">
          <button
            disabled={isFirstPage === true}
            className="arrow_btn"
            type="button"
            onClick={() => setpageNumber(pageNumber - 1)}
          >
            <ArrowBackIosIcon />
          </button>
          <div className="page_numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (val, index) => (
                <div
                  key={index}
                  onClick={() => setpageNumber(index + 1)}
                  className={
                    pageNumber === index + 1
                      ? "page_number active"
                      : "page_number"
                  }
                >
                  {index + 1}
                </div>
              )
            )}
          </div>
          <button
            disabled={isLastPage === true}
            className="arrow_btn"
            style={{ width: "50px" }}
            type="button"
            onClick={() => setpageNumber(pageNumber + 1)}
          >
            <ArrowForwardIosIcon />
          </button>
        </div>
      </div>
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
