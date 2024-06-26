import React, { useEffect, useState, useContext, useMemo, useRef } from "react";
import TopBarContainer from "./TopBarContainer";
import Animated from "react-native-reanimated";
import { Button } from "react-native-paper";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";

import {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";
import {
  RessourcesIcon,
  ArrowDownIcon,
  AddRessourcesIcon,
  ParamTextIcon,
} from "../assets/icons/flavorIcons/icons";

export default function TopBarForText({ isOnTop, functionTitle,functionParamText,functionAddResources }) {
  const progress = useDerivedValue(() => {
    return isOnTop ? withTiming(1) : withTiming(0);
  }, [isOnTop]);

  const HeaderStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ["white", "red"]
    );
    return { backgroundColor };
  });

  return (
    <TopBarContainer>
      <Animated.View
        style={[
          {
            width: "100%",
            flexDirection: "row",
            gap: 4,
            paddingHorizontal: 4,
            paddingVertical: 8,
            alignItems: "center",
          },
          HeaderStyle,
        ]}
      >
        <Button style={{ width: "20%" }}>
          <View style={{ width: 24, height: 24 }} />
        </Button>
        <TouchableOpacity style={styles.customButton}>
          <View style={styles.buttonInnerContent}>
            <RessourcesIcon width={18} height={18} />
            <Text style={styles.titleContainer}>Pain Sur Les Eaux</Text>
            <ArrowDownIcon width={18} height={18} />
          </View>
        </TouchableOpacity>
        <View style={{ flexDirection: "row", width: "20%" }}>
          <TouchableOpacity 
          onPress={functionParamText}
          style={{ padding: 8 }}>
            <ParamTextIcon width={24} height={24} />
          </TouchableOpacity>
          <TouchableOpacity style={{ margin: 8 }}>
            <AddRessourcesIcon width={24} height={24} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </TopBarContainer>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    paddingLeft: 8,
    paddingRight: 8,
    textAlign: "center",
  },

  customButton: {
    width: "50%",
    borderWidth: 1,
    borderRadius: 9,
    borderColor: "#777680",
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
});
