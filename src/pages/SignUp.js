import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { getIsEmailUnique as isUnique, signup } from "../api";
import { notify } from "../components/Notification";
import { useNavigate } from "react-router-dom";

export const SignUp = function () {
  const [email, setEmail] = useState("");
  const [emailValidation, setEmailValidation] = useState({
    isValid: false,
    message: "",
  });

  const [name, setName] = useState(undefined);

  const [password, setPassword] = useState("");
  const [confimrPassword, setConfirmPassword] = useState("");
  const [passwordValidation, setPasswordValidation] = useState({
    isValid: false,
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [formInputValidation, setFormInputValidation] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (email !== "" && password !== "")
      setFormInputValidation(
        emailValidation.isValid && passwordValidation.isValid
      );
  }, [emailValidation, passwordValidation]);
  useEffect(() => {
    getIsEmailUnique();
    if (email !== "" && password !== "")
      setFormInputValidation(
        emailValidation.isValid && passwordValidation.isValid
      );
  }, [email]);
  const getIsEmailUnique = async () => {
    if (
      !String(email)
        .toLowerCase()
        .match(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/)
    ) {
      console.log("Not a valid email");
      setEmailValidation({ isValid: false, message: "Not a valid email" });
      return;
    }
    let isEmailUnique = await isUnique(email);
    if (isEmailUnique.success) {
      console.log("unqiue");
      setEmailValidation({ isValid: true });
    } else {
      console.log("not unique");
      setEmailValidation({ isValid: false, message: "Email id Taken" });
    }
  };

  useEffect(() => {
    console.log("Change");
    isPasswordValidate();
  }, [password, confimrPassword]);

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
  const handleFormSubmit = async (event) => {
    try {
      event.preventDefault();

      setLoading(true);
      let response = await signup(email, name, password);
      console.log(response);
      setLoading(false);
      if (response.success) {
        notify().success("Successfully Signed up");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        navigate("/login");
      } else {
        notify().error(response.data.message);
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="container-fluid text-center">
      <h2>Register</h2>
      <form action="" id="sign-up-form" onSubmit={handleFormSubmit}>
        <div className="text-center">
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
        {email !== "" && !emailValidation.isValid && (
          <div className="container-fluid col-12 col-lg-5 text-danger text-start">
            *{emailValidation.message}
          </div>
        )}
        <div className="text-center">
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
        {console.log(
          `${emailValidation.isValid} && ${passwordValidation.isValid} == ${formInputValidation}`
        )}
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
