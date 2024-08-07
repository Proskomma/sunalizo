import React from 'react';
import { SvgXml } from 'react-native-svg';

export default function TextFormatIcon({ color = 'black' }) {
  const svgMarkup = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="text_format">
        <path id="Vector" d="M5 17.5V19.5H19V17.5H5ZM9.5 13.3H14.5L15.4 15.5H17.5L12.75 4.5H11.25L6.5 15.5H8.6L9.5 13.3ZM12 6.48L13.87 11.5H10.13L12 6.48Z" fill="${color}"/>
      </g>
    </svg>
  `;

  return <SvgXml xml={svgMarkup} />;
}