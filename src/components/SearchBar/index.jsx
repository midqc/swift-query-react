import React, { useState, useRef } from 'react';
import { motion, useAnimation, MotionConfig } from 'framer-motion';
import { useMediaQuery } from "../../hooks/useMediaQuery"
import './index.css';

import { useMotionVariants } from '../../hooks/useMotionVariants';

const SearchBar = () => {
  const {
    springyMotion,
    bouncyMotion,
    slowMotion,
    fastMotion,
    smoothMotion,
    wobblyMotion,
    jumpyMotion,
    elasticMotion,
    snappyMotion,
    rubberyMotion,
  } = useMotionVariants();

  const { isSm, isMd, isLg, isXl, is2xl } = useMediaQueries();

  // const searchMaxTop = "142px";
  // const searchMaxScale = "1.1";

  const searchMaxTop = "45px";
  const searchMaxScale = "0.6"; 

  const [searchValue, setSearchValue] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);

  const [isMini, setIsMini] = useState(false);

  const inputRef = useRef(null);
  const highlightRef = useRef(null);


  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      console.log('User pressed Enter!');
      // Do something else here, like submitting a form
    }
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

  const handleSearchChange = (e) => {
    const value = e.target.value.replace(/ /g, '\u00A0'); // replace spaces with non-breaking spaces
    setSearchValue(value);
    handleInputScroll();
  };

  const searchTerms = {
    start: ['-yt', '/yt', '=mini'],
    middle: ['apple', 'test'],
  };

  const isFirstMatch = (word, array) => {
    return array.some((term) => new RegExp(`^${term}`).test(word));
  };

  const isMatch = (word, array) => {
    return array.some((term) => new RegExp(`${term}`).test(word));
  };

  const renderHighlightedText = () => {
    const words = searchValue.split(/(?![/=+-])(\W+)/);
    return (
      <div ref={highlightRef}>
        {words.map((word, index) => (
          <span
            key={index}
            className={
              isFirstMatch(word, searchTerms.start)
                ? 'highlighted text-blue-600 transition-colors before:text-white duration-200 ease-in-out'
                : isMatch(word, searchTerms.middle)
                ? 'highlighted text-green-600 transition-colors before:text-white duration-200 ease-in-out'
                : 'transition-colors before:text-current duration-200 ease-in-out'
            }
          >
            {word}
          </span>
        ))}
      </div>
    );
  };

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        initial={{ scale: searchMaxScale }}
        animate={{
          scale: searchMaxScale,
        }}
      >
        <motion.div
          layout
          initial={{ top: searchMaxTop }}
          animate={{
            top: searchMaxTop,
            transition: {
              type: 'spring',
              ...springyMotion,
            },
          }}
          className="absolute w-screen flex justify-center"
        >
          <motion.div
            layout
            initial={{ width: '550px' }}
            animate={{
              top: '142px',
              width: isInputFocused ? '700px' : '650px',
              transition: {
                type: 'spring',
                ...springyMotion,
              },
            }}
          >
            <div className='w-full z-[98]'>
              <input
                id="inputContainer"
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                onKeyDown={handleKeyDown}
                style={{
                  position: 'relative',
                  top: '-1px',
                  left: '0',
                  width: '100%',
                  borderRadius: '28px',
                  height: '80px',
                  boxShadow: 'rgba(0, 0, 0, 0.25) 0px 25px 50px -12px',
                }}
                className="bg-[#333333] selection:text-blue-600 selection:bg-transparent overflow-hidden input-container select-none focus:outline-none overflow-wrap p-5 text-[2.5rem] font-default-light"
                spellCheck="false"
                placeholder="Search or -query"
                autoComplete="off"
                value={searchValue}
                onChange={handleSearchChange}
                onScroll={handleInputScroll}
                ref={inputRef}
              />
              <div className="absolute top-0 left-0 w-screen flex justify-center pointer-events-none z-[99]">
                <motion.div
                  layout
                  initial={{ width: '550px' }}
                  animate={{
                    top: '142px',
                    width: isInputFocused ? '700px' : '650px',
                    transition: {
                      type: 'spring',
                      ...springyMotion,
                    },
                  }}
                >
                  <div
                    id="highlightContainer"
                    style={{
                      top: '0',
                      left: '0',
                      height: '80px',
                      width: '100%',
                      overflow: 'scroll',
                      WebkitOverflowScrolling: 'touch',
                      msOverflowStyle: 'none',
                      scrollbarWidth: 'none',
                      whiteSpace: 'pre-wrap',
                    }}
                    className="bg-transparent focus:outline-none select-text pointer-events-none px-5 py-[0.625rem] text-[2.5rem] font-default-light text-white"
                    onScroll={handleHighlightScroll}
                    ref={highlightRef}
                  >
                    <span>{renderHighlightedText()}</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </MotionConfig>
  );
};

export default SearchBar;
