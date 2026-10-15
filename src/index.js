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
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LoginStack from "./navigation/LoginStack";

import { Layout, Avatar } from "@ui-kitten/components";

import MentorStack from "./navigation/MentorStack";
import GonuldenStack from "./navigation/GonuldenStack";
import LineStack from "./navigation/LineStack";
import CareSystemStack from "./navigation/CareSystemStack";
// import auth from "@react-native-firebase/auth";
import { auth } from "./database/firebaseDB";
import { getVersionNo,sendUserInfoName } from "./api/auth-api";
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
import { CheckListScreen, LoginScreen } from "./screens";
import Checklist from "./screens/Production/Checklist";
import CraneChecklist from "./screens/Production/CraneChecklist";
import SleeveCount from "./screens/Production/SleeveCount";
import CoilCarChecklist from "./screens/Production/CoilCarChecklist";
import PaperTrackingSecond from "./screens/Production/PaperTrackingSecond";
import EmergencyAreaChecklist from "./screens/Safety/EmergencyAreaChecklist";

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
  const [name, setName] = useState("");
  


  const CustomDrawerContent = (props) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View style={{ flex: 1 }}>
        <DrawerContentScrollView
          {...props}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.drawerHeader}>
            <Image
              source={require("./assets/logo.png")}
              style={styles.logo}
              resizeMode="cover"
            />
             {/* <Text>{user??name}</Text>  */}

        
          </View>

          <View style={{ paddingHorizontal: 10 }}>
            <DrawerItemList {...props} />
          </View>
        </DrawerContentScrollView>
      </View>

      <View
        style={{
          flexGrow: 0,
          flexShrink: 0,
          paddingHorizontal: 16,
          paddingTop: 10,
          paddingBottom: Math.max(insets.bottom, 12),
          borderTopWidth: 1,
          borderTopColor: "#E8EDF5",
          backgroundColor: "#FFFFFF",
        }}
      >
        <DrawerItem
          label={t("general.logOut")}
          inactiveTintColor="#B42318"
          inactiveBackgroundColor="#FFF1F0"
          style={{ marginHorizontal: 0, borderRadius: 10 }}
          onPress={() =>
            Alert.alert(
              t("general.logOut"),
              t("general.logoutMessage"),
              [
                {
                  text: t("general.no"),
                  style: "cancel",
                },
                {
                  text: t("general.yes"),
                  style: "destructive",
                  onPress: () => logoutUser("TST"),
                },
              ],
            )
          }
        />

        <Text
          style={{
            color: "#64748B",
            fontSize: 12,
            textAlign: "center",
            marginTop: 10,
          }}
        >
          {t("loginScreen.version")} 59
        </Text>
      </View>
    </View>
  );
};

  const checkUser = async () => {
    if (user) {
      await getVersionNo(async (responsee) => {
        if (responsee.version > 59) {
          setVersionStatus(true);
          setIsLoading(false);
          Linking.openURL("https://poscoassan.com.tr/download.html").catch(
            (err) => console.error("Error", err),
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
      <View style={styles.appContainer}>
  <Layout style={styles.appLayout}>
         <Drawer.Navigator
          initialRouteName="SafetyMainScreen"
  drawerContent={(props) => <CustomDrawerContent {...props} />}
  screenOptions={{
    headerTitle: "",
    headerStyle: {
      backgroundColor: "#FFFFFF",
    },
    headerTintColor: "#0B337C",
    headerShadowVisible: false,

    drawerType: "front",
    swipeEnabled: true,
    overlayColor: "rgba(15, 23, 42, 0.3)",

    drawerStyle: {
      width: Math.min(width * 0.88, 350),
      backgroundColor: "#FFFFFF",
    },

    drawerActiveTintColor: "#0B337C",
    drawerActiveBackgroundColor: "#EAF0FA",
    drawerInactiveTintColor: "#475569",
    drawerInactiveBackgroundColor: "transparent",

    drawerItemStyle: {
      borderRadius: 10,
      marginHorizontal: 0,
      marginVertical: 2,
    },

    drawerLabelStyle: {
      fontSize: 13,
      fontWeight: "600",
    },
  }}
>

         <Drawer.Screen
  name="SafetyMainScreen"
  component={MentorStack}
  options={{
    drawerLabel: "Safety First",
  }}
/>

            {/* <Drawer.Screen name="Checklist" component={Checklist} /> */}
            <Drawer.Screen name="Care System Checklist" component={CareSystemStack} />
            <Drawer.Screen name="Emergency Area Checklist" component={EmergencyAreaChecklist} />
            <Drawer.Screen name={t("iTSR")} component={ITIncidentStack} />
            <Drawer.Screen name={t("iTAuth")} component={ITAuthStack} />
            <Drawer.Screen name={t("myMachine")} component={MyMac} />
            <Drawer.Screen
              name="Vinç-Forklift Checklist"
              component={CraneChecklist}
            />
            <Drawer.Screen
              name="Coil Car Checklist"
              component={CoilCarChecklist}
            />
            <Drawer.Screen
              name="605 Sleeve Sayım"
              component={SleeveCount}
              options={{
                unmountOnBlur: true,
              }}
            />
            <Drawer.Screen name="Canlı Beyaz Kağıt" component={PaperTracking} />
             <Drawer.Screen name="ZRM Kağıt Stok Durumu" component={PaperTrackingSecond} />

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
  appContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "android" ? 0 : 44,
  },

  appLayout: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  drawerScroll: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  drawerContent: {
    flexGrow: 1,
  },

  drawerHeader: {
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 22,
    marginHorizontal: 8,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF1F5",
  },

  logo: {
    width: "100%",
    height: 44,
    marginBottom: 16,
  },

  profileName: {
    color: "#172B4D",
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 23,
    marginBottom: 4,
  },

  profileEmail: {
    color: "#64748B",
    fontSize: 12,
    lineHeight: 19,
  },

  menuContainer: {
    paddingHorizontal: 10,
    paddingBottom: 18,
  },

  drawerFooter: {
    flexGrow: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 12,
    paddingBottom: 16,
  },

  logoutButton: {
    borderTopWidth: 1,
    borderTopColor: "#EEF1F5",
    borderRadius: 0,
    marginHorizontal: 0,
    marginVertical: 0,
    paddingTop: 8,
  },

  logoutLabel: {
    fontSize: 13,
    fontWeight: "600",
  },

  versionText: {
    color: "#94A3B8",
    fontSize: 11,
    textAlign: "center",
    marginTop: 12,
    marginBottom: 4,
  },

  preloader: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },

  labelDate: {
    color: "#0B337C",
    fontSize: 17,
    fontWeight: "600",
    lineHeight: 26,
    textAlign: "center",
    marginBottom: 20,
  },
});
export default Index;
