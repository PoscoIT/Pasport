import LoginScreen from "../screens/LoginScreen";
import { createStackNavigator } from "@react-navigation/stack";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";

const LoginStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      initialRouteName="LoginScreen"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
      />
    </Stack.Navigator>
  );
};
export default LoginStack;
