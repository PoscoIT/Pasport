import "react-native-gesture-handler";
import "./src/database/firebaseDB";
import "./src/languages/i18n";
import React from "react";
import { enableScreens } from "react-native-screens";
import { ApplicationProvider } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";

import { Provider as PaperProvider, MD3LightTheme } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";

import SplashNavigator from "./src/navigation/SplashNavigator";
import { decode, encode } from "base-64";

// base64 polyfill (bazı Firebase işlemleri için)

enableScreens(false);
if (!global.btoa) {
  global.btoa = encode;
}
if (!global.atob) {
  global.atob = decode;
}

const Main = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ApplicationProvider {...eva} theme={eva.light}>
          <PaperProvider theme={MD3LightTheme}>
            {/* Navigation container en dışta olmalı */}
            <NavigationContainer>
              <SplashNavigator />
            </NavigationContainer>
          </PaperProvider>
        </ApplicationProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default Main;
