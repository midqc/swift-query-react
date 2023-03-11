import React, { useState } from 'react';
import EditableDiv from '../ui/EditableDiv';

const SearchBar = () => {
  const [query, setQuery] = useState("");

  const handleTextChange = (text) => {
    setQuery(text);
  };

  const fruits = ["apple", "banana", "orange", "pear", "kiwi", "grape", "pineapple"];
  const countries = ["India", "USA", "China", "Brazil", "Russia", "Australia", "Canada"];
  const animals = ["cat", "dog", "elephant", "lion", "tiger", "panda", "giraffe"];

  const matchList = fruits.concat(countries, animals);

  return (
    <div>
      <EditableDiv defaultValue="Search or -query" onTextChange={handleTextChange} matchList={matchList} />
    </div>
  );
}

export default SearchBar;
