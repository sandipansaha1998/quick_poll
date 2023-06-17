import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useEffect } from "react";
import { getMyPolls } from "../api";
import { Loader } from "../components/Loader";
import { getFormattedDate } from "../utils";
import { useAuthContext } from "../hooks";
import { notify } from "../components/Notification";
export const MyPolls = () => {
  const [loading, setLoading] = useState(true);
  // Polls created by the user
  const [myPolls, setMypolls] = useState([]);
  const navigate = useNavigate();
  const auth = useAuthContext();
  useEffect(() => {
    async function fetchData() {
      //   Poll Created
      const pollsCreated = await getMyPolls();
      // if Polls Creation failed
      if (!pollsCreated) {
        notify().error("Could not update");
        setLoading(false);
        return;
      }

      if (pollsCreated.success && pollsCreated.data.data) {
        setMypolls(pollsCreated.data.data);
      }
      setLoading(false);
    }
    // Checks for JWT expiry before sending request.If Expired catchError redirects to login
    if (auth.user) {
      if (auth.user.exp < Date.now()) auth.catchError("Authentication Expired");
      else fetchData();
    }
  }, []);

  if (loading) {
    return <Loader />;
  }
  return (
    <div className="d-flex flex-column gap-4">
      <h1 className="container fw-bold">Polls Created</h1>
      {/* If no polls created by the user  */}
      {myPolls.length < 1 && <h3 className="mx-auto">- No Polls created -</h3>}
      {myPolls.map((poll) => {
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
            {/* Poll published date */}
          </div>
        );
      })}
    </div>
  );
};
