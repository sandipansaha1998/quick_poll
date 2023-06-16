import { API_URLS, LOCALSTORAGE_TOKEN_KEY } from "../utils";

// Custom Fetch function to dynamically add parameters and HTTP Request type
const customFetch = async (url, { body, ...customConfig }) => {
  // Retreives the JSON token
  const token = window.localStorage.getItem(LOCALSTORAGE_TOKEN_KEY);
  // Headers to add the Bearer token to Authorization key in Header
  const headers = {
    "content-type": "application/json",
    Accept: "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  // Configuration
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
    // Fetch
    const response = await fetch(url, config);

    // Handling Fetch response

    // Internal Server Error
    if (response.status === 500) throw new Error("Internal Server Error");

    const responseJSON = await response.json();

    // Request and response cycle is successful
    if (response.status === 200) {
      return {
        success: true,
        data: responseJSON,
      };
      // Unauthorized Error
    } else if (response.status === 401) {
      return {
        success: false,
        message: "Unauthorized",
      };
      // Not Found Error
    } else if (response.status === 404) {
      return {
        success: false,
        message: "Not Found",
      };
    } else {
      return {
        success: false,
      };
    }
  } catch (e) {
    console.log("Error", e.message);
  }
};
// Checks if a mail ID is unique
export const getIsEmailUnique = (email) => {
  return customFetch(API_URLS.getIsEmailUnique(email), {});
};
// Sign up
export const signup = (email, name, password) => {
  return customFetch(API_URLS.signup(), {
    body: { email, name, password },
    method: "POST",
  });
};
// Login
export const login = (email, password) => {
  return customFetch(API_URLS.login(), {
    body: { email, password },
    method: "POST",
  });
};
// Creates a new Poll
export const createNewPoll = (userID, question, options) => {
  return customFetch(API_URLS.createNewPoll(), {
    body: {
      userID,
      title: question,
      options,
    },
    method: "POST",
  });
};
// Fetches poll results with id : questionID
export const getPollResults = (questionID) => {
  return customFetch(API_URLS.getPollResults(questionID), {
    method: "GET",
  });
};

// Adds vote for the option with ID:optionID and
//  adds the {question:votedoption} map to the user document
export const addVote = (optionID, userID) => {
  return customFetch(API_URLS.addVote(optionID), {
    body: {
      userID,
    },
    method: "POST",
  });
};
// Fetches the option chosen by the logged user of question with id :questionID
export const getUserChosenOption = (questionID) => {
  return customFetch(API_URLS.getUserChosenOption(questionID), {
    method: "GET",
  });
};
// Fetches polls created by user
export const getMyPolls = () => {
  return customFetch(API_URLS.getMyPolls(), {
    method: "GET",
  });
};
// Fetches polls voted by user

export const getMyVotedPolls = () => {
  return customFetch(API_URLS.getMyVotedPolls(), {
    method: "GET",
  });
};
