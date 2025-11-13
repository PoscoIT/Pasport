import { useEffect, useState } from "react";
import { useAuth, user } from "./hooks/useAuth";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Linking,
  Text,
  Alert,
  Dimensions,
  Platform,
  StatusBar,
} from "react-native";
import { TransitionPresets } from "@react-navigation/stack";
import LoginStack from "./navigation/LoginStack";

import { Layout, Avatar } from "@ui-kitten/components";

import MentorStack from "./navigation/MentorStack";
import GonuldenStack from "./navigation/GonuldenStack";
import LineStack from "./navigation/LineStack";
// import auth from "@react-native-firebase/auth";
import { auth } from "./database/firebaseDB";
import { getVersionNo } from "./api/auth-api";
import MyMac from "./navigation/MyMac";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { t } from "i18next";
import PaperTracking from "./screens/Production/PaperTracking";
import FireEquipmentChecklist from "./screens/Safety/FireEquipmentChecklist";
import ITIncidentStack from "./navigation/ITIncidentStack";
import ITAuthStack from "./navigation/ITAuthStack";
import BodyShowerChecklist from "./screens/Safety/BodyShowerChecklist";
import { signOut } from "@react-native-firebase/auth";
import { createStackNavigator } from "@react-navigation/stack";
import { LoginScreen } from "./screens";

const Index = ({ navigation }) => {
  const { user, loading } = useAuth();

  const logoutUser = (companyCode) => {
    if (companyCode === "TST") {
      signOut(auth);
    }
  };
  const color = "red";
  const [expanded, setExpanded] = useState(false);

  const handlePress = () => setExpanded(!expanded);
  const size = 24;
  const Stack = createStackNavigator();
  const Drawer = createDrawerNavigator();
  const [isLoading, setIsLoading] = useState(true);
  const [versionStatus, setVersionStatus] = useState(false);
  const { width } = Dimensions.get("screen");

  const CustomDrawerContent = (props) => {
    return (
      <DrawerContentScrollView {...props}>
        <View
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            top: 0,
          }}
        >
          <Avatar style={styles.logo} source={require("./assets/logo.png")} />
        </View>
        <DrawerItemList {...props} />

        <DrawerItem
          label={t("general.logOut")}
          onPress={() =>
            Alert.alert(t("general.logOut"), t("general.logoutMessage"), [
              {
                text: t("general.no"),
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              },
              { text: t("general.yes"), onPress: () => logoutUser("TST") },
            ])
          }
        />
        <DrawerItem label={t("loginScreen.version") + "   41"} />
      </DrawerContentScrollView>
    );
  };

  const checkUser = async () => {
    if (user) {
      await getVersionNo(async (responsee) => {
        if (responsee.version > 41) {
          setVersionStatus(true);
          setIsLoading(false);
          Linking.openURL("https://poscoassan.com.tr/download.html").catch(
            (err) => console.error("Error", err)
          );
        } else {
        }
      }).catch((err) => console.log(err));
    } else {
      setVersionStatus(false);

      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, [user]);

  if (loading || isLoading) {
    return (
      <View style={styles.preloader}>
        <ActivityIndicator size="large" color="#9E9E9E" />
      </View>
    );
  } else if (!isLoading && versionStatus) {
    return (
      <View style={styles.preloader}>
        <Text style={styles.labelDate}>
          Uygulamanın güncellenmesi gerekiyor!
        </Text>
        <ActivityIndicator size="large" color="#9E9E9E" />
      </View>
    );
  } else {
    return user ? (
      <View
        style={{
          flex: 1,
          backgroundColor: "#FDFAF6",
          paddingTop: Platform.OS === "android" ? 0 : 44,
        }}
      >
        <Layout style={{ flex: 1 }}>
          <Drawer.Navigator
            screenOptions={({ route, navigation }) => ({
              gestureEnabled: true,
              ...TransitionPresets.ModalPresentationIOS,
            })}
            initialRouteName="SafetyMainScreen"
            drawerContent={(props) => <CustomDrawerContent {...props} />}
          >
            <Drawer.Screen name="SafetyMainScreen" component={MentorStack} />
            {/* <Drawer.Screen  name="Checklist" component={CareSystemStack} />    */}
            <Drawer.Screen name={t("iTSR")} component={ITIncidentStack} />
            <Drawer.Screen name={t("iTAuth")} component={ITAuthStack} />
            <Drawer.Screen name={t("myMachine")} component={MyMac} />

            <Drawer.Screen name="Paper Tracking" component={PaperTracking} />

            {/*<Drawer.Screen options={{*/}

            {/*    drawerItemStyle: { display: 'none' }*/}
            {/*}}  name="Forklift Reservation"  component={ForkliftReservation}     />*/}
            {/*<Drawer.Screen options={{*/}
            {/*    drawerItemStyle: { display: 'none' }*/}
            {/*}}  name="Forklift Reservation Viewer"  component={ForkliftReservationViewer}     />*/}
            <Drawer.Screen
              name={t("fireEquipment")}
              component={FireEquipmentChecklist}
            />
            <Drawer.Screen
              name={"Göz ve Boy Duşları Kontrolleri"}
              component={BodyShowerChecklist}
            />
            <Drawer.Screen
              name={t("hrApplications")}
              component={GonuldenStack}
            />
            <Drawer.Screen name="Line Tracking" component={LineStack} />
          </Drawer.Navigator>

          {/* <Tab.Navigator
                tabBar={props => <BottomMainStack navigation={navigation} {...props} />}
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


                }}
              />
                <Tab.Screen
                  name="IT"
                  component={HomeStack}
                  options={{
                    headerShown: false,

                  }}

                />
                <Tab.Screen
                    name="MyM"
                    component={MyMac}
                    options={{
                        headerShown: false,

                    }}

                />

              <Tab.Screen
                name="Gönülden"
                component={GonuldenStack}
                options={{
                  headerShown: false,

                }}

              />
              <Tab.Screen
                name="Line T."
                component={LineStack}
                options={{
                  headerShown: false,

                }}

              />
            </Tab.Navigator> */}
        </Layout>
      </View>
    ) : (
      <Stack.Navigator
        initialRouteName="LoginStack"
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#C7E2FF",
          tabBarStyle: { backgroundColor: "#C7E2FF" },
        }}
      >
        <Stack.Screen name="LoginStack" component={LoginStack} />
      </Stack.Navigator>
    );
    // <View style={{ flex: 1, backgroundColor: "#FDFAF6" }}>
    //   <TopNavigationImageTitleShowcase2 />
    {
      /* <Text>Fatih</Text> */
    }

    // </View>
  }
};

const styles = StyleSheet.create({
  TopNavigation: {
    backgroundColor: "#FDFAF6",
    bottom: 0,
    zIndex: 1,
    position: "absolute",
  },
  preloader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: "100%",

    aspectRatio: 5,
  },
});
export default Index;
