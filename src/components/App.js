import { Navigate, Route, Routes } from "react-router-dom";

import "../styles/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { NavigationBar } from "./Navbar";

import {
  Login,
  SignUp,
  Home,
  NewPoll,
  PollResults,
  Poll,
  ErrorNotFound,
  Dashboard,
  MyPolls,
  MyVotedPolls,
} from "../pages";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthContext } from "../hooks";
import { Loader } from "./Loader";

function PrivateRoute({ children }) {
  const auth = useAuthContext();
  if (auth.user) {
    return children;
  } else return <Navigate to="/login" />;
}

function App() {
  const auth = useAuthContext();

  if (auth.loading) {
    console.log("loading");

    return <Loader />;
  }
  return (
    <div className="App">
      <NavigationBar />
      <ToastContainer />
      <Routes>
        {/* Home */}
        <Route exact path="/" element={<Home />}></Route>
        <Route
          exact
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        ></Route>
        <Route
          exact
          path="/mypolls"
          element={
            <PrivateRoute>
              <MyPolls />
            </PrivateRoute>
          }
        ></Route>
        <Route
          exact
          path="/myvotes"
          element={
            <PrivateRoute>
              <MyVotedPolls />
            </PrivateRoute>
          }
        ></Route>

        {/* Login  */}
        <Route exact path="/login" element={<Login />}></Route>
        {/* Sign Up */}
        <Route exact path="/sign-up" element={<SignUp />}></Route>
        {/* New Poll  */}
        <Route
          exact
          path="/poll/create-new"
          element={
            <PrivateRoute>
              <NewPoll />
            </PrivateRoute>
          }
        ></Route>
        {/* Poll results */}
        <Route exact path="/poll/results/:id" element={<PollResults />}></Route>
        {/* Polling page */}
        <Route exact path="/poll/:id" element={<Poll />}></Route>
        <Route element={<ErrorNotFound />}> </Route>
      </Routes>
    </div>
  );
}

export default App;
