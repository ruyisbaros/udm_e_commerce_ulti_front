import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { fetchRoles } from "../../../redux/adminRolesSlicer";

import { addNewUser } from "../../../redux/adminUsersSlicer";
import { toast } from "react-toastify";

import loadingGif from "../../../utils/images/loading.gif";

import defaultImg from "../../../utils/images/default-user.png";

const CreateUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { rolesContext } = useSelector((store) => store.rolesContext);
  const { updateId, willUpdate } = useSelector((store) => store.users);
  console.log(updateId, willUpdate);
  const [isCreated, setIsCreated] = useState(false);

  const [newUser, setNewUser] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    roles: [],
    isEnabled: null,
    imageId: "",
  });

  //Profile image settings start
  const [selectedFile, setSelectedFile] = useState("");
  const [preview, setPreview] = useState("");

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

    setSelectedFile(file);
    let formData = new FormData();
    formData.append("multipartFile", file);

    const { data } = await axios.post("/api/v1/users/images/upload", formData, {
      headers: { "content-type": "multipart/form-data" },
    });
    setIsCreated(false);
    console.log(data);
    setSelectedImageId(data.imageId);
    setNewUser({ ...newUser, imageId: data.imageId });
  };

  const deleteImage = async () => {
    setSelectedFile("");
    const { data } = await axios.delete(
      `/api/v1/users/images/delete/${selectedImageId}`
    );
    console.log(data);
  };

  const [emailIsNotUnique, setEmailIsNotUnique] = useState({
    situation: false,
    message: "",
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

  const handleEnabled = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setNewUser({ ...newUser, isEnabled: true });
    } else {
      setNewUser({ ...newUser, isEnabled: false });
    }
  };

  const handleInput = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };
  console.log(newUser);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const isEmailUnique = await axios.get(
      `/api/v1/admin/users/is_email_unique/${newUser.email}`
    );

    //console.log(isEmailUnique.data);

    if (!isEmailUnique.data) {
      const { data } = await axios.post("/api/v1/admin/users/create_user", {
        ...newUser,
      });
      console.log(data);
      dispatch(addNewUser(data));
      toast.success("User has been created successufully..");
      setNewUser({
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        roles: [],
        isEnabled: false,
        imageId: "",
      });
      navigate("/users");
    } else {
      setEmailIsNotUnique({
        ...setEmailIsNotUnique,
        situation: true,
        message: `${newUser.email} is already in use.  Please try with another one`,
      });
    }
  };

  //console.log(emailIsNotUnique);

  useEffect(() => {
    const getRoles = async () => {
      const { data } = await axios.get("/api/v1/admin/users/get_roles");
      //console.log(data);
      dispatch(fetchRoles(data));
    };
    getRoles();
  }, []);

  //console.log(newUser);

  const cancelOperation = () => {
    navigate("/users");
  };

  const handleWarning = () => {
    setEmailIsNotUnique({
      ...emailIsNotUnique,
      situation: false,
      message: "",
    });

    setNewUser({ ...newUser, email: "" });
  };

  return (
    <div className="create_user">
      <h2 className="text-center m-2">Create New User</h2>

      <form
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
                <div key={role.roleName} className="admin_create_box">
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
          <div className="form-group row">
            <label className="col-sm-4 col-form-label" htmlFor="">
              Enabled:
            </label>
            <div className="col-sm-8">
              <input
                defaultValue={true}
                type="checkbox"
                minLength={4}
                onChange={handleEnabled}
              />
            </div>
          </div>
          <div className="form-group row d-flex align-items-center">
            <label className="col-sm-4 col-form-label" htmlFor="">
              Profile Image:
            </label>
            <div className="col-sm-8 d-flex align-items-center">
              {/* <i className="fas fa-image"></i> */}
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
        {emailIsNotUnique.situation && (
          <div className="warning_box-unique">
            <span onClick={handleWarning} className="close-btn">
              &times;
            </span>
            <p>{emailIsNotUnique.message}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateUser;
