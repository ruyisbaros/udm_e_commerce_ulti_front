import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  suggestions: [],
  result: 0,
  usersFetching: false,
  error: false,
  message: "",
};

const usersSlicer = createSlice({
  name: "users",
  initialState,
  reducers: {
    usersFetchStart: (state) => {
      state.usersFetching = true;
    },

    usersFetchSuccess: (state, action) => {
      state.usersFetching = false;
      state.users = action.payload;
    },

    addNewUser: (state, action) => {
      state.users = [...state.users, action.payload];
    },

    usersFetchFail: (state, action) => {
      state.usersFetching = false;
      state.error = true;
    },
    fetchSuggestions: (state, action) => {
      state.suggestions = action.payload.users;
      state.result = action.payload.result;
    },
  },
});

export const {
  usersFetchStart,
  usersFetchSuccess,
  usersFetchFail,
  fetchSuggestions,
  addNewUser,
} = usersSlicer.actions;

export default usersSlicer.reducer;
