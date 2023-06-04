import { useEffect, useState } from "react";
import { Loader } from "../components/Loader";
import { OptionCard } from "../components/OptionCard";
import { useAuthContext, useLoading } from "../hooks";
import { getPollResults, getUserChosenOption } from "../api";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import "../styles/PollResults.css";
import { getFormattedDate } from "../utils";
import { ErrorNotFound } from "./Error404";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal } from "react-bootstrap";
import { faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
export const PollResults = () => {
  const questionID = useParams().id;
  const [loading, setLoading] = useLoading(true);
  const navigate = useNavigate();
  const auth = useAuthContext();
  const [question, setQuestion] = useState(null);
  const [chosenOption, setChosenOption] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    async function fetchPollDetails() {
      const responsePollResults = await getPollResults(questionID);
      setLoading(false);
      if (responsePollResults.success) {
        setQuestion(responsePollResults.data.data);
      }
    }
    async function fetchDataCookie() {
      const objectString = Cookies.get("quick-poll");
      console.log("asdsadasdadsd", objectString);
      if (objectString) {
        // contains the ID of questions voted
        const questions = JSON.parse(objectString);
        // if the user has already voted  the qustion
        console.log(questions);
        if (questions.hasOwnProperty(questionID)) {
          console.log("You cannot vote,already voted for", questions);
          setChosenOption(questions[questionID]);
        } else {
          console.log("You can vote");
        }
      }
    }
    async function fetchDataAPI() {
      // Poll Results

      const userResponse = await getUserChosenOption(questionID);
      setChosenOption(userResponse.data.data);
      // question state changed.
    }
    fetchPollDetails();
    if (auth.user) fetchDataAPI();
    else fetchDataCookie();
  }, []);

  function getTotalNumberofVotes(quesiton) {
    if (question) {
      let totalVotesCount = question.options.reduce((sum, element) => {
        return sum + element.votes;
      }, 0);
      return totalVotesCount;
    }
  }

  if (loading) {
    return <Loader />;
  }
  if (!question) {
    return <ErrorNotFound />;
  }
  //   if (auth.user === null) return <Navigate to={"/login"}></Navigate>;
  return (
    <div className="container ">
      <p className="text-end my-5">
        <span
          style={{ cursor: "pointer" }}
          className="text-secondary"
          onClick={handleShow}
        >
          Share <FontAwesomeIcon icon={faUpRightFromSquare} />
        </span>
      </p>
      <div className="d-flex flex-column  flex-md-row align-items-md-start">
        <div>
          <h1 className="fw-bold ">{question.title}</h1>
          <h6 className="text-secondary me-2 my-4">
            Asked by <span className="text-dark ">{question.user.name} on</span>
            <span className="mx-2">
              {getFormattedDate(new Date(question.createdAt))}
            </span>
            <span></span>
          </h6>
        </div>

        <div className="totalVotes col-4 col-md-2 mx-auto mx-md-0 ms-md-auto p-3  d-md-block">
          <h3 className="text-center text-secondary">Votes</h3>
          <h2 className="text-center fw-bold">
            {getTotalNumberofVotes(question)}
          </h2>
        </div>
      </div>
      {question.options.map((option) => {
        console.log("........", getTotalNumberofVotes(question));
        return (
          <OptionCard
            option={{
              ...option,
            }}
            totalVotes={getTotalNumberofVotes(question)}
            chosenOption={chosenOption}
          />
        );
      })}
      <div className="text-center">
        <button
          className="btn btn-success p-4 col-10 col-md-4 "
          onClick={() => {
            navigate(`/poll/${questionID}`);
          }}
        >
          Submit Vote
        </button>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Share Link</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-secondary">
          <p className="text-secondary">Poll Vote Link</p>
          <div
            className="container-fluid text-dark p-3 d-flex"
            style={{ background: "#f8f8f8" }}
          >
            http://localhost:3000/poll/{question._id}
          </div>
        </Modal.Body>

        <Modal.Footer></Modal.Footer>
        <p className="container mx-1 ">
          {" "}
          Copy a link from above to easily share this poll.
        </p>
      </Modal>
    </div>
  );
};
