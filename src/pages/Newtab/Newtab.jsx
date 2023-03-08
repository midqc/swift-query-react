import React from 'react';
import logo from '../../assets/logo-128.png';
import './Newtab.css';
import './Newtab.scss';

const Newtab = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/pages/Newtab/Newtab.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://github.com/midqo"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn about the developer!
        </a>
      </header>
    </div>
  );
};

export default Newtab;
