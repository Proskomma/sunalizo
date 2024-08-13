import React, { useState, useEffect, useContext } from "react";
import { ScrollView, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { SofriaRenderFromProskomma } from "proskomma-json-tools";
import sofria2WebActions from "../utils/sofria2WebActions";
import { renderers } from "../utils/renderReactNative";
import { ColorThemeContext } from "../../../context/colorThemeContext";
import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";
export function ReadingScreenAllBook({
  currentChap,
  setIsOnTop,
  pk,
  fontSize,
  fontFamily,
  documentResult,
  bibleFormat,
}) {
  const [chapterBuffer, setChapterBuffer] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { colors, theme } = useContext(ColorThemeContext);
  const [option, setOption] = useState({
    showWordAtts: false,
    showTitles: true,
    showHeadings: true,
    showIntroductions: true,
    showFootnotes: true,
    showXrefs: false,
    showParaStyles: true,
    showCharacterMarkup: true,
    showVersesLabels: true,
    showChapterLabels: true,
    showFirstVerseLabel: false,
    selectedBcvNotes: [1],
    chapters: [`${currentChap}`],
    byVerse: bibleFormat === "byVerse",
    excludeScopeTypes: ["milestone", "attribute", "spanWithAtts"],
    bcvNotesCallback: (bcv) => {},
    fontConfig: {
      fontFamily: fontFamily,
      fontSize: fontSize,
      fontColor: {
        fontText: colors.schemes[theme].onSurface,
        fontChap: colors.schemes[theme].onSurface,
        fontVerse: colors.schemes[theme].onSurface,
        surface: colors.schemes[theme].surface,
        surfaceVariant: colors.schemes[theme].surfaceVariant,
      },
    },

    renderers,
  });
  const styles = StyleSheet.create({
    scrollContainer: {
      backgroundColor: colors.schemes[theme].surface,
      paddingHorizontal: 24,
    },
    activityContainer: {
      width: "100%",
      height: "100%",
      padding: 5,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.schemes[theme].surface,
    },
  });

  useEffect(() => {
    setOption((prev) => ({
      ...prev,
      chapters: [`${currentChap}`],
      byVerse: bibleFormat === "byVerse",
      fontConfig: {
        fontFamily: fontFamily,
        fontSize: fontSize,
        fontColor: {
          fontText: colors.schemes[theme].onSurface,
          fontChap: colors.schemes[theme].onSurface,
          fontVerse: colors.schemes[theme].onSurface,
          surface: colors.schemes[theme].surface,
          surfaceVariant: colors.schemes[theme].surfaceVariant,
        },
      },
    }));
  }, [currentChap, fontSize, fontFamily, bibleFormat, theme]);

  useEffect(() => {
    setIsLoading(true);
  }, [documentResult, option]);

  useEffect(() => {
    if (documentResult) {
      const timeoutId = setTimeout(() => {
        try {
          const result = renderDoc(documentResult, pk, option);
          setChapterBuffer(result.paras);
        } catch (error) {}
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [documentResult, option]);

  useEffect(() => {
    setIsLoading(false);
  }, [chapterBuffer]);

  return isLoading ? (
    <View style={styles.activityContainer}>
      <ActivityIndicator />
    </View>
  ) : (
    <ScrollView
      onScroll={(e) => setIsOnTop(e.nativeEvent.contentOffset.y > 0)}
      style={styles.scrollContainer}
    >
      {chapterBuffer.map((c, id) => (
        <View key={id}>{c}</View>
      ))}
    </ScrollView>
  );
}

export function renderItems(items, pk, option) {
  let output = [];
  let workspace = { tr: 0 };
  let context = {
    sequences: [
      {
        type: "graft",
        subType: "euuhh",
        blockN: 1,
        sequence: "non",
      },
    ],
  };
  let config = option;

  const renderer = new SofriaRenderFromProskomma({
    proskomma: pk,
    actions: sofria2WebActions,
  });

  let t = {};
  items.map((e) => {
    let rI = renderItem(e);
    if (rI) output.push(rI);
  });

  return output;
}
export function renderDoc(documentResult, pk, option) {
  let output = {};
  let workspace = { tr: 0 };
  let context = {};
  let config = option;
  if (documentResult) {
    const renderer = new SofriaRenderFromProskomma({
      proskomma: pk,
      actions: sofria2WebActions,
    });

    try {
      renderer.renderDocument1({
        docId: documentResult.data.document.id,
        config,
        output,
        workspace,
        context,
      });
    } catch (err) {
      console.error("Renderer error:", err);
      throw err;
    }
  }
  return output;
}

export async function useDocumentQuery(livre, bible, pk) {
  let documentQuery = `
          {
            document(docSetId: "${bible}" withBook: "${livre}"){
              id
              cvIndexes {
                chapter
              }
          }}
          `;
  const documentResult = await pk.gqlQuery(documentQuery);
  return documentResult;
}

function BibleSelection({ pk, setBibleName, bible, setBible, setVisible }) {
  const [checked, setChecked] = React.useState(bible);
  let docSetids = useRef(
    pk.gqlQuerySync(
      `{
      docSets(withBook: "TIT") 
      {
        tags
        id
      }
    }`
    )
  );
  return (
    <View>
      {docSetids.current.data.docSets.map((doc, id) => (
        <View
          key={id}
          style={{ justifyContent: "space-between", flexDirection: "row" }}
        >
          <View style={{ width: "80%", marginTop: 10 }}>
            <Text style={{ color: "black" }}>
              {doc.tags.length > 0 ? doc.tags[0].split(":")[1] : doc.id}
            </Text>
          </View>
          <RadioButton
            style={{ alignSelf: "end" }}
            value={doc.id}
            color="blue"
            status={checked === doc.id ? "checked" : "unchecked"}
            onPress={() => {
              setBibleName(
                doc.tags.length > 0 ? doc.tags[0].split(":")[1] : doc.id
              );
              setChecked(`${doc.id}`);
              setBible(doc.id);
              setVisible(false);
            }}
          />
        </View>
      ))}
    </View>
  );
}
export { BibleSelection };

export function renderItem(item) {
  if (item.type === "token") {
    return <Text>{item.payload}</Text>;
  }
}

const camelCaseToSnakeCase = (s) => {
  const ret = [];
  for (const c of s.split("")) {
    if (c.toUpperCase() === c && c.toLowerCase() !== c) {
      ret.push(`_${c.toLowerCase()}`);
    } else {
      ret.push(c);
    }
  }
  return ret.join("");
};
