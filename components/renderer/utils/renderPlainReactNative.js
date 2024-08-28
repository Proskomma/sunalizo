import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  renderStyles as rs,
  ConvertCssToReactNativeStyle,
} from "./renderStyles";
import { StyleSheet } from "react-native";
import { Table, Cell, TableWrapper } from "react-native-reanimated-table";



function InlineElement(props) {
  const [display, setDisplay] = useState(false);
  const toggleDisplay = () => setDisplay(!display);
  if (display) {
    return <Text>{props.children}</Text>;
  } else {
    return <Text>{props.linkText}</Text>;
  }
}

const renderers = {
  text: ({ word, idWord, workspace, fontConfig }) => {
    return <Text style={{}}>{word}</Text>;
  },

  chapter_label: (number, id) => <Text>{number}</Text>,
  verses_label: (number, bcv, bcvCallback, id) => <Text>{number}</Text>,
  paragraph: (subType, content, footnoteNo, id) => {
    return <Text>{content}</Text>;
  },

  wrapper: (atts, subType, content, id) => {

    const updatedContent = content.map((element, index) => {
      return React.cloneElement(element, {
        style: { paddingTop: 0 },
        key: `wrapper_content_${index} `,
      });
    });

      return (
        <View
          key={`wrapper_${id}`}
        >
          {updatedContent}
        </View>
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
