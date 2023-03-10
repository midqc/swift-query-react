import { useState, useEffect } from 'react';

const useLocalStorage = (key, initialValue, limit) => {
  const [value, setValue] = useState(() => {
    const storedValue = JSON.parse(localStorage.getItem(key));
    if (storedValue) {
      return storedValue;
    } else {
      if (Array.isArray(initialValue)) {
        const limitedValue = initialValue.slice(0, limit || initialValue.length);
        const indexedValue = limitedValue.reduce((acc, item) => {
          acc[item.id] = item;
          return acc;
        }, {});
        localStorage.setItem(key, JSON.stringify(indexedValue));
        return indexedValue;
      } else {
        localStorage.setItem(key, JSON.stringify(initialValue));
        return initialValue;
      }
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  const setLocalValue = (newValue) => {
    if (Array.isArray(newValue)) {
      const limitedValue = newValue.slice(0, limit || newValue.length);
      const indexedValue = limitedValue.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {});
      setValue((prevValue) => ({ ...prevValue, ...indexedValue }));
      localStorage.setItem(key, JSON.stringify({ ...value, ...indexedValue }));
    } else {
      setValue((prevValue) => ({ ...prevValue, ...newValue }));
      localStorage.setItem(key, JSON.stringify({ ...value, ...newValue }));
    }
  };

  const removeLocalValue = (id) => {
    setValue((prevValue) => {
      const newValue = { ...prevValue };
      delete newValue[id];
      return newValue;
    });
    localStorage.setItem(key, JSON.stringify({ ...value }));
  };

  const clearLocalValue = () => {
    setValue(() => {
      if (Array.isArray(initialValue)) {
        const limitedValue = initialValue.slice(0, limit || initialValue.length);
        const indexedValue = limitedValue.reduce((acc, item) => {
          acc[item.id] = item;
          return acc;
        }, {});
        localStorage.setItem(key, JSON.stringify(indexedValue));
        return indexedValue;
      } else {
        localStorage.setItem(key, JSON.stringify(initialValue));
        return initialValue;
      }
    });
  };

  const setMutableValue = (newValue) => {
    setValue((prevValue) => ({ ...prevValue, ...newValue }));
    localStorage.setItem(key, JSON.stringify({ ...value, ...newValue }));
  };

  const setImmutableValue = (newValue) => {
    setValue(() => {
      if (Array.isArray(newValue)) {
        const limitedValue = newValue.slice(0, limit || newValue.length);
        const indexedValue = limitedValue.reduce((acc, item) => {
          acc[item.id] = item;
          return acc;
        }, {});
        localStorage.setItem(key, JSON.stringify(indexedValue));
        return indexedValue;
      } else {
        localStorage.setItem(key, JSON.stringify(newValue));
        return newValue;
      }
    });
  };

  return [value, setLocalValue, removeLocalValue, clearLocalValue, setMutableValue, setImmutableValue];
}

export default useLocalStorage;