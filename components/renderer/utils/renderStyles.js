const renderStyles = {
  paras: {
    default: {
      fontSize: "medium",
    },
    "usfm:b": {
      height: "1em",
    },
    "usfm:d": {
      fontStyle: "italic",
    },
    "usfm:f": {
      fontSize: "small",
    },
    "usfm:hangingGraft": {},
    "usfm:imt": {
      fontWeight: "bold",
      fontStyle: "italic",
      fontSize: "xxx-large",
      textAlign: "center",
    },
    "usfm:imt2": {
      fontWeight: "bold",
      fontStyle: "italic",
      fontSize: "xx-large",
      textAlign: "center",
    },
    "usfm:imt3": {
      fontWeight: "bold",
      fontStyle: "italic",
      fontSize: "x-large",
      textAlign: "center",
    },
    "usfm:imt4": {
      fontWeight: "bold",
      fontStyle: "italic",
      fontSize: "large",
      textAlign: "center",
    },
    "usfm:ip": {
      textIndent: "1.5em",
    },
    "usfm:ipi": {
      paddingLeft: "1.5em",
      textIndent: "1.5em",
    },
    "usfm:io": {
      paddingLeft: "1.5em",
    },

    "usfm:iot": {
      fontWeight: "bold",
      fontSize: "large",
    },
    "usfm:is": {
      fontStyle: "italic",
      fontSize: "x-large",
    },
    "usfm:is2": {
      fontStyle: "italic",
      fontSize: "large",
    },
    "usfm:is3": {
      fontStyle: "italic",
      fontSize: "large",
    },
    "usfm:li": {
      paddingLeft: "3em",
      textIndent: "-1.5em",
    },
    "usfm:li2": {
      paddingLeft: "4.5em",
      textIndent: "-1.5em",
    },
    "usfm:li3": {
      paddingLeft: "6em",
      textIndent: "-1.5em",
    },
    "usfm:m": {},
    "usfm:mi": {
      paddingLeft: "1.5em",
    },
    "usfm:mr": {
      fontSize: "large",
      fontStyle: "italic",
    },
    "usfm:ms": {
      fontSize: "xx-large",
      fontWeight: "bold",
    },
    "usfm:ms2": {
      fontSize: "x-large",
      fontWeight: "bold",
    },
    "usfm:ms3": {
      fontSize: "large",
      fontWeight: "bold",
    },
    "usfm:ms4": {
      fontSize: "medium",
      fontStyle: "italic",
      fontWeight: "bold",
    },
    "usfm:mt": {
      fontWeight: "bold",
      fontStyle: "italic",
      fontSize: "xxx-large",
    },
    "usfm:mt2": {
      fontWeight: "bold",
      fontStyle: "italic",
      fontSize: "xx-large",
    },
    "usfm:mt3": {
      fontStyle: "italic",
      fontSize: "x-large",
    },
    "usfm:mt4": {
      fontStyle: "italic",
      fontSize: "large",
    },
    "usfm:nb": {},
    "usfm:p": {},
    "usfm:pc": {
      textAlign: "center",
    },
    "usfm:pi": {
      paddingLeft: "1.5em",
      textIndent: "1.5em",
    },
    "usfm:pi2": {
      paddingLeft: "3em",
      textIndent: "1.5em",
    },
    "usfm:pi3": {
      paddingLeft: "4.5em",
      textIndent: "1.5em",
    },
    "usfm:q": {
      paddingLeft: "1em",
      marginTop: "0.5ex",
      marginBottom: "0.5ex",
    },
    "usfm:q2": {
      paddingLeft: "2em",
      marginTop: "0.5ex",
      marginBottom: "0.5ex",
    },
    "usfm:q3": {
      paddingLeft: "3em",
      marginTop: "0.5ex",
      marginBottom: "0.5ex",
    },
    "usfm:q4": {
      paddingLeft: "4em",
      marginTop: "0.5ex",
      marginBottom: "0.5ex",
    },
    "usfm:qa": {
      fontWeight: "bold",
      fontSize: "x-large",
    },
    "usfm:qr": {
      textAlign: "right",
    },
    "usfm:r": {
      fontWeight: "bold",
    },
    "usfm:s": {
      fontSize: "x-large",
    },
    "usfm:s2": {
      fontStyle: "italic",
      fontSize: "large",
    },
    "usfm:s3": {
      fontSize: "medium",
    },
    "usfm:s4": { fontSize: "medium", fontStyle: "italic" },
    "usfm:s5": {},
    "usfm:sr": {
      fontSize: "large",
    },
    "usfm:tr": {},
    "usfm:x": {
      fontSize: "small",
    },
    "usfm:ib": {},
  },
  marks: {
    default: {},
    chapter_label: {
      fontSize: "xx-large",
      marginRight: "1em",
    },
    verses_label: {
      fontWeight: "bold",
      fontSize: "x-small",
      marginRight: "1em",
    },
  },

  wrappers: {
    default: {
      fontSize: "medium",
    },
    "usfm:pn": {
      fontSize: "medium",
      "text-decoration": "underline dashed",
    },
    "usfm:png": {
      fontSize: "medium",
      "text-decoration": "underline dotted",
    },
    "usfm:add": {
      fontStyle: "italic",
    },
    "usfm:ior": {},

    "usfm:bd": {
      fontWeight: "bold",
    },
    "usfm:bdit": {
      fontWeight: "bold",
      fontStyle: "italic",
    },
    "usfm:bk": {
      fontWeight: "bold",
    },

    chapter: {},
    "usfm:fl": {},
    "usfm:fm": {},
    "usfm:fq": {
      fontStyle: "italic",
    },
    "usfm:fqa": {
      fontStyle: "italic",
    },
    "usfm:fr": {
      fontWeight: "bold",
    },
    "usfm:ft": {},
    "usfm:it": {
      fontStyle: "italic",
    },
    "usfm:nd": {
      fontWeight: "bold",
      fontSize: "small",
      textTransform: "uppercase",
    },
    "usfm:qs": {
      float: "right",
      fontStyle: "italic",
    },
    "usfm:sc": {
      fontSize: "small",
      textTransform: "uppercase",
    },
    "usfm:tl": {
      fontStyle: "italic",
    },
    verses: {},
    "usfm:wj": {
      color: "#D00",
    },
    "usfm:xk": {},
    "usfm:xo": {
      fontWeight: "bold",
    },
    "usfm:xt": {},
  },
};

