/* eslint-disable react-native/no-inline-styles */
import React, { memo } from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  View,
  Platform,
  Dimensions,
  StatusBar,
} from "react-native";

const height = Dimensions.get("window").height;

const Background = ({ children }) => (
  <View style={styles.background}>
    <ScrollView style={{ flex: 1 }}>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        {children}
      </KeyboardAvoidingView>
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  background: {
    backgroundColor: "white",
    flex: 1,
    justifyContent: "flex-start",
    height: height,

    paddingTop: Platform.OS === "android" ? 0 : 44,
  },
  container: {
    width: "100%",
    alignSelf: "center",
    alignItems: "center",
  },
});

export default memo(Background);
