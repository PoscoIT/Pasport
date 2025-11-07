import ITAuth from "../screens/ITAuth";
import { createStackNavigator } from "@react-navigation/stack";

const ITAuthStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      initialRouteName="ITAuth"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ITAuth" component={ITAuth} />
    </Stack.Navigator>
  );
};
export default ITAuthStack;
