import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
  categoriesFetching: false,
  error: false,
  message: "",
};

const categorySlicer = createSlice({
  name: "categories",
  initialState,
  reducers: {
    categoriesFetchStart: (state) => {
      state.categoriesFetching = true;
    },
    categoriesFetchFinish: (state) => {
      state.categoriesFetching = false;
    },

    categoriesFetchSuccess: (state, action) => {
      state.categoriesFetching = false;
      state.categories = action.payload;
    },
    addNewCategory: (state, action) => {
      state.categories = [...state.categories, action.payload];
    },
  },
});

export const {
  categoriesFetchStart,
  categoriesFetchFinish,
  categoriesFetchSuccess,
  addNewCategory,
} = categorySlicer.actions;

export default categorySlicer.reducer;
