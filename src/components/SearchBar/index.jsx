import React, { useState, useRef } from 'react';
import { motion } from "framer-motion"
import "./index.css"

import { useMotionVariants } from '../../hooks/useMotionVariants';

const SearchBar = () => {

  const { springyMotion, bouncyMotion, slowMotion, fastMotion, smoothMotion, wobblyMotion, jumpyMotion, elasticMotion, snappyMotion, rubberyMotion } = useMotionVariants();

  const [searchValue, setSearchValue] = useState("");
  const inputRef = useRef(null);
  const highlightRef = useRef(null);

  const handleSearchChange = (e) => {
    const value = e.target.value.replace(/ /g, '\u00A0'); // replace spaces with non-breaking spaces
    setSearchValue(value);
    handleInputScroll();
  };

  const handleInputScroll = () => {
    if (inputRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = inputRef.current.scrollTop;
      highlightRef.current.scrollLeft = inputRef.current.scrollLeft;
    }
  };

  const handleHighlightScroll = () => {
    if (inputRef.current && highlightRef.current) {
      inputRef.current.scrollTop = highlightRef.current.scrollTop;
      inputRef.current.scrollLeft = highlightRef.current.scrollLeft;
    }
  };

  const renderHighlightedText = () => {
    const words = searchValue.split(/ +/); // use a regular expression to split on one or more whitespace characters, including non-breaking spaces
    const searchList = ["example", "list", "word", "sentence"]; // create a list of words to search
  
    const spans = words.map((word, index) => {
      const match = searchList.find(searchTerm => word.toLowerCase().replace(/\u00A0/g, ' ').includes(searchTerm.toLowerCase())); // replace non-breaking spaces with regular spaces before checking for matches
  
      if (match && word.replace(/\u00A0/g, ' ').length === match.length) { // replace non-breaking spaces with regular spaces before checking length
        const nonBreakingSpaces = word.match(/&nbsp;/g) || [];
        const extraSpaces = nonBreakingSpaces.length > 0 ? '&nbsp;'.repeat(nonBreakingSpaces.length).replace(/&nbsp;/g, ' ') : '';
        const highlightedWord = <span className="highlighted text-blue-600 transition-colors before:text-white duration-200 ease-in-out" dangerouslySetInnerHTML={{ __html: match }} />;
        return <span key={index} id="space" dangerouslySetInnerHTML={{ __html: word.replace(match, ` ${highlightedWord.outerHTML} `) + extraSpaces }} />;
      } else if (/\s+/.test(word)) { // check if the word consists only of whitespace characters
        return <span key={index} id="space" dangerouslySetInnerHTML={{ __html: word }} />;
      } else {
        return <span key={index} className='transition-colors before:text-current duration-200 ease-in-out' dangerouslySetInnerHTML={{ __html: word }} />;
      }
    });
  
    return spans;
  };
  
  return (
    <motion.div
    layout
    initial={{ y: -60, scale: 0.8 }}
    animate={{
      y: "146px",
      scale: 1.1,
      transition: {
        type: 'spring',
        ...springyMotion
      },
    }}
    >
    <div className="absolute w-screen flex justify-center">
      <input
        id='inputContainer'
        style={{
          position: "relative",
          top: "0",
          left: "0",
          width: "650px",
          borderRadius: "28px",
          height: "80px",
          boxShadow: "rgba(0, 0, 0, 0.25) 0px 25px 50px -12px",
          overflow: "hidden",
          zIndex: "98"
        }}
        className="bg-[#333333] input-container select-none focus:outline-none overflow-wrap p-5 text-[2.5rem] font-default-light"
        spellCheck="false"
        placeholder='Search or -query'
        autoComplete='false'
        autoCorrect='false'
        value={searchValue}
        onChange={handleSearchChange}
        onScroll={handleInputScroll}
        ref={inputRef}
      />
      <div className="absolute w-screen flex justify-center">
        <div
        id='highlightContainer'
        style={{
          position: "relative",
          top: "0",
          left: "0",
          width: "650px",
          borderRadius: "28px",
          height: "80px",
          overflow: "scroll",
          WebkitOverflowScrolling: 'touch',
          '-ms-overflow-style': 'none',
          scrollbarWidth: 'none',
          zIndex: "99",
          whiteSpace: "pre-wrap"
        }}
        className="bg-transparent focus:outline-none select-text overflow-wrap pointer-events-none px-5 py-[0.625rem] text-[2.5rem] font-default-light text-white"
        onScroll={handleHighlightScroll}
        ref={highlightRef}
      >
        {renderHighlightedText()}
      </div>
      </div>
    </div>
    </motion.div>
  );
};

export default SearchBar;
