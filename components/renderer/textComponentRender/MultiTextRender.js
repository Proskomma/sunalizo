import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  View,
} from "react-native";
import { ActivityIndicator, Badge } from "react-native-paper";
import { SofriaRenderFromProskomma } from "proskomma-json-tools";
import sofria2WebActions from "../utils/sofria2WebActions";
import { renderers } from "../utils/renderReactNative";
import { Text } from "react-native-paper";
import { ColorThemeContext } from "../../../context/colorThemeContext";
import { StyleSheet } from "react-native";
import { List } from "react-native-paper";
import HandRaised from "../../../assets/icons/flavorIcons/handRaised";
import Carousel, { Pagination } from "react-native-reanimated-carousel";
export function MultiTextRender({
  currentChap,
  setIsOnTop,
  pk,
  book,
  fontSize,
  fontFamily,
  documentResult,
  bibleFormat,
  multiBibleDocSetId,
  questionId = "worldview_sq_1",
}) {
  const [currentVerse, setCurrentverse] = useState(3);
  const [chapterBuffer, setChapterBuffer] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [multiDocIdResult, setMultiDocIdResult] = useState([]);
  const { colors, theme } = useContext(ColorThemeContext);
  const { width } = Dimensions.get("window");

  const dataQuestion = pk.gqlQuerySync(`
    {
      docSet(id: "${questionId}") {
      tags
        document(bookCode: "${book}") {
          kvSequences {
            entries(keyMatches: "^${currentChap}:${currentVerse}(-|$)") {
              itemGroups {
                text
                scopeLabels
              }
            }
          }
        }
      }
    }
  `);

  const questions =
    dataQuestion?.data?.docSet?.document?.kvSequences[0].entries.flatMap(
      (e) =>
        e.itemGroups
          .filter((i) => i.scopeLabels.includes("kvField/question"))
          .map((g) => ({ text: g.text })) // Simplify the data structure for the carousel
    );

  const [option, setOption] = useState({
    showWordAtts: false,
    showTitles: true,
    showHeadings: true,
    showIntroductions: true,
    showFootnotes: false,
    showXrefs: false,
    showParaStyles: false,
    showCharacterMarkup: false,
    showVersesLabels: true,
    showChapterLabels: true,
    showFirstVerseLabel: true,
    selectedBcvNotes: [1],
    chapters: [`${currentChap}`],
    verses: ["1"],
    byVerse: false,
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
      gap: 20,
      display: "flex",
      flexDirection: "column",
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
      byVerse: false,
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
      const timeoutId = setTimeout(async () => {
        try {
          let result2 = [];
          multiBibleDocSetId.map((e) =>
            useDocumentQuery(book, e, pk).then((t) =>
              result2.push(renderDoc(t, pk, option).paras)
            )
          );
          console.log(result2);
          setMultiDocIdResult(result2);
          const result = renderDoc(documentResult, pk, option);
          setChapterBuffer(result.paras);
        } catch (error) {}
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [documentResult, option, multiBibleDocSetId]);

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
      style={{ flex: 1, backgroundColor: colors.schemes[theme].surface }}
    >
      <View style={styles.scrollContainer}>
        {chapterBuffer}
        <SafeAreaView
          style={{
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
            flex: 1,

            backgroundColor: colors.schemes[theme].surfaceContainerHigh,
          }}
        >
          <View
            style={{
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              alignItems: "center",
              margin: "auto",
              width: "100%",
              backgroundColor: colors.schemes[theme].surfaceVariant,
            }}
          >
            <Text
              variant="labelSmall"
              style={{
                color: colors.schemes[theme].onSurfaceVariant,
              }}
            >
              {dataQuestion?.data?.docSet?.tags?.length > 0
                ? dataQuestion.data.docSet.tags[0].split(":")[1]
                : questionId}
            </Text>
          </View>
          {questions?
          <List.Accordion
            style={{
              backgroundColor: colors.schemes[theme].surfaceContainerHigh,
            }}
            title="Questions"
            left={(props) => (
              <List.Icon
                {...props}
                icon={() => (
                  <HandRaised color={colors.schemes[theme].onSurface} />
                )}
              />
            )}
          >
            <View style={{ height: 8 }}></View>
            <Carousel
              loop={false}
              width={width - 48}
              conta
              style={{
                width: "100%",
                minHeight: 60,
                maxHeight:500,
                borderBottomLeftRadius: 12,
                borderBottomRightRadius: 12,
              }}
              data={questions}
              scrollAnimationDuration={1000} // Customize animation duration
              renderItem={({ item, index }) => (
                <View
                  key={index}
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    gap: 8,
                    borderBottomLeftRadius: 12,
                    borderBottomRightRadius: 12,
                  }}
                >
                  <Text
                    variant="bodyLarge"
                    style={{ flex: 1, paddingHorizontal: 16 }}
                  >
                    {item.text}
                  </Text>
                  <View
                    style={{
                      justifyContent: "center",
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      gap: 8,
                    }}
                  >
                    {questions.map((e, id) => (
                      <View
                        style={
                          id === index
                            ? {
                                width: 12,
                                height: 4,
                                borderRadius: 4,
                                backgroundColor: colors.schemes[theme].primary,
                              }
                            : {
                                width: 4,
                                height: 4,
                                borderRadius: 4,
                                backgroundColor: colors.schemes[theme].primary,
                              }
                        }
                      />
                    ))}
                  </View>
                </View>
              )}
            />
          </List.Accordion>:<></>}
        </SafeAreaView>
        <ScrollView
          horizontal={true}
          style={{ display: "flex", flexDirection: "row", gap: 8 }}
        >
          {multiDocIdResult.length > 0 ? (
            multiDocIdResult.map((e) => (
              <>
                <View
                  style={{
                    width: width * 0.85 - 45,
                    flex: 1,
                    borderBottomRightRadius: 28,
                    borderBottomLeftRadius: 28,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    backgroundColor: colors.schemes[theme].surfaceContainerLow,
                    gap: 8,
                  }}
                >
                  <View
                    style={{
                      borderTopLeftRadius: 28,
                      borderTopRightRadius: 28,
                      alignItems: "center",

                      margin: "auto",
                      width: "100%",
                      backgroundColor: colors.schemes[theme].tertiaryContainer,
                    }}
                  >
                    <Text
                      variant="labelSmall"
                      style={{
                        color: colors.schemes[theme].onTertiaryContainer,
                      }}
                    >
                      PSLE
                    </Text>
                  </View>
                  <View style={{ padding: 16, paddingTop: 0 }}>{e}</View>
                </View>
                <View style={{ width: 8 }} />
              </>
            ))
          ) : (
            <></>
          )}
        </ScrollView>
      </View>
    </ScrollView>
  );
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
