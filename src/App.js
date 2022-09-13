import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminHome from "./admin/pages/AdminHome";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="bottom-center" limit={1} />
      <div className="App">
      <Routes>
        <Route path="/admin" element={<AdminHome/>}/>
         <Route path="/admin" element={<AdminHome/>}/>
      </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
