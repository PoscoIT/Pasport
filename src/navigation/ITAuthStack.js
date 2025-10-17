import ITSR from '../screens/ITSR';
import ITAuth from '../screens/ITAuth';
import {createStackNavigator} from '@react-navigation/stack';
import ChangePasswordScreen from "../screens/ChangePasswordScreen";

const ITAuthStack = () => {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator
            initialRouteName="ITAuth"
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen name="ITAuth" component={ITAuth} />

        </Stack.Navigator>
    );
};
export default ITAuthStack;
