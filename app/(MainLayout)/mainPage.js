import React, {
  useEffect,
  useState,
  useContext,
  useMemo,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StatusBar,
  Platform,
  NativeModules,
} from "react-native";
import { Appearance } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ProskommaContext } from "../../context/proskommaContext";
import { ReadingScreenAllBook } from "../../components/renderer/textComponentRender/RenderText";
import TopBarForText from "../../components/TopBarForText";
import { useDocumentQuery } from "../../components/renderer/textComponentRender/RenderText";
import BottomSheetContent from "../../components/BottomSheets/BottomSheetContent";
import { Text, PaperProvider } from "react-native-paper";
import BottomSheetSearch from "../../components/BottomSheets/BottomSheetSearch";
import BottomBar from "../../components/BottomBar";
import ModalTextNavigation from "../../components/ModalDocNav/ModalTextNavigation";
import { Button } from "react-native-paper";
import { ColorThemeContext } from "../../context/colorThemeContext";
import BottomSheetIntroInfo from "../../components/BottomSheets/BottomSheetIntroInfo";
import { BackHandler } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationContext } from "../../context/navigationContext";
// import RNExitApp from 'react-native-exit-app';

const MainPage = () => {
  const snapPoints = useMemo(() => [316], []);
  const snapPointsIntroInfo = useMemo(() => ["100%"], []);

  const { pk } = useContext(ProskommaContext);
  const { colors, theme } = useContext(ColorThemeContext);
  const { StatusBarManager } = NativeModules;
  const {docSetId,setDocSetId} = useContext(NavigationContext)


  const bottomSheetRef = useRef(null);
  const bottomSheetIntroInfoRef = useRef(null);
  const [isOnTop, setIsOnTop] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isBottomSheetIntroInfoOpen, setIsBottomSheetOpenIntroInfoOpen] =useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentChap, setCurrentChap] = useState(1);
  const [fontSize, setFontSize] = useState(2);
  const [documentResult, setDocResults] = useState(null);
  const [currentBook, setCurrentBook] = useState("MRK");
  const [fontFamily, setFontFamily] = useState("NotoSans");
  const [bibleFormat, setBibleFormat] = useState("format");
  const [isFirstOfFirstBook, setIsFirstOfFirstBook] = useState(false);
  const [isLastOfLastBook, setIsLastOfLastBook] = useState(false);


  useEffect(() => {
    checkForLast(pk, currentBook, currentChap, docSetId).then((e) =>
      setIsLastOfLastBook(e)
    );

    checkForFirst(pk, currentBook, currentChap, docSetId).then((e) =>
      setIsFirstOfFirstBook(e)
    );
  }, [currentBook, currentChap, docSetId]);

  useEffect(()=>{
    setIsOnTop(false)
  },[currentChap,currentBook])

  const handleNextChap = useCallback(async () => {
    const nexChap = await getNextChap(pk, currentChap, currentBook, docSetId);
    if (nexChap) {
      setCurrentChap(nexChap);
      return true;
    } else {
      const nextBook = await getNextBookCode(currentBook, pk, docSetId);
      if (nextBook) {
        setCurrentBook(nextBook);
        setCurrentChap(1);
        return true;
      } else {
        return false;
      }
    }
  }, [currentChap, currentBook, docSetId, pk]);

  const handlePreviousChap = useCallback(async () => {
    const previousChap = await getPreviousChap(
      pk,
      currentChap,
      currentBook,
      docSetId
    );
    if (previousChap) {
      setCurrentChap(previousChap);
    } else {
      const PreviousBook = await getPreviousBookCode(currentBook, pk, docSetId);
      if (PreviousBook) {
        setCurrentBook(PreviousBook);
        setCurrentChap(1);
      }
    }
  }, [currentChap, currentBook, docSetId, pk]);

  useEffect(() => {
    setDocResults(null);
  }, [currentBook, docSetId]);

  useEffect(() => {
    if (!documentResult) {
      const fetchDocument = async () => {
        const result = await useDocumentQuery(currentBook, docSetId, pk);
        setDocResults(result);
      };
      fetchDocument();
    }
  }, [documentResult]);

  const backAction = () => {
    if (isBottomSheetOpen) {
      handleBottomSheetIntroInfoClose();
      handleBottomSheetClose();
      return true; // Prevent default behavior
    } else {
      // RNExitApp.exitApp();
      //put app in the background go to main page of phone
      return true;
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [isBottomSheetOpen]);
  const handleBottomSheetIntroInfoOpen = useCallback(() => {
    setIsBottomSheetOpenIntroInfoOpen(true)
    bottomSheetIntroInfoRef.current.snapToIndex(0);
  }, []);

  const handleBottomSheetIntroInfoClose = useCallback(() => {
    setIsBottomSheetOpenIntroInfoOpen(false)
    bottomSheetIntroInfoRef.current.close();
  }, []);

  const handleBottomSheetOpen = useCallback(() => {
    setIsBottomSheetOpen(true);
    bottomSheetRef.current.snapToIndex(0);
  }, []);

  const handleBottomSheetClose = useCallback(() => {
    setIsBottomSheetOpen(false);
    bottomSheetRef.current.close();
  }, []);

  const handleModalTextNavigation = useCallback((book, chap, verse) => {
    setCurrentBook(book);
    setCurrentChap(chap);
  }, []);

  const styles = StyleSheet.create({
    overlay: {
      backgroundColor: "rgba(0,0,0,0.12)",
      position: "absolute",
      height: "100%",
      width: "100%",
      left: 0,
      top: 0,
    },
    container: {
      flex: 1,
    },
    bottomSheet: {
      marginHorizontal: 0,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      backgroundColor: colors.schemes[theme].surface,
    },
    handlerStyleContainer: {
      padding: 16,
      margin: 12,
      height: 4,
    },
    handlerStyle: {
      backgroundColor: colors.schemes[theme].outline,
    },
  });

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <GestureHandlerRootView style={styles.container}>
        <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
          style={{
            paddingTop: Platform.OS === "android" ? StatusBarManager.HEIGHT : 0,
          }}
          backgroundColor={colors.schemes[theme].surface}
        />
       
          <PaperProvider>
          <TopBarForText
          isOnTop={isOnTop}
          functionTitle={setDocSetId}
          functionParamText={handleBottomSheetOpen}
          setIsOnTop={setIsOnTop}
          functionInfo={handleBottomSheetIntroInfoOpen}
        >
            <ReadingScreenAllBook
              setIsOnTop={setIsOnTop}
              documentResult={documentResult}
              pk={pk}
              fontSize={fontSize}
              currentChap={currentChap}
              fontFamily={fontFamily}
              bibleFormat={bibleFormat}
            />
            <ModalTextNavigation
              setbookNav={handleModalTextNavigation}
              currentBook={currentBook}
              currentChap={currentChap}
              setVisible={setIsModalVisible}
              visible={isModalVisible}
              docSetId={docSetId}
            />
                    </TopBarForText>

          </PaperProvider>
          
          <BottomBar
            currentBook={currentBook}
            currentChap={currentChap}
            documentResult={documentResult}
            setCurrentChap={setCurrentChap}
            isModalVisible={isModalVisible}
            handlePreviousChap={handlePreviousChap}
            handleNextChap={handleNextChap}
            isFirstOfFirstBook={isFirstOfFirstBook}
            isLastOfLastBook={isLastOfLastBook}
            setIsModalVisible={setIsModalVisible}
          />

        {isBottomSheetOpen && (
          <TouchableWithoutFeedback
            onPress={() => {
              handleBottomSheetClose();
            }}
          >
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>
        )}
         {isBottomSheetIntroInfoOpen && (
          <TouchableWithoutFeedback
            onPress={() => {
              handleBottomSheetIntroInfoClose();
            }}
          >
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>
        )}
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          enableContentPanningGesture={false}
          onClose={handleBottomSheetClose}
          enableHandlePanningGesture={true}
          handleStyle={styles.handlerStyleContainer}
          handleIndicatorStyle={styles.handlerStyle}
          backgroundStyle={styles.bottomSheet}
        >
          <BottomSheetContent
            setFontFamily={setFontFamily}
            setFontSize={setFontSize}
            setBibleFormat={setBibleFormat}
            bibleFormat={bibleFormat}
          />
        </BottomSheet>
        <BottomSheet
          ref={bottomSheetIntroInfoRef}
          index={-1}
          snapPoints={snapPointsIntroInfo}
          enablePanDownToClose={true}
          enableContentPanningGesture={false}
          onClose={handleBottomSheetIntroInfoClose}
          enableHandlePanningGesture={true}
          enableDynamicSizing={true}
          handleStyle={styles.handlerStyleContainer}
          handleIndicatorStyle={styles.handlerStyle}
          backgroundStyle={styles.bottomSheet}
        >
          <BottomSheetIntroInfo 
          shown={isBottomSheetIntroInfoOpen}
          docSetId={docSetId} />
        </BottomSheet>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default React.memo(MainPage);

async function getNextChap(pk, curChap, bookCode, docSetId) {
  try {
    const response = await pk.gqlQuery(`{
      docSet(id: "${docSetId}"){
        document(bookCode: "${bookCode}") {
          cvNavigation(chapter: "${curChap}", verse: "1") {
            nextChapter
          }
        }
      }
    }`);

    const nextChapter = response.data.docSet.document.cvNavigation.nextChapter;
    return nextChapter;
  } catch (error) {
    console.error("Error fetching next chapter:", error);
    return null;
  }
}
async function getPreviousChap(pk, curChap, bookCode, docSetId) {
  try {
    const response = await pk.gqlQuery(`{
      docSet(id: "${docSetId}"){
        document(bookCode: "${bookCode}") {
          cvNavigation(chapter: "${curChap}", verse: "1") {
            previousChapter
          }
        }
      }
    }`);

    const previousChapter =
      response.data.docSet.document.cvNavigation.previousChapter;
    return previousChapter;
  } catch (error) {
    console.error("Error fetching previous chapter:", error);
    return null;
  }
}
async function getNextBookCode(bookCode, pk, docSetId) {
  try {
    const response = await pk.gqlQuery(`{
      docSet(id: "${docSetId}"){
        documents {
          header(id: "bookCode")
        }
      }
    }`);
    const bookCodes = response.data.docSet.documents.map((doc) => doc.header);
    let index = bookCodes.indexOf("FRT");
    if (index > -1) {
      // only splice array when item is found
      bookCodes.splice(index, 1);
    }
    index = bookCodes.indexOf("GLO");
    if (index > -1) {
      bookCodes.splice(index, 1);
    }
    const indexCurrentBook = bookCodes.indexOf(bookCode);
    if (indexCurrentBook >= bookCodes.length - 1) {
      return null;
    } else {
      return bookCodes[indexCurrentBook + 1];
    }
  } catch (error) {
    console.error("Error fetching next book code:", error);
    return null;
  }
}

async function getPreviousBookCode(bookCode, pk, docSetId) {
  try {
    const response = await pk.gqlQuery(`{
      docSet(id: "${docSetId}"){
        documents {
          header(id: "bookCode")
        }
      }
    }`);

    let bookCodes = response.data.docSet.documents.map((doc) => doc.header);
    let index = bookCodes.indexOf("FRT");
    if (index > -1) {
      // only splice array when item is found
      bookCodes.splice(index, 1);
    }
    index = bookCode.indexOf("GLO");
    if (index > -1) {
      bookCodes.splice(index, 1);
    }
    const indexCurrentBook = bookCodes.indexOf(bookCode);

    if (indexCurrentBook <= 0) {
      return null;
    } else {
      return bookCodes[indexCurrentBook - 1];
    }
  } catch (error) {
    console.error("Error fetching previous book code:", error);
    return null;
  }
}

async function checkForFirst(pk, bookCode, curChap, docSetId) {
  try {
    const response = await pk.gqlQuery(`{
      docSet(id: "${docSetId}"){
        documents {
          header(id: "bookCode")
        }
      }
    }`);
    const bookCodes = response.data.docSet.documents.map((doc) => doc.header);
    let index = bookCodes.indexOf("FRT");
    if (index > -1) {
      // only splice array when item is found
      bookCodes.splice(index, 1);
    }
    index = bookCodes.indexOf("GLO");
    if (index > -1) {
      bookCodes.splice(index, 1);
    }
    if (bookCode === bookCodes[0]) {
      const chap = await pk.gqlQuery(`{
        docSet(id: "${docSetId}"){
          document(bookCode: "${bookCode}") {
            cvNavigation(chapter: "${curChap}", verse: "1") {
              previousChapter
            }
          }
        }
      }`);

      const previousChapter =
        chap.data.docSet.document.cvNavigation.previousChapter;
      if (!previousChapter) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error("Error fetching previous chapter:", error);
    return null;
  }
}

async function checkForLast(pk, bookCode, curChap, docSetId) {
  try {
    const response = await pk.gqlQuery(`{
      docSet(id: "${docSetId}"){
        documents {
          header(id: "bookCode")
        }
      }
    }`);
    const bookCodes = response.data.docSet.documents.map((doc) => doc.header);
    let index = bookCodes.indexOf("FRT");
    if (index > -1) {
      // only splice array when item is found
      bookCodes.splice(index, 1);
    }
    index = bookCodes.indexOf("GLO");
    if (index > -1) {
      bookCodes.splice(index, 1);
    }
    if (bookCode === bookCodes[bookCodes.length - 1]) {
      const chap = await pk.gqlQuery(`{
        docSet(id: "${docSetId}"){
          document(bookCode: "${bookCode}") {
            cvNavigation(chapter: "${curChap}", verse: "1") {
              nextChapter
            }
          }
        }
      }`);

      const nextChapter = chap.data.docSet.document.cvNavigation.nextChapter;
      if (!nextChapter) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error("Error fetching previous chapter:", error);
    return null;
  }
}
