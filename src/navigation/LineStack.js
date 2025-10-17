import {createStackNavigator} from '@react-navigation/stack';
import DashboardLineTracking from '../screens/LineTracking/DashboardLineTracking';
import LineTrackDetail from '../screens/LineTracking/LineTrackDetail';

const LineStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      initialRouteName="DashboardLineTracking"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="DashboardLineTracking"
        component={DashboardLineTracking}
        options={{title: 'Line Page1'}}
      />
      <Stack.Screen
        name="LineTrackDetail"
        component={LineTrackDetail}
        options={{title: 'Line Page1'}}
      />
    </Stack.Navigator>
  );
};
export default LineStack;
