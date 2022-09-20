import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import {
  usersFetchFinish,
  usersFetchStart,
  usersFetchSuccess,
} from "../../../redux/adminUsersSlicer";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

const Users = () => {
  const { users } = useSelector((store) => store.users);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [alert, setAlert] = useState(false);
  const [deletedUserInfo, setDeletedUserInfo] = useState({
    id: null,
    firstName: "",
  });

  //Pagination Sorting Filter
  const [keyword, setKeyword] = useState("");
  const [totalPages, setTotalPages] = useState();
  const [pageNumber, setpageNumber] = useState(1);
  const [pageSize, setpageSize] = useState(5);
  const [arrow, setArrow] = useState(true);
  const [sortDir, setSortDir] = useState("asc");
  const [sortField, setSortField] = useState("id");
  const [pageEmpty, setPageEmpty] = useState(false);
  const [isFirstPage, setIsFirstPage] = useState(false);
  const [isLastPage, setIsLastPage] = useState(false);

  const fetchUsers = async () => {
    dispatch(usersFetchStart());
    const { data } = await axios.get(
      `/api/v1/admin/users/all?pageSize=${pageSize}&pageNo=${pageNumber}&sortDir=${sortDir}&sortField=${sortField}&keyword=${keyword}`
    );
    dispatch(usersFetchFinish());
    console.log(data);
    setTotalPages(data.totalPages);
    setPageEmpty(data.empty);
    setIsFirstPage(data.first);
    setIsLastPage(data.last);
    dispatch(usersFetchSuccess(data.content));
  };

  useEffect(() => {
    fetchUsers();
  }, [pageNumber, pageSize, sortDir, arrow, keyword]);

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
      dispatch(usersFetchStart());
      await axios.put(`/api/v1/admin/users/user_enabled_disabled/${id}`);
      dispatch(usersFetchFinish());
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="users_container">
      <h2>Manage Users</h2>
      <div>
        <Link to="/new_user">Create New User |</Link>
        <a href="http://localhost:8080/api/v1/admin/users/export_csv">
          {" "}
          Export to CSV |
        </a>
        <a href="http://localhost:8080/api/v1/admin/users/export_excel">
          {" "}
          Export to Excel |
        </a>
        <a href="http://localhost:8080/api/v1/admin/users/export_pdf">
          {" "}
          Export to PDF{" "}
        </a>
      </div>
      <div className="search_actions">
        <p>Search By keyword:</p>
        <input
          type="text"
          placeholder="Keyword..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button onClick={fetchUsers} className="btn btn-primary">
          Search
        </button>
        <button className="btn btn-danger" onClick={() => setKeyword("")}>
          Cancel
        </button>
      </div>

      <table className="table table-bordered table-striped table-hover table-responsive-xl">
        <thead className="thead-dark">
          <tr>
            <th>User Id</th>
            <th>Photo</th>
            <th>
              Email
              {arrow ? (
                <ArrowDropDownIcon
                  className="arrows"
                  onClick={() => {
                    setSortField("email");
                    setArrow(!arrow);
                    setSortDir("desc");
                  }}
                />
              ) : (
                <ArrowDropUpIcon
                  className="arrows"
                  onClick={() => {
                    setSortField("email");
                    setArrow(!arrow);
                    setSortDir("asc");
                  }}
                />
              )}
            </th>
            <th>
              First Name
              {arrow ? (
                <ArrowDropDownIcon
                  className="arrows"
                  onClick={() => {
                    setSortField("firstName");
                    setArrow(!arrow);
                    setSortDir("desc");
                  }}
                />
              ) : (
                <ArrowDropUpIcon
                  className="arrows"
                  onClick={() => {
                    setSortField("firstName");
                    setArrow(!arrow);
                    setSortDir("asc");
                  }}
                />
              )}
            </th>
            <th>
              Last Name
              {arrow ? (
                <ArrowDropDownIcon
                  className="arrows"
                  onClick={() => {
                    setSortField("lastName");
                    setArrow(!arrow);
                    setSortDir("desc");
                  }}
                />
              ) : (
                <ArrowDropUpIcon
                  className="arrows"
                  onClick={() => {
                    setSortField("lastName");
                    setArrow(!arrow);
                    setSortDir("asc");
                  }}
                />
              )}
            </th>
            <th>Roles</th>
            <th>Enabled</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {pageEmpty ? (
            <div className="no_users text-center">
              No Users match with your field!..
            </div>
          ) : (
            users?.map((user) => (
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
                <td className="table_responsive">{user.firstName}</td>
                <td className="table_responsive">{user.lastName}</td>
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
            ))
          )}
        </tbody>
      </table>
      {!pageEmpty && (
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
              type="button"
              onClick={() => setpageNumber(pageNumber + 1)}
            >
              <ArrowForwardIosIcon />
            </button>
          </div>
        </div>
      )}
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
