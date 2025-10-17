import {createStackNavigator} from '@react-navigation/stack';
import DashboardGonulden from '../screens/Gonulden/DashboardGonulden';
import GiveMindScreen from '../screens/GiveMindScreen';
import ReceiveMindScreen from '../screens/ReceiveMindScreen';
import SendMindScreen from '../screens/SendMindScreen';
import Index from "../screens/HR/Index.js";
import FoodMenu from "../screens/HR/FoodMenu";

const GonuldenStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      initialRouteName="HRDashboard"
      screenOptions={{
        headerShown: false,
      }}>
        <Stack.Screen name="HRDashboard" component={Index} />
        <Stack.Screen name="FoodMenu" component={FoodMenu} />
      <Stack.Screen name="DashboardGonulden" component={DashboardGonulden} />
      <Stack.Screen name="GiveMindScreen" component={GiveMindScreen} />
      <Stack.Screen name="ReceiveMindScreen" component={ReceiveMindScreen} />
      <Stack.Screen name="SendMindScreen" component={SendMindScreen} />
    </Stack.Navigator>
  );
};
export default GonuldenStack;
