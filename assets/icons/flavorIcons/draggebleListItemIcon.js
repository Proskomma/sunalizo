import { SvgXml } from "react-native-svg";

export default function DraggebleListItemIcon({ color = "black" }) {
  const svgMarkup = ` <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <mask
      id="mask0_2621_8226"
      style="mask-type:alpha"
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="24"
      height="24"
    >
      <rect width="24" height="24" fill="#D9D9D9" />
    </mask>
    <g mask="url(#mask0_2621_8226)">
      <path d="M4 15V13H20V15H4ZM4 11V9H20V11H4Z" fill="${color}" />
    </g>
  </svg>`;
  return <SvgXml xml={svgMarkup} />;
}
