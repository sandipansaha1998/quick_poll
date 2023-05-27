const API_ROOT = "http://localhost:8000/api/v1";

export const API_URLS = {
  login: () => `${API_ROOT}/user/create-session`,
  signup: () => `${API_ROOT}/user/register`,
  getIsEmailUnique: (email) => `${API_ROOT}/user/is-unique?email=${email}`,
};

// Helper functions to read and write on local storage
export const setItemLocalStorage = (key, value) => {
  if (!key || !value) return console.error("Cannot store in local strage");
  const valueToStore =
    typeof value !== "string" ? JSON.stringify(value) : value;
  localStorage.setItem(key, valueToStore);
};

export const getItemFromLocalStorage = (key) => {
  if (!key) return console.error("Cannot get value for undefined key");
  return localStorage.getItem(key);
};

export const removeItemFromLocalStorage = (key) => {
  if (!key) return console.error("Cannot remove value for undefined key");
  return localStorage.removeItem(key);
};

export const LOCALSTORAGE_TOKEN_KEY = "__quickpoll_token__";
