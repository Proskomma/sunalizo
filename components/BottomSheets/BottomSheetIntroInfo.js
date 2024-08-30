import { useContext, useEffect, useState } from "react";
import { Text, ActivityIndicator } from "react-native-paper";
import { ProskommaContext } from "../../context/proskommaContext";
import { I18nContext } from "../../context/i18nContext";
import { ScrollView, View } from "react-native";
import { ColorThemeContext } from "../../context/colorThemeContext";
import { BottomSheetScrollView, BottomSheetView } from "@gorhom/bottom-sheet";
import { useDocumentQuery } from "../renderer/textComponentRender/RenderText";
import { renderDoc } from "../renderer/textComponentRender/RenderText";
import { renderers } from "../renderer/utils/renderReactNative";

export default function BottomSheetIntroInfo({ docSetId, shown }) {
  const { pk } = useContext(ProskommaContext);
  const { i18n } = useContext(I18nContext);
  const [info, setInfo] = useState(null);
  const { colors, theme } = useContext(ColorThemeContext);

  const [introComponent, setIntroComponent] = useState(null);

  const [intro, setIntro] = useState(null);
  const [intro2 ,setIntro2] = useState(null)

  const [loading, setLoading] = useState(false);

  const option = {
    showWordAtts: false,
    showTitles: true,
    showHeadings: true,
    showIntroductions: true,
    showFootnotes: false,
    showXrefs: false,
    showParaStyles: true,
    showCharacterMarkup: true,
    showVersesLabels: true,
    showChapterLabels: true,
    fontConfig: {
      fontColor: {
        fontText: colors.schemes[theme].onSurface,
        fontChap: colors.schemes[theme].onSurface,
        fontVerse: colors.schemes[theme].onSurface,
        surface: colors.schemes[theme].surface ,
        surfaceVariant: colors.schemes[theme].surfaceVariant,
      },
      fontFamily: "NotoSans",
      fontSize: 2,
    },
    excludeScopeTypes: ["milestone", "attribute", "spanWithAtts"],
    bcvNotesCallback: (bcv) => {},
    renderers,
  };

  useEffect(() => {
    if (intro?.data?.document?.id && intro2?.data?.document?.id) {
      const result = renderDoc(intro, pk, option);
      const result2 = renderDoc(intro2, pk, option);

      setIntroComponent([...result.paras,...result2.paras]);
      setLoading(false);
    } else {
      setIntroComponent(
        <Text
          style={{ padding: 16, color: colors.schemes[theme].onSurface }}
          variant="bodyLarge"
        >
          {i18n.t("noIntro")}
        </Text>
      );
     
      setLoading(false);
    }
  }, [intro,intro2]);

  useEffect(() => {
    if (docSetId) {
      const fetchDocument = async () => {
        setLoading(true);
        const result = await useDocumentQuery("FRT", docSetId, pk);
        const result2 = await useDocumentQuery("BAK", docSetId, pk);
        setIntro2(result2)
        setIntro(result);
      };
      fetchDocument();
    }
  }, [docSetId,theme]);

  useEffect(() => {
    setLoading(true);
    getTags(pk, docSetId).then((e) => {
      setInfo(e);
      setLoading(false);
    });
  }, [docSetId,theme]);

  return (
    <BottomSheetScrollView >
        <View style={{ paddingHorizontal: 16, gap: 12,marginBottom:16 }}>
      <Text
        style={{ color: colors.schemes[theme].onSurface }}
        variant="titleMedium"
      >
        {i18n.t("about")}
      </Text>
      <View
        style={{
          gap: 10,
          padding: 16,
          backgroundColor: colors.schemes[theme].secondaryContainer,
          borderRadius: 12,
        }}
      >
        {loading ? (
          <ActivityIndicator />
        ) : (
          info && (
            <>
              <Text
                style={{ color: colors.schemes[theme].onSecondaryContainer }}
                variant="headlineSmall"
              >
                {info[0].split(":")[1]}
              </Text>
              <View
              >
                <View style={{flexDirection:'row',alignItems:'center',gap:24,paddingLeft:24}}>
                  <Text
                    style={{
                      color: colors.schemes[theme].onSecondaryContainer,
                    }}
                    variant="labelLarge"
                  >
                    {i18n.t("language")}
                  </Text>
                  <Text
                    style={{
                      color: colors.schemes[theme].onSecondaryContainer,
                    }}
                    variant="bodyLarge"
                  >
                    {info[2].split(":")[1]}
                  </Text>
                </View>
                <View style={{flexDirection:'row',alignItems:'center',gap:24,paddingLeft:24}}>
                    <Text
                      style={{
                        color: colors.schemes[theme].onSecondaryContainer,
                      }}
                      variant="labelLarge"
                    >
                      {i18n.t("edition")}
                    </Text>
                    <Text
                      style={{
                        color: colors.schemes[theme].onSecondaryContainer,
                      }}
                      variant="bodyLarge"
                    >
                      {info[3].split(":")[1]}
                    </Text>
                </View>
                <View style={{flexDirection:'row',alignItems:'center',gap:24,paddingLeft:24}}>
                  <Text
                    style={{
                      color: colors.schemes[theme].onSecondaryContainer,
                    }}
                    variant="labelLarge"
                  >
                    {i18n.t("copyright")}
                  </Text>

                  <Text
                    style={{
                      color: colors.schemes[theme].onSecondaryContainer,
                    }}
                    variant="bodyLarge"
                  >
                    {info[1].split(":")[1]}
                  </Text>
                </View>
              </View>
            </>
          )
        )}
      </View>
      <Text
        style={{ color: colors.schemes[theme].onSurface }}
        variant="titleMedium"
      >
        {i18n.t("introductionBook")}
      </Text>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <View
          style={{
            backgroundColor: colors.schemes[theme].surfaceContainerHighest,
            padding: 16,
            borderRadius: 12,
          }}
        >
          {introComponent}
        </View>
      )}
      </View>
    </BottomSheetScrollView>
  );
}

async function getTags(pk, docSetId) {
  try {
    const response = await pk.gqlQuery(`{
        docSet(id: "${docSetId}"){
          tags
        }
      }`);
    const tags = response.data.docSet.tags.filter((e) =>
      ["language", "title", "owner", "copyright"].includes(e.split(":")[0])
    );
    return tags;
  } catch (error) {
    console.error("Error fetching next chapter:", error);
    return null;
  }
}
