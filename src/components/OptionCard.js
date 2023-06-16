import { useEffect, useState } from "react";
import "../styles/OptionCard.css";
import ProgressBar from "react-bootstrap/ProgressBar";

export const OptionCard = ({ option, chosenOption, totalVotes }) => {
  // Width state
  const [width, setWidth] = useState(0);
  const [votePercentage, setVotePercentage] = useState(0);

  useEffect(() => {
    // Calculates vote percentages
    if (totalVotes !== 0)
      setVotePercentage(Math.floor((option.votes / totalVotes) * 100));
    else setVotePercentage(0);
  }, [option]);
  // Rerenders on change in total votes
  useEffect(() => {
    setTimeout(() => {
      setWidth(votePercentage);
    }, 600);
  }, [votePercentage]);

  return (
    <div
      id={option._id}
      className={
        // For Marking the selected option
        option._id === chosenOption
          ? `border border-success border-3 optionCard`
          : `optionCard`
      }
    >
      <h3 className="">
        {/* Title  */}
        <p>{option.title}</p>
        {/* Vote percentage */}
        <span className="votePercentage">{votePercentage} %</span>
      </h3>
      {/* Number of votes */}
      <p className="my-3">{option.votes} Votes</p>
      <ProgressBar now={width} />
    </div>
  );
};
