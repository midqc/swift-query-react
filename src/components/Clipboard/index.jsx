import React, { useState, useEffect, createContext } from 'react';

import { motion, MotionConfig, useAnimation } from 'framer-motion';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useMotionVariants } from '../../hooks/useMotionVariants';

export const ClipboardContext = createContext();

function Clipboard() {
  const {
    springyMotion,
    bouncyMotion,
    slowMotion,
    smoothMotion,
    fastMotion,
    rubberyMotion,
  } = useMotionVariants();

  const [clipboardText, setClipboardText] = useState('');
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
    window.addEventListener('copy', handleCopy);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('copy', handleCopy);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  function handleClick() {
    console.log('Clipboard Clicked');
  }

  return (
    <div className="flex absolute left-0 justify-center w-screen">
       
      {clipboardText && (
        <span className="cursor-pointer flex flex-row justify-center items-center">
          <motion.span
            className="relative w-fit flex border-highlight border-[1px] border-black/30 dark:border-white/5 bg-yellow-500/60 dark:bg-yellow-600/10 items-center focus:outline-none align-middle select-none px-4 rounded-full shadow-md text-base text-yellow-800 dark:text-yellow-600 backdrop-blur-sm"
            style={{ top: '3.8rem' }}
            initial={{  scale: 1, translateY: '1rem' }}
            animate={{ scale: 1, translateY: '0rem'  }}
            whileTap={{ scale: 0.8 }}
            transition={{
              type: 'spring',
              restDelta: 0.001,
              ...smoothMotion,
            }}
            onClick={handleClick}
          >
            {(() => {
              const textLength = clipboardText.trim().length;
              if (textLength > maxLength) {
                const diff = textLength - maxLength;
                let trimmedText = clipboardText.trim();
                let trimmedTextFront;
                let trimmedTextEnd;
                let ellipsis = '';
                if (diff > 6) {
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
          </motion.span>
        </span>
      )}
    </div>
  );
}

export default Clipboard;
