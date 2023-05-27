import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { notify } from "../components/Notification";

import { useAuthContext } from "../hooks";
import { Navigate } from "react-router-dom";

export const Login = function () {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginButtonDefaultState = { state: false, buttonTag: "Login" };
  const [loggingIn, setLoggingIn] = useState({
    ...loginButtonDefaultState,
  });
  const auth = useAuthContext();

  const handleFormSubmit = async function (event) {
    event.preventDefault();
    setLoggingIn({
      state: true,
      buttonTag: (
        <span
          className="spinner-border spinner-border-sm text-light"
          role="status"
        ></span>
      ),
    });
    console.log(auth);
    let response = await auth.login(email, password);
    setLoggingIn({ ...loginButtonDefaultState });
    console.log(response);
    if (response.success) {
      notify().success("Successfully Signed in");
    } else {
      setEmail("");
      setPassword("");
      notify().error(response.message);
    }
  };
  if (auth.user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container-fluid text-center">
      <h2>Login</h2>
      <form action="" id="login-form" onSubmit={handleFormSubmit}>
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
