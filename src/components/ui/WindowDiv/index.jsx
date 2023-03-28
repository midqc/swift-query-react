import React from "react";
import { motion, MotionConfig } from "framer-motion";
import { useMotionVariants } from "../../../hooks/useMotionVariants";

const WindowDiv = (props) => {

    const {
        springyMotion,
        bouncyMotion,
        slowMotion,
        smoothMotion,
        fastMotion,
        rubberyMotion,
      } = useMotionVariants();
    
    return (
        <motion.div></motion.div>
    )
} 

export default WindowDiv;