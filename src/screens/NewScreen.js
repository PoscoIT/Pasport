/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Linking,
  Dimensions,
  SafeAreaView,
} from "react-native";
import {
  Avatar,
  Icon,
  MenuItem,
  OverflowMenu,
  Text,
  TopNavigation,
  TopNavigationAction,
} from "@ui-kitten/components";
import "firebase/auth";
import firebase from "firebase/compat/app";
import { getVersionNo, sendUserInfoName } from "../api/auth-api";
import { getAuth } from "firebase/auth";
import { useAuth } from "../hooks/useAuth";
import { t } from "i18next";
const MenuIcon = (props) => <Icon {...props} name="more-vertical" />;

const InfoIcon = (props) => <Icon {...props} name="info" />;

const LogoutIcon = (props) => <Icon {...props} name="log-out" />;

let width = Dimensions.get("window").width; //full width
let height = Dimensions.get("window").height; //full width

const logoutUser = (companyCode) => {
  const auth = getAuth();
  if (companyCode === "TST") {
    auth.signOut();
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
          title={`${t("loginScreen.version")} 40`}
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
      <SafeAreaView style={styles.titleContainer}>
        {/* <Text
          style={{
            fontWeight: '600',
            fontSize: width / 18,
            textAlign: 'center',
          }}>
          {title} Safety App
        </Text>*/}
      </SafeAreaView>
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
