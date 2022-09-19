import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  updateId: null,
  willUpdate: false,
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
    usersFetchFinish: (state) => {
      state.usersFetching = false;
    },

    usersFetchSuccess: (state, action) => {
      state.usersFetching = false;
      state.users = action.payload;
    },

    addNewUser: (state, action) => {
      state.users = [...state.users, action.payload];
    },

    getWillUpdateId: (state, action) => {
      state.updateId = action.payload;
    },
    isUpdate: (state, action) => {
      state.willUpdate = action.payload;
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
  getWillUpdateId,
  isUpdate,
  usersFetchFinish,
} = usersSlicer.actions;

export default usersSlicer.reducer;
