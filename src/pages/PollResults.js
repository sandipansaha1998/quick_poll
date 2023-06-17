import { useEffect, useState } from "react";
import { Loader } from "../components/Loader";
import CopyButton from "../components/CopyButton";
import { OptionCard } from "../components/OptionCard";
import { useAuthContext, useLoading } from "../hooks";
import { getPollResults, getUserChosenOption } from "../api";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "../styles/PollResults.css";
import { getFormattedDate } from "../utils";
import { ErrorNotFound } from "./Error404";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { notify } from "../components/Notification";
import { Modal } from "react-bootstrap";
import { socketManager } from "../socket";

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
      if (!responsePollResults) {
        notify().error("Could not Load");
        return;
      }

      if (responsePollResults && responsePollResults.success) {
        setQuestion(responsePollResults.data.data);
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
        } else {
        }
      }
    }
    async function fetchDataAPI() {
      // Poll Results

      const userResponse = await getUserChosenOption(questionID);
      if (!userResponse) {
        notify().error("Could not Load");
        return;
      }
      if (userResponse.success) {
        setChosenOption(userResponse.data.data);
      }

      // question state changed.
    }
    socketManager.addListener("recordedVote", (qID) => {
      if (qID === questionID) {
        fetchPollDetails();

        let totalVotes = document.querySelector(`.totalVotes`);

        if (totalVotes) {
          totalVotes.classList.add("totalVotesChange");

          setTimeout(() => {
            totalVotes.classList.remove("totalVotesChange");
          }, 1000);
        }
      }
    });

    // First fetches the poll details and then checks is the user is anonymous
    // if anonymous then checks the cookies and if logged in checks with server

    fetchPollDetails();
    if (auth.user) fetchDataAPI();
    else fetchDataCookie();
    return () => {
      socketManager.removeListener("recordedVote");
    };
    // eslint-disable-next-line
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
    <div id={`q-${question._id}`} className="container ">
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
            id="modal-link"
            className="container-fluid text-dark p-3 d-flex"
            style={{ background: "#f8f8f8" }}
          >
            https://quick-poll-india.netlify.app/poll/{question._id}
          </div>
        </Modal.Body>

        <Modal.Footer></Modal.Footer>
        <div className="container mx-1 d-flex  p-1 ">
          {" "}
          <p> Copy the link from above to easily share this poll.</p>
          <div className=" ms-2 border ms-auto me-2 align-self-start rounded cursor-pointer">
            <CopyButton />
          </div>
        </div>
      </Modal>
    </div>
  );
};
