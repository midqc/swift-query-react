export function useMotionVariants(){
    return (
      {
            springyMotion: { stiffness: 300, damping: 20 },
            bouncyMotion: { stiffness: 400, damping: 15 },
            slowMotion: { stiffness: 100, damping: 20 },
            fastMotion: { stiffness: 800, damping: 10 },
            smoothMotion: { stiffness: 200, damping: 30 },
            wobblyMotion: { stiffness: 100, damping: 10 },
            jumpyMotion: { stiffness: 500, damping: 30 },
            elasticMotion: { stiffness: 300, damping: 10 },
            snappyMotion: { stiffness: 700, damping: 20 },
            rubberyMotion: { stiffness: 200, damping: 5 },
          }
    )
}

/* ---------------------------------- usage --------------------------------- */

// import { useMotionVariants } from '../../hooks/useMotionVariants';

// function MyComponent() {
//   const { springyMotion, bouncyMotion, slowMotion, fastMotion, smoothMotion, wobblyMotion, jumpyMotion, elasticMotion, snappyMotion, rubberyMotion } = useMotionVariants();

//   return ();
// }