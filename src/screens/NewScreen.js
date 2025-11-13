/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Linking, Dimensions } from "react-native";

import {
  MenuItem,
  OverflowMenu,
  TopNavigation,
  TopNavigationAction,
} from "@ui-kitten/components";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { getVersionNo, sendUserInfoName } from "../api/auth-api";

import { t } from "i18next";
import { signOut } from "@react-native-firebase/auth";
const MenuIcon = (props) => (
  <MaterialCommunityIcons
    name="dots-vertical" // "more-vertical" yerine MaterialCommunityIcons karşılığı
    size={props.size || 24}
    color={props.color || "black"}
  />
);

// Info icon
const InfoIcon = (props) => (
  <MaterialCommunityIcons
    name="information" // "info" yerine karşılık
    size={props.size || 24}
    color={props.color || "black"}
  />
);

// Logout icon
const LogoutIcon = (props) => (
  <MaterialCommunityIcons
    name="logout" // "log-out" yerine karşılık
    size={props.size || 24}
    color={props.color || "black"}
  />
);

let width = Dimensions.get("window").width; //full width
let height = Dimensions.get("window").height; //full width

const logoutUser = (companyCode) => {
  if (companyCode === "TST") {
    signOut();
  }
};

export const TopNavigationImageTitleShowcase = (navigation) => {
  const [menuVisible, setMenuVisible] = React.useState(false);
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const onItemSelect = (index) => {
    if (index.row === 1) {
      Linking.openURL("https://poscoassan.com.tr/download.html").catch((err) =>
        console.error("Error", err)
      );
    } else if (index.row === 2) {
      logoutUser("TST");
    }
  };

  const renderMenuAction = () => (
    <TopNavigationAction icon={MenuIcon} onPress={toggleMenu} />
  );

  const renderOverflowMenuAction = () => (
    <React.Fragment>
      <OverflowMenu
        anchor={renderMenuAction}
        visible={menuVisible}
        placement="bottom end"
        backdropStyle={styles.backdrop}
        onSelect={onItemSelect}
        onBackdropPress={toggleMenu}
      >
        <MenuItem
          accessoryLeft={InfoIcon}
          title={`${t("loginScreen.version")} 41`}
        />
        <MenuItem accessoryLeft={InfoIcon} title={t("general.updateApp")} />
        <MenuItem accessoryLeft={LogoutIcon} title={t("general.logOut")} />
      </OverflowMenu>
    </React.Fragment>
  );

  const renderTitle = (props) => {
    const [lineInfo, setLineInfo] = useState("");
    const [title, setTitle] = useState("");
    const getUser = async () => {
      await sendUserInfoName((sendResponse) => {
        setLineInfo(sendResponse.line);
        if (sendResponse.line === "TNPC") {
          setTitle("Tnpc");
        } else {
          setTitle("TST");
        }
      });
    };

    useEffect(() => {
      getUser();
    }, []);

    return (
      <View style={styles.titleContainer}>
        {/* <Text
          style={{
            fontWeight: '600',
            fontSize: width / 18,
            textAlign: 'center',
          }}>
          {title} Safety App
        </Text>*/}
      </View>
    );
  };

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
    marginTop: 10,
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  logo: {
    width: "100%",

    aspectRatio: 5,
  },
  TopNavigation: {
    backgroundColor: "#FFF",
  },
  overflowMenuStyle: {
    backgroundColor: "red",
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
