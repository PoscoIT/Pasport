import {
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import {Layout} from '@ui-kitten/components';
import {NavigationContainer} from '@react-navigation/native';
import {
  BottomTabBar,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import HomeStack from './ITIncidentStack';
import MentorStack from './MentorStack';
import GonuldenStack from './GonuldenStack';
import AwardStack from './AwardStack';
import LineStack from './LineStack';
import {TopNavigationImageTitleShowcase} from '../screens/NewScreen';
import ChangePasswordScreen from "../screens/ChangePasswordScreen";
const MainStack = () => {
  const Tab = createBottomTabNavigator();
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#FDFAF6'}}>
        <Layout style={{flex: 1}}>
          <TopNavigationImageTitleShowcase />
          <NavigationContainer>
            <Tab.Navigator
              tabBar={props => <BottomTabBar {...props} />}
              initialRouteName={'Safety 1st'}
              screenOptions={{
                activeTintColor: '#C7E2FF',
                backgroundColor: '#C7E2FF',
              }}>

              <Tab.Screen
                name="Safety 1st"
                component={MentorStack}
                options={{
                  headerShown: false,
                  unmountOnBlur: true,
                }}
              />


              <Tab.Screen
                name="IT"
                component={HomeStack}
                options={{
                  headerShown: false,
                  unmountOnBlur: true,
                }}
              />
              {/*  <Tab.Screen
                    name="ChangePasswordScreen"
                    component={ChangePasswordScreen}
                    options={{
                        headerShown: false,
                        unmountOnBlur: true,
                    }}
                />*/}

              <Tab.Screen
                name="Gönülden"
                component={GonuldenStack}
                options={{
                  headerShown: false,
                  unmountOnBlur: true,
                }}
              />

              <Tab.Screen
                name="Award"
                component={AwardStack}
                options={{
                  headerShown: false,
                  unmountOnBlur: true,
                }}
              />
              <Tab.Screen
                name="Line T."
                component={LineStack}
                options={{
                  headerShown: false,
                  unmountOnBlur: true,
                }}
              />

            </Tab.Navigator>
          </NavigationContainer>
        </Layout>
      </SafeAreaView>
    );
};
const styles = StyleSheet.create({
  TopNavigation: {
    backgroundColor: '#FDFAF6',
    bottom: 0,
    zIndex: 1,
    position: 'absolute',
  },
  preloader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default MainStack;
