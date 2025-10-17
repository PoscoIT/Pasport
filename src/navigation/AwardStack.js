import {createStackNavigator} from '@react-navigation/stack';
import DashboardAward from '../screens/DashboardAward';
import SendGift from '../screens/SendGift';
import SelectGift from '../screens/SelectGift';
import ShowOldRecord from '../screens/ShowOldRecord';

const AwardStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      initialRouteName="DashboardAward"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="DashboardAward" component={DashboardAward} />
      <Stack.Screen name="SendGift" component={SendGift} />

      <Stack.Screen name="SelectGift" component={SelectGift} />
    </Stack.Navigator>
  );
};
export default AwardStack;
