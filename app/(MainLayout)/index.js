import React, { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { ProskommaContext } from "../../context/proskommaContext";
import { I18nContext } from "../../context/i18nContext";
import SplashScreenXenizo from "../../components/SplashScreen";
import {
  createAssetsFolder,
  createFileIfNotExists,
  createFolder,
  createFolderIfNotExists,
  creatFileInFolder,
  deleteFolderIfExist,
  getAllInDirectory,
  getContentOfFile,
} from "../../utils/fileFolderFunctions";

SplashScreen.preventAutoHideAsync();

export default function IndexScreen() {
  const router = useRouter();
  const { pk } = useContext(ProskommaContext);
  const { setLanguage } = useContext(I18nContext);
  const [isReady, setIsReady] = useState(false);

  let [fontsLoaded] = useFonts({
    NotoSans: require("../../assets/fonts/Noto/NotoSans-Regular.ttf"),
    NotoSansItalic: require("../../assets/fonts/Noto/NotoSans-Italic.ttf"),
    NotoSansItalicRegular: require("../../assets/fonts/Noto/NotoSans-Italic.ttf"),
    NotoSansItalicMedium: require("../../assets/fonts/Noto/NotoSans-MediumItalic.ttf"),
    NotoSansRegular: require("../../assets/fonts/Noto/NotoSans-Regular.ttf"),
    NotoSansMedium: require("../../assets/fonts/Noto/NotoSans-Medium.ttf"),
    NotoSansBold: require("../../assets/fonts/Noto/NotoSans-Bold.ttf"),
  });
  useEffect(() => {
    async function prepare() {
      SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, []);

  useEffect(() => {
    async function loadResources() {
      if (!isReady) {
        await deleteFolderIfExist("succinct");
        const info = await getAllInDirectory(`/`);
        if (!info.includes("succinct")) {
          await createFolderIfNotExists("succinct");
          const psle = require("../../assets/Succinct/xenizo_psle_1.json");
          await createFileIfNotExists(`succinct/xenizo_psle_1.json`, psle);
        }

        const infoSuccinct = await getAllInDirectory(`./succinct`);
        if (!infoSuccinct.length < 1) {
          const psle = require("../../assets/Succinct/xenizo_psle_1.json");
          await createFolderIfNotExists(`succinct/xenizo_psle_1.json`, psle);
        }
        await infoSuccinct.map(async (e) => {
          pk.loadSuccinctDocSet(await getContentOfFile(`succinct/${e}`));
        });
        setLanguage("fr"); // Set the language
        setIsReady(true); // Mark as ready
      }
    }

    loadResources();
  }, []);

  useEffect(() => {
    async function hideSplashScreen() {
      if (fontsLoaded && isReady) {
        await SplashScreen.hideAsync();
          router.push("/mainPage");
      }
    }

    hideSplashScreen();
  }, [isReady, fontsLoaded]);

  if (!fontsLoaded || !isReady) {
    return null; // Return null while waiting for resources to load
  }

  return (
    <View>
      <SplashScreenXenizo />
    </View>
  );
}
