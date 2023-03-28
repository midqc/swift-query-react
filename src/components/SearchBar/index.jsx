import React, { useState, useRef, useEffect } from 'react';
import { useLocalStorage } from 'react-use';
import './index.css';

import { motion, MotionConfig, useAnimation } from 'framer-motion';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useMotionVariants } from '../../hooks/useMotionVariants';

import useThemeContext from '../../hooks/useThemeContext';
import Wallpaper from '../../components/ui/Wallpaper';

import usePexelsAPI from '../../hooks/api/usePexelsAPI';

let ccTLDs = [".com", ".org", ".net", ".edu", ".gov", ".co", ".io", ".info", ".biz", ".me", ".tv", ".us", ".ca", ".uk", ".au", ".mx", ".de", ".fr", ".es", ".it", ".nl", ".se", ".no", ".dk", ".ru", ".jp", ".cn", ".nz", ".za", ".in", ".ae"];

const SEARCH_HISTORY_KEY = 'searchHistory';

let defaultShortcuts = [
  { name: '-google', url: 'https://www.google.com/search?q=', info: 'search' },
  { name: '-bing', url: 'https://www.bing.com/search?q=', info: 'search' },
  {
    name: '-duck',
    url: 'https://duckduckgo.com/?q=',
    info: 'search duckduckgo',
  },
  {
    name: '-gmail',
    url: 'https://mail.google.com/mail/u/0/#search/',
    info: 'search google mail',
  },
  {
    name: '-gml',
    url: 'https://mail.google.com/mail/u/0/#search/',
    info: 'search google mail',
  },
  { name: '-yahoo', url: 'https://search.yahoo.com/search?p=', info: 'search' },
  {
    name: '-yt',
    url: 'https://www.youtube.com/results?search_query=',
    info: 'search youtube',
  },
  {
    name: '-ytm',
    url: 'https://music.youtube.com/search?q=',
    info: 'search youtube music',
  },
  { name: '-amz', url: 'https://www.amazon.com/s?k=', info: 'search amazon' },
  {
    name: '-img',
    url: 'https://www.google.com/search?tbm=isch&q=',
    info: 'search images',
  },
  {
    name: '-drive',
    url: 'https://drive.google.com/drive/u/0/search?q=',
    info: 'search google drive',
  },
];

const defaultLinks = [
  { name: '/yt', url: 'https://www.youtube.com/', info: 'youtube.com' },
  {
    name: '/yth',
    url: 'https://www.youtube.com/feed/history',
    info: 'youtube history',
  },
  {
    name: '/ytm',
    url: 'https://music.youtube.com/',
    info: 'music.youtube.com',
  },
  { name: '/amz', url: 'https://www.amazon.com/', info: 'amazon.com' },
  { name: '/apl', url: 'https://www.apple.com/', info: 'apple.com' },
];

