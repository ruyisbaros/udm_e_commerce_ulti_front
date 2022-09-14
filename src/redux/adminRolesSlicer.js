import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  rolesContext: [],
};

const rolesSlicer = createSlice({
  name: "rolesContext",
  initialState,
  reducers: {
    fetchRoles: (state, action) => {
      state.rolesContext = action.payload;
    },
  },
});

export const { fetchRoles } = rolesSlicer.actions;

export default rolesSlicer.reducer;
