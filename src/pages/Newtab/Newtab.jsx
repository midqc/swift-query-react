import React, { useRef, useState, lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

import favicon from '../../assets/favicon.png';
import './Newtab.css';
import './Newtab.scss';

import useThemeContext from '../../hooks/useThemeContext';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import Wallpaper from '../../components/ui/Wallpaper';

import { useMotionVariants } from '../../hooks/useMotionVariants';

import { ClipboardProvider } from '../../context/globalContext';

const LazyClipboard = lazy(() => import('../../components/Clipboard'));
const LazySearchBar = lazy(() => import('../../components/SearchBar'));
const LazyDock = lazy(() => import('../../components/Dock'));


const withDelay = (Component, delay) => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = { showComponent: false };
      setTimeout(() => {
        this.setState({ showComponent: true });
      }, delay);
    }

    render() {
      return this.state.showComponent ? <Component {...this.props} /> : null;
    }
  };
};

const Newtab = (props) => {
  const {
    springyMotion,
    bouncyMotion,
    slowMotion,
    smoothMotion,
    fastMotion,
    rubberyMotion,
  } = useMotionVariants();

  const [theme, setTheme] = useState('default');
  const [currentClipboardText, updateClipboardText] = useState('');

  const divThemeRef = useRef(null);

  const { isSm, isMd, isLg, isXl, is2xl } = useMediaQuery();

  const DelayedClipboard = withDelay(LazyClipboard, 600);
  const DelayedSearchBar = withDelay(LazySearchBar, 0);
  const DelayedDock = withDelay(LazyDock, 300);

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
        <div className='opacity-10 dark:opacity-40' style={{ height: '120vh', width: '320vw', mixBlendMode: 'multiply', zIndex: '-9999', position: 'absolute', top: '0', left: '0', filter: 'grayscale(100%)' }}>
          <svg
            viewBox="0 0 1010 666"
            xmlns='http://www.w3.org/2000/svg'>

            <filter id='noiseFilter'>
              <feTurbulence
                type='fractalNoise'
                baseFrequency='3.2'
                numOctaves='3'
                stitchTiles='stitch' />
            </filter>

            <rect
              width='100%'
              height='100%'
              filter='url(#noiseFilter)' />
          </svg>
        </div>
        <Suspense fallback={<div></div>}>
          <ClipboardProvider value={{ currentClipboardText, updateClipboardText }}>
            <DelayedDock />
            <DelayedClipboard />
            <DelayedSearchBar />
          </ClipboardProvider>
        </Suspense>
      </div>
    </>
  );
};

export default Newtab;
