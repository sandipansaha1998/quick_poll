const API_ROOT = "https://polling-api-lbat.onrender.com/api/v1";

export const API_URLS = {
  login: () => `${API_ROOT}/user/create-session`,
  signup: () => `${API_ROOT}/user/register`,
  getIsEmailUnique: (email) => `${API_ROOT}/user/is-unique?email=${email}`,
  createNewPoll: () => `${API_ROOT}/question/create`,
  getPollResults: (id) => `${API_ROOT}/question/${id}`,
  addVote: (optionID, userID) => `${API_ROOT}/options/add-vote/${optionID}`,
  getUserChosenOption: (questionID) =>
    `${API_ROOT}/user/getChosenOption/${questionID}`,
  getMyPolls: () => `${API_ROOT}/user/mypolls`,
  getMyVotedPolls: () => `${API_ROOT}/user/myvotes`,
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

// Get date and time

export const getFormattedDate = (date) => {
  date = new Date(date);
  var year = date.getFullYear();

  var month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : "0" + month;

  var day = date.getDate().toString();
  day = day.length > 1 ? day : "0" + day;

  return month + "." + day + "." + year;
};
