import React, { useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';


import logo from '../../assets/logo-128.png';
import favicon from '../../assets/favicon.png';
import './Newtab.css';
import './Newtab.scss';

import SearchBar from '../../components/SearchBar';
import useThemeContext from '../../hooks/useThemeContext';
import useLocalStorage from '../../hooks/useLocalStorage';

const Newtab = () => {

  const divThemeRef = useRef(null);
  useThemeContext(divThemeRef.current);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Swift Tab</title>
        <link rel="icon" type="image/png" href={favicon} />
      </Helmet>
      <div ref={divThemeRef} className="font-pulp-regular">
      <div className="App">
        <header className="App-header">
          <motion.img
            initial={{ y: -20, scale: 0.6 }}
            animate={{
              y: 0,
              scale: 1.0,
              transition: {
                duration: 0.5,
                type: 'spring',
                damping: 8,
                stiffness: 160,
              },
            }}
            whileHover={{
              scale: 1.1,
              transition: {
                duration: 0.5,
                type: 'spring',
                damping: 8,
                stiffness: 160,
              },
            }}
            whileTap={{
              scale: 0.9,
              transition: {
                duration: 0.5,
                type: 'spring',
                damping: 8,
                stiffness: 160,
              },
            }}
            src={logo}
            className="App-logo"
            alt="logo"
          />
          <p className="text-blue-600">
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
        <SearchBar/>
        </div>
    </>
  );
};

export default Newtab;
