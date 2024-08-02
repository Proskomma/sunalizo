import { SvgXml } from "react-native-svg";

export default function SelectedIcon({ color = "black" }) {
  const svgMarkup = `
<svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Selected icon">
<path id="icon" d="M7.50012 12.1274L4.37262 8.99988L3.30762 10.0574L7.50012 14.2499L16.5001 5.24988L15.4426 4.19238L7.50012 12.1274Z" fill="${color}"/>
</g>
</svg>`;
  return <SvgXml xml={svgMarkup} />;
}
