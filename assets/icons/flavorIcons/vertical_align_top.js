import { SvgXml } from "react-native-svg";

export default function ArrowAlignTop({ color = "black" }) {
  const svgMarkup = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="vertical_align_top">
<path id="vertical_align_top_2" d="M4.0625 4.84277V2.84277H20.0625V4.84277H4.0625ZM11.0625 20.8428V10.6428L8.4625 13.2428L7.0625 11.8428L12.0625 6.84277L17.0625 11.8428L15.6625 13.2428L13.0625 10.6428V20.8428H11.0625Z" fill="${color}"/>
</g>
</svg>`

return <SvgXml xml={svgMarkup} />;

}
