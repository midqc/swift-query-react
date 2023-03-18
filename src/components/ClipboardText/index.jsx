import React, { useState, useEffect } from 'react';

import { motion, MotionConfig, useAnimation } from 'framer-motion';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useMotionVariants } from '../../hooks/useMotionVariants';
import * as Icons from '../Icons';

function ClipboardText() {
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

  return (
    <div className="flex absolute left-0 justify-center w-screen">
      {clipboardText && (
        <span className="cursor-pointer flex flex-row justify-center items-center">
          <motion.span
            className="relative w-fit flex border-[1px] border-black/10 dark:border-white/5 bg-yellow-400/10 dark:bg-yellow-600/10 items-center focus:outline-none align-middle select-none px-4 rounded-full shadow-md text-base text-yellow-600 dark:text-yellow-400"
            style={{ top: '3.8rem' }}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1.1 }}
            whileTap={{ scale: 0.8 }}
            transition={{
              type: 'spring',
              restDelta: 0.001,
              ...springyMotion,
            }}
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

export default ClipboardText;
