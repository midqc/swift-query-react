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

const motionVariants = {
  springy: { stiffness: 300, damping: 20 },
  bouncy: { stiffness: 400, damping: 15 },
  slow: { stiffness: 100, damping: 20 },
  fast: { stiffness: 800, damping: 10 },
  smooth: { stiffness: 200, damping: 30 },
  wobbly: { stiffness: 100, damping: 10 },
  jumpy: { stiffness: 500, damping: 30 },
  elastic: { stiffness: 300, damping: 10 },
  snappy: { stiffness: 700, damping: 20 },
  rubbery: { stiffness: 200, damping: 5 },
};

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
      <div ref={divThemeRef} className="font-regular">
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
                ...motionVariants.wobbly
              },
            }}
            whileHover={{
              scale: 1.1,
              transition: {
                duration: 0.5,
                type: 'spring',
                ...motionVariants.wobbly
              },
            }}
            whileTap={{
              scale: 0.9,
              transition: {
                duration: 0.5,
                type: 'spring',
                ...motionVariants.wobbly
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
