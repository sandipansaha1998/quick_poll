import { API_URLS, LOCALSTORAGE_TOKEN_KEY } from "../utils";

const customFetch = async (url, { body, ...customConfig }) => {
  console.log(url);
  const token = window.localStorage.getItem(LOCALSTORAGE_TOKEN_KEY);
  const headers = {
    "content-type": "application/json",
    Accept: "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const config = {
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    // Stringifying JSON object before sending it with the request
    config.body = JSON.stringify(body);
  }
  try {
    const response = await fetch(url, config);
    // Internal Server Error
    if (response.status === 500) throw new Error("Internal Server Error");
    const responseJSON = await response.json();
    if (response.status === 200) {
      return {
        success: true,
        data: responseJSON,
      };
    } else {
      return {
        success: false,
        data: responseJSON,
      };
    }
  } catch (e) {
    console.error("error");
  }
};
export const getIsEmailUnique = (email) => {
  console.log(API_URLS.getIsEmailUnique(email));
  return customFetch(API_URLS.getIsEmailUnique(email), {});
};
export const signup = (email, name, password) => {
  return customFetch(API_URLS.signup(), {
    body: { email, name, password },
    method: "POST",
  });
};

export const login = (email, password) => {
  return customFetch(API_URLS.login(), {
    body: { email, password },
    method: "POST",
  });
};
