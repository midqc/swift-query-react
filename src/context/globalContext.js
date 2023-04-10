import React, { createContext, useState, useEffect } from 'react';

export const ClipboardContext = createContext('');

const CLIPBOARD_STORAGE_KEY = 'clipboardText';

const MAX_CLIPBOARD_LENGTH = 13;

export const ClipboardProvider = ({ children }) => {
  const [currentClipboardText, setCurrentClipboardText] = useState('');
  const [clipboardTextHistory, setClipboardTextHistory] = useState([]);

  useEffect(() => {
    // Update localStorage value when clipboardText changes
    localStorage.setItem(CLIPBOARD_STORAGE_KEY, currentClipboardText);
  }, [currentClipboardText]);

  useEffect(() => {
    // Load initial value from localStorage
    const storedValue = localStorage.getItem(CLIPBOARD_STORAGE_KEY);
    if (storedValue) {
      setClipboardTextHistory(prevClipboardTextHistory => [
        storedValue,
        ...prevClipboardTextHistory.slice(0, MAX_CLIPBOARD_LENGTH - 1)
      ]);
      setCurrentClipboardText(storedValue);
    }
  }, []);

  console.log(clipboardTextHistory)

  const updateClipboardText = (newText) => {
    if (newText.trim() === '') {
      // Do not insert if the clipboard text only contains spaces
      return;
    }

    const newClipboardTextHistory = [...clipboardTextHistory];

    // Remove any duplicates before adding the new text to the front of the array
    const existingIndex = newClipboardTextHistory.indexOf(newText);
    if (existingIndex !== -1) {
      newClipboardTextHistory.splice(existingIndex, 1);
    }

    newClipboardTextHistory.unshift(newText); // Add the newText to the front of the array
    newClipboardTextHistory.splice(MAX_CLIPBOARD_LENGTH); // Remove any elements beyond the limit

    setClipboardTextHistory(newClipboardTextHistory);
    setCurrentClipboardText(newText);
  };

  const deleteClipboardTextHistory = (index) => {
    const newClipboardTextHistory = [...clipboardTextHistory];
    newClipboardTextHistory.splice(index, 1);
    setClipboardTextHistory(newClipboardTextHistory);
  };

  return (
    <ClipboardContext.Provider
      value={{
        currentClipboardText,
        clipboardTextHistory,
        updateClipboardText,
        deleteClipboardTextHistory,
        setClipboardTextHistory
      }}
    >
      {children}
    </ClipboardContext.Provider>
  );
};
