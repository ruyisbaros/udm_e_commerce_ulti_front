import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import {
  categoriesFetchFinish,
  categoriesFetchStart,
  categoriesFetchSuccess,
} from "../../../redux/categorySlicer";
import axios from "axios";

const Categories = ({ token }) => {
  const { categories } = useSelector((store) => store.categories);
  /* console.log(categories);
  const [rootCategories, setRootCategories] = useState(
    categories.filter((cat) => cat.parent === null)
  );
  const [subCategories, setSubCategories] = useState(
    categories.filter((cat) => cat.parent !== null)
  );
  console.log(rootCategories);
  console.log(subCategories); */

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [alert, setAlert] = useState(false);
  const [deletedCategoryInfo, setDeletedCategoryInfo] = useState({
    id: null,
    name: "",
  });

  //console.log(localStorage.getItem("token"));
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

  const fetchCategories = async (e) => {
    dispatch(categoriesFetchFinish());
    try {
      const { data } = await axios.get(
        `/api/v1/company/categories/all?pageSize=${pageSize}&pageNo=${pageNumber}&sortDir=${sortDir}&sortField=${sortField}&keyword=${keyword}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(categoriesFetchFinish());
      console.log(data);
      setTotalPages(data.totalPages);
      setPageEmpty(data.empty);
      setIsFirstPage(data.first);
      setIsLastPage(data.last);
      dispatch(categoriesFetchSuccess(data.content));
    } catch (error) {
      dispatch(categoriesFetchFinish());
    }
  };

  const handleEnableDisable = async (id) => {
    try {
      dispatch(categoriesFetchStart());
      await axios.put(
        `/api/v1/company/categories/category_enabled_disabled/${id}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch(categoriesFetchFinish());
      window.location.reload();
    } catch (error) {
      console.log(error);
      dispatch(categoriesFetchFinish());
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [pageNumber, pageSize, sortDir, arrow, keyword, token]);

  const getDeleteCategoryInfo = (id, name) => {
    setAlert(true);
    setDeletedCategoryInfo({ ...deletedCategoryInfo, id, name });
  };
  const handleDelete = async () => {
    try {
      await axios.delete(
        `/api/v1/company/categories/delete/${deletedCategoryInfo.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Category deleted successufully");
      window.location.reload();
      setAlert(false);
    } catch (error) {
      console.log(error);
      setAlert(false);
    }
  };

  return (
    <div className="categories_container">
      <h2>Manage Categories</h2>
      <div>
        <Link to="/new_category">Create New Category |</Link>
        <a href="http://localhost:8080/api/v1/company/categories/export_csv">
          {" "}
          Export to CSV |
        </a>
        <a href="http://localhost:8080/api/v1/company/categories/export_excel">
          {" "}
          Export to Excel |
        </a>
        <a href="http://localhost:8080/api/v1/company/categories/export_pdf">
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
        <button onClick={fetchCategories} className="btn btn-primary">
          Search
        </button>
        <button className="btn btn-danger" onClick={() => setKeyword("")}>
          Cancel
        </button>
      </div>

      <table className="table table-bordered table-striped table-hover table-responsive-xl">
        <thead className="thead-dark">
          <tr>
            <th> Id</th>
            <th>Category Photo</th>
            <th>Category Name</th>
            <th>Alias</th>
            <th>Enabled</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {pageEmpty ? (
            <div className="no_categories text-center">
              No Users match with your field!..
            </div>
          ) : (
            categories?.map((category) => (
              <tr key={category.id}>
                <td>{category.id}</td>
                {/* <td>{category.photo}</td> */}
                <td>
                  <img
                    className="avatar"
                    src={
                      category.images.length > 0
                        ? category.images[0].imageUrl
                        : ""
                    }
                    alt="photoname"
                  />
                </td>
                <td>
                  {category.name} - (parent:{" "}
                  {category.parent ? category.parent.name : "main"})
                </td>
                <td className="table_responsive">{category.alias}</td>

                <td className="text-center">
                  {category.enabled ? (
                    <i
                      onClick={() => handleEnableDisable(category.id)}
                      className="fa-solid fa-check-circle icon_green"
                    ></i>
                  ) : (
                    <i
                      onClick={() => handleEnableDisable(category.id)}
                      className="fa-solid fa-check-circle icon_dark"
                    ></i>
                  )}
                </td>
                <td className="text-center d-flex justify-content-around border-bottom-0">
                  <Link to={`/update_category/${category.id}`}>
                    <i className="fa-solid fa-pen-to-square icon_green"></i>
                  </Link>

                  <i
                    onClick={() =>
                      getDeleteCategoryInfo(category.id, category.name)
                    }
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
            Are you sure do you want to delete " {deletedCategoryInfo.firstName}{" "}
            " with " {deletedCategoryInfo.id} " ID
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

export default Categories;
