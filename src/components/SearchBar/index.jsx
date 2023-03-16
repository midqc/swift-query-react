import React, { useState, useRef, useEffect } from 'react';
import './index.css';

import { motion, MotionConfig } from 'framer-motion';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useMotionVariants } from '../../hooks/useMotionVariants';

const SearchBar = () => {
  const { springyMotion, bouncyMotion, slowMotion, smoothMotion, fastMotion, rubberyMotion } = useMotionVariants();

  const { isSm, isMd, isLg, isXl, is2xl } = useMediaQuery();

  const [isMini, setIsMini] = useState(false);

  useEffect(() => {
    // Get value from local storage if it exists
    const storedValue = localStorage.getItem('isMini');
    if (storedValue !== null) {
      setIsMini(JSON.parse(storedValue));
    }
  }, []);

  useEffect(() => {
    // Set value in local storage on change
    localStorage.setItem('isMini', JSON.stringify(isMini));
  }, [isMini]);

  let searchScaleVariants = {
    mini: { scale: 0.7 },
    full: { scale: 1.1 },
  };

  let searchTopVariants = {
    mini: { top: '65px' },
    full: { top: '131px' },
  };

  let searchWidthVariants = {
    mini: { width: '1800px' },
    full: { width: '400px' },
  };

  let currentWidth = '';

  if (is2xl) {
    searchWidthVariants = {
      mini: { width: '1300px' },
      full: { width: '700px' },
    };
  } else if (isXl || isLg) {
    searchWidthVariants = {
      mini: { width: '1000px' },
      full: { width: '650px' },
    };
  } else if (isMd) {
    searchWidthVariants = {
      mini: { width: '800px' },
      full: { width: '500px' },
    };
  } else {
    searchWidthVariants = {
      mini: { width: '600px' },
      full: { width: '400px' },
    };
  }

  const handleToggleMini = () => {
    setIsMini(!isMini);
  };

  const [searchValue, setSearchValue] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isInputHovered, setIsInputHovered] = useState(false);
  const [isNewTab, setIsNewTab] = useState(true);

  const inputRef = useRef(null);
  const highlightRef = useRef(null);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      console.log('User pressed Enter!');
      event.preventDefault();
      if (isNewTab) {
        window.open(
          `https://www.youtube.com/results?search_query=${searchValue}`,
          '_blank'
        );
      } else {
        window.location.href = `https://www.youtube.com/results?search_query=${searchValue}`;
      }
    }
  };

  const handleCheckboxChange = (event) => {
    setIsNewTab(event.target.checked);
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
    return array.some((term) => {
      const regex = new RegExp(`(^|\\W)${term}(\\W|$)`);
      return regex.test(word);
    });
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

  const [message, setMessage] = useState('');

  const sendMessage = () => {
    chrome.runtime.sendMessage({ message }, (response) => {
      console.log('Response:', response.message);
    });
  };

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        variants={searchScaleVariants}
        initial={isMini ? 'mini' : 'full'}
        animate={isMini ? 'mini' : 'full'}
        transition={{
          type: 'spring',
          restDelta: 0.001,
          ...smoothMotion,
        }}
      >
        <motion.div
          layout
          variants={searchTopVariants}
          initial={isMini ? 'mini' : 'full'}
          animate={isMini ? 'mini' : 'full'}
          whileHover={{ scale: isInputHovered ? 1.05 : 1 }}
          transition={{
            type: 'spring',
            restDelta: 0.001,
            ...smoothMotion,
          }}
          className="absolute w-screen flex justify-center"
        >
            <motion.div
              variants={searchWidthVariants}
              initial={
                isMini
                  ? 'mini'
                  : 'full' && isMini
                  ? searchWidthVariants.mini.width
                  : searchWidthVariants.full.width
              }
              animate={isMini ? 'mini' : 'full'}
              
              transition={{
                type: 'spring',
                opacity: { width: 0.3 },
                restDelta: 0.001,
                ...smoothMotion,
              }}
            >
              <div className="w-full z-[98]">
                <input
                  id="inputContainer"

                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}

                  onMouseOver={() => setIsInputHovered(true)}
                  onMouseOut={() => setIsInputHovered(false)}

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
                  className="bg-[#333333] selection:text-blue-600 selection:bg-transparent overflow-hidden input-container select-none focus:outline-none overflow-wrap p-5 text-[2.5rem]"
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
                    variants={searchWidthVariants}
            
                    initial={
                      isMini
                        ? 'mini'
                        : 'full' && isMini
                        ? searchWidthVariants.mini.width
                        : searchWidthVariants.full.width
                    }
                    animate={isMini ? 'mini' : 'full'}
                    transition={{
                      type: 'spring',
                      opacity: { width: 0.3 },
                      restDelta: 0.001,
                      ...smoothMotion,
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
                      className="bg-transparent focus:outline-none select-none pointer-events-none px-5 py-[0.625rem] text-[2.5rem] font-default-light text-white"
                      onScroll={handleHighlightScroll}
                      ref={highlightRef}
                    >
                      <span className="whitespace-nowrap">
                        {renderHighlightedText()}
                      </span>
                    </div>
                    
                  </motion.div>
                </div>
              </div>
          </motion.div>
        </motion.div>
      </motion.div>
      <button
        className="z-[99] px-2 py-1 m-4 bg-blue-600/20 rounded-lg text-blue-400 font-xl"
        onClick={handleToggleMini}
      >
        Toggle Mini
      </button>
      <label>
        <input
          className="z-[99]"
          type="checkbox"
          checked={isNewTab}
          onChange={handleCheckboxChange}
        />
        Open in new tab
      </label>
      <div>
        <input
          type="text"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        <button onClick={sendMessage}>Send Message</button>
      </div>
    </MotionConfig>
  );
};

export default SearchBar;
