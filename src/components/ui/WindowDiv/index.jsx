import React, { useEffect, useState, useRef } from "react";
import { motion, MotionConfig, AnimatePresence, useDragControls } from "framer-motion";
import { useMotionVariants } from "../../../hooks/useMotionVariants";

const WindowDiv = ({ children, windowVisible, windowIndex }) => {

    const {
        springyMotion,
        bouncyMotion,
        slowMotion,
        smoothMotion,
        fastMotion,
        rubberyMotion,
    } = useMotionVariants();

    const [isVisible, setIsVisible] = useState(windowVisible);

    useEffect(() => {
        setIsVisible(windowVisible);
    }, [windowVisible])

    const controls = useDragControls()

    const [isDragging, setIsDragging] = useState({})

    function startDrag(event) {
        if (event) {
          controls.start(event)
        }
      }      

    return (
        <>
            <AnimatePresence>
                {isVisible && (
                    <div className="absolute h-screen w-screen flex flex-row top-0 left-0 justify-center items-center">
                        <motion.div
                            initial={{ scale: 0.2, translateY: '60%', zIndex: windowIndex }}
                            animate={{ scale: 1, translateY: '0', zIndex: windowIndex }}
                            exit={{ scale: 0.95, opacity: 0, display: 'none', transition: { type: "spring", restDelta: 0.001, ...smoothMotion, display: { delay: 0.15 }, } }}
                            drag={isDragging}
                            dragControls={controls}
                            whileDrag={{ scale: 1.01 }}
                            transition={{
                                type: "spring",
                                restDelta: 0.001,
                                ...smoothMotion,
                            }}
                            dragConstraints={{ left: -1000, right: 1000, top: -400, bottom: 600 }}
                            className='border-highlight overflow-hidden border-[1px] outline-none p-4 border-black/20 dark:border-white/5 bg-neutral-100 dark:bg-neutral-800 rounded-3xl mb-[188px] m-[28px] w-[-webkit-fill-available] h-[-webkit-fill-available] max-h-[48rem] max-w-5xl shadow-xl'
                        >
                            <motion.div onMouseDown={(e) => startDrag(e) & setIsDragging(true)}
                                onMouseUp={() => setIsDragging(false)}
                                whileHover={{ cursor: "grab" }}
                                whileTap={{ cursor: "grabbing" }}
                                className="h-full w-full absolute top-0 left-0 bg-transparent z-[-9]"></motion.div>

                            {children}

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}

export default WindowDiv;
