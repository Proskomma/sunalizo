import React from "react";
import { SvgXml } from "react-native-svg";

export default function MinusIcon({ color = "black",size=24 }) {
  const svgMarkup = `
 <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none">
  <path d="M19 13H5V11H19V13Z" fill="${color}"/>
</svg>
  `;

  return <SvgXml xml={svgMarkup} />;
}
