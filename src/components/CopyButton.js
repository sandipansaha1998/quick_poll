import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCopy } from "@fortawesome/free-solid-svg-icons";
function CopyButton() {
  const [isCopied, setIsCopied] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setIsCopied(false);
    }, 600);
  }, [isCopied]);
  const copyContent = () => {
    const modalLink = document.getElementById("modal-link");
    // Copy the text inside the text field
    navigator.clipboard.writeText(modalLink.innerText);
    setIsCopied(true);
  };

  return (
    <div>
      <div onClick={copyContent}>
        {isCopied ? (
          <FontAwesomeIcon icon={faCheck} size="xl" className="p-1" />
        ) : (
          <FontAwesomeIcon icon={faCopy} size="xl" className="p-1" />
        )}
      </div>
    </div>
  );
}

export default CopyButton;
