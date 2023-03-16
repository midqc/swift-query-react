import React, { useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

import favicon from '../../assets/favicon.png';
import './Newtab.css';
import './Newtab.scss';

import SearchBar from '../../components/SearchBar';
import useThemeContext from '../../hooks/useThemeContext';
import useLocalStorage from '../../hooks/useLocalStorage';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import Wallpaper from '../../components/ui/Wallpaper';
import ClipboardText from '../../components/ClipboardText';

const Newtab = () => {
  const [theme, setTheme] = useState('default');

  const { isSm, isMd, isLg, isXl, is2xl } = useMediaQuery();

  const divThemeRef = useRef(null);

  return (
    <>
      <Wallpaper
        themeName={theme}
        mode={useThemeContext(divThemeRef.current)}
      />

      <Helmet>
        <meta charSet="utf-8" />
        <title>Swift Tab</title>
        <link rel="icon" type="image/png" href={favicon} />
      </Helmet>

      <div
        className="App font-default-regular overflow-hidden h-screen w-screen"
        ref={divThemeRef}
      >
        <ClipboardText />
        <SearchBar />
      </div>
    </>
  );
};

export default Newtab;
