import React, { useState, useContext, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useMotionVariants } from '../../hooks/useMotionVariants';
import Tooltip from '../Tooltip';

import './index.css'

import WindowDiv from '../../components/ui/WindowDiv';
import { ClipboardContext } from '../../context/globalContext';

import { NotesIcon, TipsIcon, OptionsIcon, ClipboardIcon, VideoIcon, PluginsIcon, MoreAppsIcon, CrossIcon, PinIcon, TrashIcon, AppendIcon, FuseIcon, BoxCheckedIcon, BoxUncheckedIcon, UpdateIcon } from '../Icons';

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

    const { currentClipboardText, clipboardTextHistory, updateClipboardText, deleteClipboardTextHistory, setClipboardTextHistory } = useContext(ClipboardContext);

    // const handleTextAreaClipboardChange = () => {
    //     if (currentClipboardText !== textAreaValue) {
    //         updateClipboardText(textAreaValue);
    //         navigator.clipboard.writeText(textAreaValue);
    //     }
    // };

    const handleTextAreaClipboardChange = (event) => {
        setTextAreaValue(event.target.value);
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

    const [customFileName, setCustomFileName] = useState({ found: false, fileName: '.txt', fileText: '' });
    const [fileText, setFileText] = useState(currentClipboardText)

    useEffect(() => {
        const regex = /^([\w-]+\.[\w-]+)\s+(.*)$/;
        const match = fileText.match(regex);
        if (match) {
            const fileName = match[1];
            const fileText = match[2].trim();
            setCustomFileName({ found: true, fileName, fileText });
            console.log(fileText);
        } else {
            setCustomFileName({ found: false, fileName: '.txt', fileText: '' });
        }
    }, [fileText]);

    const handleDownloadClick = (textInput, fileExtension = '.txt', preFileName = '') => {
        let text = textInput;
        let fileName = preFileName.trim();

        const fileExtensionRegex = /^.*\.(.*)$/;
        const matches = fileExtension.match(fileExtensionRegex);

        if (matches) {
            fileName = fileExtension.replace(/[?\/\\*<>|"]/g, '');
        } else {
            fileName = fileName.replace(/[?\/\\*<>|"]/g, '');
            if (!fileName) {
                fileName = text.trim().substring(0, 46) + '... ';
            }
            fileName += fileExtension;
        }

        const blob = new Blob([text], { type: "text/plain" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    // const regexPatterns = [
    //     // { name: "jsxTest", pattern: /(import\s+\*\s+as\s+React\s+from\s+'react')|(import\s+React,\s*\{\s*(useState|useEffect|useContext|useCallback|useMemo|useRef|useReducer)\s*\}\s*from\s+'react')|(import\s+\{\s*(useState|useEffect|useContext|useCallback|useMemo|useRef|useReducer)\s*\}\s+from\s+'react')|(export\s+default\s)|(<\s*[a-zA-Z]+\s*(\S*\s*=\s*".*?"\s*)*\/?\s*>)/ },
    //     { name: "jsxTest", pattern: /import\s+(?:(?:\*\s+as\s+\w+\s+from|{[^}]*})\s+from\s+)?['"]react['"]/i },
    //     // { name: "jsTest", pattern: /(function\s*\()|(var\s+\w+\s*=)|(const\s+\w+\s*=)|(let\s+\w+\s*=)|(\w+\s*\(\s*\))|(\[\s*\])|(\{\s*\})|(\.\w+)|(\+\+|\-\-)|(\=\=)|(\!\=)|(\|\|)|(\&\&)|(\?\:)|(\=\>)/ },
    //     { name: "jsTest", pattern: /\bfunction\b|\bconst\b|\blet\b|\bvar\b|\bif\b|\belse\b|\bfor\b|\bwhile\b|\bdo\b|\bswitch\b|\bcase\b|\bbreak\b|\breturn\b|\btrue\b|\bfalse\b|\bnull\b|\bundefined\b|\btypeof\b|\bin\b|\binstanceof\b|\bthis\b|\bnew\b|\btry\b|\bcatch\b|\bfinally\b|\bthrow\b|\basync\b|\bawait\b|\bimport\b|\bexport\b/ },
    //     { name: "jsonTest", pattern: /^{\s*"[\w-]+":\s*(?:"(?:\\.|[^"\\])*"|true|false|null|\d+(?:\.\d+)?(?:[eE][-+]?\d+)?)\s*(?:,\s*"[\w-]+":\s*(?:"(?:\\.|[^"\\])*"|true|false|null|\d+(?:\.\d+)?(?:[eE][-+]?\d+)?)\s*)*}\s*$/ },
    //     { name: "pyTest", pattern: /(def\s+\w+\s*\()|(\bimport\s+\w+)|(\bfrom\s+\w+\s+import\b)|(^[\t ]+)|(^[\t ]*#.*$)|(pandas|numpy|matplotlib|django)|(\+\+|\-\-)|(\*\*)|(\=\=)|(\!\=)|(\|\|)|(\&\&)|(\bif\b)|(\belif\b)|(\belse\b)|(\bfor\b)|(\bin\b)|(\bwhile\b)|(\btry\b)|(\bexcept\b)|(\bfinally\b)/ },
    //     { name: "cppTest", pattern: /^\s*(#include\s*<\w+\.h>|#include\s*"\w+\.h")|\b(int|float|double|void)\s+\w+\s*\(|\bstd::vector\s*<.+>\s+\w+\s*\(|\bstd::unique_ptr\s*<.+>\s+\w+\s*\(|\bstd::shared_ptr\s*<.+>\s+\w+\s*\(|\bstd::make_unique\s*<.+>\s*\(|\bstd::make_shared\s*<.+>\s*\(|\bstd::sort\s*\(|\bstd::find\s*\(|\bstd::cout\s*<<|\bstd::endl|(\+\+|\-\-)|(\=\=)|(\!\=)|(\|\|)|(\&\&)/ },
    //     { name: "csvTest", pattern: /^(?:"(?:[^"]|"")*"|[^,"\r\n]*)(?:,(?:"(?:[^"]|"")*"|[^,"\r\n]*))*$/gm },
    //     // { name: "svgTest", pattern: /^<svg\s+(?<required>(?:width|height)="[\d\.]+(px|%)?"\s+viewBox="[\d\.]+\s+[\d\.]+\s+[\d\.]+\s+[\d\.]+")(?<optional>(?:\s+\w+="[^"]*")*)\s*>(?:[\s\S]*?(?:<\/?(?:path|rect|circle|ellipse|line|polyline|polygon|text|g|defs)\b(?:\s+\w+="[^"]*")*\s*\/?>[\s\S]*?<\/(?:path|rect|circle|ellipse|line|polyline|polygon|text|g|defs)>\s*)+)<\/svg>$/i },
    //     { name: "svgTest", pattern: /^<svg.*<\/svg>$/is },
    //     { name: "htmlTest", pattern: /<!DOCTYPE\s[^>]*>|<meta\s[^>]*>|<title\b[^>]*>.*?<\/title>|<\s*\w+(?:\s+\w+(?:\s*=\s*(?:".*?"|'.*?'|[\^'">\s]+))?)*\s*\/?>|<!--.*?-->|<!\[CDATA\[.*?\]\]>|<style\b[^>]*>.*?<\/style>|<script\b[^>]*>.*?<\/script>|<h\d\b[^>]*>.*?<\/h\d>|<p\b[^>]*>.*?<\/p>|<a\b[^>]*>.*?<\/a>|<img\b[^>]*>|<ul\b[^>]*>.*?<\/ul>|<ol\b[^>]*>.*?<\/ol>|<li\b[^>]*>.*?<\/li>|<table\b[^>]*>.*?<\/table>|<tr\b[^>]*>.*?<\/tr>|<th\b[^>]*>.*?<\/th>|<td\b[^>]*>.*?<\/td>|<div\b[^>]*>.*?<\/div>/s },
    //     { name: "cssTest", pattern: /^\s*(?:\/\*[\s\S]*?\*\/\s*)*(?:\.[a-zA-Z][a-zA-Z0-9_-]*|\#[a-zA-Z][a-zA-Z0-9_-]*)\s*(?:\{(?:[\s\S]*?(?:(?<=^|\s)(?:background(?:-(?:color|image))?|color|font-(?:family|size|weight)|height|margin|padding|text-align|text-decoration|width|(?:border|outline)-(?:width|style|color)|display|float|position|top|left|right|bottom|z-index)\s*:\s*[^;}]*;)*[\s\S]*?)\})/ },
    //     { name: "csTest", pattern: /\b(using|namespace|class|struct|interface|delegate|enum|void|object|string|bool|int|long|decimal|float|double)\s+(\w+|\[.*?\])\s*(<.*?>)?\s*(\(.+\))?\s*({|=\s*new)/ },
    //     { name: "cTest", pattern: /^\s*#(include|define)\s+<\w+\.h>|\s*#(include|define)\s+"\w+\.h"|\b(unsigned\s+)?(char|short|int|long|float|double|void)\s+\*?\s*\w+\s*(\[[^\]]+\])?\s*(\([^{}]*\))?\s*\{|for\s*\([^;]*;[^;]*;[^)]*\)\s*\{|while\s*\([^)]*\)\s*\{|do\s*\{\s*[^}]*\s*\}\s*while\s*\([^)]*\);|if\s*\([^)]*\)\s*\{\s*[^}]*\s*\}\s*(else\s*\{\s*[^}]*\s*\})?|switch\s*\([^)]*\)\s*\{\s*[^}]*\s*\}|case\s+[\w\s,]+:\s*|default\s*:\s*|return\s+[\w\*\[\]\(\)\+\-\/\%]+;/ },
    //     { name: "goTest", pattern: /\bimport\s+\(\s*(\n|\s)*(["'`\/])(.|[\n\r])*?\2\s*\)|\bpackage\s+\w+|\bfunc\s+\w+\s*\(|\bfmt\.(Print|Println|Printf|Error|Sprint|Sprintf|Fprint|Fprintf)\(|\blogrus\.(Print|Println|Printf|Error|Warn|Info|Debug|Trace|Panic|Fatal)\(|\bgorilla\/mux\.(NewRouter|HandleFunc|Path|Methods|Queries|Headers|Schemes|Subrouter|NotFoundHandler|MethodNotAllowedHandler)\(|\bhttp\.(ListenAndServe|HandleFunc|Handle)\(|\bjson\.(Marshal|Unmarshal)\(|\btime\.(Now|Parse)\(|\bos\.(Open|Create)\(|\bioutil\.(ReadFile|WriteFile)\(|\bnet\/http\/httptest\.(NewRecorder|NewRequest)\(|\btesting\.(T|B)\{|sync\.(WaitGroup|Mutex|RWMutex)\{|defer\s+\w+\(|\bconst\s+\w+\s*=\s*\w+|\w+\s*:=/ },
    //     { name: "sqlTest", pattern: /\b(CREATE|SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|TRUNCATE|FROM|JOIN|ON|WHERE|GROUP BY|HAVING|ORDER BY|LIMIT|OFFSET|AS|CASE|WHEN|THEN|ELSE|END|PRIMARY KEY|FOREIGN KEY|REFERENCES|INDEX|UNIQUE|CHECK|DEFAULT|NULL|NOT NULL|AND|OR|NOT|LIKE|IN|BETWEEN|EXISTS|COUNT|SUM|AVG|MIN|MAX|DATE|TIME|TIMESTAMP)\b/i },
    //     { name: "phpTest", pattern: /(<\?php|\$[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*\s*=|\becho\s+('|")|\bif\s*\(|\belse\s*\{|->|\barray\(|\bfunction\s+([a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*)?\s*\()/i },
    //     { name: "rsTest", pattern: /\b(fn|let|use|match|if|else|while|for|loop|break|continue|return|const|static|unsafe|mut|ref|self|super|crate|as|in|where)\s+\w+|struct\s+\w+|enum\s+\w+|type\s+\w+|\bimpl\s+\w+|\btrait\s+\w+|\bmod\s+\w+|pub(\s+[(][^\n]*[)])?\s+(fn|struct|enum|type|trait|mod)\s+\w+|(\bunsafe\s+)?(extern\s+["C"]\s+\{[^{}]*\})|\buse\s+(serde|tokio)([_\w\d]+)*/ },
    //     { name: "xmlTest", pattern: /^<\?xml\s+version=["'][^"']*["']\s*(?:encoding=["'][^"']*["']\s*)?(?:standalone=["'][^"']*["']\s*)?\?>\s*<([a-z]+)(?:\s+[a-z]+(?:\s*=\s*(?:"[^"]*"|'[^']*'))?)*\s*>(?:[\s\S]*?(?=<\/\1\s*>))+<\/\1\s*>$/i },
    //     { name: "batTest", pattern: /^(?:@echo off|echo[^(]|\bset\s+\w+=|\bif\s+not\s+exist\b|\bif\s+exist\b|\bfor\s+\/[dfr]*\s+%?\w+%\s+in\s+\([^\)]+\)\s+do|\bgoto\s+\w+)/i },
    //     { name: "ps1Test", pattern: /^(?:function\s|\$[\w\d]+\s*=|Write-Output\b|Write-Host\b|\bImport-Module\b|\bNew-Module\b|\bGet-Module\b|\bRemove-Module\b|\bForEach-Object\b|\bSelect-Object\b|\bWhere-Object\b|\bIf\b|\bElseIf\b|\bElse\b|\bSwitch\b|\bTry\b|\bCatch\b|\bFinally\b|\bThrow\b|\bReturn\b|\bExit\b|\bAdd-Type\b|\bRegister-ObjectEvent\b|\bUnregister-Event\b)/i },
    //     { name: "shTest", pattern: /^#!\/usr\/bin\/(env )?(bash|sh)( |-)(\d\.\d)?(\s|$)/ },
    //     { name: "yamlTest", pattern: /^\s*(#.*|\w[-\w]*):\s*((?:(?<=\s)[\w-]+:\s+\S.*\n)+|"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|>[ ]*\n(?:(?:[^\n]+|\n(?=[ ]{0,3}\S))+)|\S.*?)\s*(?:(?<=\s)#.*)?$/m },
    //     { name: "mdTest", pattern: /^(#+\s*)?(.*\s+)?\[[\w\d\s-]*\.md\][^#\n]*$/m },
    //     { name: "dockerfileTest", pattern: /^FROM\s+(?:\w[\w.-]*\/)?[\w.-]+(?:\:[\w.-]+)?(?:\s+AS\s+\w+)?(?:\s+USER\s+\w+)?(?:\s+WORKDIR\s+\S+)?(?:\s+ARG\s+\w+)?(?:\s+ENV\s+\w+\s+\S+)?(?:\s+COPY\s+.*?\s+\S+)?(?:\s+ADD\s+.*?\s+\S+)?(?:\s+RUN\s+.*?\s*)*$/m },
    //     { name: "ipynbTest", pattern: /^[\s\S]*# In\[[0-9]+\]:\s*\[[^\]]*\][\s\S]*/ },
    //     { name: "rTest", pattern: /^(?:use\s+\w+|fn\s+\w+\s*\(|struct\s+\w+|enum\s+\w+|mod\s+\w+|pub\s+(?:fn|struct|enum)\s+\w+|\bOption\b|\bResult\b|macro_rules!\s+\w+\s*\{|trait\s+\w+\s*\{|'\w+|unsafe\s*\{|#\[\w+\])/i },
    // ]

    // const detectTextType = (text) => {

    //     const FPT = (nameToFind) => {
    //         return regexPatterns.find(obj => obj.name === nameToFind)?.pattern.test(text);
    //     }

    //     let fileExtension = [];

    //     if (FPT('svgTest')) {
    //         fileExtension.push('.svg');
    //     }
    //     if (FPT('jsTest')) {
    //         fileExtension.push('.js', '.ts');
    //     }
    //     if (FPT('pyTest')) {
    //         fileExtension.push('.py');
    //     }
    //     if (FPT('cppTest')) {
    //         fileExtension.push('.c++');
    //     }
    //     if (FPT('csvTest')) {
    //         fileExtension.push('.csv');
    //     }
    //     if (FPT('htmlTest')) {
    //         fileExtension.push('.html');
    //     }
    //     if (FPT('cssTest')) {
    //         fileExtension.push('.css');
    //     }
    //     if (FPT('csTest')) {
    //         fileExtension.push('.cs');
    //     }
    //     if (FPT('cTest')) {
    //         fileExtension.push('.c');
    //     }
    //     if (FPT('goTest')) {
    //         fileExtension.push('.go');
    //     }
    //     if (FPT('sqlTest')) {
    //         fileExtension.push('.sql');
    //     }
    //     if (FPT('phpTest')) {
    //         fileExtension.push('.php');
    //     }
    //     if (FPT('rsTest')) {
    //         fileExtension.push('.rs');
    //     }
    //     if (FPT('xmlTest')) {
    //         fileExtension.push('.xml');
    //     }
    //     if (FPT('jsonTest')) {
    //         fileExtension.push('.json');
    //     }
    //     if (FPT('batTest')) {
    //         fileExtension.push('.bat');
    //     }
    //     if (FPT('ps1Test')) {
    //         fileExtension.push('.ps1');
    //     }
    //     if (FPT('shTest')) {
    //         fileExtension.push('.sh');
    //     }
    //     if (FPT('yamlTest')) {
    //         fileExtension.push('.yaml');
    //     }
    //     if (FPT('mdTest')) {
    //         fileExtension.push('.md');
    //     }
    //     if (FPT('dockerfileTest')) {
    //         fileExtension.push('.dockerfile');
    //     }
    //     if (FPT('ipynbTest')) {
    //         fileExtension.push('.ipynb');
    //     }
    //     if (FPT('rTest')) {
    //         fileExtension.push('.R');
    //     }

    //     const jsxNameTest = /export\s+default\s+([^\s;]+)/;

    //     if (jsxNameTest.test(text)) {
    //         let jsxName = RegExp.$1 + '.jsx';
    //         fileExtension.push(`${jsxName}`, '.tsx');
    //     } else if (FPT('jsxTest')) {
    //         fileExtension.push('.jsx', '.tsx');
    //     }

    //     return fileExtension
    // }

    function isReactCode(code) {
        const hasReactImport = /import\s+React\s+from\s+'react'/.test(code);
        const hasJSX = /<(?:(\w+)|\/)/.test(code);
        const hasReactFunctions = /(useState|useEffect|useContext|useReducer|useCallback|useMemo|useRef|useImperativeHandle|useLayoutEffect|useDebugValue)\b/.test(code);
        return hasReactImport || hasJSX || hasReactFunctions;
    }

    function isGoCode(code) {
        const hasGoImport = /import\s+"(fmt|math|os|time|io)"\s*$/.test(code);
        const hasGoFunctions = /(fmt\.|math\.|os\.|time\.|io\.)(\w+)/.test(code);
        return hasGoImport || hasGoFunctions;
    }


    function isRustCode(code) {
        const hasRustImport = /use\s+(std|core)::/.test(code);
        const hasRustFunctions = /(std|core)::(\w+)/.test(code);
        const hasRustStructs = /struct\s+(\w+)/.test(code);
        return (hasRustImport || hasRustFunctions) || hasRustStructs;
    }

    function isRCode(code) {
        const hasRImport = /library\(\w+\)/.test(code);
        const hasRFunctions = /\w+\s*<-|\s*\$\s*\w+|\bif\s*\(|\bfor\s*\(|\bwhile\s*\(/.test(code);
        return hasRImport || hasRFunctions;
    }

    function isSVGCode(code) {
        const hasSVGOpeningTag = /<svg\s/.test(code);
        const hasSVGElements = /<(rect|circle|ellipse|line|path|polygon|polyline|text)\s/.test(code);
        return hasSVGOpeningTag || hasSVGElements;
    }

    function isJsonCode(code) {
        try {
            JSON.parse(code);
            return true;
        } catch (e) {
            return false;
        }
    }

    function isJsCode(code) {
        // Regular expression to match valid JavaScript code
        const jsRegex = /^\s*(?:var|let|const|\(|function|class|if|else|switch|case|default|for|while|do|try|catch|finally|throw|new|return|typeof|instanceof|void|delete|async|await|\+|-|\*|\/|%|&|\||\^|!|~|<<|>>|>>>|===|!==|==|!=|<=|>=|<|>|&&|\|\||\?|:|,|;|\{|\}|\[|\]|\(|\)|=|\.)+\s*$/;
      
        return jsRegex.test(code);
      }
      

    function isPyCode(code) {
        const hasPythonImport = /^import\s+\w+/.test(code);
        const hasPythonFunction = /\b(def|class)\s+\w+/.test(code);
        const hasPythonComment = /#/.test(code);
        return hasPythonImport || hasPythonFunction || hasPythonComment;
    }

    function isCppCode(code) {
        const hasCppHeaders = /#include\s+(?:<.+>|".+")/.test(code);
        const hasCppClasses = /class\s+\w+\s*\{/.test(code);
        const hasCppFunctions = /\b(?:int|void|double|float)\s+\w+\s*\(.+\)\s*\{/.test(code);
        return hasCppHeaders || hasCppClasses || hasCppFunctions;
    }

    function isCSVCode(code) {
        return /(?:\w+,)+\w+/.test(code);
    }

    function isHtmlCode(code) {
        const htmlTagsRegex = /<\s*(\w+)[^>]*>(.*?)<\s*\/\s*\1\s*>/;
        return htmlTagsRegex.test(code);
    }

    function isCssCode(code) {
        const hasCssImport = /import.+\.css['";]/.test(code); // Check if code has import statement for CSS
        const hasCssClass = /\.[a-zA-Z_-]+/.test(code); // Check if code has a CSS class selector
        const hasCssId = /#[a-zA-Z_-]+/.test(code); // Check if code has a CSS ID selector
        const hasCssAttribute = /\[[a-zA-Z_-]+\]/.test(code); // Check if code has a CSS attribute selector
        const hasCssPseudo = /:[a-zA-Z_-]+/.test(code); // Check if code has a CSS pseudo-class or pseudo-element selector
        const hasCssProperty = /[a-zA-Z_-]+:\s*[a-zA-Z0-9#()_,\s]+[;}]/.test(code); // Check if code has a CSS property declaration
        return hasCssImport || hasCssClass || hasCssId || hasCssAttribute || hasCssPseudo || hasCssProperty;
    }

    function isSQLCode(code) {
        const hasSelectStatement = /SELECT\s+.+\s+FROM\s+.+/.test(code); // Check if code has a SELECT statement
        const hasInsertStatement = /INSERT\s+INTO\s+.+\s+\(.+\)\s+VALUES\s*\(.+\)/.test(code); // Check if code has an INSERT statement
        const hasUpdateStatement = /UPDATE\s+.+\s+SET\s+.+/.test(code); // Check if code has an UPDATE statement
        const hasDeleteStatement = /DELETE\s+FROM\s+.+/.test(code); // Check if code has a DELETE statement
        const hasJoinClause = /JOIN\s+.+\s+ON\s+.+/.test(code); // Check if code has a JOIN clause
        const hasWhereClause = /WHERE\s+.+/.test(code); // Check if code has a WHERE clause
        const hasOrderByClause = /ORDER\s+BY\s+.+/.test(code); // Check if code has an ORDER BY clause
        return hasSelectStatement || hasInsertStatement || hasUpdateStatement || hasDeleteStatement || hasJoinClause || hasWhereClause || hasOrderByClause;
    }

    function isDockerfileCode(code) {
        const hasDockerfileInstruction = /^(FROM|MAINTAINER|RUN|CMD|EXPOSE|ENV|ADD|COPY|ENTRYPOINT|VOLUME|USER|WORKDIR|ARG|ONBUILD|STOPSIGNAL)\b/.test(code); // Check if code has a Dockerfile instruction
        const hasComment = /^\s*#/.test(code); // Check if code has a comment (which is allowed in Dockerfiles)
        const hasVariableSubstitution = /\$\{[^\}]+\}/.test(code); // Check if code has a variable substitution syntax (e.g. ${VARIABLE})
        return hasDockerfileInstruction || hasComment || hasVariableSubstitution;
    }

    function isBatCode(code) {
        const hasBatchFileExtension = /\.bat$/i.test(code); // Check if code has a .bat file extension
        const hasEchoCommand = /^echo\b/.test(code); // Check if code has an echo command
        const hasCdCommand = /^cd\b/.test(code); // Check if code has a cd command
        const hasMkdirCommand = /^mkdir\b/.test(code); // Check if code has a mkdir command
        const hasCopyCommand = /^copy\b/.test(code); // Check if code has a copy command
        return hasBatchFileExtension || hasEchoCommand || hasCdCommand || hasMkdirCommand || hasCopyCommand;
    }

    function isIpynbCode(code) {
        const hasNotebookFormat = /"nbformat":\s*(\d+)/.test(code); // Check if code has nbformat metadata indicating it's a notebook
        const hasPythonKernel = /"kernel_info":\s*{\s*"name":\s*"python"/.test(code); // Check if code has a Python kernel
        const hasPythonCode = /"cell_type":\s*"code"/.test(code) && /"language":\s*"python"/.test(code); // Check if code is within a code cell and is Python code
        return hasNotebookFormat || hasPythonKernel || hasPythonCode;
    }

    function isMdCode(code) {
        const hasHeader = /^#\s/.test(code); // Check if code starts with a header
        const hasList = /^[\*\-]\s/.test(code); // Check if code starts with a list item
        const hasBlockquote = /^>\s/.test(code); // Check if code starts with a blockquote
        const hasCodeBlock = /^```/.test(code); // Check if code starts with a code block
        const hasLink = /\[.*?\]\(.*?\)/.test(code); // Check if code has a link
        return hasHeader || hasList || hasBlockquote || hasCodeBlock || hasLink;
    }

    function isYamlCode(code) {
        const yamlRegex = /^\s*(?:-.*|\w+(?:\s*:\s*.+)?)\s*$/gm;
        return yamlRegex.test(code);
      }      

    function isShCode(code) {
        const hasShebang = /^#!\s*\/(bin|usr\/bin|usr\/local\/bin)\/(sh|bash)\s*$/.test(code);
        const hasBashCommands = /(^|\n)(ls|cd|pwd|echo|export|alias|unalias|source|exec|printf|read|unset|test|if|while|for|case|select)\b/.test(code);
        const hasComments = /#/.test(code);
        return hasShebang || hasBashCommands || hasComments;
    }

    function isPs1Code(code) {
        const hasPs1Tag = /^#.*powershell/i.test(code);
        const hasCmdlets = /(^|\s)(Get-|Set-|New-|Remove-|Test-|Invoke-|Export-|Import-|Start-|Stop-|Write-|Read-|ForEach-|Select-)\w*\b/.test(code);
        const hasComments = /#/.test(code);
        return hasPs1Tag || hasCmdlets || hasComments;
    }

    function isCsCode(code) {
        const hasUsingStatement = /\busing\s+\w+(\.\w+)*;/.test(code);
        const hasClassDeclaration = /\bclass\s+\w+\s*{/.test(code);
        const hasDotNetFunctions = /(\bConsole\b|\bMath\b|\bDateTime\b|\bString\b|\bRegex\b|\bList\b|\bDictionary\b|\bEnumerable\b|\bLINQ\b|\bSystem\b)\./.test(code);
        return hasUsingStatement || hasClassDeclaration || hasDotNetFunctions;
    }

    function isCCode(code) {
        const hasIncludes = /#include\s+(<\w+\.h>|"\w+\.h")/.test(code);
        const hasMainFunction = /\bint\s+main\s*\(\s*void\s*\)/.test(code);
        const hasCFunctions = /(\bprintf\b|\bscanf\b|\bfgets\b|\bfputs\b|\bstrcpy\b|\bstrcat\b|\bstrlen\b|\bstrcmp\b|\bstrncpy\b|\bstrtok\b|\bsrand\b|\bmalloc\b|\bfree\b|\bexit\b)\s*\(/.test(code);
        return hasIncludes || hasMainFunction || hasCFunctions;
    }

    function detectCodeType(code) {
        let extensions = [];

        let logicWeights = {}  

        if (isReactCode(code)) {
            if (/export\s+default\s+([^\s;]+)/.test(code)) {
                let jsxName = RegExp.$1 + '.jsx';
                extensions.push(`${jsxName}`, '.tsx');
            } else {
                extensions.push('.jsx');
            }
        }
        if (isGoCode(code)) {
            extensions.push('.go');
        }
        if (isRustCode(code)) {
            extensions.push('.rs');
        }
        if (isRCode(code)) {
            extensions.push('.R');
        }
        if (isSVGCode(code)) {
            extensions.push('.svg');
        }
        if (isJsonCode(code)) {
            extensions.push('.json');
        }
        if (isJsCode(code)) {
            extensions.push('.js');
        }
        if (isPyCode(code)) {
            extensions.push('.py');
        }
        if (isCppCode(code)) {
            extensions.push('.cpp');
        }
        if (isCSVCode(code)) {
            extensions.push('.csv');
        }
        if (isHtmlCode(code)) {
            extensions.push('.html');
        }
        if (isCssCode(code)) {
            extensions.push('.css');
        }
        if (isSQLCode(code)) {
            extensions.push('.sql');
        }
        if (isCCode(code)) {
            extensions.push('.c');
        }
        if (isIpynbCode(code)) {
            extensions.push('.ipynb');
        }
        if (isCsCode(code)) {
            extensions.push('.cs');
        }
        if (isPs1Code(code)) {
            extensions.push('.ps1');
        }
        if (isShCode(code)) {
            extensions.push('.sh');
        }
        if (isYamlCode(code)) {
            extensions.push('.yaml');
        }
        if (isMdCode(code)) {
            extensions.push('.md');
        }
        if (isBatCode(code)) {
            extensions.push('.bat');
        }
        if (isDockerfileCode(code)) {
            extensions.push('.dockerfile');
        }

        if (extensions.length > 0) {
            return extensions;
        } else {
            return [];
        }
    }

    const clearHistory = () => {
        setClipboardTextHistory([currentClipboardText])
    }

    const [isAppending, setIsAppending] = useState(false)
    const [isFusing, setIsFusing] = useState(false)

    useEffect(() => {
        !isClipboardVisible || !isClipboardPinned ? setIsAppending(false) & setIsFusing(false) : setIsAppending(isAppending) & setIsFusing(isFusing);
        isClipboardVisible && setTextAreaValue(currentClipboardText);
    }, [isClipboardVisible, isClipboardPinned])

    const textAreaRef = useRef(null);

    const [textAreaValue, setTextAreaValue] = useState('');

    const handleTextAreaChange = (event) => {
        setTextAreaValue(event.target.value);
    };

    useEffect(() => {
        setTextAreaValue(currentClipboardText)
    }, [currentClipboardText])

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
                            setTextAreaValue(text);
                            setIsClipboardVisible(true);
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

            <container onClick={() => isCurrentWindow !== 'notes' && setIsCurrentWindow('notes')}>
                <WindowDiv windowVisible={isNotesVisible ? true : false} windowIndex={isCurrentWindow === 'notes' ? 999 : (isNotesVisible && !isNotesPinned ? 99 : 9)}>
                    <div className='flex flex-row items-center justify-between' >
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
            </container>

            <container className='relative' onClick={() => isCurrentWindow !== 'clipboard' && setIsCurrentWindow('clipboard')}>
                <WindowDiv windowVisible={isClipboardVisible ? true : false} windowIndex={isCurrentWindow === 'clipboard' ? 999 : (isClipboardVisible && !isClipboardPinned ? 99 : 9)}>
                    <div className='flex flex-row items-center justify-between'>
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
                        <pre className='w-full h-full shrink-0 md:w-2/3'><textarea ref={textAreaRef} value={textAreaValue} onChange={handleTextAreaChange} onMouseLeave={(event) => handleTextAreaClipboardChange(event)} className='font-default-regular p-4 w-full rounded-xl text-neutral-600 dark:text-neutral-500 bg-black/5 dark:bg-white/[0.03] h-full overflow-y-scroll hide-scroll outline-none whitespace-pre-wrap break-words overflow-wrap-break-word'></textarea></pre>
                        <div className='flex flex-col space-y-4 w-[-webkit-fill-available]'>
                            <span className='text-xl text-neutral-600 dark:text-neutral-400 select-none flex flex-row space-x-4 justify-between items-center'>History{clipboardTextHistory.length > 1 && <motion.span initial={{ translateX: '20%' }} animate={{ translateX: '0' }} transition={{ type: 'spring', restDelta: 0.001, ...smoothMotion, }} whileTap={{ scale: 0.95 }} className='flex flex-row justify-center items-center px-3 py-1 rounded-xl bg-black/5 dark:bg-white/[0.03] text-sm cursor-pointer text-neutral-400 dark:text-neutral-600 outline-none' onClick={() => clearHistory()}>Clear</motion.span>}</span>
                            {clipboardTextHistory.length <= 1 && <span className='rounded-xl bg-black/5 dark:bg-white/[0.03] px-2 py-1 text-neutral-600/40 dark:text-neutral-400/10 flex flex-row justify-center items-center select-none h-[5.32rem] text-center'>Make changes<br />to enable history</span>}
                            {clipboardTextHistory.length > 1 && <ul className='text-base text-neutral-500 select-none overflow-y-scroll hide-scroll space-y-4 rounded-xl max-h-[43%]'>
                                {clipboardTextHistory.map((text, index) => (
                                    index > 0 && <div className='relative group'><motion.li key={index} onClick={() => updateClipboardText(text) & setTextAreaValue(text)} initial={{ scale: 0.95 }} animate={{ scale: 1 }} transition={{ type: 'spring', restDelta: 0.001, ...smoothMotion, }} whileTap={{ scale: 0.9 }} className='rounded-xl outline-none h-[5.32rem] overflow-hidden bg-black/5 dark:bg-white/[0.03] px-4 py-2 cursor-pointer' style={{ overflowWrap: 'anywhere' }}>
                                        {index + '. ' + text}
                                    </motion.li>
                                        {/* <button className='p-2 h-8 w-8 rounded-lg absolute top-2 right-2 flex-row flex items-center justify-center transition-all ease-in-out duration-300 scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-100 active:scale-75 outline-none' onClick={() => deleteClipboardTextHistory(index)}><TrashIcon className='fill-neutral-400 dark:fill-neutral-600' /></button> */}
                                    </div>
                                ))}
                            </ul>}
                            <div className='flex flex-col space-y-4 '>
                                <span className='text-xl text-neutral-600 dark:text-neutral-400 select-none'>Actions</span>
                                <div className='flex flex-wrap -m-1'>
                                    <motion.button onClick={() => updateClipboardText(textAreaValue) & navigator.clipboard.writeText(textAreaValue)} transition={{ type: 'spring', restDelta: 0.001, ...smoothMotion, }} whileTap={{ scale: 0.9 }} className='outline-none w-fit px-3 py-1 text-neutral-600 dark:text-neutral-500 rounded-xl bg-black/10 dark:bg-white/[0.03] text-base m-1 select-none flex flex-row justify-center items-center'><UpdateIcon height='14px' className='mr-2 fill-neutral-600 dark:fill-neutral-400' />Update</motion.button>
                                    <motion.button onClick={() => isAppending ? setIsAppending(false) : setIsAppending(true) & setIsFusing(false)} transition={{ type: 'spring', restDelta: 0.001, ...smoothMotion, }} whileTap={{ scale: 0.9 }} className='outline-none w-fit px-3 py-1 text-neutral-600 dark:text-neutral-500 rounded-xl bg-black/10 dark:bg-white/[0.03] text-base m-1 select-none flex flex-row justify-center items-center'>{isAppending ? <><BoxCheckedIcon height='14px' className='mr-2 fill-neutral-600 dark:fill-neutral-400' />Appending</> : <><AppendIcon height='14px' className='mr-2 fill-neutral-600 dark:fill-neutral-400' />Append</>}</motion.button>
                                    <motion.button onClick={() => isFusing ? setIsFusing(false) : setIsFusing(true) & setIsAppending(false)} transition={{ type: 'spring', restDelta: 0.001, ...smoothMotion, }} whileTap={{ scale: 0.9 }} className='outline-none w-fit px-3 py-1 text-neutral-600 dark:text-neutral-500 rounded-xl bg-black/10 dark:bg-white/[0.03] text-base m-1 select-none flex flex-row justify-center items-center outline-none'>{isFusing ? <><BoxCheckedIcon height='14px' className='mr-2 fill-neutral-600 dark:fill-neutral-400' />Fusing</> : <><FuseIcon height='14px' className='mr-2 fill-neutral-600 dark:fill-neutral-400' />Fuse</>}</motion.button>
                                    <motion.button onClick={() => !isNotesPinned ? setIsNotesVisible(!isNotesVisible) & setIsCurrentWindow('notes') : setIsCurrentWindow('notes')} transition={{ type: 'spring', restDelta: 0.001, ...smoothMotion, }} whileTap={{ scale: 0.9 }} className='outline-none w-fit px-3 py-1 text-neutral-600 dark:text-neutral-500 rounded-xl bg-black/10 dark:bg-white/[0.03] text-base m-1 select-none flex flex-row justify-center items-center'><NotesIcon height='14px' className='mr-2 fill-neutral-600 dark:fill-neutral-400' />Note</motion.button>
                                    <motion.button onClick={() => handleDownloadClick(textAreaValue)} transition={{ type: 'spring', restDelta: 0.001, ...smoothMotion, }} whileTap={{ scale: 0.9 }} className='outline-none w-fit px-3 py-1 text-neutral-600 dark:text-neutral-500 rounded-xl bg-black/10 dark:bg-white/[0.03] text-base m-1 select-none'>Download as {customFileName.found ? customFileName.fileName : '.txt'}</motion.button>
                                    {textAreaValue.trim() !== '' &&
                                        detectCodeType(textAreaValue).map((type, index) => (
                                            <motion.button key={index} onClick={() => handleDownloadClick(textAreaValue, type)} initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: 'spring', restDelta: 0.001, ...smoothMotion, }} whileTap={{ scale: 0.9 }} className='w-fit px-3 py-1 bg-black/10 dark:bg-white/[0.03] text-neutral-600 dark:text-neutral-500 rounded-xl text-base m-1 select-none outline-none'>
                                                {type}
                                            </motion.button>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </WindowDiv>
            </container>

            <container onClick={() => isCurrentWindow !== 'options' && setIsCurrentWindow('options')}>
                <WindowDiv windowVisible={isOptionsVisible ? true : false} windowIndex={isCurrentWindow === 'options' ? 999 : (isOptionsVisible ? 99 : 9)}>
                    <div className='flex flex-row items-center justify-between' >
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
            </container>
        </>
    )
}

export default Dock;