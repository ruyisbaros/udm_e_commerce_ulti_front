import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";

import loadingGif from "../../../utils/images/loading.gif";

import defaultImg from "../../../utils/images/image-thumbnail.png";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CreateCategory = ({ token }) => {
  //Profile image settings start
  //const { categories } = useSelector((store) => store.categories);
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState("");
  const [preview, setPreview] = useState("");
  const [isCreated, setIsCreated] = useState(false);
  const [categories, setCategories] = useState([]);
  const [uploadImagesIds, setUploadImagesIds] = useState([]);
  const [uploadImages, setUploadImages] = useState([]);
  const [newCategory, setNewCategory] = useState({
    name: "",
    alias: "",
    parentName: "",
    imageId: "",
    enabled: false,
  });
  const [nameIsNotUnique, setNameIsNotUnique] = useState({
    situation: false,
    message: "",
  });

  const handleInput = (e) => {
    setNewCategory({ ...newCategory, [e.target.name]: e.target.value });
  };
  console.log(newCategory);
  //For Form select options
  const fetchCategories = async () => {
    const { data } = await axios.get(
      "/api/v1/company/categories/all_categories",
      {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(data);
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, [token]);

  // console.log(categories);

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const [selectedImageId, setSelectedImageId] = useState("");

  const handleSelectFile = async (e) => {
    const file = e.target.files[0];
    setIsCreated(true);

    if (!file) return alert("Please select an image");
    if (file.size > 1024 * 1024 * 1) {
      alert("Your file is too large (max 1mb allowed)");
      setSelectedFile("");
      return;
    }
    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      alert("Only jpeg, jpg or PNG images are allowed");
      setSelectedFile("");
      return;
    }
    let formData = new FormData();
    formData.append("multipartFile", file);
    setSelectedFile(file);
    //imageUpload(formData);
    const { data } = await axios.post(
      "/api/v1/company/categories/images/upload",
      formData,
      {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setIsCreated(false);
    console.log(data);
    setSelectedImageId(data.imageId);
    setNewCategory({ ...newCategory, imageId: data.imageId });
  };

  const deleteImage = async () => {
    setSelectedFile("");
    const { data } = await axios.delete(
      `/api/v1/company/categories/images/delete/${selectedImageId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log(data);
    setNewCategory({ ...newCategory, imageId: "" });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const isNameUnique = await axios.get(
      `/api/v1/company/categories/name_unique/${newCategory.name}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const isAliasUnique = await axios.get(
      `/api/v1/company/categories/name_unique/${newCategory.alias}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log(isNameUnique.data);
    console.log(isAliasUnique.data);

    if (!isNameUnique.data && !isAliasUnique.data) {
      const { data } = await axios.post(
        "/api/v1/company/categories/create",
        { ...newCategory },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Category created successufully");
      navigate("/categories");
    } else if (!isNameUnique.data && isAliasUnique.data) {
      setNameIsNotUnique({
        ...nameIsNotUnique,
        situation: true,
        message: `${newCategory.alias} is already exist`,
      });
    } else if (isNameUnique.data && !isAliasUnique.data) {
      setNameIsNotUnique({
        ...nameIsNotUnique,
        situation: true,
        message: `${newCategory.name} is already exist`,
      });
    } else if (isNameUnique.data && isAliasUnique.data) {
      setNameIsNotUnique({
        ...nameIsNotUnique,
        situation: true,
        message: `${newCategory.name} and ${newCategory.alias} are already exist`,
      });
    }
  };

  const cancelOperation = () => {
    navigate("/categories");
  };

  const handleWarning = () => {
    setNameIsNotUnique({
      ...nameIsNotUnique,
      situation: false,
      message: "",
    });

    setNewCategory({ ...newCategory, name: "" });
  };

  return (
    <div className="create_update_category">
      <h2 className="text-center m-4">Create New Category</h2>
      <form
        onSubmit={submitHandler}
        className="border border-secondary rounded p-3"
      >
        <div>
          <div className="form-group row">
            <label className="col-sm-4 col-form-label" htmlFor="">
              Category Name:
            </label>
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control"
                required
                placeholder="Category Name"
                name="name"
                value={newCategory.name}
                onChange={handleInput}
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-4 col-form-label" htmlFor="">
              Alias:
            </label>
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control"
                required
                placeholder="Alias..."
                name="alias"
                value={newCategory.alias}
                onChange={handleInput}
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-4 col-form-label" htmlFor="">
              Parent Category:
            </label>
            <div className="col-sm-8">
              <select
                className="form-control"
                name="parentName"
                id="parent"
                value={newCategory.parentName}
                onChange={handleInput}
              >
                <option value="0">No Parent</option>
                {categories?.map((c, i) => (
                  <option key={c.id} value={c.name}>
                    {c.name}- (parent: {c.parent ? c.parent.name : "main"})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-4 col-form-label" htmlFor="">
              Enabled:
            </label>
            <div className="col-sm-8">
              <input
                defaultValue={true}
                type="checkbox"
                name="enabled"
                value={newCategory.enabled}
                minLength={4}
                //onChange={handleEnabled}
              />
            </div>
          </div>
          <div className="form-group row d-flex align-items-center">
            <label className="col-sm-4 col-form-label" htmlFor="">
              Category Image:
            </label>
            <div className="col-sm-8 d-flex align-items-center">
              <input
                type="file"
                required
                maxLength={1024 * 1024}
                accept="image/png/* , image/jpeg/*"
                //value={newUser.photos}
                onChange={handleSelectFile}
              />
              {isCreated ? (
                <img
                  className="selected_image loading_gif"
                  src={loadingGif}
                  alt=""
                />
              ) : (
                <div className="selected_image_box">
                  <img
                    className="selected_image"
                    src={!preview ? defaultImg : preview}
                    alt=""
                  />
                  {preview && (
                    <div className="close_btn">
                      <i
                        onClick={deleteImage}
                        className="fa-solid fa-circle-xmark icon_red "
                      ></i>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="text-center">
            <button className="btn btn-primary m-4" type="submit">
              Create
            </button>
            <button
              onClick={cancelOperation}
              className="btn btn-danger"
              type="button"
            >
              Cancel
            </button>
          </div>
          {nameIsNotUnique.situation && (
            <div className="warning_box-unique">
              <span onClick={handleWarning} className="close-btn">
                &times;
              </span>
              <p>{nameIsNotUnique.message}</p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateCategory;
