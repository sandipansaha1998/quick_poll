import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/Authprovider";
import {
  setItemLocalStorage,
  LOCALSTORAGE_TOKEN_KEY,
  getItemFromLocalStorage,
  removeItemFromLocalStorage,
} from "../utils";
import { login as userLogin } from "../api";
import jwt from "jwt-decode";

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const useProvideAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // console.log("hello hook");

    const userToken = getItemFromLocalStorage(LOCALSTORAGE_TOKEN_KEY);
    if (userToken) {
      const userDecoded = jwt(userToken);
      setUser(userDecoded);
    }
    setLoading(false);
  }, []);

  // useEffect(() => {
  //   setLoading(!loading);
  // }, [user]);

  const login = async (email, password) => {
    let response = await userLogin(email, password);
    if (response.success) {
      const userDecoded = jwt(response.data.data.token);
      setUser(userDecoded);
      setItemLocalStorage(
        LOCALSTORAGE_TOKEN_KEY,
        response.data.data.token ? response.data.data.token : null
      );
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        message: response.data.message,
      };
    }
  };

  const logout = async () => {
    setUser(null);
    removeItemFromLocalStorage(LOCALSTORAGE_TOKEN_KEY);
  };

  return {
    user,
    login,
    logout,
    loading,
  };
};
