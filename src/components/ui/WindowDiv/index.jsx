import React, { useEffect, useState } from "react";
import { motion, MotionConfig, AnimatePresence } from "framer-motion";
import { useMotionVariants } from "../../../hooks/useMotionVariants";

import { CrossIcon } from "../../Icons";

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

    return (
        <>
            <AnimatePresence>
                {isVisible && (
                    <div className="absolute h-screen w-screen flex flex-row top-0 left-0 justify-center items-center">
                        <motion.div
                            initial={{ scale: 0.2, translateY: '60%', zIndex: windowIndex }}
                            animate={{ scale: 1, translateY: '0', zIndex: windowIndex }}
                            exit={{ scale: 0.95, opacity: 0, display: 'none', transition: { type: "spring", restDelta: 0.001, ...smoothMotion, display: { delay: 0.15 }, } }}
                            transition={{
                                type: "spring",
                                restDelta: 0.001,
                                ...smoothMotion,
                            }}
                            className='border-highlight border-[1px] outline-none p-4 border-black/20 dark:border-white/5 bg-neutral-100 dark:bg-neutral-800 rounded-3xl mb-[188px] m-[28px] w-[-webkit-fill-available] h-[-webkit-fill-available] max-w-5xl shadow-xl'
                        >
                            {children}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}

export default WindowDiv;
