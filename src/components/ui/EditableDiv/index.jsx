import React, { useRef } from 'react';

const EditableDiv = ({ defaultValue }) => {
  const divRef = useRef(null);

  const handleInputBlur = () => {
    const textContent = divRef.current.textContent.trim();
    if (!textContent) {
      divRef.current.textContent = defaultValue;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      divRef.current.blur();
    }
  };

  const handleInputFocus = () => {
    const textContent = divRef.current.textContent.trim();
    if (textContent === defaultValue) {
      divRef.current.textContent = '';
    }
  };

  return (
    <div
      ref={divRef}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleInputBlur}
      onKeyDown={handleKeyDown}
      onFocus={handleInputFocus}
    >
      {defaultValue}
    </div>
  );
};

export default EditableDiv;
