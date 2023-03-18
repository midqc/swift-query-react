export function useMotionVariants(){
    return (
      {
            springyMotion: { stiffness: 400, damping: 15 },
            bouncyMotion: { stiffness: 600, damping: 6 },
            slowMotion: { stiffness: 200, damping: 60 },
            smoothMotion: { stiffness: 400, damping: 50 },
            fastMotion: { stiffness: 400, damping: 20 },
            rubberyMotion: { stiffness: 400, damping: 12 },
          }
    )
}

/* ---------------------------------- usage --------------------------------- */

// import { useMotionVariants } from '../../hooks/useMotionVariants';

// function MyComponent() {
  // const { springyMotion, bouncyMotion, slowMotion, smoothMotion, fastMotion, rubberyMotion } = useMotionVariants();

//   return ();
// }