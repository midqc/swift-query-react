/* eslint-disable react/no-danger-with-children */
import React, { useState, useEffect, useContext, useRef } from 'react';

import { ClipboardContext } from '../../context/globalContext';
import './index.css'

import { delay, motion, MotionConfig, useAnimation } from 'framer-motion';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useMotionVariants } from '../../hooks/useMotionVariants';

import { GlobeIcon, TrashIcon, VideoIcon } from '../Icons'

function Clipboard() {
  const {
    springyMotion,
    bouncyMotion,
    slowMotion,
    smoothMotion,
    fastMotion,
    rubberyMotion,
  } = useMotionVariants();

  const childControls = useAnimation();
  const childRef = useRef(null);

  const [isEditableFocused, setIsEditableFocused] = useState(false);
  const [isParentHovered, setIsParentHovered] = useState(false);

  const handleParentHoverStart = () => {
    childControls.start("hover");
    setClipboardHoverProp({ borderRadius: ['0.6rem', '1.8rem'], zIndex: 999 })
    setIsParentHovered(true)
  };

  const handleParentHoverEnd = () => {
    childControls.start("nothover");
    setClipboardHoverProp({})
    setIsParentHovered(false)
  };

  const handleEditableFocus = () => {
    setIsEditableFocused(true);
    handleParentHoverStart();
    setClipboardHoverProp({ borderRadius: ['0.6rem', '1.8rem'], zIndex: 999 })
  };

  const handleEditableBlur = () => {
    setIsEditableFocused(false);
    handleParentHoverEnd();
    setClipboardHoverProp({})
  };

  const { currentClipboardText, clipboardTextHistory, updateClipboardText, deleteClipboardTextHistory } = useContext(ClipboardContext);

  const [maxLength, setMaxLength] = useState(6);

  const handleCopy = async () => {
    const text = await navigator.clipboard.readText();

    // Check if the text only contains spaces or is shorter than 3 characters
    if (/^\s*$/.test(text) || text.length <= 0) {
      return;
    }

    // Check if the text is the same as the previous text
    if (text === currentClipboardText) {
      return;
    }

    updateClipboardText(text);
  };

  const handleFocus = async () => {
    try {
      const text = await navigator.clipboard.readText();

      // Check if the text only contains spaces or is shorter than 3 characters
      if (/^\s*$/.test(text) || text.length <= 0) {
        return;
      }

      // Check if the text is the same as the previous text
      if (text === currentClipboardText) {
        return;
      }

      updateClipboardText(text);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const isDocumentFocused = document.hasFocus();

    if (isDocumentFocused) {
      handleFocus();
    }

    window.addEventListener('copy', handleCopy);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('copy', handleCopy);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);



  function handleClick() {
  }

  const [links, setLinks] = useState([]);

  // Regular expression to match URLs
  const urlRegex = /(?:(?:https?|ftp):\/\/)?[\w/\-?=%.]+\.[\w/\-?=%.]+/g;

  // Function to filter links from text
  const filterLinks = (text) => {
    const matchedLinks = text.match(urlRegex) || [];
    const separatedLinks = matchedLinks.map((link) =>
      link.split(/[,\s]+/).filter(Boolean)
    ).flat();
    const uniqueLinks = Array.from(new Set(separatedLinks));
    const sortedLinks = uniqueLinks
      .map((link) => {
        try {
          return new URL(link).href;
        } catch (error) {
          // console.error(`Invalid URL: ${link}`, error);
          return null;
        }
      })
      .filter(Boolean)
      .sort((a, b) => {
        const hostA = new URL(a).hostname;
        const hostB = new URL(b).hostname;
        if (hostA < hostB) return -1;
        if (hostA > hostB) return 1;
        return 0;
      });
    setLinks(sortedLinks);

  };

  const [titles, setTitles] = useState({});
  // const youtubeApiKey = 'AIzaSyDgFa2LO6IVENx50Xi-mxc07THnEe-vFmI';
  const youtubeApiKey = '';

  useEffect(() => {
    links.forEach(url => {
      const videoId = url.split('v=')[1];

      fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${youtubeApiKey}`)
        .then(response => response.json())
        .then(data => {
          if (data.items && data.items.length > 0) {
            setTitles(titles => ({ ...titles, [url]: data.items[0].snippet.title }))
          }
        })
        .catch(error => console.error(error));
    });
  }, [links, youtubeApiKey]);

  function trimSimilar(url1, url2) {
    if (!url1 || !url2) {
      return url1 || url2 || '';
    }

    const url1Parts = url1.split('/');
    const url2Parts = url2.split('/');

    // Find the index where the two URLs differ
    let diffIndex = 0;
    while (url1Parts[diffIndex] === url2Parts[diffIndex]) {
      diffIndex++;
      if (diffIndex === url1Parts.length || diffIndex === url2Parts.length) {
        break;
      }
    }

    // If the URLs have the same domain name, return the remaining path of url2
    if (url1Parts[2] === url2Parts[2]) {
      return '/' + url2Parts.slice(diffIndex).join('/');
    }

    // If the URLs have different domain names, return url2
    return url2;
  }

  const linkCount = links.length;

  const linkList = links.map((item, index) => {
    if (item.includes('youtube.com/watch')) {
      return (
        <motion.li
          whileTap={{ scale: 0.9 }}
          transition={{
            type: 'spring',
            restDelta: 0.001,
            ...smoothMotion,
          }}
          className='select-none text-ellipsis overflow-hidden max-w-[16rem] w-full h-fit whitespace-nowrap bg-red-600/10 dark:bg-red-400/5 text-red-600 dark:text-red-500 px-2 py-1 rounded-[0.8rem] flex'
          key={index}
        >
          <span className='flex items-center space-x-2'>
            {linkCount <= 3 ? <VideoIcon height='16px' className='fill-red-600 dark:fill-red-500' /> : ''}
            {Object.keys(titles).length && titles[item]
              ? linkCount > 3
                ? (
                  <a href={item} className='inline-block text-ellipsis cursor-pointer' style={{ width: '15.5rem', overflow: 'hidden' }}>
                    {index + 1 + '. '}{titles[item]}
                  </a>
                ) : (
                  <a href={item} className='inline-block text-ellipsis cursor-pointer' style={{ width: '13rem', overflow: 'hidden' }}>
                    {titles[item]}
                  </a>
                )
              : linkCount > 3
                ? (
                  <a href={item} className='inline-block text-ellipsis cursor-pointer' style={{ width: '15.5rem', overflow: 'hidden' }}>
                    {index + 1 + '. '}{`YouTube/${item.replace(/^https?:\/\/www.youtube.com\/watch\?v=/, '')}`}
                  </a>
                ) : (
                  <a href={item} className='inline-block text-ellipsis cursor-pointer' style={{ width: '13rem', overflow: 'hidden' }}>
                    {`YouTube/${item.replace(/^https?:\/\/www.youtube.com\/watch\?v=/, '')}`}
                  </a>
                )
            }
          </span>
        </motion.li>
      );
    } else {
      return (
        <motion.li
          whileTap={{ scale: 0.9 }}
          transition={{
            type: 'spring',
            restDelta: 0.001,
            ...smoothMotion,
          }}
          className='select-none text-ellipsis overflow-hidden max-w-[16rem] w-full h-fit whitespace-nowrap bg-blue-600/10 dark:bg-blue-400/5 text-blue-600 dark:text-blue-500 px-2 py-1 rounded-[0.8rem] flex'
          key={index}
        >
          <span className='flex items-center space-x-2'>
            {linkCount <= 3 ? <GlobeIcon height='16px' className='fill-blue-600 dark:fill-blue-500' /> : ''}
            {linkCount > 3
              ? (<a href={item} className='inline-block text-ellipsis cursor-pointer' style={{ width: '15rem', overflow: 'hidden' }}>
                {index + 1 + '. '}{trimSimilar(links[index - 1], item).replace(/^https?:\/\/www./, '').replace(/^https?:\/\//, '')}
              </a>) : (<a href={item} className='inline-block text-ellipsis cursor-pointer' style={{ width: '13.5rem', overflow: 'hidden' }}>
                {trimSimilar(links[index - 1], item).replace(/^https?:\/\/www./, '').replace(/^https?:\/\//, '')}
              </a>)}
          </span>
        </motion.li>
      );
    }
  });

  // Call filterLinks function on initial render and whenever text changes
  useEffect(() => {
    filterLinks(currentClipboardText);
  }, [currentClipboardText]);

  let countText;

  if (linkCount === 0) {
    countText = '';
  } else if (linkCount === 1) {
    countText = '1 Link';
  } else {
    countText = `${linkCount} Links`;
  }

  const handleClipboardChange = (event) => {
    const innerText = event.target.innerText;
    if (currentClipboardText !== innerText) {
      updateClipboardText(innerText);
      navigator.clipboard.writeText(innerText);
    }
  };

  const [clipboardHoverProp, setClipboardHoverProp] = useState({})

  return (
    <div className="flex absolute left-0 justify-center w-screen">

      {currentClipboardText && (
        <span className="flex flex-row justify-center items-center">
          <motion.span
            onHoverStart={handleParentHoverStart}
            onHoverEnd={isEditableFocused ? handleParentHoverStart : handleParentHoverEnd}
            onDragOver={(event) => {
              event.preventDefault();
            }}
            onDrop={(event) => {
              const text = event.dataTransfer.getData("text/plain");
              !isParentHovered ? (updateClipboardText(text) || navigator.clipboard.writeText(text)) : updateClipboardText(currentClipboardText);
            }}
            className="relative w-fit flex flex-col border-highlight border-[1px] overflow-hidden border-black/20 dark:border-white/5 bg-neutral-100 dark:bg-[#2C2C2C] focus:outline-none align-middle items-center justify-center px-4 rounded-[0.6rem] text-base text-neutral-500 shadow-lg"
            style={{ top: '3.8rem' }}
            initial={{ scale: 1, translateY: '1rem' }}
            animate={{ scale: 1, translateY: '0rem', ...clipboardHoverProp }}
            exit={{ scale: 0.8 }}
            // whileHover={{
            //   borderRadius: ['0.6rem', '1.4rem'],
            //   zIndex: 999,
            // }}
            transition={{
              type: 'spring',
              restDelta: 0.001,
              ...smoothMotion,
            }}
            onClick={handleClick}
          >
            <motion.div
              ref={childRef}
              variants={{
                hover: { opacity: 0, translateY: '-24px' },
                nothover: { opacity: 1, translateY: '0px' }
              }}
              initial="nothover"
              animate={childControls}
              className='flex flex-nowrap shrink-0 flex-row select-none'>
              <span className='text-neutral-600 dark:text-neutral-400'>Copied: &#8205;</span>
              {(() => {
                const textLength = currentClipboardText.trim().length;
                if (textLength > maxLength) {
                  const diff = textLength - maxLength;
                  let trimmedText = currentClipboardText.trim();
                  let trimmedTextFront;
                  let trimmedTextEnd;
                  let ellipsis = '';
                  if (diff > 6) {
                    trimmedTextFront = trimmedText.slice(0, maxLength);
                    ellipsis = <span className="opacity-50">...</span>;
                    trimmedTextEnd = trimmedText.slice(textLength - 6);
                  } else if (diff === 6) {
                    trimmedTextFront = trimmedText.slice(0, maxLength);
                    ellipsis = <span className="opacity-50">...</span>;
                    trimmedTextEnd = trimmedText.slice(textLength - 3);
                  } else if (diff === 5) {
                    trimmedTextFront = trimmedText.slice(0, maxLength);
                    ellipsis = <span className="opacity-50">...</span>;
                    trimmedTextEnd = trimmedText.slice(textLength - 2);
                  } else if (diff === 4) {
                    trimmedTextFront = trimmedText.slice(0, maxLength);
                    ellipsis = <span className="opacity-50">...</span>;
                    trimmedTextEnd = trimmedText.slice(textLength - 1);
                  } else {
                    trimmedTextFront = trimmedText.slice(0, maxLength);
                    ellipsis = <span className="opacity-50">...</span>;
                    trimmedTextEnd = '';
                  }
                  return (
                    <>
                      {trimmedTextFront}
                      {ellipsis}
                      {trimmedTextEnd}
                    </>
                  );
                } else {
                  return currentClipboardText.trim();
                }
              })()}

              <span className='text-blue-600 dark:text-blue-500'>
                &#8205; &#8205;{countText}
              </span>
            </motion.div>

            <motion.div
              ref={childRef}
              variants={{
                hover: {
                  opacity: 1, translateY: '-24px', height: 'auto',
                  transition: {
                    type: 'spring',
                    restDelta: 0.001,
                    ...smoothMotion,
                  }
                },
                nothover: {
                  opacity: 0, translateY: '0px', height: 0,
                  transition: {
                    type: 'spring',
                    restDelta: 0.001,
                    ...smoothMotion,
                  }
                },
                // nothover: {
                //   opacity: 1, translateY: '-24px', height: 'auto',
                //   transition: {
                //     type: 'spring',
                //     restDelta: 0.001,
                //     ...smoothMotion,
                //   }
                // },
              }}
              initial="nothover"
              animate={childControls}>
              <ul className='space-y-2 mt-4 select-text mb-[-7px]'>

                {/* {!(linkCount > 0) ? (<li
                  onFocus={handleEditableFocus}
                  onBlur={handleEditableBlur}
                  className='min-w-[16rem] max-w-[18rem] max-h-[15.9rem] overflow-y-scroll -m-[1.5rem] -mb-8'>
                  <pre id='clipboardTextContainer' className='font-default-regular p-[1.5rem] outline-none whitespace-pre-wrap break-words overflow-wrap-break-word' contentEditable={false} suppressContentEditableWarning
                    onMouseLeave={handleClipboardChange}>
                    {currentClipboardText}
                  </pre>
                </li>) : (<li
                  onFocus={handleEditableFocus}
                  onBlur={handleEditableBlur}
                  className='min-w-[12rem] max-w-[16rem] max-h-[7.5rem] overflow-y-scroll rounded-[0.8rem] border-2 border-black/5 dark:border-white/[0.03] p-2'>
                  <pre id='clipboardTextContainer' className='font-default-regular outline-none whitespace-pre-wrap break-words overflow-wrap-break-word' contentEditable={false} suppressContentEditableWarning
                    onMouseLeave={handleClipboardChange}>
                    {currentClipboardText}
                  </pre>
                </li>)}

                {(linkCount > 0) && (
                  <li className='pt-2 flex flex-col space-y-4 hide-scroll scroll-smooth select-none'>
                    <span className='text-neutral-600 dark:text-neutral-400'>Links</span>
                    <span className='max-h-28 space-y-2 overflow-y-scroll rounded-[0.8rem] overflow-hidden'>{linkList}</span>
                  </li>
                )} */}

                <li
                  onFocus={handleEditableFocus}
                  onBlur={handleEditableBlur}
                  className='min-w-[16rem] max-w-[18rem] max-h-[15.9rem] overflow-y-scroll -m-[1.5rem] -mb-8'>
                  <pre id='clipboardTextContainer' className='font-default-regular p-[1.5rem] outline-none whitespace-pre-wrap break-words overflow-wrap-break-word' contentEditable={false} suppressContentEditableWarning
                    onMouseLeave={handleClipboardChange}>
                    {currentClipboardText}
                  </pre>
                </li>


              </ul>
            </motion.div>
          </motion.span>
        </span>
      )}
    </div>
  );
}

export default Clipboard;
