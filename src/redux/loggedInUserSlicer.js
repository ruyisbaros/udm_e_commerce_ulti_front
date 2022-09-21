import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUserEmail: "",
  currentUserImage: "",
  currentUserRoles: [],
  token: "",
  logging: false,
};

const currentUserSlicer = createSlice({
  name: "currentUser",
  initialState,
  reducers: {
    userLoggedStart: (state) => {
      state.logging = true;
    },
    userLoggedFinish: (state) => {
      state.logging = false;
    },
    userLoggedSucces: (state, action) => {
      state.logging = false;
      state.currentUserEmail = action.payload.email;
      state.currentUserRoles = action.payload.roles.map((r) => r.roleName);
      state.currentUserImage = action.payload.profileImage;
      state.token = action.payload.token;
    },
  },
});

export const { userLoggedStart, userLoggedFinish, userLoggedSucces } =
  currentUserSlicer.actions;

export default currentUserSlicer.reducer;
