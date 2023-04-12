import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

import { useMotionVariants } from '../../hooks/useMotionVariants';

const SmartTooltip = ({ content, children, followCursor }) => {
    const {
        springyMotion,
        bouncyMotion,
        slowMotion,
        smoothMotion,
        fastMotion,
        rubberyMotion,
    } = useMotionVariants();

    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const parentRef = useRef(null);
    const tooltipRef = useRef(null);

    const onMouseMove = (e) => {
        if (parentRef.current && tooltipRef.current) {
            const rect = parentRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const tooltipRect = tooltipRef.current.getBoundingClientRect();
            const tooltipX = x + 20;
            const tooltipY = y + 20;

            const maxX = window.innerWidth - tooltipRect.width - 10;
            const maxY = window.innerHeight - tooltipRect.height - 10;

            setTooltipPosition({
                x: Math.min(tooltipX, maxX),
                y: Math.min(tooltipY, maxY),
            });
        }
    };

    const onMouseEnter = () => {
        setShowTooltip(true);
    };

    const onMouseLeave = () => {
        setShowTooltip(false);
    };

    const tooltipVariants = {
        hidden: { opacity: 0, scale: 0.6 },
        visible: { opacity: 1, scale: 1 },
    };

    return (
        <div style={{ position: 'relative', zIndex: 999999999 }} ref={parentRef} onMouseMove={followCursor ? onMouseMove : null} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            {children}
            {showTooltip && (
                <motion.div
                    layout="position"
                    className="tooltip"
                    style={{ position: 'absolute', left: tooltipPosition.x, top: tooltipPosition.y }}
                    initial="hidden"
                    animate="visible"
                    variants={tooltipVariants}
                    exit="hidden"
                    transition={{ type: "spring", restDelta: 0.001, ...smoothMotion }}
                    ref={tooltipRef}
                >
                    {content}
                </motion.div>
            )}
        </div>
    );
};

export default SmartTooltip;
