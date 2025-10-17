
import {createStackNavigator} from '@react-navigation/stack';
import MyMachineScreen from "../screens/MyMachine/MyMachineScreen";

const MyMachineStack = () => {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator
            initialRouteName="MyMachine"
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen name="MyMach" component={MyMachineScreen} />
        </Stack.Navigator>
    );
};
export default MyMachineStack;
