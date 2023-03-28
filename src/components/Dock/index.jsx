import React from 'react';
import { motion } from 'framer-motion';
import { useMotionVariants } from '../../hooks/useMotionVariants';
import Tooltip from '../Tooltip';

import { NotesIcon, TipsIcon, OptionsIcon, ClipboardIcon, VideoIcon, PluginsIcon, MoreAppsIcon } from '../Icons';

const iconDefaultClass = 'dark:fill-white/60 fill-black/80'

const DockIconContainer = (props) => {
    const {
        springyMotion,
        bouncyMotion,
        slowMotion,
        smoothMotion,
        fastMotion,
        rubberyMotion,
    } = useMotionVariants();

    return (
         <motion.div
            whileTap={{ scale: 0.9, zIndex: 9999 }}
            dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
            dragTransition={{ bounceStiffness: 200, bounceDamping: 20 }}
            dragElastic={0.5}
            whileDrag={{ cursor: "grabbing" }}
            className='h-[62px] w-[62px] p-4 cursor-pointer flex justify-center items-center rounded-[1.3rem] shadow-sm focus:outline-none select-none dark:bg-white/[0.03] bg-black/20'
            transition={{
                type: 'spring',
                restDelta: 0.001,
                ...springyMotion,
            }}
        >
            {props.children}
        </motion.div>
       
    )
}

const GroupIconCLasses = 'col-span-1 row-span-1 text-center transform scale-[0.8]';

const GroupContainer = (props) => {
    return (
        <div class="grid grid-cols-2 grid-rows-2 scale-50 bg-black/10 dark:bg-white/[0.02] rounded-3xl focus:outline-none select-none p-1" style={{ marginLeft: '-18px', marginRight: '-34px', height: '128px', width: '128px' }}>
            {props.children}
        </div>
    )
}

const GroupLayout = (props) => {
    let childrenCount = React.Children.count(props.children);

    if (childrenCount === 2) {
        return (
            <GroupContainer>
                <div class={GroupIconCLasses}>{props.children[0]}</div>
                <div class={GroupIconCLasses}>{props.children[1]}</div>
            </GroupContainer>
        );
    } else if (childrenCount === 3) {
        return (
            <GroupContainer>
                <div class={GroupIconCLasses}>{props.children[0]}</div>
                <div class={GroupIconCLasses}>{props.children[1]}</div>
                <div class={GroupIconCLasses}>{props.children[2]}</div>
            </GroupContainer>
        );
    } else if (childrenCount > 3) {
        return (
            <GroupContainer>
                <div class={GroupIconCLasses}>{props.children[0]}</div>
                <div class={GroupIconCLasses}>{props.children[1]}</div>
                <div class={GroupIconCLasses}>{props.children[2]}</div>
                <div class={GroupIconCLasses}><MoreAppsIcon className="dark:fill-white/5 fill-black/10 p-1" height="64px"></MoreAppsIcon></div>
            </GroupContainer>
        );
    }
}

const DockSeparator = (props) => {
    return (
        <div id='dock-separator' className='h-[62px] w-[2px] shrink-0 dark:bg-white/[0.03] bg-black/10 rounded-full z-50'></div>
    )
}

const Dock = () => {
    const {
        springyMotion,
        bouncyMotion,
        slowMotion,
        smoothMotion,
        fastMotion,
        rubberyMotion,
    } = useMotionVariants();

    return (
        <div className='flex w-screen z-40 h-fit justify-center items-center absolute bottom-[64px]'>
            <motion.div
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{
                    type: 'spring',
                    restDelta: 0.001,
                    ...smoothMotion,
                }}
                id='dock-container' className='flex flex-row h-24 items-center justify-center border-highlight border-[1px] border-black/30 dark:border-white/5 space-x-4 p-4 backdrop-blur-xl rounded-[2.3rem] shadow-lg bg-neutral-100/60 dark:bg-neutral-800/80'>

                <Tooltip
                    tooltipContent={() => (
                        <>
                            <span>Notes</span>
                        </>
                    )}
                >
                    <DockIconContainer ><NotesIcon className={iconDefaultClass} /></DockIconContainer>
                </Tooltip>

                {/* <GroupLayout>
                    <DockIconContainer><VideoIcon className={iconDefaultClass} /></DockIconContainer>
                    <DockIconContainer><TipsIcon className={iconDefaultClass} /></DockIconContainer>
                    <DockIconContainer><ClipboardIcon className={iconDefaultClass} /></DockIconContainer>
                    <DockIconContainer><ClipboardIcon className={iconDefaultClass} /></DockIconContainer>
                </GroupLayout> */}

                <DockSeparator />

                <Tooltip
                    tooltipContent={() => (
                        <>
                            <span>Options</span>
                        </>
                    )}
                >
                        <DockIconContainer><OptionsIcon className={iconDefaultClass} /></DockIconContainer>
                </Tooltip>

                {/* <Tooltip
                        tooltipContent={() => (
                            <>
                                <h3 className='whitespace-nowrap'>Plugins</h3>
                            </>
                        )}
                    >
                        <DockIconContainer><PluginsIcon className={iconDefaultClass} /></DockIconContainer>
                    </Tooltip> */}

            </motion.div>
        </div>
    )
}

export default Dock;