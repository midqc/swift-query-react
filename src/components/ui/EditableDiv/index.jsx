import React, { useRef, useState } from 'react';
import styles from './EditableDiv.module.css';

export const Editable = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [content, setContent] = useState('');
  const divRef = useRef(null);

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      // Perform your action here
      console.log('Enter key pressed!');
    } else if (event.key === 'Tab') {
      event.preventDefault();
      if (!isExpanded) {
        setIsExpanded(true);
        divRef.current.classList.add(styles.expanded);
      }
    }
  }

  function handleBlur() {
    if (isExpanded) {
      setIsExpanded(false);
      divRef.current.classList.remove(styles.expanded);
    }
  }

  function handleChange(event) {
    setContent(event.target.innerText);
  }

  return (
    <div
      ref={divRef}
      contentEditable
      className={`${styles.editable} ${isExpanded ? styles.expanded : ''}`}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      onInput={handleChange}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
