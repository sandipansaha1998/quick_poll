import { useAuthContext } from "../hooks";
import { notify } from "../components/Notification";
import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/NewPoll.css";
import { createNewPoll } from "../api";
export const NewPoll = () => {
  const auth = useAuthContext();
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [pollFormValidation, setPollFormValidation] = useState({
    isValid: false,
    message: "",
  });
  const [questionInput, setQuestionInput] = useState("");
  const [options, setOptions] = useState([
    { value: "" },
    { value: "" },
    { value: "" },
    { value: "" },
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    let optionsList = [...options];
    console.log(optionsList);
    if (!isFirstRender) {
      optionsList = optionsList.filter((option) => {
        if (option.value !== "") {
          return true;
        }
        return false;
      });
    }

    if (optionsList.length < 2) {
      setPollFormValidation({
        isValid: false,
        message: " * You need to enter a minimum of 2 options",
      });
    } else {
      setPollFormValidation({
        isValid: true,
        message: "",
      });
    }
    setIsFirstRender(true);
  }, [options]);

  const handleInputChange = (event) => {
    const id = event.target.id.split("-")[1];
    let updatedOptions = [...options];
    updatedOptions[id] = { value: event.target.value };

    setOptions(updatedOptions);
  };

  const handlePollSubmit = async (event) => {
    event.preventDefault();
    let question = questionInput;
    let optionsList = [...options];
    optionsList = optionsList.filter((option) => {
      if (option.value !== "") {
        console.log("option:", option.value);
        return true;
      }
      return false;
    });
    optionsList = optionsList.map((option) => {
      return option.value;
    });
    setIsFirstRender(false);
    if (question === "" || optionsList.length < 2) {
      console.log("Inside submit ");
      setPollFormValidation({
        isValid: false,
        message: "* You need to enter atleast 2 options",
      });
      return;
    }
    let response = await createNewPoll(auth.user.id, question, optionsList);
    if (!response) {
      notify().error("Could not create poll");
      return;
    }
    if (response.success) {
      const questionID = response.data.data.question._id;
      notify().success("Poll created");
      navigate(`/poll/results/${questionID}`);
    } else {
      notify().error("Server Error");
    }
  };

  if (auth.user === null) {
    notify().error("Please Login to create a new poll");
    return <Navigate to="/login" />;
  }
  return (
    <div className="col-11 col-md-8 mx-auto my-5 ">
      <form action="" id="create-poll-form" onSubmit={handlePollSubmit}></form>
      <h1 className=" fw-bold">Create a poll</h1>
      <h6 className="fw-bolder text-secondary mt-3">
        Complete the below fields to create your poll
      </h6>
      {/* {optionCount} */}
      <div id="poll-quesiton" className="my-5">
        <label className=" mb-3 text-secondary">Poll Quesiton</label>
        <textarea
          form="create-poll-form"
          onChange={(event) => {
            setQuestionInput(event.target.value);
          }}
          className="d-block col-12 col-md-10 text-wrap"
          required
          wrap="hard"
          rows={5}
        ></textarea>
      </div>
      {options.map((option, index) => {
        return (
          <div key={`option-container-${index}`}>
            <label className="text-secondary">Poll Option {index + 1}</label>

            <input
              id={`option-${index}`}
              onChange={handleInputChange}
              className={`${
                index < 2 && !pollFormValidation.isValid && !isFirstRender
                  ? "border border-danger border-2"
                  : "border"
              } text-primary d-block col-12 col-md-10 text-wrap`}
              form="create-poll-form"
            ></input>
            {index < 2 && !pollFormValidation.isValid && !isFirstRender ? (
              <span className="text-danger">{pollFormValidation.message}</span>
            ) : undefined}
            {/* <span>value:{option.value}</span> */}
          </div>
        );
      })}
      <div className="mt-4">
        {" "}
        <button
          className="btn btn-primary col-5 col-md-3  p-3"
          onClick={() => {
            setOptions([...options, { value: "" }]);
          }}
        >
          Add option +
        </button>
        <button
          type="submit"
          form="create-poll-form"
          className="btn btn-success col-5 col-md-3 mx-3 p-3"
        >
          Create Poll
        </button>
      </div>
    </div>
  );
};
