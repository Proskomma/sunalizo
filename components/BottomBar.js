import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { IconButton, Text, ActivityIndicator } from "react-native-paper";
import ArrowDownIcon from "../assets/icons/flavorIcons/arrowDown";
import ArrowUpIcon from "../assets/icons/flavorIcons/arrowUp";
import ArrowRightGreyIcon from "../assets/icons/flavorIcons/ArrowRightGreyIcon";
import ArrowLeftGreyIcon from "../assets/icons/flavorIcons/arrowGreyLeft";
import { useContext } from "react";
import { ColorThemeContext } from "../context/colorThemeContext";
import { TouchableRipple } from "react-native-paper";
import { NavigationContext } from "../context/navigationContext";
export default function BottomBar({
  
  handleNextChap,
  handlePreviousChap,
  documentResult,
  isModalVisible,
  isLastOfLastBook,
  isFirstOfFirstBook,
  setIsModalVisible,
}) {
  const {bookCode,currentChap} = useContext(NavigationContext)
  const { colors, theme } = useContext(ColorThemeContext);
  const styles = StyleSheet.create({
    bottomContainer: {
      height: 80,
      width: "100%",
      backgroundColor: colors.schemes[theme].surfaceContainer,
      alignItems: "center", // Center items horizontally
      flexDirection: "row",
      padding: 24,
      justifyContent: "space-between", // Center items vertically
    },
    customButton: {
      borderWidth: 1,
      borderRadius: 9,
      margin: 0,
      padding: 0,
      width:110,
      borderColor: colors.schemes[theme].outline,
      borderStyle: "solid",
      alignItems: "center",
      flexDirection: "row",
      height: 32,
      paddingVertical: 6,
      paddingRight: 8,
      paddingLeft: 16,
      alignSelf: "center",
      justifyContent:'center',
      overflow: "hidden",
    },
    buttonInnerContent: {
      height: 32,
      gap: 8,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    InsideOfTheBottomBar: { gap: 8, flexDirection: "row" },
  });

  
  return (
    <View style={styles.bottomContainer}>
      <View style={styles.InsideOfTheBottomBar}>
        {documentResult ? (
          <>
            <View
              style={{
                height: 48,
                width: 48,
                padding: 0,
                margin: 0,
                justifyContent: "center",
              }}
            >
              <IconButton
                style={{
                  alignSelf: "center",
                  width: 48,
                  height: 48,
                  margin: 0,
                }}
                onPress={() => {
                  handlePreviousChap();
                }}
                icon={() => (
                  <ArrowLeftGreyIcon
                    color={
                      isFirstOfFirstBook
                        ? colors.stateLayers[theme].onSurface.opacity016
                        : colors.schemes[theme].onSurface
                    }
                    width={18}
                    height={18}
                  />
                )}
              />
            </View>

            <TouchableRipple
              onPress={() => setIsModalVisible((prev) => !prev)}
              style={{
                borderRadius: 9,
                margin: 0,
                padding: 0,
                alignSelf: "center",
              }}
              borderless
              rippleColor={colors.stateLayers[theme].onSurfaceVariant.opacity012}
            >
              <View style={styles.customButton}>
                <View style={styles.buttonInnerContent}>
                  <Text
                    style={{color: colors.schemes[theme].onSurfaceVariant}}
                    variant="labelLarge"
                  >
                    {bookCode} {currentChap}
                  </Text>
                  {isModalVisible ? (
                    <ArrowUpIcon
                      color={colors.schemes[theme].onSurface}
                      width={18}
                      height={18}
                    />
                  ) : (
                    <ArrowDownIcon
                      color={colors.schemes[theme].onSurface}
                      width={18}
                      height={18}
                    />
                  )}
                </View>
              </View>
            </TouchableRipple>
            <View
              style={{
                height: 48,
                width: 48,
                padding: 0,
                margin: 0,
                justifyContent: "center",
              }}
            >
              <IconButton
                style={{
                  alignSelf: "center",
                  width: 48,
                  height: 48,
                  margin: 0,
                }}
                icon={() => (
                  <ArrowRightGreyIcon
                    color={
                      isLastOfLastBook
                        ? colors.stateLayers[theme].onSurface.opacity016
                        : colors.schemes[theme].onSurface
                    }
                    style={{ margin: 8 }}
                    width={24}
                    height={24}
                  />
                )}
                onPress={() => {
                  handleNextChap();
                }}
              />
            </View>
          </>
        ) : (
          <ActivityIndicator />
        )}
      </View>
    </View>
  );
}
