import ITSR from "../screens/ITSR";

import { createStackNavigator } from "@react-navigation/stack";

const ITIncidentStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      initialRouteName="ITSR"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ITSR" component={ITSR} />
    </Stack.Navigator>
  );
};
export default ITIncidentStack;