const SearchBar = () => {

  const controls = useAnimation();

  const jelloKeyframes = {
    '0%': { skewX: '0deg', skewY: '0deg' },
    '12.5%': { skewX: '-12.5deg', skewY: '-12.5deg' },
    '25%': { skewX: '6.25deg', skewY: '6.25deg' },
    '37.5%': { skewX: '-3.125deg', skewY: '-3.125deg' },
    '50%': { skewX: '1.5625deg', skewY: '1.5625deg' },
    '62.5%': { skewX: '-0.78125deg', skewY: '-0.78125deg' },
    '75%': { skewX: '0.390625deg', skewY: '0.390625deg' },
    '87.5%': { skewX: '-0.1953125deg', skewY: '-0.1953125deg' },
    '100%': { skewX: '0deg', skewY: '0deg' },
  };

  const [links, setLinks] = useLocalStorage('links', defaultLinks);
  const [shortcuts, setShortcuts] = useLocalStorage(
    'shortcuts',
    defaultShortcuts
  );

  let allNames = [...defaultLinks, ...defaultShortcuts].map(
    (item) => item.name
  );

  const {
    springyMotion,
    bouncyMotion,
    slowMotion,
    smoothMotion,
    fastMotion,
    rubberyMotion,
  } = useMotionVariants();

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

  const [isNewTab, setIsNewTab] = useState(() => {
    const savedIsNewTab = localStorage.getItem('isNewTab');
    return savedIsNewTab ? JSON.parse(savedIsNewTab) : true;
  });

  const toggleIsNewTab = () => {
    const newIsNewTab = !Boolean(isNewTab);
    setIsNewTab(newIsNewTab);
    localStorage.setItem('isNewTab', JSON.stringify(newIsNewTab));
  };

  const inputRef = useRef(null);
  const highlightRef = useRef(null);

  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    // Load search history from local storage
    const storedHistory = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (storedHistory) {
      setSearchHistory(JSON.parse(storedHistory));
    }
  }, []);

  useEffect(() => {
    // Save search history to local storage
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(searchHistory));
  }, [searchHistory]);

  const handleSearchHistoryChange = (newValue) => {
    setSearchValue(newValue);

    if (newValue === '') {
      inputRef.current.focus();
      return;
    }

    const newHistory = [newValue, ...searchHistory.filter(value => value !== newValue)];
    setSearchHistory(newHistory);
  };

  const handleInputKeyDown = (event) => {
    const key = event.key;
    if (key === 'ArrowUp' || key === 'ArrowDown') {
      event.preventDefault();
      const currentIndex = searchHistory.indexOf(searchValue);
      const nextIndex = key === 'ArrowUp' ? currentIndex + 1 : currentIndex - 1;
      if (nextIndex >= 0 && nextIndex < searchHistory.length) {
        const nextValue = searchHistory[nextIndex];
        setSearchValue(nextValue);
      } else if (nextIndex === -1) {
        setSearchValue('');
      } else if (nextIndex === currentIndex - 1 && searchHistory.length > 0) {
        setSearchValue('=clear');
      }
    }
  };


  const handleClearHistory = () => {
    setSearchHistory([]);
  };

  const openLink = (url, searchValue, isNewTab) => {
    if (isNewTab) {
      window.open(`${url}${searchValue}`, '_blank');
    } else {
      window.location.href = `${url}${searchValue}`;
    }
  };

  let defaultUrl = 'https://www.google.com/search?q=';

  const [theme, setTheme] = useState('default');
  const divThemeRef = useRef(null);

  const [pexelsImageQuery, setPexelsImageQuery] = useState("");
  const images = usePexelsAPI(pexelsImageQuery);

  const handleKeyDown = async (event) => {
    if (event.key === 'Enter' && !event.ctrlKey) {

      if (searchValue) {
        handleSearchHistoryChange(searchValue);
      }

      event.preventDefault();
      let clipboardText;

      try {
        clipboardText = await navigator.clipboard.readText();
      } catch (error) {
        console.error(error);
      }

      //calculate the length of the firstWord
      let matchFirstWord = searchValue.match(/^[-.=\/,\w]+/);
      let firstWord = matchFirstWord ? matchFirstWord[0] : '';
      let nameLength = firstWord.length + 1;

      // check if searchValue only contains spaces
      if (/^\s*$/.test(searchValue)) {

        openLink(defaultUrl, clipboardText, isNewTab);

      } else if (searchValue.startsWith('-') || searchValue.startsWith('/')) {
        const allNameCommands = [...defaultLinks, ...defaultShortcuts];

        // Create an array of command names
        const allNamesNow = allNameCommands.map((item) => item.name);

        const matchingCommand = allNameCommands.find(
          (command) => command.name === firstWord
        );

        if (allNamesNow.includes(firstWord) && searchValue.startsWith('-')) {

          if (!(searchValue.slice(nameLength)).replace(/&nbsp;/g, '').trim()) {
            // The searchValue string contains only whitespace or &nbsp; or is empty
            openLink(
              matchingCommand.url,
              clipboardText,
              isNewTab
            );
          } else {
            openLink(
              matchingCommand.url,
              searchValue.slice(nameLength),
              isNewTab
            );
          }

          // if (searchValue.startsWith('-img')) {
          //   setPexelsImageQuery(searchValue.slice(nameLength))
          //   return (
          //     <div>
          //       {images && images.length > 0 && images.map((image) => (
          //         <img src={image.src.medium} key={image.id} alt={image.url} />
          //       ))}
          //     </div>
          //   );
          // }

          setSearchValue(searchValue.split(" ")[0].substring(0, nameLength));

        } else if (searchValue.startsWith('-all')) {

          let allURLs = ['google', 'yt', 'bing'];

          const multiURLs = defaultShortcuts
            .filter(shortcut => allURLs.includes(shortcut.name.substring(1))) // filter for the desired shortcuts
            .map(shortcut => shortcut.url); // map the remaining objects to their 'url' values

          for (let i = 0; i < multiURLs.length; i++) {
            window.open(`${multiURLs[i]}${searchValue.slice(nameLength)}`, '_blank');
          }

          setSearchValue('-all ');

        } else if ((allNamesNow.includes(firstWord)) && searchValue.startsWith('/')) {

          openLink(
            matchingCommand.url, '',
            isNewTab
          );

        } else if (searchValue.startsWith('/')) {

          openLink('http://' + searchValue.replace(/^\/+/, ''), '', isNewTab);

        }
      } else if (searchValue.startsWith('=')) {

        // if the searchValue starts with =mini, then toggle mini
        if (searchValue.startsWith('=mini')) {

          handleToggleMini();
          setSearchValue('');

        } else if (searchValue.startsWith('=newtab')) {

          toggleIsNewTab();
          setSearchValue('');

        } else if (searchValue.startsWith('=pin')) {

          chrome.runtime.sendMessage(
            { message: 'pinTab' },
            function (response) {
              console.log(response);
            }
          );
          setSearchValue('');

        } else if (searchValue.startsWith('=theme')) {

          setTheme(searchValue.slice(nameLength))
          setSearchValue('');
          
        } else if (searchValue.startsWith('=clear')) {

          handleClearHistory();
          setSearchValue('');

        }

      } else if (searchValue.startsWith('.')) {

        sendMessage(searchValue.replace(/&nbsp;/g, ' '));

      } else {

        openLink(defaultUrl, searchValue.slice(0), isNewTab);

      }
    }

    if (event.ctrlKey && event.key === 'Enter') {
      event.preventDefault();

      if (searchValue) {
        handleSearchHistoryChange(searchValue);
      }

    }
  };

  const handleKeyDowns = (event) => {
    handleKeyDown(event);
    handleInputKeyDown(event);
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

  let browserNames;

  try {
    browserNames = JSON.parse(localStorage.getItem('browserNames')) || [];
  } catch (error) {
    browserNames = [];
  }

  chrome.runtime.sendMessage({ message: 'getBrowserData' }, function (response) {
    if (response && response.data) {
      let browserData = response.data;
      localStorage.setItem('browserData', JSON.stringify(browserData));
      browserNames = Object.keys(browserData).map(name => `.${name}`);
      localStorage.setItem('browserNames', JSON.stringify(browserNames));
    } else {
      console.error('Error handling response:', chrome.runtime.lastError);
      let browserData = JSON.parse(localStorage.getItem('browserData'));
      if (browserData) {
        browserNames = Object.keys(browserData).map(name => `.${name}`);
        localStorage.setItem('browserNames', JSON.stringify(browserNames));
      } else {
        console.error('Failed to get browser data from message and local storage');
      }
    }
  });

  let searchTerms = {
    start: [
      '=mini',
      '=newtab',
      '=add',
      '=remove',
      '=note',
      '=clear',
      '=pin',
      '=theme',
      '=default',
      '-all',
      ...allNames, ...browserNames
    ],
    middle: ['- NULL -'],
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
    const words = searchValue.split(/(?![/=+-.])(\W+)/);
    return (
      <div ref={highlightRef}>
        {words.map((word, index) => (
          <span
            key={index}
            className={
              isFirstMatch(word, searchTerms.start)
                ? 'highlighted text-blue-600 dark:text-blue-500 transition-colors before:text-black dark:before:text-white duration-200 ease-in-out'
                : isMatch(word, searchTerms.middle)
                  ? 'highlighted text-green-600 transition-colors before:text-black dark:before:text-white duration-200 ease-in-out'
                  : 'transition-colors before:text-current duration-200 ease-in-out'
            }
          >
            {word}
          </span>
        ))}
      </div>
    );
  };

  const sendMessage = (message) => {
    chrome.runtime.sendMessage({ message }, (response) => {
      console.log('Response:', response.message);
    });
  };

  useEffect(() => {
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  const handleEscKey = (event) => {
    if (event.key === 'Escape') {
      setSearchValue('');
    }
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
              duration: 2,
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
                onKeyDown={handleKeyDowns}
                style={{
                  position: 'relative',
                  top: '-1px',
                  left: '0',
                  width: '100%',
                  borderRadius: '28px',
                  height: '80px',
                  boxShadow: 'rgba(0, 0, 0, 0.25) 0px 25px 50px -12px',
                }}
                className="border-highlight border-[1px] border-black/40 dark:border-white/5 bg-white dark:bg-[#333333] overflow-hidden input-container select-none focus:outline-none overflow-wrap p-5 text-[2.5rem]"
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
                    className="bg-transparent focus:outline-none select-none pointer-events-none px-5 py-[0.625rem] text-[2.5rem] font-default-light  text-black dark:text-white"
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
    </MotionConfig>
  );
};

export default SearchBar;
