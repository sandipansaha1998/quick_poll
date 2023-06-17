import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { Navigate, useNavigate } from "react-router-dom";

import { getIsEmailUnique as isUnique, signup } from "../api";
import { notify } from "../components/Notification";
import { useAuthContext } from "../hooks";

export const SignUp = function () {
  const auth = useAuthContext();
  // Hook for email
  const [email, setEmail] = useState("");
  // Hook for Validation of email
  // contains -isValid,message
  // A valid email is if follows '@domain_name.xyz and is unique'
  const [emailValidation, setEmailValidation] = useState({
    isValid: false,
    message: "",
  });
  // Hook for input Name
  const [name, setName] = useState(undefined);
  // Hook for input : Password
  const [password, setPassword] = useState("");
  // Hook for input : confirm password
  const [confimrPassword, setConfirmPassword] = useState("");
  // Hook for password validaiton A password is validate
  //  - minimum 6 characters length
  // - the password and cofirm password match
  const [passwordValidation, setPasswordValidation] = useState({
    isValid: false,
    message: "",
  });
  // Loading to freeze the button on click in order prevent unneccessary mutliple requests
  const [loading, setLoading] = useState(false);

  // Allover Form Validation
  // If valdiated ,Submit button is enabled
  const [formInputValidation, setFormInputValidation] = useState(true);
  const navigate = useNavigate();
  // UseEffect hook to update All over Form validaiton
  useEffect(() => {
    //Compulsory feild check
    if (email !== "" && password !== "")
      setFormInputValidation(
        emailValidation.isValid && passwordValidation.isValid
      );
  }, [emailValidation, passwordValidation]);
  // Hook for email Validation.
  useEffect(() => {
    getIsEmailUnique(); //checks if the email is unique
    if (email !== "" && password !== "")
      setFormInputValidation(
        emailValidation.isValid && passwordValidation.isValid
      );
  }, [email]);

  // To update password validaiton on change in password and confirm password change
  useEffect(() => {
    isPasswordValidate();
  }, [password, confimrPassword]);

  // Function to check if email is unique
  const getIsEmailUnique = async () => {
    // Matches the regular expression
    if (
      !String(email)
        .toLowerCase()
        .match(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/)
    ) {
      setEmailValidation({ isValid: false, message: "Not a valid email" });
      return;
    }
    // Checks if email is unique and updates validation state
    let isEmailUnique = await isUnique(email);
    if (!isEmailUnique) {
      notify().error("Could not validate email");
      return;
    }
    if (isEmailUnique.success) {
      setEmailValidation({ isValid: true });
    } else {
      setEmailValidation({ isValid: false, message: "Email id Taken" });
    }
  };
  // Checks if Password is validate
  const isPasswordValidate = () => {
    if (password.length < 6) {
      setPasswordValidation({
        isValid: false,
        message: "Minimum 6 characters",
      });
      return;
    } else {
      if (password !== confimrPassword) {
        setPasswordValidation({
          isValid: false,
          message: "Passwords do not match",
        });
      } else {
        setPasswordValidation({ isValid: true });
      }
    }
  };

  // Handles Form Submit
  const handleFormSubmit = async (event) => {
    try {
      event.preventDefault();
      // Freezes button
      setLoading(true);
      // Sends sign up request through API
      let response = await signup(email, name, password);

      setLoading(false);
      if (!response) {
        notify.error("Could not Sign up");
      }
      if (response.success) {
        notify().success("Successfully Signed up");
        // Reset Form
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        // Redirect to login
        navigate("/login");
      } else {
        // If registration fails,Error notification is shown
        notify().error(response.data.message);
      }
    } catch (e) {
      console.log(e);
    }
  };
  // if user is logged in redirect to login page
  if (auth.user) {
    return <Navigate to="/" />;
  }
  return (
    <div className="container-fluid text-center">
      <h2>Register</h2>
      {/* Sign up Form */}
      <form action="" id="sign-up-form" onSubmit={handleFormSubmit}>
        <div className="text-center">
          {/* Email */}
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email Address"
            className="card col-12 col-lg-5 m-2 mx-auto p-3"
            form="sign-up-form"
            required
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
        </div>
        {/* Email Validaiton Message */}
        {email !== "" && !emailValidation.isValid && (
          <div className="container-fluid col-12 col-lg-5 text-danger text-start">
            *{emailValidation.message}
          </div>
        )}
        <div className="text-center">
          {/* Name */}
          <input
            type="name"
            name="name"
            id="name"
            placeholder="Name"
            className="card col-12 col-lg-5 m-2 mx-auto p-3"
            form="sign-up-form"
            onChange={(e) => {
              setName(e.target.value);
            }}
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
            form="sign-up-form"
            required
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
        </div>
        <div>
          {/* Confirm password */}
          <input
            type="confirm_password"
            name="confirm_password"
            id="confirm_password"
            placeholder="Confirm Password"
            className="card col-12 col-lg-5 mx-auto m-2 p-3"
            form="sign-up-form"
            onChange={(event) => {
              setConfirmPassword(event.target.value);
            }}
          />
        </div>
        {/* Passowrd Validation messages */}
        {passwordValidation.isValid && (
          <div className="container-fluid col-12 col-lg-5 text-success text-start">
            Passwords match
          </div>
        )}
        {password !== "" && !passwordValidation.isValid && (
          <div className="container-fluid col-12 col-lg-5 text-danger text-start">
            *{passwordValidation.message}
          </div>
        )}
        {/* Submit button */}
        <Button
          variant="dark"
          className="col-10 col-lg-3 m-4 p-2"
          type="submit"
          form="sign-up-form"
          disabled={!formInputValidation || loading}
          style={
            !formInputValidation
              ? { backgroundColor: "#000" }
              : { backgroundColor: "#111" }
          }
        >
          {loading ? "Signing.." : "Sign up"}
        </Button>{" "}
      </form>
    </div>
  );
};
