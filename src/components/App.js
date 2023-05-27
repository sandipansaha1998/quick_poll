import "../styles/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { NavigationBar } from "./Navbar";
import { Route, Routes } from "react-router-dom";

import { Login, SignUp, Home } from "../pages";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthContext } from "../hooks";
import { Loader } from "./Loader";
function App() {
  const auth = useAuthContext();
  if (auth.loading) {
    console.log("loading");

    return <Loader />;
  }
  return (
    <div className="App">
      <NavigationBar />

      <Routes>
        {/* Home */}
        <Route exact path="/" element={<Home />}></Route>
        {/* Login  */}
        <Route exact path="/login" element={<Login />}></Route>
        {/* Sign Up */}
        <Route exact path="/sign-up" element={<SignUp />}></Route>
        <Route
          element={<h1 className="text-center">404 Page Not Found</h1>}
        ></Route>
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
