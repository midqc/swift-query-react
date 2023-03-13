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

  const clipboardContainerClasses = "cursor-pointer whitespace-nowrap text-ellipsis bg-yellow-400/20 dark:bg-yellow-600/10 backdrop-blur-lg items-center align-middle select-none border-[1px] border-black/10 dark:border-white/5  px-4 md:hover:max-w-md max-w-[10rem] hover:max-w-[15rem] max-h-8 rounded-2xl shadow-md  transform transition-all duration-300 active:scale-90 ease-in-out text-base text-neutral-700 dark:text-neutral-200 overflow-hidden shrink-0"

  const clipboardTextClasses = "relative text-yellow-600 dark:text-yellow-400  transform transition-all duration-300 ease-in-out"

  return (
    <div className="flex absolute top-62 left-0 justify-center w-screen ">
      {clipboardText && <span className={clipboardContainerClasses}>Clipboard: &#160;<span className={clipboardTextClasses}>{clipboardText}</span></span>}
    </div>
  );
}

export default ClipboardText;
