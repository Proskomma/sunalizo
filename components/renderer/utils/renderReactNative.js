import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import {
  renderStyles as rs,
  ConvertCssToReactNativeStyleOnFloor,
} from "./renderStyles";
import { StyleSheet } from "react-native";
import { Table, Cell, TableWrapper } from "react-native-reanimated-table";
import { Text, Divider } from "react-native-paper";

function getStyles(type, subType, indexForStyle, fontFamily = null) {
  // let subTypeWithIntro = subType.split(':')[1][0] === 'i'? subType.split(':')[0]+':'+subType.split(':')[1].substring(1):subType
  if (!rs[type]) {
    throw new Error(`Unknown style type '${type}'`);
  }
  if (!rs[type][subType]) {
    console.log(`Unknown style '${type}' '${subType}'`);
    if (indexForStyle > -1 && fontFamily) {
      return ConvertCssToReactNativeStyleOnFloor(
        rs[type]["default"],
        indexForStyle,
        fontFamily
      );
    } else {
      return ConvertCssToReactNativeStyleOnFloor(rs[type]["default"]);
    }
  }
  if (indexForStyle > -1 && fontFamily) {
    return ConvertCssToReactNativeStyleOnFloor(
      rs[type][subType],
      indexForStyle,
      fontFamily
    );
  }
  return ConvertCssToReactNativeStyleOnFloor(rs[type][subType]);
}

function InlineElement(props) {
  const [display, setDisplay] = useState(false);
  const color = props.fontConfig?.fontColor?.fontText
    ? props.fontConfig.fontColor.fontText
    : "black";
  const backgroundColor = props.fontConfig?.fontColor?.surfaceVariant
    ? props.fontConfig.fontColor.surfaceVariant
    : "#CCC";
  const toggleDisplay = () => setDisplay(!display);
  if (display) {
    return (
      <Text
        key={`Inline ${Math.random()} `}
        style={{
          marginLeft: "10%",
          marginRight: "10%",
          marginTop: "5%",
          marginBottom: "5%",
          backgroundColor: backgroundColor,
          color: color,
          marginBottom: 16,
          borderWidth: 1,
          borderRadius: 4,
          width: "80%",
          flexDirection: "row",
        }}
        onPress={toggleDisplay}
      >
        {props.children}
      </Text>
    );
  } else {
    return (
      <Text
        key={`Inline_${Math.random()}`}
        style={{
          verticalAlign: "top",
          fontSize: 10,
          fontWeight: "bold",
          marginRight: 4,
          marginLeft: 4,
          marginTop: 15,
          padding: 2,
          color: color,
          backgroundColor: backgroundColor,
        }}
        onPress={toggleDisplay}
      >
        {props.linkText}
      </Text>
    );
  }
}

