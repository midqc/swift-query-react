/* eslint-disable react/no-danger-with-children */
import React, { useState, useEffect, useContext, useRef } from 'react';

import { ClipboardContext } from '../../context/globalContext';

import { delay, motion, MotionConfig, useAnimation } from 'framer-motion';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useMotionVariants } from '../../hooks/useMotionVariants';

import { IFrameIcon } from '../Icons'

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

  const handleParentHoverStart = () => {
    childControls.start("hover");
  };

  const handleParentHoverEnd = () => {
    childControls.start("nothover");
  };


  const { clipboardText, setClipboardText } = useContext(ClipboardContext);
  const [maxLength, setMaxLength] = useState(6);

  const handleCopy = async () => {
    const text = await navigator.clipboard.readText();

    // Check if the text only contains spaces or is shorter than 3 characters
    if (/^\s*$/.test(text) || text.length <= 0) {
      return;
    }

    // Check if the text is the same as the previous text
    if (text === clipboardText) {
      return;
    }

    setClipboardText(text);
  };

  const handleFocus = async () => {
    try {
      const text = await navigator.clipboard.readText();

      // Check if the text only contains spaces or is shorter than 3 characters
      if (/^\s*$/.test(text) || text.length <= 0) {
        return;
      }

      // Check if the text is the same as the previous text
      if (text === clipboardText) {
        return;
      }

      setClipboardText(text);
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
          console.error(`Invalid URL: ${link}`, error);
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

  const linkList = links.map((item) =>
    <motion.li
      whileTap={{ scale: 0.9 }}
      transition={{
        type: 'spring',
        restDelta: 0.001,
        ...smoothMotion,
      }}
      className='select-none text-ellipsis overflow-hidden max-w-[16rem] w-full h-fit whitespace-nowrap bg-blue-600/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-500 px-2 py-1 rounded-lg flex'>
      <span className='flex items-center space-x-2'>
        <IFrameIcon height='16px' className='fill-blue-600 dark:fill-blue-500' />
        <a href={item} className='inline-block text-ellipsis cursor-pointer' style={{ width: '13.5rem', overflow: 'hidden' }}>{item}</a>
      </span>
    </motion.li>
  );

  // Call filterLinks function on initial render and whenever text changes
  useEffect(() => {
    filterLinks(clipboardText);
  }, [clipboardText]);

  const count = links.length;
  let countText;

  if (count === 0) {
    countText = '';
  } else if (count === 1) {
    countText = '1 Link';
  } else {
    countText = `${count} Links`;
  }

  const handleClipboardChange = (event) => {
    const innerText = event.target.innerText;
    setClipboardText(innerText);
    navigator.clipboard.writeText(innerText);
  };

  return (
    <div className="flex absolute left-0 justify-center w-screen">

      {clipboardText && (
        <span className="flex flex-row justify-center items-center">
          <motion.span
            onHoverStart={handleParentHoverStart}
            onHoverEnd={handleParentHoverEnd}
            className="relative z-[99] w-fit flex flex-col border-highlight border-[1px] overflow-hidden border-black/30 dark:border-white/5 shadow-md  bg-white/80 dark:bg-neutral-700/40  focus:outline-none align-middle items-center justify-center px-4 rounded-[0.6rem] text-base text-neutral-500 backdrop-blur-2xl"
            style={{ top: '3.8rem' }}
            initial={{ scale: 1, translateY: '1rem' }}
            animate={{ scale: 1, translateY: '0rem' }}
            whileHover={{
              borderRadius: ['0.6rem', '1.4rem'],
            }}
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
                const textLength = clipboardText.trim().length;
                if (textLength > maxLength) {
                  const diff = textLength - maxLength;
                  let trimmedText = clipboardText.trim();
                  let trimmedTextFront;
                  let trimmedTextEnd;
                  let ellipsis = '';
                  if (diff >= 6) {
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
                  return clipboardText.trim();
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
                  opacity: 1, translateY: '-24px', height: 'auto', width: 'auto',
                  transition: {
                    type: 'spring',
                    restDelta: 0.001,
                    ...smoothMotion,
                  }
                },
                nothover: {
                  opacity: 0, translateY: '0px', height: 0, width: 0,
                  transition: {
                    type: 'spring',
                    restDelta: 0.001,
                    ...smoothMotion,
                  }
                }
              }}
              initial="nothover"
              animate={childControls}>
              <ul className='space-y-2 mt-4 select-text mb-[-7px]'>
                <li className='bg-black/5 dark:bg-white/5 rounded-lg p-2 max-w-[16rem] max-h-32 overflow-y-scroll shadow-sm'><pre id='clipboard-content' className='font-default-regular outline-none whitespace-pre-wrap break-words overflow-wrap-break-word' contentEditable onMouseLeave={handleClipboardChange} onBlur={handleClipboardChange}>{clipboardText}</pre></li>
                {linkList}
              </ul>
            </motion.div>
          </motion.span>
        </span>
      )}

    </div>
  );
}

export default Clipboard;
