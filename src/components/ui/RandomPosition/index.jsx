import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const MAX_TOP = window.innerHeight - 100; // subtract element height
const MAX_LEFT = window.innerWidth - 100; // subtract element width
const MARGIN = 40; // margin when elements overlap
const DELAY = 0; // delay between element animations

const ObstacleContext = React.createContext([]);

const RandomPosition = ({ children, saveEnabled, groupName }) => {
    const [positions, setPositions] = useState([]);
    const [obstacleIds, setObstacleIds] = useState([]);
    const obstacles = React.useContext(ObstacleContext);

    const getPosition = () => {
        let left = Math.random() * (MAX_LEFT - MARGIN); // subtract MARGIN to prevent going out of the body in the right
        let top = Math.random() * (MAX_TOP - MARGIN); // subtract MARGIN to prevent going out of the body in the bottom
        const overlapsObstacle = obstacleIds.some((id) => {
            const obstacle = obstacles.find((o) => o.id === id);
            return (
                obstacle &&
                left + MARGIN < obstacle.right &&
                left + 100 - MARGIN > obstacle.left &&
                top + MARGIN < obstacle.bottom &&
                top + 100 - MARGIN > obstacle.top
            );
        });
        if (overlapsObstacle) {
            if (top < MAX_TOP / 2) {
                top = 0;
            } else {
                top = MAX_TOP - 100 - MARGIN; // subtract MARGIN to prevent going out of the body in the bottom
            }
            if (left < MAX_LEFT / 2) {
                left = 0;
            } else {
                left = MAX_LEFT - 100 - MARGIN; // subtract MARGIN to prevent going out of the body in the right
            }
        }
        return { left, top };
    };


    const handleSave = (content, { left, top }) => {
        if (!saveEnabled) return;
        const savedPositions = JSON.parse(localStorage.getItem('positions')) || {};
        const group = savedPositions[groupName] || [];
        group.push({ content, left, top });
        savedPositions[groupName] = group;
        localStorage.setItem('positions', JSON.stringify(savedPositions));
    };

    const getObstacles = () => {
        const obstacleRects = obstacles.map((o) => {
            const rect = document.getElementById(o.id).getBoundingClientRect();
            return {
                id: o.id,
                left: rect.left,
                right: rect.right,
                top: rect.top,
                bottom: rect.bottom,
            };
        });
        setObstacleIds(obstacleRects.map((o) => o.id));
        return obstacleRects;
    };

    useEffect(() => {
        const interval = setInterval(() => {
            const newPosition = getPosition();
            setPositions((p) => [...p, newPosition]);
        }, DELAY);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        getObstacles();
        window.addEventListener('resize', getObstacles);
        return () => window.removeEventListener('resize', getObstacles);
    }, [obstacles]);

    return (
        <>
            {React.Children.map(children, (child, i) => {
                const position = positions[i] || {};
                return (
                    <motion.div
                        key={`${groupName}-${i}`} // add a key prop
                        style={{ ...child.props.style, position: 'absolute', ...position }}
                        initial={{ zIndex: 0 }}
                        whileHover={{ zIndex: 999 }}
                    >
                        {React.cloneElement(child, {
                            onSave: (content) => handleSave(content, position),
                        })}
                    </motion.div>
                );
            })}
        </>
    );
};

export default RandomPosition;
