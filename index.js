/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import i18n from "./src/languages/i18n";
import {PaperProvider} from "react-native-paper";


export default function Main() {
    return (
        <PaperProvider>
            <App />
        </PaperProvider>
    );
}


AppRegistry.registerComponent(appName, () => Main);
