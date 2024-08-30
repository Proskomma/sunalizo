import { Slider, HapticModeEnum } from "react-native-awesome-slider";
import { Text, RadioButton } from "react-native-paper";
import * as Haptics from "expo-haptics";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { I18nContext } from "../../context/i18nContext";
import { useSharedValue } from "react-native-reanimated";
import { useContext, useState } from "react";
import DropDownSelectFont from "../DropDownSelectFont";
import { ColorThemeContext } from "../../context/colorThemeContext";
import { TextOptionContext } from "../../context/textOptionContext";

export default function BottomSheetContent({
  setBibleFormat,
  bibleFormat,
}) {
  const {textHeight,setTextHeight} = useContext(TextOptionContext)
  const progress = useSharedValue(textHeight);
  const min = useSharedValue(0);
  const max = useSharedValue(4);
  const correspondanceTable = [0, 1, 2, 3, 4];
  const { colors, theme } = useContext(ColorThemeContext);
  const { i18n } = useContext(I18nContext);

  const styles = StyleSheet.create({
    optionContentContainer: {
      width: "100%",
      paddingHorizontal: 16,
      gap: 12,
    },
    optionContainer: {
      gap: 12,
      height: 44,
      flexDirection: "row",
    },
    optionContainerSlider: {
      gap: 12,
      height: 44,
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
    },
    optionContainerRadioButtons: {
      paddingHorizontal: 16,
      gap: 16,
      flex: 1,
      alignItems: "center",
      flexDirection: "row",
    },
    sliderContainer: {
      backgroundColor: colors.schemes[theme].primaryContainer,
      height: 16,
      width: "100 %",
      borderRadius: 24,
    },
    stepMarker: {
      width: 4,
      height: 4,
      borderRadius: 30,
      marginTop: 7,
      backgroundColor: "rgba(84, 90, 146, 1)",
    },
  });

  return (
    <View style={styles.optionContentContainer}>
      <View style={[styles.optionContainer, { height: 24 }]}>
        <Text
          style={{ color: colors.schemes[theme].onSurface }}
          variant="titleMedium"
        >
          {i18n.t("textOptionGreeting")}
        </Text>
      </View>
      {/* <View style={styles.optionContainer}>
        <Text style={{ alignSelf: "center" }} variant="bodyLarge">
          Police
        </Text>
        <DropDownSelectFont setFontFamily={setFontFamily} />
      </View> */}

      <View style={styles.optionContainerSlider}>
        <Text
          style={{ color: colors.schemes[theme].onSurface }}
          variant="bodyLarge"
        >
          Taille
        </Text>
        <View style={{ flex: 1, marginLeft: 32 }}>
          <Slider
            theme={{
              maximumTrackTintColor: colors.schemes[theme].primaryContainer,
              minimumTrackTintColor: colors.schemes[theme].primaryContainer,
            }}
            onSlidingComplete={(e) => setTextHeight(correspondanceTable[e])}
            renderMark={() => (
              <View
                style={{
                  height: 4,
                  width: 4,
                  borderRadius: 4,
                  backgroundColor: colors.schemes[theme].primary,
                }}
              />
            )}
            renderThumb={() => (
              <View
                style={{
                  backgroundColor: colors.schemes[theme].surface,
                  height: 32,
                  width: 20,
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor: colors.schemes[theme].primary,
                    borderRadius: 3,
                    height: 32,
                    width: 4,
                    justifyContent: "center",
                  }}
                />
              </View>
            )}
            progress={progress}
            minimumValue={min}
            maximumValue={max}
            step={4}
            containerStyle={styles.sliderContainer}
            thumbWidth={12}
            onHapticFeedback={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            }}
            hapticMode={HapticModeEnum.STEP}
          />
        </View>
      </View>
      <View style={styles.optionContainer}>
        <Text
          variant="bodyLarge"
          style={{
            width: 50,
            alignSelf: "center",
            color: colors.schemes[theme].onSurface,
          }}
        >
          {i18n.t("style")}
        </Text>
        <TouchableOpacity
          onPress={() => setBibleFormat("format")}
          style={styles.optionContainerRadioButtons}
        >
          <RadioButton
            value="format"
            color={
              bibleFormat === "format"
                ? colors.schemes[theme].primary
                : colors.schemes[theme].onSurfaceVariant
            }
            status={bibleFormat === "format" ? "checked" : "unchecked"}
            onPress={() => setBibleFormat("format")}
          />
          <Text
            style={{ color: colors.schemes[theme].onSurface }}
            variant="bodyLarge"
          >
            {i18n.t("formatBible")}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.optionContainer}>
        <TouchableOpacity
          onPress={() => setBibleFormat("byVerse")}
          style={{ marginLeft: 62, ...styles.optionContainerRadioButtons }}
        >
          <RadioButton
            value="byVerse"
            color={
              bibleFormat === "byVerse"
                ? colors.schemes[theme].primary
                : colors.schemes[theme].onSurfaceVariant
            }
            status={bibleFormat === "byVerse" ? "checked" : "unchecked"}
            onPress={() => setBibleFormat("byVerse")}
          />
          <Text
            style={{ color: colors.schemes[theme].onSurface }}
            variant="bodyLarge"
          >
            {i18n.t("formatBibleVerse")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
