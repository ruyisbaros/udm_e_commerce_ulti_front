import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Categories from "./admin/components/categoryComps/Categories";
import CreateCategory from "./admin/components/categoryComps/CreateCategory";
import EditCategory from "./admin/components/categoryComps/EditCategory";
import CreateUser from "./admin/components/userComps/CreateUser";
import EditUser from "./admin/components/userComps/EditUser";
import Users from "./admin/components/userComps/Users";
import Home from "./admin/pages/Home";
import Login from "./admin/pages/Login";
import Footer from "./componentsGen/Footer";
import NavbarAdmin from "./componentsGen/NavbarAdmin";
import NavbarGeneral from "./componentsGen/NavbarGeneral";
import Loading from "./componentsGen/notifies/Loading";
import SingleUser from "./componentsGen/SingleUser";

function App() {
  const { usersFetching } = useSelector((store) => store.users);
  const { categoriesFetching } = useSelector((store) => store.categories);
  const { logging } = useSelector((store) => store.currentUser);

  const [token, setToken] = useState("");

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  //console.log(token);

  return (
    <BrowserRouter>
      <ToastContainer position="bottom-center" limit={1} />
      {usersFetching && <Loading />}
      {logging && <Loading />}
      {categoriesFetching && <Loading />}
      <div className="App">
        <div className="main">
          {token ? <NavbarAdmin /> : <NavbarGeneral />}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<Users token={token} />} />
            <Route path="/users/:email" element={<SingleUser />} />
            <Route path="/new_user" element={<CreateUser token={token} />} />
            <Route
              path="/update_user/:id"
              element={<EditUser token={token} />}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/categories" element={<Categories token={token} />} />
            <Route
              path="/new_category"
              element={<CreateCategory token={token} />}
            />
            <Route
              path="/update_category/:id"
              element={<EditCategory token={token} />}
            />
          </Routes>
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
