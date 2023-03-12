import React, { useEffect } from 'react';
import "./Wallpaper.module.css"

const defaultBgLight = "default-light.svg";
const defaultBgDark = "default-dark.svg";

const hackerBgLight ="hacker-light.svg";
const hackerBgDark = "hacker-dark.svg";

const waveBgLight = "wave-light.svg";
const waveBgDark = "wave-dark.svg";

const imageBgLight = "";
const imageBgDark = "";

const themes = {
  default: {
    light: {
      bgColor: '#e0e0e0',
      bgImg: defaultBgLight,
    },
    dark: {
      bgColor: '#212121',
      bgImg: defaultBgDark,
    },
  },
  hacker: {
    light: {
      bgColor: '#dcedc8',
      bgImg: hackerBgLight,
    },
    dark: {
      bgColor: '#222420',
      bgImg: hackerBgDark,
    },
  },
  wave: {
    light: {
      bgColor: '#bbdefb',
      bgImg: waveBgLight,
    },
    dark: {
      bgColor: '#212225',
      bgImg: waveBgDark,
    },
  },
  image: {
    light: {
      bgColor: '#e0e0e0',
      bgImg: imageBgLight,
    },
    dark: {
      bgColor: '#212121',
      bgImg: imageBgDark,
    },
  },
};

const Wallpaper = ({ themeName, mode}) => {
  const theme = themeName && themes[themeName] ? themes[themeName] : themes.default;

  useEffect(() => {
    document.body.style.backgroundColor = mode === 'dark' ? theme.dark.bgColor : theme.light.bgColor;
    document.body.style.backgroundImage = `url(${mode === 'dark' ? theme.dark.bgImg : theme.light.bgImg})`;
    document.body.style.backgroundRepeat = 'repeat-x';
    document.body.style.backgroundSize = 'auto 100vh';
    document.body.style.backgroundPosition = 'center';

    return () => {
      document.body.style.backgroundColor = null;
      document.body.style.backgroundImage = null;
      document.body.style.backgroundRepeat = null;
      document.body.style.backgroundSize = null;
      document.body.style.backgroundPosition = null;
    };
  }, [themeName, mode, theme]);

  return null;
};

export default Wallpaper;
