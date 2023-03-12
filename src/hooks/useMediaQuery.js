import { useState, useEffect } from 'react';

export function useMediaQueries() {
  const [isSm, setIsSm] = useState(window.matchMedia('(min-width: 640px)').matches);
  const [isMd, setIsMd] = useState(window.matchMedia('(min-width: 768px)').matches);
  const [isLg, setIsLg] = useState(window.matchMedia('(min-width: 1024px)').matches);
  const [isXl, setIsXl] = useState(window.matchMedia('(min-width: 1280px)').matches);
  const [is2xl, setIs2xl] = useState(window.matchMedia('(min-width: 1536px)').matches);

  const smQuery = window.matchMedia('(min-width: 640px)');
  const mdQuery = window.matchMedia('(min-width: 768px)');
  const lgQuery = window.matchMedia('(min-width: 1024px)');
  const xlQuery = window.matchMedia('(min-width: 1280px)');
  const twxlQuery = window.matchMedia('(min-width: 1536px)');

  useEffect(() => {
    const handleSmQueryChange = (event) => {
      setIsSm(event.matches);
    };
    const handleMdQueryChange = (event) => {
      setIsMd(event.matches);
    };
    const handleLgQueryChange = (event) => {
      setIsLg(event.matches);
    };
    const handleXlQueryChange = (event) => {
      setIsXl(event.matches);
    };
    const handle2xlQueryChange = (event) => {
      setIs2xl(event.matches);
    };

    smQuery.addEventListener('change', handleSmQueryChange);
    mdQuery.addEventListener('change', handleMdQueryChange);
    lgQuery.addEventListener('change', handleLgQueryChange);
    xlQuery.addEventListener('change', handleXlQueryChange);
    twxlQuery.addEventListener('change', handle2xlQueryChange);

    return () => {
      smQuery.removeEventListener('change', handleSmQueryChange);
      mdQuery.removeEventListener('change', handleMdQueryChange);
      lgQuery.removeEventListener('change', handleLgQueryChange);
      xlQuery.removeEventListener('change', handleXlQueryChange);
      twxlQuery.removeEventListener('change', handle2xlQueryChange);
    };
  }, []);

  return {
    isSm,
    isMd,
    isLg,
    isXl,
    is2xl,
  };
}

/* ---------------------------------- usage --------------------------------- */

// import { useMediaQueries } from '../../hooks/useMediaQueries';

// function MyComponent() {
//   const { isSm, isMd, isLg, isXl, is2xl } = useMediaQueries();

//   return (
//     <div>
//       {isSm && <p>Small screen view</p>}
//       {isMd && <p>Medium screen view</p>}
//       {isLg && <p>Large screen view</p>}
//       {isXl && <p>Extra-large screen view</p>}
//       {is2xl && <p>2XL screen view</p>}
//     </div>
//   );
// }