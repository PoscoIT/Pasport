import React, { useEffect, useState } from "react";
import { useAuth } from "./hooks/useAuth";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Linking,
  Text,
  Alert,
  Dimensions,
} from "react-native";
import LoginStack from "./navigation/LoginStack";
import { SafeAreaView } from "react-native-safe-area-context";
import { Layout, Avatar, Icon } from "@ui-kitten/components";
import { TopNavigationImageTitleShowcase2 } from "./screens/NewScreen2";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MentorStack from "./navigation/MentorStack";
import GonuldenStack from "./navigation/GonuldenStack";
import LineStack from "./navigation/LineStack";
import { getAuth } from "firebase/auth";
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
import CareSystemStack from "./navigation/CareSystemStack";
import ITIncidentStack from "./navigation/ITIncidentStack";
import ITAuthStack from "./navigation/ITAuthStack";
import BodyShowerChecklist from "./screens/Safety/BodyShowerChecklist";

const Index = ({ navigation }) => {
  const { user, loading, isOpen } = useAuth();
  getAuth();

  const logoutUser = (companyCode) => {
    const auth = getAuth();
    if (companyCode === "TST") {
      auth.signOut();
    }
  };
  const color = "red";
  const [expanded, setExpanded] = useState(false);

  const handlePress = () => setExpanded(!expanded);
  const size = 24;
  const Tab = createBottomTabNavigator();
  const Drawer = createDrawerNavigator();
  const [isLoading, setIsLoading] = useState(true);
  const [versionStatus, setVersionStatus] = useState(false);
  const { width } = Dimensions.get("screen");

  const CustomDrawerContent = (props) => {
    return (
      <DrawerContentScrollView {...props}>
        <View>
          <Avatar style={styles.logo} source={require("./assets/logo.png")} />
        </View>
        <DrawerItemList {...props} />
        {/*<AccordionItem {...props} />*/}
        {/*   logoutUser('TST')*/}
        {/*  <List.Section>
              <List.Accordion titleStyle={{fontSize:14,color:expanded ? '#1f95d5' : '#3c3c3c'}}
                  title="Forklift Reservation"
                  expanded={expanded}
                  style={{ backgroundColor: expanded ? '#FFFFFF' : '#FFFFFF'}}
                  onPress={handlePress}
              >
                  <List.Item
                      titleStyle={{fontSize:14}}
                      title="Rezarvasyon Yap"
                      onPress={() => props.navigation.navigate("Forklift Reservation")}
                  />
                  <List.Item
                      titleStyle={{fontSize:14}}
                      title="Rezarvasyonları Görüntüle"
                      onPress={() => props.navigation.navigate("Forklift Reservation Viewer")}
                  />
              </List.Accordion>
          </List.Section>*/}

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
        <DrawerItem label={t("loginScreen.version") + "   40"} />
      </DrawerContentScrollView>
    );
  };

  const checkUser = async () => {
    if (user) {
      await getVersionNo(async (responsee) => {
        if (responsee.version > 40) {
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
      <View style={{ flex: 1, backgroundColor: "#FDFAF6", marginTop: 35 }}>
        <Layout style={{ flex: 1 }}>
          {/* <TopNavigationImageTitleShowcase /> */}

          <Drawer.Navigator
            initialRouteName="Login"
            drawerContent={(props) => <CustomDrawerContent {...props} />}
          >
            <Drawer.Screen name="Safety 1st" component={MentorStack} />
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
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FDFAF6" }}>
        <Layout style={{ flex: 1 }}>
          <TopNavigationImageTitleShowcase2 />

          <Tab.Navigator
            initialRouteName="LoginStack"
            screenOptions={{
              activeTintColor: "#C7E2FF",
              backgroundColor: "#C7E2FF",
            }}
          >
            <Tab.Screen
              name="Login"
              component={LoginStack}
              options={{
                headerShown: false,
                tabBarStyle: { display: "none" },
              }}
            />
          </Tab.Navigator>
        </Layout>
      </SafeAreaView>
    );
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
