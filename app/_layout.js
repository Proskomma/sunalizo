import { Stack } from "expo-router";
import { ProskommaProvider } from "../context/proskommaContext";
import { I18nProvider } from "../context/i18nContext";
import { ColorThemeProvider } from "../context/colorThemeContext";
import { NavigationProvider } from "../context/navigationContext";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <NavigationProvider>
      <I18nProvider>
        <ProskommaProvider>
          <ColorThemeProvider>
            <Stack>
              <Stack.Screen
                options={{
                  headerShown: false,
                  gestureEnabled: false, // Disable gesture navigation
                }}
                name="(MainLayout)"
              />
            </Stack>
          </ColorThemeProvider>
        </ProskommaProvider>
      </I18nProvider>
    </NavigationProvider>
  );
}
