import { useState } from "react";
import { useAuthContext } from "../hooks";
import { Navigate } from "react-router-dom";

import Button from "react-bootstrap/Button";
import { notify } from "../components/Notification";

export const Login = function () {
  // Email input hook
  const [email, setEmail] = useState("");
  // password input hook
  const [password, setPassword] = useState("");

  // hook for login button state  to avoid multiple clicks leading to unnecessary API calls
  const loginButtonDefaultState = { state: false, buttonTag: "Login" };
  const [loggingIn, setLoggingIn] = useState({
    ...loginButtonDefaultState,
  });
  // Context hook for user functionalities
  const auth = useAuthContext();
  // Handles login form submit
  const handleFormSubmit = async function (event) {
    event.preventDefault();
    // sets the state to login mode and disables submit button to avoid multiple clicks
    setLoggingIn({
      state: true,
      buttonTag: (
        <span
          className="spinner-border spinner-border-sm text-light"
          role="status"
        ></span>
      ),
    });
    // Function call
    let response = await auth.login(email, password);
    // enables the form submit button
    setLoggingIn({ ...loginButtonDefaultState });

    if (!response) {
      return (
        <div className="container-fluid text-center">Internal Server Error</div>
      );
    }
    if (response.success) {
      notify().success("Successfully Signed in");
      // Redirect to shared link
    } else {
      // Login unsuccessful
      setEmail("");
      setPassword("");
      notify().error(response.message);
    }
  };
  // If already logged in navigate to home
  if (auth.user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container-fluid text-center">
      <h2>Login</h2>
      <h4 className="text-secondary">Log in to create your poll</h4>
      {/* login form */}
      <form action="" id="login-form" onSubmit={handleFormSubmit}>
        {/* Email */}
        <div className="text-center">
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email Address"
            className="card col-12 col-lg-5 m-2 mx-auto p-3"
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
            form="login-form"
            required
          />
        </div>
        <div>
          {/* Password */}
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            className="card col-12 col-lg-5 mx-auto m-2 p-3"
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
            form="login-form"
            required
          />
        </div>
        {/* Submit Button */}
        <Button
          type="submit"
          form="login-form"
          variant="dark"
          className="col-10 col-lg-3 p-3"
          disabled={loggingIn.state}
        >
          {loggingIn.buttonTag}
        </Button>{" "}
      </form>
    </div>
  );
};
