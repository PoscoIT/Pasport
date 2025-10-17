import React from 'react';
import App from './src';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import 'react-native-gesture-handler';
import * as eva from '@eva-design/eva';
import {MD3LightTheme, useTheme} from 'react-native-paper';
import {decode, encode} from 'base-64';
import './src/database/firebaseDB'
import SplashNavigator from "./src/navigation/SplashNavigator";
import { Provider as PaperProvider } from 'react-native-paper';
import './src/languages/i18n';
import {SafeAreaProvider} from "react-native-safe-area-context";




if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

const Main = () => {
    const theme = useTheme();
  return (
    <SafeAreaProvider>

      <IconRegistry icons={EvaIconsPack} />

      <ApplicationProvider {...eva} theme={eva.light}>

          <PaperProvider  theme={MD3LightTheme}>
    <SplashNavigator/>
          </PaperProvider>


      </ApplicationProvider>


    </SafeAreaProvider>
  );
};

export default Main;
