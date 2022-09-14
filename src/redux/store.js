import { configureStore } from "@reduxjs/toolkit";

import adminUsersSlicer from "./adminUsersSlicer";
import adminRolesSlicer from "./adminRolesSlicer";

export const store = configureStore({
  reducer: {
    users: adminUsersSlicer,
    rolesContext: adminRolesSlicer,
  },
});
