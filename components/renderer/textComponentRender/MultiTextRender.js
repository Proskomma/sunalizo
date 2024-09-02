import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityIndicator, Badge, Divider } from "react-native-paper";
import { SofriaRenderFromProskomma } from "proskomma-json-tools";
import sofria2WebActions from "../utils/sofria2WebActions";
import { renderers } from "../utils/renderReactNative";

import { Text } from "react-native-paper";
import { ColorThemeContext } from "../../../context/colorThemeContext";
import { StyleSheet } from "react-native";
import { List } from "react-native-paper";
import HandRaised from "../../../assets/icons/flavorIcons/handRaised";
import Carousel, { Pagination } from "react-native-reanimated-carousel";
import { useMemo } from "react";
import { NavigationContext } from "../../../context/navigationContext";
import { ProskommaContext } from "../../../context/proskommaContext";
import { TextOptionContext } from "../../../context/textOptionContext";
import Markdown from "react-native-markdown-display";

export function MultiTextRender({}) {
  const {
    docSetId,
    bookCode,
    currentChap,
    secondariesDocSetIds,
    questionDocSetId,
  } = useContext(NavigationContext);
  const { textHeight } = useContext(TextOptionContext);
  const { pk } = useContext(ProskommaContext);
  const [docTags, setDocTags] = useState();
  const [chapterBuffer, setChapterBuffer] = useState([]);
  const [isLoadingMainText, setIsLoadingMainText] = useState(true);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(true);
  const [isLoadingSecondTexts, setIsLoadingSecondTexts] = useState(
    new Array(secondariesDocSetIds.length).fill(true)
  );

  const [multiDocIdResult, setMultiDocIdResult] = useState(
    new Array(secondariesDocSetIds.length).fill([])
  );
  const { colors, theme } = useContext(ColorThemeContext);
  const { width } = Dimensions.get("window");
  const [dataQuestion, setDataQuestion] = useState(new Array(200).fill([]));

  const [fontFamily, setFontFamily] = useState("NotoSans");
  const styles = StyleSheet.create({
    scrollContainer: {
      backgroundColor: colors.schemes[theme].surface,
      paddingHorizontal: 24,
      gap: 20,
      display: "flex",
      flexDirection: "column",
    },
    activityContainer: {
      width: 100,
      height: 100,
      padding: 0,

      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
    },
  });
  useEffect(() => {
    setIsLoadingMainText(true);
    setIsLoadingQuestion(true);
    setIsLoadingSecondTexts(new Array(secondariesDocSetIds.length).fill(true));
  }, []);

  useEffect(() => {
    getTagsDocSet(secondariesDocSetIds, pk).then((e) => setDocTags(e));
  }, [secondariesDocSetIds]);

  useEffect(() => {
    const fetchQuestionsAsync = async () => {
      try {
        // Fetch verse ranges first
        const verseRangesResponse = await pk.gqlQuery(`
          {
            docSet(id:"${docSetId}") {
              document(bookCode: "${bookCode}") {
                cvIndex(chapter: ${currentChap}) {
                  verses {
                    verse {
                      verseRange
                    }
                  }
                }
              }
            }
          }
        `);

        let testResponse = await pk.gqlQuery(`
          {
            docSet(id: "${questionDocSetId}") {
              document(bookCode: "${bookCode}") {
                kvSequences {
                  entries {
                    key
                  }
                }
              }
            }
          }
        `);

        // Convert the keys to a single string
        const initialValue = "/";
        testResponse = testResponse.data.docSet.document.kvSequences[0].entries
          .map((e) => e.key)
          .reduce(
            (accumulator, currentValue) => accumulator + currentValue + "/",
            initialValue
          );

        // Extract verse ranges
        const verseRanges =
          verseRangesResponse.data.docSet.document.cvIndex.verses
            .map((v) => v.verse)
            .filter((e) => e.length > 0)
            .map((e) => e[0].verseRange);

        // Create a new array to store questions
        let dataQuestionToBeUpdate = [...dataQuestion];
        verseRanges.forEach((verseRange, id) => {
          try {
            const re = new RegExp(`/${currentChap}:${verseRange}(-|/)`);

            if (re.test(testResponse)) {
              dataQuestionToBeUpdate[id] = [
                { text: "toBeFetch", verse: verseRange },
              ];
            }
          } catch (error) {
            console.error(`Error processing verse range ${verseRange}:`, error);
          }
        });

        // Update state with new questions
        setDataQuestion(dataQuestionToBeUpdate);
      } catch (error) {
        console.error("Error fetching verse ranges:", error);
      }
      setIsLoadingQuestion(false);
    };

    // Call the async function
    fetchQuestionsAsync();
  }, [questionDocSetId, bookCode, currentChap]);

  const multiTab = [0.75, 0.88, 1, 1.15, 1.25];

  const [option, setOption] = useState({
    showWordAtts: false,
    showTitles: false,
    showHeadings: false,
    showIntroductions: false,
    showFootnotes: false,
    showXrefs: false,
    showParaStyles: true,
    showCharacterMarkup: true,
    showVersesLabels: true,
    showChapterLabels: true,
    showFirstVerseLabel: true,
    selectedBcvNotes: [1],
    chapters: [`${currentChap}`],
    byVerseExperimental: true,
    byVerse: false,
    excludeScopeTypes: ["milestone/", "attribute/", "spanWithAtts/"],

    bcvNotesCallback: (bcv) => {},
    fontConfig: {
      fontFamily: fontFamily,
      fontSize: textHeight,
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

  useEffect(() => {

    setOption((prev) => ({
      ...prev,
      chapters: [`${currentChap}`],
      byVerse: false,
      fontConfig: {
        fontFamily: fontFamily,
        fontSize: textHeight,
        fontColor: {
          fontText: colors.schemes[theme].onSurface,
          fontChap: colors.schemes[theme].onSurface,
          fontVerse: colors.schemes[theme].onSurface,
          surface: colors.schemes[theme].surface,
          surfaceVariant: colors.schemes[theme].surfaceVariant,
        },
      },
    }));
  }, [currentChap, textHeight, fontFamily, theme]);

  useEffect(() => {
    if (docSetId) {

      (async () => {
        try {
          setIsLoadingMainText(true); // Start loading main text

          // Delay the execution to allow UI to render the loading indicator
          setTimeout(async () => {
            const info = await useDocumentQueryJustId(bookCode, docSetId, pk);
            const result = renderDoc(info, pk, option);
            setChapterBuffer(result.paras);
            setIsLoadingMainText(false); // End loading main text
          }, 0); // The delay can be 0ms; it's just to push this operation to the end of the event loop
        } catch (error) {
          console.error(error);
          setIsLoadingMainText(false); // End loading main text in case of error
        }
      })();
    }
  }, [option.fontConfig.fontSize, theme, currentChap, docSetId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingSecondTexts(
          new Array(secondariesDocSetIds.length).fill(true)
        ); // Start loading secondary texts

        for (let i = 0; i < secondariesDocSetIds.length; i++) {
          setTimeout(async () => {
            const r = await useDocumentQueryJustId(
              bookCode,
              secondariesDocSetIds[i],
              pk
            );

            renderDocAsync(r, pk, option)
              .then((e) => {
                setMultiDocIdResult((prev) => {
                  let p = [...prev];
                  p[i] = e.paras;
                  return p;
                });
              })
              .catch((error) => {
                console.error("An error occurred:", error);
              });

            setIsLoadingSecondTexts((prev) => {
              let p = [...prev];
              p[i] = false;
              return p;
            });
          }, 0);
        } // Again, delay to push execution to the end of the event loop
      } catch (error) {
        console.error("Error fetching multi-doc results:", error);
        setIsLoadingSecondTexts(
          new Array(secondariesDocSetIds.length).fill(false)
        ); // End loading in case of error
      }
    };

    fetchData();
  }, [option.fontConfig.fontSize, theme, secondariesDocSetIds, currentChap]);
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.schemes[theme].surface }}
    >
      <View style={styles.scrollContainer}>
        {isLoadingMainText ? (
          <View style={styles.activityContainer}>
            <ActivityIndicator />
          </View>
        ) : (
          chapterBuffer.map((main, idmain) => (
            <>
              <View>{main}</View>
              {isLoadingQuestion ? (
                <>
                  <SafeAreaView
                    style={{
                      borderTopLeftRadius: 28,
                      borderTopRightRadius: 28,
                      borderBottomLeftRadius: 12,
                      borderBottomRightRadius: 12,
                      flex: 1,
                      height: 10,
                      backgroundColor:
                        colors.schemes[theme].surfaceContainerHigh,
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
                    ></View>
                  </SafeAreaView>
                  <ActivityIndicator />
                </>
              ) : dataQuestion[idmain].length > 0 ? (
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
                        : questionDocSetId}
                    </Text>
                  </View>

                  <List.Accordion
                    style={{
                      backgroundColor:
                        colors.schemes[theme].surfaceContainerHigh,
                    }}
                    title="Questions"
                    onPress={() => {
                      if (dataQuestion[idmain][0].text === "toBeFetch") {
                        fetchQuestion(
                          pk,
                          currentChap,
                          dataQuestion[idmain][0].verse,
                          questionDocSetId,
                          bookCode,
                          setDataQuestion,
                          idmain
                        );
                      }
                    }}
                    left={(props) => (
                      <List.Icon
                        {...props}
                        icon={() => (
                          <HandRaised color={colors.schemes[theme].onSurface} />
                        )}
                      />
                    )}
                  >
                    {dataQuestion[idmain][0]?.text !== "toBeFetch" ? (
                      <>
                        <View style={{ height: 8 }}></View>
                        <ScrollView
                          horizontal={true}
                          snapToInterval={width - 48}
                          pagingEnabled={true}
                          scrollEnabled={true}
                          width={width - 48}
                          conta
                          style={{
                            width: "100%",
                            borderBottomLeftRadius: 12,
                            borderBottomRightRadius: 12,
                          }}
                        >
                          {dataQuestion[idmain].map((item, index) => (
                            <View
                              key={index}
                              style={{
                                width: width - 48,

                                justifyContent: "center",
                                gap: 8,
                                borderBottomLeftRadius: 12,
                                borderBottomRightRadius: 12,
                              }}
                            >
                              <Markdown
                                style={{
                                  body: {
                                    flex: 1,
                                    fontFamily: "NotoSans",
                              
                                    paddingHorizontal: 16,
                                    fontSize: 16 * multiTab[textHeight],
                                  },
                                  stong: {
                                    fontFamily: "NotoSansBold",
                                  },
                                }}
                              >
                                {item.text}
                              </Markdown>

                              {/* <Text
                                variant="bodyLarge"
                                
                              >
                                
                              </Text> */}
                              <View
                                style={{
                                  justifyContent: "center",
                                  width: "100%",
                                  display: "flex",
                                  flexDirection: "row",
                                  gap: 8,
                                }}
                              >
                                {dataQuestion[idmain].map((e, id) => (
                                  <View
                                    key={id}
                                    style={
                                      id === index
                                        ? {
                                            width: 12,
                                            height: 4,
                                            borderRadius: 4,
                                            backgroundColor:
                                              colors.schemes[theme].primary,
                                          }
                                        : {
                                            width: 4,
                                            height: 4,
                                            borderRadius: 4,
                                            backgroundColor:
                                              colors.schemes[theme].primary,
                                          }
                                    }
                                  />
                                ))}
                              </View>
                            </View>
                          ))}
                        </ScrollView>
                      </>
                    ) : (
                      <View
                        style={{
                          height: 100,
                          marginRight: 48,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <ActivityIndicator />
                      </View>
                    )}
                  </List.Accordion>
                </SafeAreaView>
              ) : null}

              {secondariesDocSetIds.length > 0 ? (
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  scrollEnabled={secondariesDocSetIds.length > 1}
                  style={{ display: "flex", flexDirection: "row" }}
                >
                  {isLoadingSecondTexts.map((e, id) =>
                    e ? (
                      <>
                        <View
                          key={id}
                          style={{
                            width:
                              secondariesDocSetIds.length < 2
                                ? width - 48
                                : width * 0.85 - 48,
                            flex: 1,
                            borderBottomRightRadius: 28,
                            borderBottomLeftRadius: 28,
                            borderTopLeftRadius: 28,
                            borderTopRightRadius: 28,
                            backgroundColor:
                              colors.schemes[theme].surfaceContainerLow,
                            gap: 8,
                          }}
                        >
                          <View
                            style={{
                              borderTopLeftRadius: 28,
                              borderTopRightRadius: 28,
                              justifyContent: "center",
                              paddingHorizontal: 30,
                              height: 10,
                              alignItems: "center", // Add this line
                              width: "100%",
                              backgroundColor:
                                colors.schemes[theme].tertiaryContainer,
                            }}
                          ></View>
                          <View style={styles.activityContainer}>
                            <ActivityIndicator />
                          </View>
                        </View>
                        <View style={{ width: 8 }} />
                      </>
                    ) : multiDocIdResult[id] ? (
                      <>
                        <View
                          key={id}
                          style={{
                            width:
                              secondariesDocSetIds.length < 2
                                ? width - 48
                                : width * 0.85 - 48,
                            flex: 1,
                            borderBottomRightRadius: 28,
                            borderBottomLeftRadius: 28,
                            borderTopLeftRadius: 28,
                            borderTopRightRadius: 28,
                            backgroundColor:
                              colors.schemes[theme].surfaceContainerLow,
                            gap: 8,
                          }}
                        >
                          <View
                            style={{
                              borderTopLeftRadius: 28,
                              borderTopRightRadius: 28,
                              justifyContent: "center",
                              paddingHorizontal: 30,
                              alignItems: "center", // Add this line
                              width: "100%",
                              backgroundColor:
                                colors.schemes[theme].tertiaryContainer,
                            }}
                          >
                            <Text
                              variant="labelSmall"
                              style={{
                                color:
                                  colors.schemes[theme].onTertiaryContainer,
                              }}
                            >
                              {
                                docTags?.data?.docSets
                                  .filter(
                                    (t) => t.id === secondariesDocSetIds[id]
                                  )[0]
                                  ?.tags[0].split(":")[1]
                              }
                            </Text>
                          </View>
                          <View style={{ padding: 16, paddingTop: 0 }}>
                            {multiDocIdResult[id][idmain]}
                          </View>
                        </View>
                        <View style={{ width: 8 }} />
                      </>
                    ) : (
                      <></>
                    )
                  )}
                </ScrollView>
              ) : null}
              {idmain === chapterBuffer.length - 1 ? (
                <></>
              ) : (
                <Divider
                  style={{
                    height: 2,
                    backgroundColor: colors.schemes[theme].outlineVariant,
                  }}
                />
              )}
            </>
          ))
        )}
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

export async function renderDocAsync(documentResult, pk, option) {
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

export async function useDocumentQueryJustId(livre, bible, pk) {
  let documentQuery = `
          {
            document(docSetId: "${bible}" withBook: "${livre}"){
              id

          }}
          `;

  const documentResult = await pk.gqlQuery(documentQuery);
  return documentResult;
}

export async function getTagsDocSet(docsets, pk) {
  let documentQuery = `
          {
  docSets(ids: [${docsets.map((e) => `"${e}"`)}]) {
  id
    tags
  }
}
          `;
  const documentResult = await pk.gqlQuery(documentQuery);
  return documentResult;
}
async function fetchQuestion(
  pk,
  chap,
  verse,
  questionDocSetId,
  bookCode,
  setDataQuestion,
  id
) {
  pk.gqlQuery(
    `
    {
          docSet(id: "${questionDocSetId}") {
            tags
            document(bookCode: "${bookCode}") {
              kvSequences {
                entries(keyMatches: "^${chap}:${verse}(-|$)"){
                 itemGroups {
                 scopeLabels
            text
          }
                }
              }
            }
          }
        }
  `
  ).then((v) => {
    setDataQuestion((prev) => {
      let t = v.data?.docSet?.document?.kvSequences[0].entries.map(
        (entry) =>
          entry.itemGroups
            .filter((itemGroup) =>
              itemGroup.scopeLabels.includes("kvField/question")
            )
            .map((itemGroup) => {
              return { text: itemGroup.text };
            }) // Simplify the data structure for the carousel
      );
      let p = [...prev];
      p[id] = t.flat();
      return p;
    });
  });
}
