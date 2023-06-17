import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Cookies from "js-cookie";

import { connectionManager, socket } from "../socket";

import { getPollResults, addVote, getUserChosenOption } from "../api";
import { Loader } from "../components/Loader";
import { getFormattedDate } from "../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { notify } from "../components/Notification";
import { ErrorNotFound } from "../pages";
import { useAuthContext } from "../hooks";
export const Poll = () => {
  const auth = useAuthContext();
  //manages the question associated with the page
  const [question, setQuestion] = useState("");
  //It checks with DB if the poll is answered by the logged in user.This was used to allow voters to vote once.
  // If already voted,contains the optionID chosen
  const [chosenOption, setChosenOption] = useState("");
  //Loading state
  const [loading, setLoading] = useState(true);
  //This checks with the db and checks if the user has voted.This controls the state of submit button and click events on option
  const [isVoted, setisVoted] = useState(false);

  const navigate = useNavigate();

  //getting the id of the poll
  const questionID = useParams().id;

  //manages click event on option cards
  function chooseOption(event) {
    setChosenOption(event.currentTarget.id);
  }
  //
  useEffect(() => {
    async function fetchPollDetails() {
      // Fetching the poll details
      const responsePollResults = await getPollResults(questionID);
      setLoading(false);
      if (!responsePollResults) {
        notify().error("Could not Load");
        return;
      }

      if (responsePollResults.success) {
        setQuestion(responsePollResults.data.data);
      } else {
        setQuestion("");
      }
    }
    async function fetchDataCookie() {
      const objectString = Cookies.get("quick-poll");
      if (objectString) {
        // contains the ID of questions voted
        const questions = JSON.parse(objectString);
        // if the user has already voted  the qustion
        if (questions.hasOwnProperty(questionID)) {
          setChosenOption(questions[questionID]);
          setisVoted(true);
        } else {
        }
      }
    }
    async function fetchDataAPI() {
      // To check if the user has voted
      const chosenOptionResponse = await getUserChosenOption(questionID);
      if (!chosenOptionResponse) {
        notify().error("Could not Load");
        return;
      }
      if (chosenOptionResponse.success) {
        //if User has not voted
        if (chosenOptionResponse.data.data === null) {
          setisVoted(false);
          setChosenOption("");
        } else {
          // User has voted and the chosenOption state is updated
          setisVoted(true);
          setChosenOption(chosenOptionResponse.data.data);
        }
      }
    }

    if (auth.user) {
      // Checks if the JWT has expired
      if (auth.user.exp > Date.now()) {
        fetchDataAPI();
      } else {
        auth.catchError("Authentication Expired");
      }
    } else {
      fetchDataCookie();
    }
    fetchPollDetails();
  }, []);

  // Handles click event on Submit Vote button
  const handleSubmitVote = async () => {
    // Compeles the user to choose one vote before submitting

    if (chosenOption === "") {
      notify().error("Choose one vote to submit");
    } else {
      // API call kor adding the vote to the desired option
      let userID = "";

      if (auth.user) {
        userID = auth.user.id;
        if (auth.user.exp < Date.now()) {
          auth.catchError("Authentication Expired");
          return;
        }
      }

      setLoading(true);
      const response = await addVote(chosenOption, userID);
      if (!response) {
        notify().error("Could not cast vote");
        setLoading(false);
        return;
      }
      setLoading(false);
      //
      if (response.success) {
        // If the voting is anonymous
        if (!auth.user) {
          // Checks if this is the first vote

          const votedPollsString = Cookies.get("quick-poll");
          if (votedPollsString) {
            const votedPolls = JSON.parse(votedPollsString);

            // Checks if user has already voted

            votedPolls[questionID] = chosenOption;
            Cookies.set("quick-poll", JSON.stringify(votedPolls));
          } else {
            const votedPolls = {};
            votedPolls[questionID] = chosenOption;

            Cookies.set("quick-poll", JSON.stringify(votedPolls));
          }
        }

        socket.emit("voted", questionID);

        // Navigates to Results.
        navigate(`/poll/results/${questionID}`);
      } else {
        notify().error("Voting Failed");
      }
    }
  };
  if (loading) {
    return <Loader />;
  }
  if (!question) {
    return <ErrorNotFound />;
  }

  return (
    <div className="col-11 col-md-8 mx-auto my-5">
      {chosenOption === "" || !isVoted ? undefined : (
        <span className="bg-success text-light rounded-pill p-2 ">
          <FontAwesomeIcon icon={faCircleCheck} className="me-2" />
          Voted
        </span>
      )}

      {/* Question details container */}
      <div className="question-details-container d-flex mt-3">
        <div className="">
          {/* Poll Info */}
          {/* Question title */}
          <h1 className="fw-bold">{question.title}</h1>
          {/* Creater name and time of creation */}
          <h6 className="text-secondary me-3 my-4  gap-2">
            Asked by{" "}
            <span className="text-dark me-3 ">
              {question.user.name} <span className="text-secondary">on</span>{" "}
              {getFormattedDate(question.createdAt)}
            </span>
            {/* Link for results */}
            <p
              className=" text-secondary mt-2 text-decoration-underline"
              style={{ cursor: "pointer" }}
              onClick={
                // Does not allow voter to see result if he has not voted
                chosenOption === "" || !isVoted
                  ? () => {
                      notify().error("You cannot view results before voting");
                    }
                  : () => {
                      navigate(`/poll/results/${questionID}`);
                    }
              }
            >
              Jump to results &#62;
            </p>
          </h6>
        </div>
      </div>
      {/* Options */}
      {question.options.map((option) => {
        return (
          // Conditonal rendering to differentiate the chosen option
          // Compares the option ids with the choseOption if any
          <div
            id={option._id}
            className={`optionCard d-flex  ${
              option._id === chosenOption
                ? "border border-3 border-success "
                : ""
            }`}
            style={{
              transform: option._id === chosenOption && `translateX(100)`,
            }}
            onClick={chosenOption === "" || !isVoted ? chooseOption : undefined}
            // Disables click events if already voted
          >
            <div
              style={{ width: `40px` }}
              className={`d-flex align-items-center justify-content-center border  rounded-circle   ${
                option._id === chosenOption ? "" : "border-3"
              }`}
            >
              {/* Checkbox */}
              {option._id === chosenOption ? (
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  size="2xl"
                  className="text-success "
                />
              ) : undefined}
            </div>
            <h3 className="ms-3">{option.title}</h3>
          </div>
        );
        // options
      })}
      <div className="text-center">
        <button
          className="btn btn-success p-4 col-10 col-md-4 "
          onClick={handleSubmitVote}
          disabled={chosenOption === "" || !isVoted ? false : true}
        >
          Submit Vote
        </button>
      </div>
    </div>
  );
};
