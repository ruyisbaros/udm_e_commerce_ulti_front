import axios from "axios";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchRoles } from "../../../redux/adminRolesSlicer";
import defaultImg from "../../../utils/images/default-user.png";
import loadingGif from "../../../utils/images/loading.gif";

const EditUser = () => {
  const { id } = useParams();
  //console.log(id);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { rolesContext } = useSelector((store) => store.rolesContext);
  useEffect(() => {
    const getRoles = async () => {
      const { data } = await axios.get("/api/v1/admin/users/get_roles");
      //console.log(data);
      dispatch(fetchRoles(data));
    };
    getRoles();
  }, []);

  const [editUser, setEditUser] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    roles: [],
    isEnabled: false,
    imageId: "",
    imageUrl: "",
  });

  const [emailIsNotUnique, setEmailIsNotUnique] = useState({
    situation: false,
    message: "",
  });
  const [existingEmail, setExistingEmail] = useState("");
  const [isCreated, setIsCreated] = useState(false);

  const fetchUser = async () => {
    const { data } = await axios.get(`/api/v1/admin/users/get_user/${id}`);
    /* console.log(data);
    console.log("data dan: ", data.email); */
    setExistingEmail(data.email);
    setEditUser({
      ...editUser,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      password: "",
      roles: data.roles.map((r) => r.roleName),
      isEnabled: data.enabled,
      imageId: data.profileImage.imageId,
      imageUrl: data.profileImage.imageUrl,
    });
  };
  const [selectedImageId, setSelectedImageId] = useState("");
  // setSelectedImageId(editUser.imageId);
  console.log(editUser);
  console.log(existingEmail);

  useEffect(() => {
    fetchUser();
  }, [id]);

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
    setEditUser({
      ...editUser,
      imageId: data.imageId,
      imageUrl: data.imageUrl,
    });
  };

  const deleteImage = async () => {
    setSelectedFile("");
    const { data } = await axios.delete(
      `/api/v1/users/images/delete/${selectedImageId}`
    );
    setEditUser({ ...editUser, imageId: "" });
    console.log(data);
  };

  const { roles } = editUser;

  const handleRole = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setEditUser({ ...editUser, roles: [...roles, value] });
    } else {
      setEditUser({ ...editUser, roles: roles.filter((e) => e !== value) });
    }
  };

  const handleEnabled = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setEditUser({ ...editUser, isEnabled: true });
    } else {
      setEditUser({ ...editUser, isEnabled: false });
    }
  };

  const handleInput = (e) => {
    setEditUser({ ...editUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let isEmailUnique = false;
    if (existingEmail !== editUser.email) {
      isEmailUnique = await axios.get(
        `/api/v1/admin/users/is_email_unique/${editUser.email}`
      );
    }

    //console.log(isEmailUnique.data);

    if (!isEmailUnique.data) {
      const { data } = await axios.put(
        `/api/v1/admin/users/update_user/${id}`,
        {
          ...editUser,
        }
      );
      //console.log(data);
      toast.success("User has been updated successufully..");
      setEditUser({
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        roles: [],
        isEnabled: false,
        photos: "",
      });
      navigate("/users");
    } else {
      setEmailIsNotUnique({
        ...setEmailIsNotUnique,
        situation: true,
        message: `${editUser.email} is already in use.  Please try with another one`,
      });
    }
  };

  const cancelOperation = () => {
    navigate("/users");
  };

  const handleWarning = () => {
    setEmailIsNotUnique({
      ...emailIsNotUnique,
      situation: false,
      message: "",
    });

    setEditUser({ ...editUser, email: "" });
  };

  return (
    <div>
      <div className="create_user">
        <h2 className="text-center m-2">
          Update{" "}
          <span
            style={{
              color: "blue",
              fontSize: "20px",
            }}
          >
            {editUser.firstName.toUpperCase()}{" "}
          </span>
          's Needed Info
        </h2>

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
                  value={editUser.email}
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
                  value={editUser.firstName}
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
                  value={editUser.lastName}
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
                  value={editUser.password}
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
                        checked={editUser.roles.find(
                          (r) => r === role.roleName
                        )}
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
                  checked={editUser.isEnabled}
                  name="isEnabled"
                  type="checkbox"
                  //minLength={4}
                  //value={editUser.isEnabled}
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
                      src={editUser.imageUrl}
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
            <button
              disabled={editUser.imageId === ""}
              className="btn btn-primary m-4"
              type="submit"
            >
              {editUser.imageId === "" ? "select image" : "update"}
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
            <div className="warning_box">
              <span onClick={handleWarning} className="close-btn">
                &times;
              </span>
              <p>{emailIsNotUnique.message}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditUser;
