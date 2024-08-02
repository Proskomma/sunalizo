import React, { useContext, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button, IconButton, Modal } from "react-native-paper";
import { ColorThemeContext } from "../context/colorThemeContext";
import { NativeModules } from "react-native";
import ArrowReturnLeftIcon from "../assets/icons/flavorIcons/arrowReturnLeftIcon";
import { useRouter } from "expo-router";
import { Portal } from "react-native-paper";
export default function TopBarForRessources({
  mode,
  isActive,
  functionGoBack,
  functionShow,
  children,
}) {
  const { colors, theme } = useContext(ColorThemeContext);
  const { StatusBarManager } = NativeModules;
  const [modalSure, setModalSure] = useState(false);
  const router = useRouter();

  const styles = StyleSheet.create({
    titleContainer: {
      marginTop: StatusBarManager.HEIGHT,
    },

    customButton: {
      width: "50%",
      borderWidth: 1,
      borderRadius: 9,
      borderColor: colors.schemes[theme].outline,
      borderStyle: "solid",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
      paddingVertical: 6,
      paddingHorizontal: 12,
    },

    buttonInnerContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
    },

    topBar: {
      flexDirection: "row",
      gap: 4,
      height: 64,
      width: "100%",
      paddingHorizontal: 4,
      paddingVertical: 8,
      alignItems: "center",
      alignContent: "stretch",
    },

    iconContainer: {
      justifyContent: "center",
      alignSelf: "center",
      height: 48,
      width: 48,
      margin: 0,
      padding: 0,
    },

    textContainer: {
      flex: 1,
      justifyContent: "center",
    },
  });

  return (
    <>
      <View style={styles.titleContainer}>
        <View style={styles.topBar}>
          <View style={styles.iconContainer}>
            <IconButton
              style={{
                margin: 0,
                alignSelf: "center",
                width: 48,
                height: 48,
              }}
              onPress={() => {
                if (mode && isActive) {
                  setModalSure(true);
                }
              }}
              icon={() => (
                <ArrowReturnLeftIcon
                  color={colors.schemes[theme].onSurfaceVariant}
                />
              )}
            />
          </View>
          <View style={styles.textContainer}>
            <Text variant="headlineSmall">Ressources</Text>
          </View>
          {mode === "Multiple" ? (
            <Button
              onPress={() => console.log("goTo")}
              mode="contained"
              contentStyle={{ height: 40 }}
              disabled={!isActive}
            >
              Afficher
            </Button>
          ) : (
            <></>
          )}
        </View>
      </View>
      <Portal>
        <Modal
          contentContainerStyle={{
            backgroundColor: colors.schemes[theme].surfaceContainerHigh,
            display: "flex",
            height: 132,
            width: 312,
            minWidth: 280,
            maxWidth: 560,
            flexDirection: "column",
            margin: "auto",
            borderRadius: 28,
          }}
          onDismiss={() => setModalSure(false)}
          visible={modalSure}
        >
          <View
            style={{
              alignItems: "flex-start",
              marginTop: 24,
              marginHorizontal: 24,
            }}
          >
            <Text style={{ color: colors.schemes[theme].onSurfaceVariant }}>
              Abandonner les changements ?
            </Text>
          </View>
          <View
            style={{
              height: 40,
              alignSelf: "flex-end",
              flexDirection: "row",
              gap: 8,
              marginLeft: 8,
              marginVertical: 24,
              marginRight: 24,
            }}
          >
            <Button
              onPress={() => setModalSure(false)}
              containerStyle={{
                paddingVertical: 12,
                paddingHorizontal: 10,
                alignSelf: "center",
                color: colors.schemes[theme].primary,
              }}
            >
              Annuler
            </Button>
            <Button
            onPress={() =>  router.push("/mainPage")}
              containerStyle={{
                paddingVertical: 12,
                paddingHorizontal: 10,
                alignSelf: "center",
                color: colors.schemes[theme].primary,
              }}
            >
              Abandonner
            </Button>
          </View>
        </Modal>
      </Portal>
      <View style={{ flex: 1 }}>{children}</View>
    </>
  );
}
