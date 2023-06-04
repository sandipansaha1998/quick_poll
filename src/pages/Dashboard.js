import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import {
  faSquarePollHorizontal,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import { getMyPolls, getMyVotedPolls } from "../api";
import { Loader } from "../components/Loader";
export const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [myPollsCount, setMypollsCount] = useState(0);
  const [myVotedPollsCount, setMyVotedPollsCount] = useState(0);

  useEffect(() => {
    async function fetchData() {
      //   Poll Created
      const pollsCreated = await getMyPolls();
      if (pollsCreated.success && pollsCreated.data.data) {
        setMypollsCount(pollsCreated.data.data.length);
      }
      // Poll Voted
      const pollsVoted = await getMyVotedPolls();
      if (pollsVoted.success && pollsCreated.data.data) {
        setMyVotedPollsCount(pollsVoted.data.data.length);
      }
      setLoading(false);
    }
    fetchData();
  }, []);
  if (loading) {
    return <Loader />;
  }
  return (
    <div className="d-flex flex-column flex-lg-row justify-content-center align-items-center container gap-5">
      <div
        id="polls-created"
        className=" customCard d-flex flex-column  col-8 col-lg-3"
      >
        <div className="p-4 text-center">
          <FontAwesomeIcon
            icon={faSquarePollHorizontal}
            size="2xl"
            className="my-4"
          />

          <h1 className="quantity " style={{ fontSize: `4.5rem` }}>
            {myPollsCount}
          </h1>
          <div className="title text-secondary">Polls Created</div>
        </div>
      </div>
      <div
        id="polls-voted"
        className=" customCard d-flex flex-column  col-8 col-lg-3"
      >
        <div className="p-4 text-center">
          <FontAwesomeIcon
            icon={faCircleCheck}
            style={{ color: "#16e395" }}
            size="2xl"
            className="my-4"
          />

          <h1 className="quantity " style={{ fontSize: `4.5rem` }}>
            {myVotedPollsCount}
          </h1>
          <div className="title text-secondary">Polls Voted</div>
        </div>
      </div>
    </div>
  );
};
