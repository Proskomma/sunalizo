import { Portal, Modal, Divider } from "react-native-paper";
import { TouchableOpacity, View, StyleSheet, ScrollView } from "react-native";
import { Text } from "react-native-paper";
import { I18nContext } from "../../context/i18nContext";

import {
  useState,
  useContext,
  useEffect,
  useRef,
  useLayoutEffect,
} from "react";
import { ProskommaContext } from "../../context/proskommaContext";
import { ColorThemeContext } from "../../context/colorThemeContext";
import { NavigationContext } from "../../context/navigationContext";

export default function ModalTextNavigation({
  visible,
  setVisible,
  setbookNav,
}) {
  const { bookCode, setBookCode, setCurrentChap, currentChap, docSetId } =
    useContext(NavigationContext);
  const { colors, theme } = useContext(ColorThemeContext);
  const { pk } = useContext(ProskommaContext);
  const [book, setBook] = useState(bookCode);
  const [chapter, setChapter] = useState(currentChap);
  const bookRef = useRef(bookCode)
  // const [verse, setVerse] = useState(1);
  const [data, setData] = useState(null);
  const [pixelNavBook, setPixelNavBook] = useState(0);
  const [pixelNavCha, setPixelNavChap] = useState(0);
  const parentScroll = useRef(null);
  const chapterScroll = useRef(null);
  useEffect(()=>{
    bookRef.current= bookCode
  },[bookCode])
  useEffect(() => {
    setChapter(currentChap);
  }, [currentChap]);
  const { i18n } = useContext(I18nContext);
  useEffect(() => {
    setBook(bookCode);
  }, [bookCode]);

  useEffect(() => {
    async function fetchData() {
      getData(pk, docSetId).then((e) => setData(e));
    }

    fetchData();
  }, [docSetId]);

  useEffect(() => {
    if (book && data) {
      const bookIndex = data.findIndex((e) =>
        e.headers.some((p) => p.key === "bookCode" && p.value === book)
      );
      const chapIndex = data[bookIndex].cvIndexes.findIndex(
        (e) => e.chapter === currentChap
      );
      if (bookIndex > -1) {
        setPixelNavBook(bookIndex * 56);
      }
      if (chapIndex > -1) {
        setPixelNavChap(chapIndex * 56);
      }
    }
  }, [data]);

  useEffect(() => {
    if (parentScroll.current) {
      parentScroll.current.scrollTo({ x: 0, y: pixelNavBook, animated: true });
    }
  }, [visible]);

  useEffect(() => {
    if (chapterScroll.current) {
      chapterScroll.current.scrollTo({ x: 0, y: pixelNavCha, animated: true });
    }
  }, [visible]);
  return (
    <Portal>
      <Modal
        onDismiss={() => setVisible(false)}
        visible={visible}
        contentContainerStyle={[
          styles.container,
          { backgroundColor: colors.schemes[theme].surfaceContainerHigh },
        ]}
      >
        <View style={{ flex: 1 }}>
          <View style={styles.title}>
            <Text
              style={{ color: colors.schemes[theme].onSurface }}
              variant="headlineSmall"
            >
              {i18n.t("navigateTo")}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              height: 20,
              marginBottom: 24,
            }}
          >
            <View style={styles.columnTitle}>
              <Text
                style={[
                  styles.columnTitleText,
                  { color: colors.schemes[theme].onSurfaceVariant },
                ]}
                variant="bodyMedium"
              >
                {i18n.t("book")}
              </Text>
            </View>
            <View style={styles.columnTitle}>
              <Text
                style={[
                  styles.columnTitleText,
                  { color: colors.schemes[theme].onSurfaceVariant },
                ]}
                variant="bodyMedium"
              >
                {i18n.t("chapter")}
              </Text>
            </View>
            {/* <View style={styles.columnTitle}>
              <Text style={styles.columnTitleText} variant="bodyMedium">
                                  {i18n.t("verse")}

              </Text>
            </View> */}
          </View>
          <View style={styles.columnsContainer}>
            <View style={styles.column}>
              <ScrollView ref={parentScroll}>
                {data?.map((e, id) => (
                  <TouchableOpacity
                    style={
                      book ===
                      e.headers.filter((p) => p.key === "bookCode")[0].value
                        ? [
                            {
                              backgroundColor:
                                colors.stateLayers[theme].onSurface.opacity012,
                            },
                            styles.chipContainer,
                          ]
                        : [styles.chipContainer]
                    }
                    onPress={() => {
                      setBook(
                        e.headers.filter((p) => p.key === "bookCode")[0].value
                      );
                      setChapter(1);
                    }}
                    key={id}
                  >
                    <View>
                      <Text
                        style={{
                          color: colors.schemes[theme].onSurfaceVariant,
                        }}
                        variant="labelMedium"
                      >
                        {e.headers.filter((p) => p.key === "toc2")[0]?.value}
                      </Text>
                      <Text
                        style={{
                          color: colors.schemes[theme].onSurface,
                        }}
                        variant="bodyLarge"
                      >
                        {e.headers.filter((p) => p.key === "bookCode")[0].value}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <Divider
              style={[
                styles.divider,
                { color: colors.schemes[theme].outlineVariant },
              ]}
            />
            <View style={styles.column}>
              <ScrollView
                ref={chapterScroll}
                showsHorizontalScrollIndicator={true}
              >
                {data
                  ?.find(
                    (e) =>
                      e.headers.filter((p) => p.key === "bookCode")[0].value ===
                      book
                  )
                  ?.cvIndexes.map((e, id) => (
                    <TouchableOpacity
                      onPress={() => {
                        setBookCode(book);
                        setCurrentChap(e.chapter);
                        setVisible(false);
                      }}
                      style={
                        parseInt(currentChap) === e.chapter && book === bookRef.current
                          ? [
                              {
                                backgroundColor:
                                  colors.stateLayers[theme].onSurface
                                    .opacity012,
                              },
                              styles.chipContainer,
                            ]
                          : [styles.chipContainer]
                      }
                      key={id}
                    >
                      <Text
                        style={{
                          color: colors.schemes[theme].onSurface,
                        }}
                        variant="bodyLarge"
                      >
                        {e.chapter}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            </View>
            {/* <Divider style={styles.divider} />
            <View style={styles.column}>
              <ScrollView>
                {data
                  ?.find(
                    (e) =>
                      e.headers.filter((p) => p.key === "bookCode")[0].value ===
                      book
                  )
                  ?.cvIndexes.find((e) => e.chapter === chapter)
                  ?.verseRanges.map((e, id) => (
                    <TouchableOpacity
                      style={
                        book === e.numbers[0]
                          ? [{ backgroundColor: "grey" }, styles.chipContainer]
                          : [styles.chipContainer]
                      }
                      onPress={() => {
                        setVerse(e.numbers[0]);
                        setbookNav(book, chapter, e.numbers[0]);
                        setVisible(false);
                      }}
                      key={id}
                    >
                      <Text variant="bodyLarge">{e.numbers[0]}</Text>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            </View> */}
          </View>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 24,
    margin: 24,

    borderRadius: 28,
  },
  title: {
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  columnsContainer: {
    flexDirection: "row",
    flex: 1,
  },
  column: {
    flex: 1,
  },
  columnTitle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  columnTitleText: {
    color: "rgba(70, 70, 79, 1)",
  },
  divider: {
    width: 1,
    height: "100%",
  },
  chipContainer: {
    height: 56,
    paddingLeft: 16,
    paddingRight: 24,
    justifyContent: "center",
  },
});

async function getData(pk, docSetId) {
  const documents = await pk.gqlQuerySync(`{
    docSet(id: "${docSetId}"){
      documents {
        headers{
          key
          value
        }
        cvIndexes {
          chapter
          verseRanges {
            numbers
          }
        }
      }
    }
  }`).data?.docSet?.documents;

  // Filter out 'GLO' and 'FRT' books
  const filteredDocuments = documents.filter((doc) => {
    const bookCode = doc.headers.find(
      (header) => header.key === "bookCode"
    ).value;
    return bookCode !== "GLO" && bookCode !== "FRT" && bookCode != "BAK";
  });

  return filteredDocuments;
}
