import React, { useState, useContext, useRef, useEffect } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import ResourcesIcon from "../assets/icons/flavorIcons/resources";
import { Badge, TouchableRipple } from "react-native-paper";
import { ProskommaContext } from "../context/proskommaContext";
import { ColorThemeContext } from "../context/colorThemeContext";
import { Text } from "react-native-paper";
import { NavigationContext } from "../context/navigationContext";
import { useRouter } from "expo-router";
import AddResourcesIcon from "../assets/icons/flavorIcons/addResources";
export default function DropDownSelectRessources({ setDocSetId, setIsOnTop }) {
  const router = useRouter();
  const { docSetId, secondariesDocSetIds } = useContext(NavigationContext);
  const { pk } = useContext(ProskommaContext);
  const { colors, theme } = useContext(ColorThemeContext);
  const dropdownRef = useRef(null);
  const data = useRef(createDataArray(pk));



  const handleChange = (item) => {
    setIsOnTop(false);
    setInComponentValue(item.value);
  };

  const openDropdown = () => {
    if (dropdownRef.current) {
      dropdownRef.current.open();
    }
  };

  return (
    <TouchableRipple
      borderless
      style={{ height: 40, flex: 1 }}
      rippleColor={colors.stateLayers[theme].onSurfaceVariant.opacity012}
      onPress={() => router.push('/ressourcesPage')}
    >
      <View
        style={{
          flexDirection: "row", // Ensures horizontal layout
          paddingLeft: 24,
          paddingRight: 24,
          height: 40, // Match the height of TouchableRipple
          borderColor: colors.schemes[theme].outline,
          borderWidth: 1,
          borderRadius: 100,
          justifyContent: "center", // Center content horizontally
          alignItems: "center", // Center content vertically
        }}
      >
        {secondariesDocSetIds.length > 0 ? (
          <AddResourcesIcon
            color={colors.schemes[theme].primary}
            width={18}
            height={18}
          />
        ) : (
          <ResourcesIcon
            color={colors.schemes[theme].primary}
            width={18}
            height={18}
          />
        )}

        <Text
          variant="labelLarge"
          style={{
            color: colors.schemes[theme].primary,
            marginLeft: 8, // Space between icon and text
          }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {data.current.filter((e) => e.value === docSetId)[0]?.label}
        </Text>

        {secondariesDocSetIds.length > 0 && (
          <View
            style={{
              marginLeft: 8, // Space between text and badge
              justifyContent: "center", // Center the badge vertically
              alignItems: "center",
              height: "100%",
            }}
          >
            <Badge>+{secondariesDocSetIds.length}</Badge>
          </View>
        )}
      </View>
    </TouchableRipple>
  );
}
const styles = StyleSheet.create({
  dropdownWrapper: {
    position: "relative",
  },
  dropdown: {
    height: 32,
    width: Dimensions.get("window").width - 3 * 48 - 16, //-16 for 4*2 padding and 4*2 for 4 gap
    borderWidth: 1,
    borderRadius: 9,
    borderColor: "#777680",
    justifyContent: "center",
    alignItems: "center",
    overflow: "visible",
    flexDirection: "row",
  },
  placeholderStyle: {
    paddingLeft: 8,
    paddingRight: 8,
    paddingVertical: 4,
    textAlign: "center",
  },
  selectedTextStyle: {
    fontSize: 16,
    marginHorizontal: 12,
    textAlign: "center",
  },
  containerStyle: {
    maxHeight: 600,
    minHeight: 300,
    borderRadius: 4,
    paddingBottom: 12,
  },
  itemContainerStyle: {
    paddingLeft: 8,
    paddingRight: 8,
  },
  touchableOverlay: {
    ...StyleSheet.absoluteFillObject,
    height: 32,
    zIndex: 2,
    borderRadius: 9,
    backgroundColor: "rgba(0,0,0,0)",
    justifyContent: "center",
    alignItems: "center",
  },
});

function createDataArray(pk) {
  const response = pk.gqlQuerySync(`
    {
      docSets {
        tags
        id
      }
    }
  `);
  console.log(response.data.docSets)
  return response.data.docSets.map((e) => ({
    label: e.tags.length > 0? e.tags[0].split(":")[1]:[e.id],
    value: e.id,
  }));
}

// <View style={styles.dropdownWrapper}>
//   <Dropdown
//     ref={dropdownRef}
//     style={[styles.dropdown]}
//     itemTextStyle={{ color: colors.schemes[theme].onSurface }}
//     placeholderStyle={[
//       styles.placeholderStyle,
//       {
//         color: colors.schemes[theme].onSurface,
//         backgroundColor: colors.schemes[theme].surface,
//       },
//     ]}
//     itemContainerStyle={[
//       styles.itemContainerStyle,
//       {
//         color: colors.schemes[theme].onSurface,
//         backgroundColor: colors.schemes[theme].surface,
//       },
//     ]}
//     selectedTextStyle={[
//       styles.selectedTextStyle,
//       { color: colors.schemes[theme].onSurfaceVariant },
//     ]}
//     containerStyle={[
//       styles.containerStyle,
//       {
//         backgroundColor: colors.schemes[theme].surface,
//         color: colors.schemes[theme].onSurface,
//       },
//     ]}
//     activeColor={colors.schemes[theme].surfaceVariant}
//     selectedTextProps={{
//       numberOfLines: 1,
//       ellipsizeMode: "tail",
//     }}
//     data={data.current}
//     labelField="label"
//     valueField="value"
//     value={inComponentValue}
//     onChange={handleChange}
//     showsVerticalScrollIndicator={true}
//     renderLeftIcon={() => (
//       <View style={{ marginLeft: 12 }}>
//         <ResourcesIcon
//           color={colors.schemes[theme].onSurface}
//           width={18}
//           height={18}
//         />
//       </View>
//     )}
//     renderRightIcon={() => (
//       <View style={{ marginRight: 12 }}>
//         <ArrowDownIcon
//           color={colors.schemes[theme].onSurface}
//           width={18}
//           height={18}
//         />
//       </View>
//     )}
//   />
//   <TouchableRipple
//     onPress={openDropdown}
//     style={styles.touchableOverlay}
//     borderless
//     rippleColor = {colors.stateLayers[theme].onSurfaceVariant.opacity012}
//   >
//     <View style={{ flexDirection: "row", alignItems: "center" }}>
//       <View style={{ flex: 1, height: "100%" }} />
//     </View>
//   </TouchableRipple>
// </View>
