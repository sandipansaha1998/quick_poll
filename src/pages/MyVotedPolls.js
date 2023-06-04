import { useState } from "react";
import { getFormattedDate } from "../utils";

import { useEffect } from "react";
import { getMyVotedPolls } from "../api";
import { Loader } from "../components/Loader";
import { useNavigate } from "react-router-dom";
export const MyVotedPolls = () => {
  const [loading, setLoading] = useState(true);
  const [myVotedPolls, setMyVotedPolls] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchData() {
      //   Polls Voted
      const pollsVoted = await getMyVotedPolls();
      if (pollsVoted.success && pollsVoted.data.data) {
        setMyVotedPolls(pollsVoted.data.data);
      }
      setLoading(false);
    }
    fetchData();
  }, []);
  if (loading) {
    return <Loader />;
  }
  return (
    <div className="d-flex flex-column gap-4">
      <h1 className="container fw-bold">Polls Created</h1>
      {myVotedPolls.length < 1 && (
        <h3 className="mx-auto">- No polls Voted -</h3>
      )}
      {myVotedPolls.map((poll) => {
        console.log(poll.user.name);

        return (
          <div
            id={poll._id}
            className=" displayCard container p-4 cursor-pointer"
            onClick={(event) =>
              navigate(`/poll/results/${event.currentTarget.id}`)
            }
          >
            <h2 className="fw-bold"> {poll.title}</h2>
            <h5 className="text-dark">
              <span className="text-secondary">Created by </span>
              {poll.user.name}
            </h5>
            on {getFormattedDate(new Date(poll.createdAt))}
          </div>
        );
      })}
    </div>
  );
};