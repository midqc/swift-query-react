import { useState, useEffect } from 'react';

const useThemeContext = (element) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (event) => {
      const newTheme = event.matches ? 'dark' : 'light';
      setTheme(newTheme);
      if (element) {
        element.classList.toggle('dark', newTheme === 'dark');
      }
    };

    handleChange(darkQuery);
    const listener = (event) => handleChange(event);
    darkQuery.addEventListener('change', listener);

    return () => darkQuery.removeEventListener('change', listener);
  }, [element]);

  return theme;
}

export default useThemeContext;