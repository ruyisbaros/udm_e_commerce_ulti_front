import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import loadingGif from "../../../utils/images/loading.gif";

import defaultImg from "../../../utils/images/image-thumbnail.png";

const EditCategory = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  //console.log(id);
  const [categories, setCategories] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [preview, setPreview] = useState("");
  const [isCreated, setIsCreated] = useState(false);
  const [categoryImageUrl, setCategoryImageUrl] = useState("");

  const [editCategory, setEditCategory] = useState({
    name: "",
    alias: "",
    imageId: "",
    parentName: "",
    enabled: false,
  });
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
    //console.log(data);
    setCategories(data);
  };

  //User may keep alias and name info as existing!!!
  const [existingName, setExistingName] = useState("");
  const [existingAlias, setExistingAlias] = useState("");

  const fetchCategory = async () => {
    const { data } = await axios.get(`/api/v1/company/categories/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(data);
    setExistingAlias(data.alias);
    setExistingName(data.name);
    setEditCategory({
      ...editCategory,
      name: data.name,
      alias: data.alias,
      enabled: data.enabled,
      imageId: data.images[0]?.imageId,
      parentName: data.parent ? data.parent.name : null,
    });
    setCategoryImageUrl(data.images[0]?.imageUrl);
  };
  useEffect(() => {
    fetchCategory();
  }, [id]);

  useEffect(() => {
    fetchCategories();
  }, [token]);

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
    console.log(file);
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
    setEditCategory({ ...editCategory, imageId: data.imageId });
    setCategoryImageUrl(data.imageUrl);
  };

  const deleteImage = async () => {
    setSelectedFile("");
    const { data } = await axios.delete(
      `/api/v1/company/categories/images/delete/${selectedImageId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log(data);
    setEditCategory({ ...editCategory, imageId: "" });
  };

  const [nameIsNotUnique, setNameIsNotUnique] = useState({
    situation: false,
    message: "",
  });

  const handleInput = (e) => {
    setEditCategory({ ...editCategory, [e.target.name]: e.target.value });
  };

  console.log(editCategory);

  const submitHandler = async (e) => {
    e.preventDefault();
    let nameUnique, aliasUnique;
    if (
      existingName !== editCategory.name &&
      existingAlias !== editCategory.alias
    ) {
      const isNameUnique = await axios.get(
        `/api/v1/company/categories/name_unique/${editCategory.name}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      nameUnique = isNameUnique.data;
      const isAliasUnique = await axios.get(
        `/api/v1/company/categories/name_unique/${editCategory.alias}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      aliasUnique = isAliasUnique.data;
    }

    if (!nameUnique && !aliasUnique) {
      try {
        const { data } = await axios.put(
          `/api/v1/company/categories/update/${id}`,
          { ...editCategory },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Category updated successufully");
        navigate("/categories");
      } catch (error) {
        console.log(error);
        toast.error(error);
      }
    } else if (!nameUnique && aliasUnique) {
      setNameIsNotUnique({
        ...nameIsNotUnique,
        situation: true,
        message: `${editCategory.alias} is already exist`,
      });
    } else if (nameUnique && !aliasUnique) {
      setNameIsNotUnique({
        ...nameIsNotUnique,
        situation: true,
        message: `${editCategory.name} is already exist`,
      });
    } else if (nameUnique && aliasUnique) {
      setNameIsNotUnique({
        ...nameIsNotUnique,
        situation: true,
        message: `${editCategory.name} and ${editCategory.alias} are already exist`,
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
  };

  return (
    <div className="create_update_category">
      <h2 className="text-center m-2">
        Update{" "}
        <span
          style={{
            color: "blue",
            fontSize: "20px",
          }}
        >
          {editCategory.name.toUpperCase()}{" "}
        </span>
        's Needed Info
      </h2>
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
                value={editCategory.name}
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
                placeholder="Category Name"
                name="alias"
                value={editCategory.alias}
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
                value={editCategory.parentName}
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
                minLength={4}
                name="enabled"
                value={editCategory.enabled}
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
                    src={
                      categoryImageUrl
                        ? categoryImageUrl
                        : !preview
                        ? defaultImg
                        : preview
                    }
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
        </div>
        <div className="text-center">
          <button className="btn btn-primary m-4" type="submit">
            Update
          </button>
          <button
            onClick={cancelOperation}
            className="btn btn-danger"
            type="button"
          >
            Cancel
          </button>
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

export default EditCategory;
