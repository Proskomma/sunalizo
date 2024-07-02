import { Slider, HapticModeEnum } from "react-native-awesome-slider";
import { Text, RadioButton } from "react-native-paper";
import * as Haptics from "expo-haptics";
import { View, StyleSheet } from "react-native";
import { I18nContext } from "../../context/i18nContext";
import { useSharedValue } from "react-native-reanimated";
import { useContext, useState } from "react";

export default function BottomSheetContent({setFontSize}) {
  const progress = useSharedValue(2);
  const min = useSharedValue(0);
  const max = useSharedValue(4);
  const correspondanceTable = ['bodyMedium','bodyLarge','headlineSmall','headlineMedium','headlineLarge']
  const { i18n } = useContext(I18nContext);
  const [checked, setChecked] = useState("format");

  return (
    <View style={styles.optionContentContainer}>
      <View style={styles.optionContainer}>
        <Text variant="titleMedium">{i18n.t("textOptionGreeting")}</Text>
      </View>
      <View style={styles.optionContainerSlider}>
        <Text variant="bodyLarge">Taille</Text>
        <Slider
          theme={{
            maximumTrackTintColor: "rgba(223, 224, 255, 1)",
            minimumTrackTintColor: "rgba(223, 224, 255, 1)",
          }}
          onValueChange={e => setFontSize(correspondanceTable[e])}
          renderMark={() => (
            <View
              style={{
                height: 4,
                width: 4,
                borderRadius: 4,
                backgroundColor: "rgba(84, 90, 146, 1)",
              }}
            />
          )}
          renderThumb={() => (
            <View
              style={{
                backgroundColor: "white",
                height: 32,
                width: 20,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "rgba(84, 90, 146, 1)",
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
      <View style={styles.optionContainer}>
        <Text variant="bodyLarge">{i18n.t("style")}</Text>
        <View>
          <View style={styles.optionContainerRadioButtons}>
            <RadioButton
              value="format"
              status={checked === "format" ? "checked" : "unchecked"}
              onPress={() => setChecked("format")}
            />
            <Text variant="bodyLarge">{i18n.t("formatBible")}</Text>
          </View>
          <View style={styles.optionContainerRadioButtons}>
            <RadioButton
              value="byVerse"
              status={checked === "byVerse" ? "checked" : "unchecked"}
              onPress={() => setChecked("byVerse")}
            />
            <Text variant="bodyLarge">{i18n.t("formatBibleVerse")}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  optionContentContainer: {
    width: "100%",
    paddingHorizontal: 32,
    gap: 12,
  },
  optionContainer: {
    gap: 12,
    flexDirection: "row",
  },
  optionContainerSlider: {
    gap: 24,

    flexDirection: "row",
    alignItems: "center",
    width: "90%",
  },
  optionContainerRadioButtons: {
    gap: 12,
    alignItems: "center",
    flexDirection: "row",
  },
  sliderContainer: {
    backgroundColor: "rgba(223, 224, 255, 1)",
    height: 16,
    width: "105%",
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
