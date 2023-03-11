import React, { useState, useEffect } from "react";

const useHighlightText = (text, matchList) => {
  const [highlightedText, setHighlightedText] = useState([]);

  useEffect(() => {
    if (!text) {
      setHighlightedText([]);
      return;
    }

    const words = text.split(" ");
    const newText = words.map((word, index) => {
      // span 1: check for starting word in match list
      if (matchList.some((match) => word.toLowerCase().startsWith(match))) {
        return (
          <span key={index} className="text-blue-600">
            {word + " "}
          </span>
        );
      }
      // span 2: normal text
      else {
        return (
          <span key={index} className="text-black">
            {word + " "}
          </span>
        );
      }
    });

    // span 3: info text
    const infoText = (
      <span key={newText.length} className="text-neutral-200">
        [INFO]
      </span>
    );

    // span 4: autocomplete text
    const autoCompleteText = (
      <span key={newText.length + 1} className="text-neutral-400">
        [AUTO-COMPLETE]
      </span>
    );

    const newHighlightedText = [...newText, infoText, autoCompleteText];
    if (newHighlightedText.join('') !== highlightedText.join('')) {
      setHighlightedText(newHighlightedText);
    }
  }, [text, matchList]);

  return highlightedText;
};

export default useHighlightText;
