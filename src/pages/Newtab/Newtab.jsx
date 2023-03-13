import React, { useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

import favicon from '../../assets/favicon.png';
import './Newtab.css';
import './Newtab.scss';

import SearchBar from '../../components/SearchBar';
import useThemeContext from '../../hooks/useThemeContext';
import useLocalStorage from '../../hooks/useLocalStorage';
import { useMediaQueries } from '../../hooks/useMediaQuery';
import { useMotionVariants } from '../../hooks/useMotionVariants';
import Wallpaper from '../../components/ui/Wallpaper';
import ClipboardText from '../../components/ClipboardText';

const Newtab = () => {
  const [theme, setTheme] = useState('default');

  const { isSm, isMd, isLg, isXl, is2xl } = useMediaQueries();

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
        <SearchBar />
        {/* {isSm && <p>Small screen view</p>}
      {isMd && <p>Medium screen view</p>}
      {isLg && <p>Large screen view</p>}
      {isXl && <p>Extra-large screen view</p>}
      {is2xl && <p>2XL screen view</p>} */}
        <ClipboardText />
      </div>
    </>
  );
};

export default Newtab;
