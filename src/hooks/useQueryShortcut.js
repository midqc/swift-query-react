import { useState, useEffect } from 'react';
import useLocalStorage from "/useLocalStorage";

const defaultShortcuts = [
    {
      name: "-goo",
      url: "https://www.google.com/search?q=",
      info: "search google",
    },
    { name: "-google", url: "https://www.google.com/search?q=", info: "search" },
    { name: "-bing", url: "https://www.bing.com/search?q=", info: "search" },
    {
      name: "-duck",
      url: "https://duckduckgo.com/?q=",
      info: "search duckduckgo",
    },
    {
      name: "-gmail",
      url: "https://mail.google.com/mail/u/0/#search/",
      info: "search google mail",
    },
    {
      name: "-gml",
      url: "https://mail.google.com/mail/u/0/#search/",
      info: "search google mail",
    },
    { name: "-yahoo", url: "https://search.yahoo.com/search?p=", info: "search" },
    {
      name: "-yt",
      url: "https://www.youtube.com/results?search_query=",
      info: "search youtube",
    },
    {
      name: "-ytm",
      url: "https://music.youtube.com/search?q=",
      info: "search youtube music",
    },
    { name: "-amz", url: "https://www.amazon.com/s?k=", info: "search amazon" },
    {
      name: "-img",
      url: "https://www.google.com/search?tbm=isch&q=",
      info: "search images",
    },
    {
      name: "-drive",
      url: "https://drive.google.com/drive/u/0/search?q=",
      info: "search google drive",
    },
    { name: "-all", url: "", info: "google, bing & youtube" },
  ];

  const useShortcuts = () => {
    const [shortcuts, setShortcuts, removeShortcuts, clearShortcuts, setMutableShortcuts, setImmutableShortcuts] = useLocalStorage(
      'shortcuts',
      defaultShortcuts
    );
  
    const allShortcuts = shortcuts.filter((shortcut) => shortcut.name !== '-all');
  
    const resetShortcuts = () => {
      setMutableShortcuts(defaultShortcuts);
    };
  
    const handleShortcut = (input, newTab = false) => {
      const shortcut = shortcuts.find((s) => input.startsWith(s.name));
      if (shortcut) {
        const query = input.replace(shortcut.name, '').trim();
        let urls = '';
        if (shortcut.name === '-all') {
          allShortcuts.forEach((s) => {
            urls += s.url + encodeURIComponent(query) + '&';
          });
          urls = urls.slice(0, -1);
        } else {
          urls = shortcut.url + encodeURIComponent(query);
        }
        if (newTab) {
          window.open(urls, '_blank');
        } else {
          window.location.href = urls;
        }
      }
    };
  
    return [shortcuts, handleShortcut, resetShortcuts, allShortcuts];
  };
  
  export default useShortcuts;