import React, { useState, useContext, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useMotionVariants } from '../../hooks/useMotionVariants';
import Tooltip from '../Tooltip';

import './index.css'

import WindowDiv from '../../components/ui/WindowDiv';
import { ClipboardContext } from '../../context/globalContext';

import { NotesIcon, TipsIcon, OptionsIcon, ClipboardIcon, VideoIcon, PluginsIcon, MoreAppsIcon, CrossIcon, PinIcon, TrashIcon } from '../Icons';

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
            className='h-[62px] w-[62px] p-4 scale-[1.2rem] cursor-pointer flex justify-center items-center rounded-[1.3rem] shadow-sm focus:outline-none select-none dark:bg-white/[0.03] bg-black/20'
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

    const [text1, setText1] = useState('');
    const [text2, setText2] = useState('');
    const [similarity, setSimilarity] = useState(0);
    const [differences, setDifferences] = useState([]);

    const compareTexts = () => {
        let longerText = text1.length >= text2.length ? text1 : text2;
        let shorterText = text1.length < text2.length ? text1 : text2;

        let maxLength = Math.max(text1.length, text2.length);
        let errors = [];

        let index = 0;
        let startIndex = -1;
        let endIndex = -1;

        for (let i = 0; i < maxLength; i++) {
            if (longerText[i] !== shorterText[i - index]) {
                if (startIndex === -1) {
                    startIndex = i;
                }
                endIndex = i;
                index++;
            } else {
                if (startIndex !== -1) {
                    errors.push({
                        startIndex,
                        endIndex
                    });
                    startIndex = -1;
                    endIndex = -1;
                }
            }
        }

        if (startIndex !== -1) {
            errors.push({
                startIndex,
                endIndex: maxLength - 1
            });
        }

        let differenceTexts = errors.map((error) => {
            return {
                text1: text1.slice(error.startIndex, error.endIndex + 1),
                text2: text2.slice(error.startIndex, error.endIndex + 1),
            };
        });

        let similarityScore = (1 - (errors.length / maxLength)) * 100;

        setSimilarity(similarityScore);
        setDifferences(differenceTexts);
    };

    const handleTextChange = (e, setText) => {
        setText(e.target.value);
    };

    const [isNotesVisible, setIsNotesVisible] = useState(false);
    const [isOptionsVisible, setIsOptionsVisible] = useState(false);
    const [isClipboardVisible, setIsClipboardVisible] = useState(false);

    const [isNotesPinned, setIsNotesPinned] = useState(false);
    const [isClipboardPinned, setIsClipboardPinned] = useState(false);

    const { currentClipboardText, clipboardTextHistory, updateClipboardText, deleteClipboardTextHistory } = useContext(ClipboardContext);

    const handleClipboardChange = (event) => {
        const preDivRef = event.target;
        const innerText = preDivRef.innerText;
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const start = range.startOffset;
        const end = range.endOffset;
        if (currentClipboardText !== innerText) {
          updateClipboardText(innerText);
          navigator.clipboard.writeText(innerText).then(() => {
            preDivRef.innerText = innerText;
            if (start <= preDivRef.textContent.length) {
              range.setStart(preDivRef.firstChild, start);
            }
            if (end <= preDivRef.textContent.length) {
              range.setEnd(preDivRef.firstChild, end);
            }
            selection.removeAllRanges();
            selection.addRange(range);
          });
        }
      };      
      

    const [isCurrentWindow, setIsCurrentWindow] = useState('');

    useEffect(() => {
        if (isCurrentWindow !== 'notes') {
            !isNotesPinned ? setIsNotesVisible(false) : setIsNotesVisible(true);
        }
        if (isCurrentWindow !== 'clipboard') {
            !isClipboardPinned ? setIsClipboardVisible(false) : setIsClipboardVisible(true);
        }
        if (isCurrentWindow !== 'options') {
            setIsOptionsVisible(false);
        }
    }, [isCurrentWindow])

    const rootRef = useRef(null);

    useEffect(() => {
        function handleKeyPress(event) {
            if (event.keyCode === 27) {
                // Do something when Escape key is pressed
                isNotesPinned === false && isNotesVisible === true ? setIsNotesVisible(false) : isNotesPinned === true ? setIsNotesVisible(true) : setIsNotesVisible(false);
                isClipboardPinned === false && isClipboardVisible === true ? setIsClipboardVisible(false) : isClipboardPinned === true ? setIsClipboardVisible(true) : setIsClipboardVisible(false);
                isOptionsVisible === true ? setIsOptionsVisible(false) : setIsOptionsVisible(false);
            }
        }

        const rootElement = rootRef.current;
        rootElement.addEventListener('keydown', handleKeyPress);

        return () => {
            rootElement.removeEventListener('keydown', handleKeyPress);
        };
    }, [isNotesPinned, isClipboardPinned]);

    const handleDownloadClick = (textInput, fileExtension = '.txt', preFileName = '') => {
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        let text = textInput;
        let cleanedFileName = preFileName.replace(/[?\/\\*<>|"]/g, ''); // removes unwanted characters
        let preName = (cleanedFileName.trim().length === 0 ? text.trim().substring(0, 12) + '... ' : cleanedFileName);

        const filename = preName + formattedDate + ' (Swift Query)' + fileExtension;

        const blob = new Blob([text], { type: "text/plain" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    const detectTextType = (text) => {
        let fileExtension = [];

        if (/function\s*\(|var\s+\w+\s*=|const\s+\w+\s*=|let\s+\w+\s*=/.test(text)) {
            fileExtension.push('.js');
        }
        if (/def\s+\w+\s*\(|\bimport\s+\w+|\bfrom\s+\w+\s+import\b/.test(text)) {
            fileExtension.push('.py');
        }
        if (/^\s*(#include\s*<\w+\.h>|#include\s*"\w+\.h")|\bint\s+\w+\s*\(|\bfloat\s+\w+\s*\(|\bdouble\s+\w+\s*\(|\bvoid\s+\w+\s*\(/.test(text)) {
            fileExtension.push('.c++');
        }
        if (/^[\w\s,]+(?:\r?\n[\w\s,]+)*\r?$/.test(text)) {
            fileExtension.push('.csv');
        }
        if (/<svg[\s\S]*<\/svg>/.test(text)) {
            fileExtension.push('.svg');
        }
        if (/<html[\s\S]*?>(<!DOCTYPE[\s\S]*?>)?[\s\S]*?<\/html>/.test(text)) {
            fileExtension.push('.html');
        }
        if (/^\s*(\/\*([\s\S]*?)\*\/)?\s*(\.[a-zA-Z][a-zA-Z0-9_-]*|\#[a-zA-Z][a-zA-Z0-9_-]*)\s*\{[\s\S]*?\}/.test(text)) {
            fileExtension.push('.css');
        }
        if (/using\s+\w+\s*;|public\s+class\s+\w+\s*{|private\s+class\s+\w+\s*{|static\s+void\s+\w+\s*\(|\bint\s+\w+\s*=|\bstring\s+\w+\s*=|\bfloat\s+\w+\s*=|\bdouble\s+\w+\s*=/.test(text)) {
            fileExtension.push('.cs');
        }
        if (/^\s*#include\s*<\w+\.h>|\s*#include\s*"\w+\.h"|int\s+\w+\s*\(|float\s+\w+\s*\(|double\s+\w+\s*\(|void\s+\w+\s*\(/.test(text)) {
            fileExtension.push('.c');
        }
        if (/package\s+\w+|\bfunc\s+\w+\s*\(/.test(text)) {
            fileExtension.push('.go');
        }
        if (/CREATE\s+(TABLE|DATABASE|INDEX)|SELECT\s+\*?\s+FROM|INSERT\s+INTO/.test(text)) {
            fileExtension.push('.sql');
        }
        if (/\<\?php|\$[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*\s*=|\becho\s+('|")/.test(text)) {
            fileExtension.push('.php');
        }
        if (/fn\s+\w+\s*\(|let\s+\w+\s*=|use\s+\w+::|\bmatch\s+/.test(text)) {
            fileExtension.push('.rs');
        }
        if (/^\s*<\?xml\s+version=["'][^"']*["']\s+encoding=["'][^"']*["']\s*\?>/.test(text)) {
            fileExtension.push('.xml');
        }
        if (/^\s*\{[\s\S]*"\w+"\s*:/.test(text)) {
            fileExtension.push('.json');
        }
        if (/^@echo off|echo[^(]|\bset\s+\w+=|\bif\s+[not]*\s*exist\b|\bfor\s+\w+\s+in\s+\([^\)]+\)\s+do|\bgoto\s+\w+/.test(text)) {
            fileExtension.push('.bat');
        }
        if (/^function\s|\$[\w\d]+\s*=|Write-Output\b|Write-Host\b|\bImport-Module\b/.test(text)) {
            fileExtension.push('.ps1');
        }
        if (text.startsWith('#!/bin/bash') || text.startsWith('#!/bin/sh')) {
            fileExtension.push('.sh');
        }
        if (/^\s*\[\w+]\s*$|^\s*\w+\s*=.*/m.test(text)) {
            fileExtension.push('.toml');
        }
        if (/^\s*[\w-]+:\s+.*/m.test(text)) {
            fileExtension.push('.yaml');
        }
        if (/^#*\s+.*/m.test(text)) {
            fileExtension.push('.md');
        }
        if (/^FROM\s+[\w\d\/\.-]+/.test(text)) {
            fileExtension.push('.dockerfile');
        }
        if (/^[\s\S]*# In\[\d+\]:/.test(text)) {
            fileExtension.push('.ipynb');
        }
        if (/^library\(/.test(text) || /^require\(/.test(text)) {
            fileExtension.push('.R');
        }

        return fileExtension
    }

    const preDivRef = useRef(null);

    function handleClipboardDrop(event) {
        event.preventDefault();

        const text = event.dataTransfer.getData("text/plain");
        const preDiv = preDivRef.current;

        if (preDiv) {
            const selection = window.getSelection();

            if (selection.rangeCount === 0) {
                const range = document.createRange();
                range.setStart(preDiv, preDiv.childNodes.length);
                range.setEnd(preDiv, preDiv.childNodes.length);
                selection.removeAllRanges();
                selection.addRange(range);
            }

            const range = selection.getRangeAt(0);

            const textNode = document.createTextNode(text);
            const markerNode = document.createTextNode("");
            const insertNode = document.createElement("span");
            insertNode.appendChild(textNode);
            insertNode.appendChild(markerNode);

            range.insertNode(insertNode);

            const newRange = document.createRange();
            newRange.setStart(insertNode.childNodes[0], 0);
            newRange.setEnd(markerNode, 0);
            selection.removeAllRanges();
            selection.addRange(newRange);
        }
    }

    function handleClipboardPaste(event) {
        event.handleClipboardChange();
    }

    useEffect(() => {
        const divRef = preDivRef.current;
        if (divRef) {
            divRef.addEventListener('paste', handleClipboardPaste);
            return () => {
                divRef.removeEventListener('paste', handleClipboardPaste);
            };
        }
    }, [preDivRef]);

    return (
        <>
            <div ref={rootRef} className='flex w-screen z-40 h-fit justify-center items-center absolute bottom-[64px] ' style={{ pointerEvents: 'none' }}>
                <motion.div
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{
                        type: 'spring',
                        restDelta: 0.001,
                        ...smoothMotion,
                    }}
                    id='dock-container' className='flex flex-row h-24 items-center justify-center border-highlight border-[1px] border-black/20 dark:border-white/5 space-x-4 p-4 backdrop-blur-xl rounded-[2.3rem] shadow-lg bg-neutral-100/60 dark:bg-neutral-800/80' style={{ pointerEvents: 'auto' }}>

                    <div onClick={() => !isNotesPinned ? setIsNotesVisible(!isNotesVisible) & setIsCurrentWindow('notes') : setIsCurrentWindow('notes')}>
                        <Tooltip
                            tooltipContent={() => (
                                <>
                                    <span>Notes</span>
                                </>
                            )}
                        >
                            <DockIconContainer><NotesIcon className={iconDefaultClass} /></DockIconContainer>
                        </Tooltip>
                    </div>

                    <div onClick={() => !isClipboardPinned ? setIsClipboardVisible(!isClipboardVisible) & setIsCurrentWindow('clipboard') : setIsCurrentWindow('clipboard')} onDragOver={(event) => {
                        event.preventDefault();
                    }}
                        onDrop={(event) => {
                            const text = event.dataTransfer.getData("text/plain");
                            updateClipboardText(text);
                            navigator.clipboard.writeText(text);
                            setIsClipboardVisible(true)
                        }}>
                        <Tooltip
                            tooltipContent={() => (
                                <>
                                    <span>Clipboard</span>
                                </>
                            )}
                        >
                            <DockIconContainer><ClipboardIcon className={iconDefaultClass} /></DockIconContainer>
                        </Tooltip>
                    </div>

                    {/* <div>
                        <Tooltip
                            tooltipContent={() => (
                                <>
                                    <span>Tips</span>
                                </>
                            )}
                        >
                            <DockIconContainer><TipsIcon className={iconDefaultClass} /></DockIconContainer>
                        </Tooltip>
                    </div> */}

                    {/* <GroupLayout>
                    <DockIconContainer><VideoIcon className={iconDefaultClass} /></DockIconContainer>
                    <DockIconContainer><TipsIcon className={iconDefaultClass} /></DockIconContainer>
                    <DockIconContainer><ClipboardIcon className={iconDefaultClass} /></DockIconContainer>
                    <DockIconContainer><ClipboardIcon className={iconDefaultClass} /></DockIconContainer>
                </GroupLayout> */}

                    <DockSeparator />

                    <div onClick={() => setIsOptionsVisible(!isOptionsVisible) & setIsCurrentWindow('options')} className='flex flex-col justify-center items-center'>
                        <Tooltip
                            tooltipContent={() => (
                                <>
                                    <span>Options</span>
                                </>
                            )}
                        >
                            <DockIconContainer><OptionsIcon className={iconDefaultClass} /></DockIconContainer>
                        </Tooltip>
                    </div>

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

            <WindowDiv windowVisible={isNotesVisible ? true : false} windowIndex={isCurrentWindow === 'notes' ? 999 : (isNotesVisible && !isNotesPinned ? 99 : 9)}>
                <div className='flex flex-row items-center justify-between'>
                    <span className='text-2xl text-neutral-600 dark:text-neutral-400 flex flex-row w-fit items-center justify-center select-none bottom-0 font-default-light'>
                        <NotesIcon height='24px' className='fill-neutral-600 dark:fill-neutral-400 mr-4' />Notes
                        <motion.div
                            whileTap={{ scale: 0.8 }}
                            transition={{
                                type: "spring",
                                restDelta: 0.001,
                                ...smoothMotion,
                            }}
                            onClick={() => setIsNotesPinned(!isNotesPinned)}
                            className='h-[32px] ml-4 px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 cursor-pointer outline-none flex flex-row justify-center items-center text-lg text-neutral-600 dark:text-neutral-400 select-none'>
                            <motion.div transition={{ type: "spring", restDelta: 0.001, ...smoothMotion, }} animate={isNotesPinned ? { rotate: 45, marginTop: '0.5rem', marginRight: '0.3rem' } : { rotate: 0 }}><PinIcon height="16px" className='fill-neutral-600 dark:fill-neutral-400 mr-2' /></motion.div>
                            <span>{isNotesPinned ? 'Unpin' : 'Pin'}</span>
                        </motion.div>
                    </span>
                    {/* <motion.div
                            whileTap={{ scale: 0.8 }}
                            transition={{
                                type: "spring",
                                restDelta: 0.001,
                                ...smoothMotion,
                            }}
                            className='h-[32px] px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 cursor-pointer outline-none flex flex-row justify-center items-center text-lg text-neutral-600 dark:text-neutral-400 select-none'>
                            <PinIcon height="auto" className='fill-neutral-600 dark:fill-neutral-400 mr-2' />
                            <span>Pin</span>
                        </motion.div> */}
                    {!isNotesPinned && <span onClick={() => setIsNotesVisible(!isNotesVisible)} className='space-x-2 text-xl text-neutral-600 dark:text-neutral-400 flex flex-row w-fit items-center justify-center select-none bottom-0 font-default-light'>
                        <motion.div
                            whileTap={{ scale: 0.8 }}
                            transition={{
                                type: "spring",
                                restDelta: 0.001,
                                ...smoothMotion,
                            }}
                            className='h-[32px] w-[32px] p-2 rounded-xl bg-black/5 dark:bg-white/5 cursor-pointer outline-none'>
                            <CrossIcon height="auto" className='fill-neutral-600 dark:fill-neutral-400 mr-4' />
                        </motion.div>
                    </span>}
                </div>
                <div className='bg-black/5 dark:bg-white/[0.03] w-full h-[-webkit-fill-available] rounded-xl mt-4 mb-8'>
                </div>
            </WindowDiv>

            <WindowDiv windowVisible={isClipboardVisible ? true : false} windowIndex={isCurrentWindow === 'clipboard' ? 999 : (isClipboardVisible && !isClipboardPinned ? 99 : 9)}>
                <div className='flex flex-row items-center justify-between' onDragStart={() => isClipboardPinned ? setIsClipboardVisible(true) : setIsClipboardVisible(false)}>
                    <span className='text-2xl text-neutral-600 dark:text-neutral-400 flex flex-row w-fit items-center justify-center select-none bottom-0 font-default-light'>
                        <ClipboardIcon height='24px' className='fill-neutral-600 dark:fill-neutral-400 mr-4' />Clipboard
                        <motion.div
                            whileTap={{ scale: 0.8 }}
                            transition={{
                                type: "spring",
                                restDelta: 0.001,
                                ...smoothMotion,
                            }}
                            onClick={() => setIsClipboardPinned(!isClipboardPinned)}
                            className='h-[32px] ml-4 px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 cursor-pointer outline-none flex flex-row justify-center items-center text-lg text-neutral-600 dark:text-neutral-400 select-none'>
                            <motion.div transition={{ type: "spring", restDelta: 0.001, ...smoothMotion, }} animate={isClipboardPinned ? { rotate: 45, marginTop: '0.5rem', marginRight: '0.3rem' } : { rotate: 0 }}><PinIcon height="16px" className='fill-neutral-600 dark:fill-neutral-400 mr-2' /></motion.div>
                            <span>{isClipboardPinned ? 'Unpin' : 'Pin'}</span>
                        </motion.div>
                    </span>
                    {!isClipboardPinned && <span onClick={() => setIsClipboardVisible(!isClipboardVisible)} className='space-x-2 text-xl text-neutral-600 dark:text-neutral-400 flex flex-row w-fit items-center justify-center select-none bottom-0 font-default-light'>
                        <motion.div
                            whileTap={{ scale: 0.8 }}
                            transition={{
                                type: "spring",
                                restDelta: 0.001,
                                ...smoothMotion,
                            }}
                            className='h-[32px] w-[32px] p-2 rounded-xl bg-black/5 dark:bg-white/5 cursor-pointer outline-none'>
                            <CrossIcon height="auto" className='fill-neutral-600 dark:fill-neutral-400 mr-4' />
                        </motion.div>
                    </span>}
                </div>

                <div className=' flex flex-row space-x-4 w-full h-[-webkit-fill-available] mt-4 mb-8 text-lg'>
                    <pre ref={preDivRef} onDragOver={(event) => event.preventDefault()} onDrop={handleClipboardDrop} onMouseLeave={handleClipboardChange} className='font-default-regular p-4 w-full rounded-xl text-neutral-600 dark:text-neutral-500 bg-black/5 dark:bg-white/[0.03] shrink-0 md:w-2/3 h-full overflow-y-scroll hide-scroll outline-none whitespace-pre-wrap break-words overflow-wrap-break-word' contentEditable suppressContentEditableWarning>{currentClipboardText}</pre>
                    <div className='flex flex-col space-y-4 w-[-webkit-fill-available]'>
                        <span className='text-xl text-neutral-600 dark:text-neutral-400 select-none flex flex-row space-x-4 justify-between items-center'>History</span>
                        {clipboardTextHistory.length <= 1 && <span className='rounded-xl bg-neutral-600/5 dark:bg-neutral-400/[0.03] px-2 py-1 text-neutral-600/40 dark:text-neutral-400/10 flex flex-row justify-center items-center select-none h-[5.32rem] text-center'>Make changes<br />to enable history</span>}
                        {clipboardTextHistory.length > 1 && <ul className='text-base text-neutral-500 select-none overflow-y-scroll hide-scroll space-y-4 rounded-xl max-h-[43%]'>
                            {clipboardTextHistory.map((text, index) => (
                                index > 0 && <div className='relative group'><motion.li key={index} onClick={() => updateClipboardText(text)} initial={{ scale: 0.95 }} animate={{ scale: 1 }} transition={{ type: 'spring', restDelta: 0.001, ...smoothMotion, }} whileTap={{ scale: 0.9 }} className='rounded-xl outline-none h-[5.32rem] overflow-hidden bg-black/5 dark:bg-white/[0.03] px-4 py-2 cursor-pointer' style={{ overflowWrap: 'anywhere' }}>
                                    {index + '. ' + text}
                                    <div className='absolute top-0 left-0 flex flex-row h-full w-full space-x-4 items-center justify-end px-4'></div>
                                </motion.li>
                                    {/* <button className='p-2 h-8 w-8 rounded-lg absolute top-2 right-2 flex-row flex items-center justify-center transition-all ease-in-out duration-300 scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-100 active:scale-75 outline-none' onClick={() => deleteClipboardTextHistory(index)}><TrashIcon className='fill-neutral-400 dark:fill-neutral-600' /></button> */}
                                </div>
                            ))}
                        </ul>}
                        <div className='flex flex-col space-y-4 '>
                            <span className='text-xl text-neutral-600 dark:text-neutral-400 select-none'>Actions</span>
                            <div className='flex flex-wrap -m-1'>
                                <motion.button onClick={() => handleDownloadClick(currentClipboardText)} transition={{ type: 'spring', restDelta: 0.001, ...smoothMotion, }} whileTap={{ scale: 0.9 }} className='w-fit px-3 py-1 text-neutral-600 dark:text-neutral-500 rounded-xl bg-black/10 dark:bg-white/[0.03] text-base m-1 select-none'>Download as .txt</motion.button>
                                {detectTextType(currentClipboardText).map((type, index) => (
                                    <motion.button key={index} onClick={() => handleDownloadClick(currentClipboardText, type)} initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} transition={{ type: 'spring', restDelta: 0.001, ...smoothMotion, }} whileTap={{ scale: 0.9 }} className='w-fit px-3 py-1 dark:text-neutral-500 rounded-xl bg-white/[0.03] text-base m-1 select-none'>{type}</motion.button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </WindowDiv>

            <WindowDiv windowVisible={isOptionsVisible ? true : false} windowIndex={isCurrentWindow === 'options' ? 999 : (isOptionsVisible ? 99 : 9)}>
                <div className='flex flex-row items-center justify-between'>
                    <span className='text-2xl text-neutral-600 dark:text-neutral-400 flex flex-row w-fit items-center justify-center select-none bottom-0 font-default-regular'>
                        <OptionsIcon height='24px' className='fill-neutral-600 dark:fill-neutral-400 mr-4' />Options</span>
                    {/* <motion.div
                            whileTap={{ scale: 0.8 }}
                            transition={{
                                type: "spring",
                                restDelta: 0.001,
                                ...smoothMotion,
                            }}
                            className='h-[32px] px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 cursor-pointer outline-none flex flex-row justify-center items-center text-lg text-neutral-600 dark:text-neutral-400 select-none'>
                            <PinIcon height="auto" className='fill-neutral-600 dark:fill-neutral-400 mr-2' />
                            <span>Pin</span>
                        </motion.div> */}
                    <span onClick={() => setIsOptionsVisible(!isOptionsVisible)} className='space-x-2 text-xl text-neutral-600 dark:text-neutral-400 flex flex-row w-fit items-center justify-center select-none bottom-0 font-default-light'>
                        <motion.div
                            whileTap={{ scale: 0.8 }}
                            transition={{
                                type: "spring",
                                restDelta: 0.001,
                                ...smoothMotion,
                            }}
                            className='h-[32px] w-[32px] p-2 rounded-xl bg-black/5 dark:bg-white/5 cursor-pointer outline-none'>
                            <CrossIcon height="auto" className='fill-neutral-600 dark:fill-neutral-400 mr-4' />
                        </motion.div>
                    </span>
                </div>
                <div className='bg-black/5 dark:bg-white/[0.03] w-full h-[-webkit-fill-available] rounded-xl mt-4 mb-8'>
                </div>
            </WindowDiv>
        </>
    )
}

export default Dock;