import {createStackNavigator} from '@react-navigation/stack';
import ChecklistDetails from '../screens/Maintenance/ChecklistDetails';
import CareSystemChecklist from '../screens/Maintenance/CareSystemChecklist';
import CareSystemMainScreen from '../screens/Maintenance/CareSystemMainScreen';
import CareSystemPeriodicControl from '../screens/Maintenance/CareSystemPeriodicControl';

const CareSystemStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      initialRouteName="CareSystemMainScreen"
      screenOptions={{
        headerShown: false,
      }}>
         <Stack.Screen
        name="CareSystemMainScreen"
        component={CareSystemMainScreen}
  
      />
         <Stack.Screen
        name="CareSystemPeriodicControl"
        component={CareSystemPeriodicControl}
  
      />
      <Stack.Screen
        name="CareSystemChecklist"
        component={CareSystemChecklist}
  
      />
      <Stack.Screen
        name="ChecklistDetails"
        component={ChecklistDetails}
       
      />
    </Stack.Navigator>
  );
};
export default CareSystemStack;
