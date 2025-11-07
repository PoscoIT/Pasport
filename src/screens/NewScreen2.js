/* eslint-disable prettier/prettier */
import React from "react";
import { StyleSheet, View, Linking } from "react-native";
import {
  Avatar,
  MenuItem,
  OverflowMenu,
  TopNavigation,
  TopNavigationAction,
} from "@ui-kitten/components";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// Icon bileşenleri
const MenuIcon = (props) => (
  <MaterialCommunityIcons
    name="dots-vertical"
    size={props.size || 24}
    color={props.color || "black"}
  />
);

const InfoIcon = (props) => (
  <MaterialCommunityIcons
    name="information"
    size={props.size || 24}
    color={props.color || "black"}
  />
);

const LogoutIcon = (props) => (
  <MaterialCommunityIcons
    name="logout"
    size={props.size || 24}
    color={props.color || "black"}
  />
);

export const TopNavigationImageTitleShowcase2 = ({ navigation }) => {
  const [menuVisible, setMenuVisible] = React.useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const onItemSelect = (index) => {
    if (index.row === 0) {
      Linking.openURL("https://poscoassan.com.tr/download.html").catch((err) =>
        console.error("Error", err)
      );
    }
  };

  const renderMenuAction = () => (
    <TopNavigationAction icon={MenuIcon} onPress={toggleMenu} />
  );

  const renderOverflowMenuAction = () => (
    <OverflowMenu
      anchor={renderMenuAction}
      visible={menuVisible}
      placement="bottom end"
      backdropStyle={styles.backdrop}
      onSelect={onItemSelect}
      onBackdropPress={toggleMenu}
    >
      <MenuItem accessoryLeft={InfoIcon} title="Update App" />
    </OverflowMenu>
  );

  const renderTitle = (props) => (
    <View style={styles.titleContainer}>
      <View style={{ position: "absolute", left: -50 }}>
        <Avatar style={styles.logo} source={require("../assets/logo.png")} />
      </View>
      {/* <Text {...props}>TST Safety App</Text> */}
    </View>
  );

  return (
    <TopNavigation
      title={renderTitle}
      style={styles.TopNavigation}
      accessoryRight={renderOverflowMenuAction}
    />
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00000",
  },
  logo: {
    width: "100%",
    aspectRatio: 5,
  },
  TopNavigation: {
    backgroundColor: "#FFF",
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