const renderers = {
  divider: () => {
    return <View style={{ height: 1, width: "100%" }} />;
  },
  text: ({ word, idWord, workspace, fontConfig }) => {
    if (fontConfig && fontConfig.fontFamily != "default") {
      const color = fontConfig.fontColor
        ? fontConfig.fontColor.fontText
        : "black";

      return (
        <View key={idWord} style={{}}>
          <Text
            style={{
              fontFamily: fontConfig.fontFamily,
              ...ConvertCssToReactNativeStyleOnFloor(
                { fontSize: "medium" },
                parseInt(fontConfig.fontSize),
                fontConfig.fontFamily
              ),
              color: color,
            }}
          >
            {word}
          </Text>
        </View>
      );
    }
    return (
      <View key={idWord} style={{}}>
        <Text>{word}</Text>
      </View>
    );
  },
  chapter_label: (number, id, fontConfig) => {
    const color = fontConfig?.fontColor
      ? fontConfig.fontColor.fontChap
      : "black";

    return (
      <View onPress={() => {}} key={`chapter_label_${id}`}>
        <Text
          style={[
            {
              color: color,
              alignSelf: "flex-start",
              ...getStyles(
                "marks",
                "chapter_label",
                fontConfig.fontSize,
                fontConfig.fontFamily
              ),
            },
          ]}
        >
          {number}
        </Text>
      </View>
    );
  },
  verses_label: (number, bcv, bcvCallback, id, fontConfig) => {
    const color = fontConfig?.fontColor
      ? fontConfig.fontColor.fontVerse
      : "black";

    if (bcv && bcv.length === 3) {
      return (
        <TouchableOpacity
          key={id}
          style={{}}
          onPress={() => {
            bcvCallback(bcv);
          }}
        >
          <Text
            key={`verse_label${id}`}
            style={{
              color: color,
              ...getStyles(
                "marks",
                "verses_label",
                fontConfig.fontSize,
                fontConfig.fontFamily
              ),
              fontFamily: fontConfig.fontFamily + "Bold",
              //   color: "#00D",
              //   textDecorationLine: "underline",
            }}
          >
            {number}
          </Text>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity
        onPress={() => {
          bcvCallback(bcv);
        }}
        key={`versesLabel_${id}`}
        style={{ flexDirection: "row", paddingTop: 10 }}
      >
        <Text
          style={{
            ...getStyles(
              "marks",
              "verses_label",
              fontConfig.fontSize,
              fontConfig.fontFamily
            ),
          }}
        >
          {number}
        </Text>
      </TouchableOpacity>
    );
  },
  paragraph: (subType, content, footnoteNo, id, fontConfig) => {
    let TitleContent = {};
    const color = fontConfig?.fontColor
      ? fontConfig.fontColor.fontText
      : "black";

    const tableIsViewText = [
      "usfm:mt",
      "usfm:mt2",
      "usfm:mt3",
      "usfm:mt4",
      "usfm:s",
      "usfm:s2",
      "usfm:s3",
      "usfm:s4",
      "usfm:imt",
      "usfm:imt2",
      "usfm:imt3",
      "usfm:imt4",
      "usfm:is",
      "usfm:is2",
      "usfm:is3",
      "usfm:is4",
    ];

    if (tableIsViewText.includes(subType)) {
      const updatedContent = content.map((element, index) => {
        const updatedChildren = React.Children.map(
          element.props.children,
          (child, childIndex) => {
            return React.cloneElement(child, {
              style: {
                ...getStyles(
                  "paras",
                  subType,
                  fontConfig.fontSize,
                  fontConfig.fontFamily
                ),
                display: "flex",
                flexDirection: "row",
                color: color,
              },
              key: `title_subTitle_${index}_${childIndex}`,
            });
          }
        );
        return React.cloneElement(
          element,
          { key: element.key || `parent_${index}` },
          updatedChildren
        );
      });
      TitleContent = updatedContent;
    }

    return ["usfm:f", "usfm:x"].includes(subType) ? (
      <InlineElement
        fontConfig={fontConfig}
        key={`paragraph_${id}`}
        style={[
          getStyles(
            "paras",
            subType,
            fontConfig.fontSize,
            fontConfig.fontFamily
          ),
        ]}
        linkText={subType === "usfm:f" ? `${footnoteNo}` : "*"}
      >
        {content}
      </InlineElement>
    ) : tableIsViewText.includes(subType) ? (
      <View
        key={`paraphraphe_${id} `}
        style={{
          flexWrap: "wrap",
          flexDirection: "row",
          alignItems: "flex-start",
          marginVertical: 8,
        }}
      >
        {TitleContent}
      </View>
    ) : (
      <View
        key={`parapgraphe_${id} `}
        style={{
          ...getStyles(
            "paras",
            subType,
            fontConfig.fontSize,
            fontConfig.fontFamily
          ),
          flexWrap: "wrap",
          flexDirection: "row",
          alignItems: "flex-end",

          marginBottom: ["usfm:q", "usfm:q2", "usfm:q3", "usfm:b"].includes(
            subType
          )
            ? 0
            : 8,
        }}
      >
        {content}
      </View>
    );
  },

  wrapper: (atts, subType, content, id, fontConfig) => {
    const color = fontConfig?.fontColor
      ? fontConfig.fontColor.fontText
      : "black";

    if (subType.includes("usfm:it")) {
      return (
        <View
          key={`wrapper_${id} `}
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          {content.map((element, index) => {
            const updatedChildren = React.Children.map(
              element.props.children,
              (child, childIndex) => {
                return React.cloneElement(child, {
                  style: {
                    ...getStyles(
                      "wrappers",
                      subType,
                      fontConfig.fontSize,
                      fontConfig.fontFamily
                    ),
                    color: color,
                  },
                  key: `italic_text_intro${index}_${childIndex}`,
                });
              }
            );
            return React.cloneElement(
              element,
              { key: element.key || `parent_${index}` },
              updatedChildren
            );
          })}
        </View>
      );
    }
    const updatedContent = content.map((element, index) => {
      const updatedChildren = React.Children.map(
        element.props.children,
        (child, childIndex) => {
          return React.cloneElement(child, {
            style: {
              ...getStyles(
                "wrappers",
                subType,
                fontConfig.fontSize,
                fontConfig.fontFamily
              ),
              color: color,
              borderColor: color,
            },
            key: `wrapper${index}_${childIndex}`,
          });
        }
      );
      return React.cloneElement(
        element,
        { key: element.key || `parent_${index}` },
        updatedChildren
      );
    });

    if (["usfm:f", "usfm:ft", "usfm:fr"].includes(subType)) {
      return (
        <View
          key={`wrapper_${id}`}
          style={{
            ...getStyles(
              "wrappers",
              subType,
              fontConfig.fontSize,
              fontConfig.fontFamily
            ),
            flexDirection: "row",
            color: color,
          }}
        >
          {updatedContent}
        </View>
      );
    }
    return subType === "cell" ? (
      atts.role === "body" ? (
        <Cell
          key={`cell_${id}`}
          textStyle={{ textAlign: atts.alignment }}
          data={updatedContent}
        />
      ) : (
        <Cell
          key={`cell_${id}`}
          textStyle={{ fontWeight: "bold", textAlign: atts.alignment }}
          data={updatedContent}
        />
      )
    ) : (
      <>{updatedContent}</>
    );
  },
  wWrapper: (atts, content, id) =>
    Object.keys(atts).length === 0 ? (
      content
    ) : (
      <View
        key={`wWrapper_${id}`}
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Text key={`Text_wWrapper_${id}`}>{content}</Text>
        <Text
          key={`wWrapper_${id}`}
          style={{
            fontSize: 9,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {`lemma = ${id}` +
            Object.entries(atts)
              .filter((a) => a[0] === "lemma")
              .map((a) => {
                return `${a[1]}`;
              }) +
            `\n` +
            `content =` +
            Object.entries(atts)
              .filter((a) => a[0] === "content")
              .map((a) => {
                return `${a[1]}`;
              })}
        </Text>
      </View>
    ),
  mergeParas: (paras) => paras,
  table: (content, id) => (
    <View key={`table_${id}`} style={{ flex: 1 }}>
      <Table
        borderStyle={{ borderWidth: 1 }}
        style={{ flexDirection: "column" }}
      >
        {content}
      </Table>
    </View>
  ),
  row: (content, id) => (
    <TableWrapper key={`row_${id}`} style={{ flexDirection: "row" }}>
      {content}
    </TableWrapper>
  ),
};

export { renderers };
