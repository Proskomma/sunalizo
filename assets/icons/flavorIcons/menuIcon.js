import React from 'react';
import { SvgXml } from 'react-native-svg';

export default function MenuIcon({ color = 'black' }) {
  const svgMarkup = `
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="MenuIcon">
        <path
          id="icon"
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M3 8V6H21V8H3ZM3 13H21V11H3V13ZM3 18H21V16H3V18Z"
          fill="${color}"
        />
      </g>
    </svg>
  `;

  return <SvgXml xml={svgMarkup} />;
}
