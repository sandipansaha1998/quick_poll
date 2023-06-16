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
  const copyContent = async () => {
    const modalLink = document.getElementById("modal-link");
    const textToCopy = modalLink.innerText;
    const tempInput = document.createElement("input");
    tempInput.value = textToCopy;

    document.body.appendChild(tempInput);
    // Copy the text
    tempInput.select();

    document.execCommand("copy");

    setIsCopied(true);
    document.body.removeChild(tempInput);
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
