import * as React from "react";

export const ClipboardIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    width={props.width}
    height={props.height}
    viewBox="0 0 62 62"
    style={{
      overflow: "visible",
      enableBackground: "new 0 0 62 62",
    }}
    xmlSpace="preserve"
    {...props}
  >
    <style type="text/css">{"\n\t.st0{fill:{#212121;}}\n"}</style>
    <defs />
    <g>
      <path
      fill={props.fill}
        className={props.classes}
        d="M48.8,62H13.2C5.9,62,0,56.1,0,48.8V29.3c0-1.2,1-2.2,2.2-2.2h57.7c1.2,0,2.2,1,2.2,2.2v19.5 C62,56.1,56.1,62,48.8,62z"
      />
      <path
      fill={props.fill}
      className={props.classes}
        d="M62,14.3v6.7c0,1.2-1,2.2-2.2,2.2H2.2c-1.2,0-2.2-1-2.2-2.2v-6.7c0-3.6,3-6.6,6.6-6.6l12,0 c0.8,0,1.6-0.5,1.9-1.2C22.5,2.7,26.4,0,31,0c4.6,0,8.5,2.7,10.4,6.5c0.4,0.7,1.1,1.2,1.9,1.2l12,0C59,7.7,62,10.7,62,14.3z"
      />
    </g>
  </svg>
);
