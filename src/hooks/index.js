import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/Authprovider";
import {
  setItemLocalStorage,
  LOCALSTORAGE_TOKEN_KEY,
  getItemFromLocalStorage,
  removeItemFromLocalStorage,
} from "../utils";
import { login as userLogin } from "../api";
import jwt_decode from "jwt-decode";

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const useProvideAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    // console.log("hello hook");

    const userToken = getItemFromLocalStorage(LOCALSTORAGE_TOKEN_KEY);
    if (userToken) {
      const userDecoded = jwt_decode(userToken);
      console.log(userDecoded);
      // Checking validity of JSON web token
      if (userDecoded.exp > Date.now()) setUser(userDecoded);
      else setError("Authentication Expired");
    }
    setLoading(false);
  }, []);

  // useEffect(() => {
  //   setLoading(!loading);
  // }, [user]);

  const login = async (email, password) => {
    let response = await userLogin(email, password);
    if (!response)
      return {
        success: false,
        message: "Server is down",
      };
    console.log(response);
    try {
      if (response.success) {
        const userDecoded = jwt_decode(response.data.data.token);
        setUser(userDecoded);
        setItemLocalStorage(
          LOCALSTORAGE_TOKEN_KEY,
          response.data.data.token ? response.data.data.token : null
        );
        setError(null);
        return {
          success: true,
        };
      } else {
        console.log(response);
        return {
          success: false,
          message: response.message,
        };
      }
    } catch (e) {
      console.log(e);
    }
  };

  const logout = async () => {
    setUser(null);
    removeItemFromLocalStorage(LOCALSTORAGE_TOKEN_KEY);
    setError(null);
  };

  const catchError = async (error) => {
    console.log(error);
    setError(error);
    return;
  };

  return {
    user,
    login,
    logout,
    loading,
    error,
    catchError,
  };
};

export const useLoading = (initialState) => {
  return useState(initialState);
};
