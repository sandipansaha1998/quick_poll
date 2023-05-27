import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import Navbar from "react-bootstrap/Navbar";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";

import logo from "../images/logo.png";

import styles from "../styles/navbar.module.css";

import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark, faUser } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks";
import { notify } from "./Notification";

export function NavigationBar() {
  const [isOpen, setIsOpen] = useState(false);
  const auth = useAuthContext();
  const toggleAccessControls = () => {
    setIsOpen(!isOpen);
  };
  const handleLogout = () => {
    auth.logout();

    notify().success("Logged out");
  };
  useEffect(() => {
    console.log("Change in auth");
  }, [auth]);
  return (
    <Navbar bg="light" expand="lg">
      <div className="container-fluid d-flex justify-content-between">
        <div
          className="text-success fs-6 fs-sm-5 bg-success text-light p-2 fw-bold "
          style={{ borderRadius: `5px` }}
        >
          <span>Create Poll</span>
        </div>
        <Navbar.Brand href="/">
          <img
            src={logo}
            height="90rem"
            className="rounded-pill p-3 p-sm-0 "
            alt="QuickPoll"
          ></img>
        </Navbar.Brand>

        {/* Hook */}
        {/* {console.log(auth.user)} */}
        {auth.user !== null && (
          <div className="dropdown">
            <DropdownButton
              align="end"
              variant="success"
              title={<FontAwesomeIcon icon={faUser} />}
              id="dropdown-menu-align-end"
              size="lg"
              className="bg-green"
              style={{ display: "", backgroundColor: "pink !important" }}
            >
              <div className="container-fluid text-center fs-5">
                {auth.user.name}
              </div>
              <div className="container-fluid text-center text-secondary">
                {auth.user.email}
              </div>
              <Dropdown.Divider className="mx-auto col-9" />
              <Dropdown.Item className="text-center">Dashboard</Dropdown.Item>
              <Dropdown.Item
                className="bg-light text-center text-danger"
                onClick={handleLogout}
              >
                Logout
              </Dropdown.Item>
            </DropdownButton>
          </div>
        )}
        {/* Navbar if no user logged in */}
        {auth.user === null && (
          <div>
            {console.log(auth.user)}
            <FontAwesomeIcon
              icon={faBars}
              size="2xl"
              onClick={toggleAccessControls}
              className="d-sm-none"
            />

            {isOpen ? (
              <div
                className="d-flex flex-column justify-content-center align-items-center gap-5 "
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  width: "100vw",
                  height: "100vh",
                  backgroundColor: "#c6c6c6",
                  zIndex: 9999,
                }}
              >
                <FontAwesomeIcon
                  icon={faXmark}
                  size="2xl"
                  onClick={toggleAccessControls}
                  className=" position-absolute m-3  top-0 end-0"
                />

                <Link to="/login" onClick={toggleAccessControls}>
                  <Button variant="light" className="mx-1 ">
                    Login
                  </Button>{" "}
                </Link>
                <Link to="/sign-up" onClick={toggleAccessControls}>
                  <Button variant="light">Sign up</Button>{" "}
                </Link>
              </div>
            ) : (
              // Desktops
              <Nav className="d-none d-sm-block">
                <Link to="/login">
                  <Button variant="light" className="mx-1 ">
                    Login
                  </Button>
                </Link>
                <Link to="/sign-up" className="text-decoration-none">
                  <Button variant="primary">Sign up</Button>
                </Link>
              </Nav>
            )}
          </div>
        )}
      </div>
    </Navbar>
  );
}
