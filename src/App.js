import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Categories from "./admin/components/Categories";
import CreateUser from "./admin/components/CreateUser";
import Users from "./admin/components/Users";
import AdminHome from "./admin/pages/AdminHome";
import ClientHome from "./client/pages/ClientHome";
import Footer from "./componentsGen/Footer";
import Navbar from "./componentsGen/Navbar";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="bottom-center" limit={1} />
      <div className="App">
        <div className="main">
          <Navbar />
          <Routes>
            <Route path="/" element={<ClientHome />} />
            <Route path="/admin" element={<AdminHome />} />
            <Route path="/users" element={<Users />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/new_user" element={<CreateUser />} />
          </Routes>
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
