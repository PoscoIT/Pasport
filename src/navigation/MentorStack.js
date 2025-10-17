import {createStackNavigator} from '@react-navigation/stack';
import SafetyMainScreen from '../screens/Safety/SafetyMainScreen';
import SafetyRules from '../screens/Safety/SafetyRules';
import SafetyRuleDetail from '../screens/Safety/SafetyRuleDetail';
import SafetyDetailScreen from '../screens/Safety/SafetyDetailScreen';
import SafetyImage from "../screens/Safety/SafetyImage";
import VideoModal from "../components/VideoModal";
import SafetyControl from "../screens/Safety/SafetyControl";

const MentorStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      initialRouteName="SafetyMainScreen"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="SafetyMainScreen" component={SafetyMainScreen} />
      <Stack.Screen name="SafetyDetailScreen" component={SafetyDetailScreen} />
      <Stack.Screen name="SafetyRules" component={SafetyRules} />
       <Stack.Screen name="SafetyRuleDetail" component={SafetyRuleDetail} /> 
        <Stack.Screen name="SafetyControl" component={SafetyControl} />
      <Stack.Screen name="SafetyImage" component={SafetyImage} />
      <Stack.Screen name="SafetyVideo" component={VideoModal} />

    </Stack.Navigator>
  );
};
export default MentorStack;
