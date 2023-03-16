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
  const [maxLength, setMaxLength] = useState(10);
  const [targetMaxLength, setTargetMaxLength] = useState(10);

  const controls = useAnimation();

  const handleCopy = async () => {
    const text = await navigator.clipboard.readText();

    // Check if the text only contains spaces or is shorter than 3 characters
    if (/^\s*$/.test(text) || text.length <= 3) {
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
      if (/^\s*$/.test(text) || text.length <= 3) {
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

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (targetMaxLength > maxLength) {
        setMaxLength(maxLength + 1);
      } else if (targetMaxLength < maxLength) {
        setMaxLength(maxLength - 1);
      }
    }, 10);

    return () => clearTimeout(timerId);
  }, [maxLength, targetMaxLength]);

  const animateNumber = (num) => {
    setTargetMaxLength(num);
    controls.start((i) => ({
      clipboardTextMaxLength: num,
      transition: {
        type: 'spring',
        restDelta: 0.001,
        ...slowMotion,
        delay: i * 0.05,
      },
    }));
  };

  const handleMouseEnter = () => {
    animateNumber(25);
  };

  const handleMouseLeave = () => {
    animateNumber(10);
  };

  return (
    <div className="flex absolute left-0 justify-center w-screen">
      {clipboardText && (
        <span className="cursor-pointer flex flex-row justify-center items-center">
          &#160;
          <motion.span
            className="relative w-fit flex bg-yellow-400/10 dark:bg-yellow-600/10 items-center align-middle select-none px-2 rounded-lg shadow-md text-base text-yellow-600 dark:text-yellow-400"
            style={{ top: '3.8rem' }}
            layout="position"
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            whileTap={{ scale: 0.8 }}
            transition={{
              type: 'spring',
              restDelta: 0.001,
              ...slowMotion,
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {clipboardText.trim().length > maxLength
              ? clipboardText.trim().slice(0, maxLength) + '...'
              : clipboardText.trim()}
          </motion.span>
        </span>
      )}
    </div>
  );
}

export default ClipboardText;
