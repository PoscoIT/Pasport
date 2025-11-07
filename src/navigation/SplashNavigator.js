import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { TransitionPresets } from "@react-navigation/stack";
import Index from "../index";

const Stack = createNativeStackNavigator();

const SplashNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={({ route, navigation }) => ({
        headerShown: false,
        gestureEnabled: true,
        ...TransitionPresets.ModalPresentationIOS,
      })}
    >
      {/* <Stack.Screen
                    component={Splash}
                    name="Splash"
                    options={{header: () => null}}
                />*/}
      <Stack.Screen
        component={Index}
        name="Index"
        options={{ header: () => null }}
      />
    </Stack.Navigator>
  );
};
export default SplashNavigator;
