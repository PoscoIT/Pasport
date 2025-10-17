import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import Splash from '../components/SplashComponent';
import App from "../index";
import Index from "../index";

const Stack = createNativeStackNavigator();

const SplashNavigator= ()=>{
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator>
               {/* <Stack.Screen
                    component={Splash}
                    name="Splash"
                    options={{header: () => null}}
                />*/}
                <Stack.Screen
                    component={Index}
                    name="Index"
                    options={{header: () => null}}
                />

            </Stack.Navigator>
        </NavigationContainer>
    );
}
export default SplashNavigator;