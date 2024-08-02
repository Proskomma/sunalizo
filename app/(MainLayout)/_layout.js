import { Stack } from "expo-router";
import { View, Image } from "react-native";
import { Text } from "react-native-paper";
import { useContext } from "react";
import { ColorThemeContext } from "../../context/colorThemeContext";
export default function MainLayout() {
  const { colors, theme } = useContext(ColorThemeContext); // Correct context usage
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitleAlign: "center",
          headerShown: false,
          headerTitle: () => (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image
                source={require("../../assets/icons/SplashScreen/IconSplash.png")}
                style={{ width: 24, height: 24 }}
              />
              <Text style={{ marginLeft: 6 }} variant="titleLarge">
                Sunalizo
              </Text>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="mainPage"
        options={{
          headerShown: false,
          gestureEnabled: false, // Disable gesture navigation
        }}
      />
      <Stack.Screen
        name="ressourcesPage"
        options={{
          headerShown: false,
          gestureEnabled: false, // Disable gesture navigation

         
        }}
      />
    </Stack>
  );
}