export { renderStyles, ConvertCssToReactNativeStyleOnFloor };

function ConvertCssToReactNativeStyleOnFloor(
  styleSheet,
  index,
  fontFamil = null
) {
  const multiTab = [0.75, 0.88, 1, 1.15, 1.25];
  const fontSpace = [0.5, 0.15, 0, 0, 0, 0];
  const fontSizeTab = [16, 16, 22, 24, 28, 12];
  const lineHeightTab = [24, 24, 28, 32, 36, 22];

  //  note that this function is not exaustive and need futher adding. Unfortunatly not all css
  //is compatible with react native so be sure to check the documentation when adding css
  let copyStyleSheet = { ...styleSheet };

  let fontFamily = `${fontFamil}`;
  let values = Object.values(copyStyleSheet);
  let keys = Object.keys(copyStyleSheet);
  if (keys.includes("fontStyle") || keys.includes("fontWeight")) {
    if (!keys.includes("fontSize")) {
      copyStyleSheet["fontSize"] = "medium";
    }
  }
  // if (values.includes("bold") && values.includes("italic")) {
  //   fontFamily = font + "-BoldItalic";
  //   copyStyleSheet["fontFamily"] = fontFamily;
  //   delete copyStyleSheet["fontWeight"];
  //   delete copyStyleSheet["fontStyle"];
  // }
  if (values.includes("bold")) {
    // fontFamily = fontFamily + "-Bold";
    // copyStyleSheet["fontFamily"] = fontFamily;
    delete copyStyleSheet["fontWeight"];
  } else if (values.includes("italic")) {
    fontFamily = fontFamily + "Italic";
    copyStyleSheet["fontFamily"] = fontFamily;
    delete copyStyleSheet["fontStyle"];
  }

  const thirdLayerKeysArray = Object.keys(copyStyleSheet);

  thirdLayerKeysArray.map((thirdLayerKey) => {
    if (thirdLayerKey === "float") {
      if (copyStyleSheet[thirdLayerKey] === "left") {
        copyStyleSheet["textAlign"] = "left";
        delete copyStyleSheet[thirdLayerKey];
      }
    }

    if (thirdLayerKey === "verticalAlign") {
      if (copyStyleSheet[thirdLayerKey] === "super") {
        copyStyleSheet[thirdLayerKey] = "top";
      }
    }
    if (thirdLayerKey === "textIndent") {
      if (copyStyleSheet[thirdLayerKey].includes("em")) {
        let stringToChange = copyStyleSheet[thirdLayerKey];
        stringToChange.replace("em", "");
        copyStyleSheet["marginLeft"] = parseFloat(stringToChange) * 2;
        delete copyStyleSheet[thirdLayerKey];
      }
      delete copyStyleSheet[thirdLayerKey];
    }
    if (thirdLayerKey === "text-decoration") {
      if (copyStyleSheet[thirdLayerKey] === "underline dotted") {
        copyStyleSheet["borderBottomWidth"] = 1;
        copyStyleSheet["marginBottom"] = -1;
        copyStyleSheet["borderStyle"] = "dotted";
      }
      if (copyStyleSheet[thirdLayerKey] === "underline dashed") {
        copyStyleSheet["borderBottomWidth"] = 1;
        copyStyleSheet["marginBottom"] = -1;

        copyStyleSheet["borderStyle"] = "dashed";
      }
      if (copyStyleSheet[thirdLayerKey] === "underline") {
        copyStyleSheet["borderBottomWidth"] = 1;
        copyStyleSheet["marginBottom"] = -1;
        copyStyleSheet["borderStyle"] = "solid";
      }
      delete copyStyleSheet[thirdLayerKey];
    }
    if (copyStyleSheet[thirdLayerKey] === "xx-small") {
      copyStyleSheet[thirdLayerKey] = fontSizeTab[0] * multiTab[index];
      copyStyleSheet["lineHeight"] = lineHeightTab[0] * multiTab[index];
      copyStyleSheet["letterSpacing"] = fontSpace[0] * multiTab[index];
      if (fontFamil) {
        copyStyleSheet["fontFamily"] = `${fontFamily}Medium`;
      }
    }
    if (copyStyleSheet[thirdLayerKey] === "x-small") {
      copyStyleSheet[thirdLayerKey] = fontSizeTab[5] * multiTab[index];
      copyStyleSheet["lineHeight"] = lineHeightTab[5] * multiTab[index];
      copyStyleSheet["letterSpacing"] = fontSpace[5] * multiTab[index];
      if (fontFamil) {
        copyStyleSheet["fontFamily"] = `${fontFamily}Medium`;
      }
    }
    if (copyStyleSheet[thirdLayerKey] === "small") {
      copyStyleSheet[thirdLayerKey] = fontSizeTab[0] * multiTab[index];
      copyStyleSheet["lineHeight"] = lineHeightTab[0] * multiTab[index];
      copyStyleSheet["letterSpacing"] = fontSpace[0] * multiTab[index];
      if (fontFamil) {
        copyStyleSheet["fontFamily"] = `${fontFamily}Regular`;
      }
    }
    if (copyStyleSheet[thirdLayerKey] === "medium") {
      copyStyleSheet[thirdLayerKey] = fontSizeTab[0] * multiTab[index];
      copyStyleSheet["lineHeight"] = lineHeightTab[0] * multiTab[index];
      copyStyleSheet["letterSpacing"] = fontSpace[0] * multiTab[index];
      if (fontFamil) {
        copyStyleSheet["fontFamily"] = `${fontFamily}Regular`;
      }
    }
    if (copyStyleSheet[thirdLayerKey] === "large") {
      copyStyleSheet[thirdLayerKey] = fontSizeTab[1] * multiTab[index];
      copyStyleSheet["lineHeight"] = lineHeightTab[1] * multiTab[index];
      copyStyleSheet["letterSpacing"] = fontSpace[1] * multiTab[index];
      if (fontFamil) {
        copyStyleSheet["fontFamily"] = `${fontFamily}Medium`;
      }
    }
    if (copyStyleSheet[thirdLayerKey] === "x-large") {
      copyStyleSheet[thirdLayerKey] = fontSizeTab[2] * multiTab[index];
      copyStyleSheet["lineHeight"] = lineHeightTab[2] * multiTab[index];
      copyStyleSheet["letterSpacing"] = fontSpace[2] * multiTab[index];

      if (fontFamil) {
        copyStyleSheet["fontFamily"] = `${fontFamily}Regular`;
      }
    }
    if (copyStyleSheet[thirdLayerKey] === "xx-large") {
      copyStyleSheet[thirdLayerKey] = fontSizeTab[3] * multiTab[index];
      copyStyleSheet["lineHeight"] = lineHeightTab[3] * multiTab[index];
      copyStyleSheet["letterSpacing"] = fontSpace[3] * multiTab[index];

      if (fontFamil) {
        copyStyleSheet["fontFamily"] = `${fontFamily}Regular`;
      }
    }
    if (copyStyleSheet[thirdLayerKey] === "xxx-large") {
      copyStyleSheet[thirdLayerKey] = fontSizeTab[4] * multiTab[index];
      copyStyleSheet["lineHeight"] = lineHeightTab[4] * multiTab[index];
      copyStyleSheet["letterSpacing"] = fontSpace[4] * multiTab[index];

      if (fontFamil) {
        copyStyleSheet["fontFamily"] = `${fontFamily}Regular`;
      }
    }
    if (typeof copyStyleSheet[thirdLayerKey] === typeof "string") {
      if (copyStyleSheet[thirdLayerKey].includes("em")) {
        let stringToChange = copyStyleSheet[thirdLayerKey];
        stringToChange.replace("em", "");
        copyStyleSheet[thirdLayerKey] = parseFloat(stringToChange) * 4;
        return;
      }
      if (copyStyleSheet[thirdLayerKey].includes("ex")) {
        let stringToChange = copyStyleSheet[thirdLayerKey];
        stringToChange.replace("ex", "");
        copyStyleSheet[thirdLayerKey] = parseFloat(stringToChange);
        return;
      }
      if (copyStyleSheet[thirdLayerKey].includes("px")) {
        let stringToChange = copyStyleSheet[thirdLayerKey];
        stringToChange.replace("px", "");
        copyStyleSheet[thirdLayerKey] = parseFloat(stringToChange);
        return;
      }
    }
  });

  return copyStyleSheet;
}
