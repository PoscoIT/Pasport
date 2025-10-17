import ITSR from '../screens/ITSR';
import ITAuth from '../screens/ITAuth';
import {createStackNavigator} from '@react-navigation/stack';
import ChangePasswordScreen from "../screens/ChangePasswordScreen";

const ITIncidentStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      initialRouteName="ITSR"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="ITSR" component={ITSR} />


    </Stack.Navigator>
  );
};
export default ITIncidentStack;
