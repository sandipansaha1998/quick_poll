import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import {
  faSquarePollHorizontal,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import { getMyPolls, getMyVotedPolls } from "../api";
import { Loader } from "../components/Loader";
import { useAuthContext } from "../hooks";
import { notify } from "../components/Notification";
export const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [myPollsCount, setMypollsCount] = useState("-");
  const [myVotedPollsCount, setMyVotedPollsCount] = useState("-");
  const auth = useAuthContext();
  useEffect(() => {
    async function fetchData() {
      //   Poll Created
      const pollsCreated = await getMyPolls();
      // Poll Voted
      const pollsVoted = await getMyVotedPolls();
      // If  request is not fulfilled
      if (!pollsCreated || !pollsVoted) {
        notify().error("Could not update");
        setLoading(false);
        return;
      }
      // If request if fulfilled
      if (pollsCreated.success) {
        if (!pollsCreated.data.data) setMypollsCount(0);
        else setMypollsCount(pollsCreated.data.data.length);
      }

      if (pollsVoted.success) {
        if (!pollsVoted.data.data) setMyVotedPollsCount(0);
        else setMyVotedPollsCount(pollsVoted.data.data.length);
      }
      setLoading(false);
    }
    // Restricted Route
    if (auth.user) {
      if (auth.user.exp < Date.now()) {
        auth.catchError("Authentication Expired");
        return;
      } else fetchData();
    }
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
