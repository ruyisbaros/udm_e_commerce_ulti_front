import { configureStore } from "@reduxjs/toolkit";

import adminUsersSlicer from "./adminUsersSlicer";
import adminRolesSlicer from "./adminRolesSlicer";
import loggedInUserSlicer from "./loggedInUserSlicer";
import categorySlicer from "./categorySlicer";

export const store = configureStore({
  reducer: {
    users: adminUsersSlicer,
    rolesContext: adminRolesSlicer,
    currentUser: loggedInUserSlicer,
    categories: categorySlicer,
  },
});
