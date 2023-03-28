import React, { createContext, useState } from 'react';

export const ClipboardContext = createContext('');

export const ClipboardProvider = ({ children }) => {
  const [clipboardText, setClipboardText] = useState('');

  return (
    <ClipboardContext.Provider value={{ clipboardText, setClipboardText }}>
      {children}
    </ClipboardContext.Provider>
  );
};
