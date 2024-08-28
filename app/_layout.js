import { Stack } from "expo-router";
import { ProskommaProvider } from "../context/proskommaContext";
import { I18nProvider } from "../context/i18nContext";
import { ColorThemeProvider } from "../context/colorThemeContext";
import { NavigationProvider } from "../context/navigationContext";
import * as SplashScreen from "expo-splash-screen";
import { TextOptionProvider } from "../context/textOptionContext";

SplashScreen.preventAutoHideAsync();
//eas build -p android --profile preview

export default function RootLayout() {
  return (
    <NavigationProvider>
      <I18nProvider>
        <ProskommaProvider>
          <ColorThemeProvider>
            <TextOptionProvider>
              <Stack>
                <Stack.Screen
                  options={{
                    headerShown: false,
                    gestureEnabled: false, // Disable gesture navigation
                  }}
                  name="(MainLayout)"
                />
              </Stack>
            </TextOptionProvider>
          </ColorThemeProvider>
        </ProskommaProvider>
      </I18nProvider>
    </NavigationProvider>
  );
}
