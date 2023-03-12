import React, { useState, useEffect } from "react";

function ClipboardText() {
  const [clipboardText, setClipboardText] = useState("");

  const handleCopy = async () => {
    const text = await navigator.clipboard.readText();
    setClipboardText(text);
    console.log(text);
  };

  const handleFocus = async () => {
    const text = await navigator.clipboard.readText();
    setClipboardText(text);
    console.log(text);
  };

  useEffect(() => {
    window.addEventListener("copy", handleCopy);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("copy", handleCopy);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const clipboardContainerClasses = "cursor-pointer whitespace-nowrap text-ellipsis bg-yellow-400/20 dark:bg-yellow-600/10 backdrop-blur-lg items-center align-middle select-none border-[1px] border-black/10 dark:border-white/5  px-4 md:hover:max-w-md max-w-[10rem] hover:max-w-[15rem] max-h-8 rounded-lg shadow-md  transform transition-all duration-300 active:scale-90 ease-in-out text-base text-neutral-700 dark:text-neutral-200 overflow-hidden shrink-0"

  const clipboardTextClasses = ""

  return (
    <div >
      {/* {clipboardText && <div className={clipboardContainerClasses}>Clipboard: <div className={clipboardTextClasses}>{clipboardText}</div></div>} */}
    </div>
  );
}

export default ClipboardText;
