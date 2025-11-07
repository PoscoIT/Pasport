/* eslint-disable react-native/no-inline-styles */
import React, { memo } from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  View,
  Platform,
  StatusBar,
  Dimensions,
} from "react-native";

import LinearGradient from "react-native-linear-gradient";
let height = Dimensions.get("window").height;

const BackgroundGradient = ({ children }) => (
  <View style={styles.background}>
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <LinearGradient
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 1.0, y: 1.0 }}
        locations={[0, 0.5, 1]}
        useAngle={true}
        angle={180}
        colors={["#FDFAF6", "rgba(122,183,209,0.44)", "#FDFAF6"]}
        style={styles.linearGradient}
      >
        {children}
      </LinearGradient>
    </KeyboardAvoidingView>
  </View>
);

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#FDFAF6",
    flex: 1,
    justifyContent: "flex-start",
    height: height,
    backgroundColor: "#D6E4EF",

    // iPhone çentik alanı + Android status bar yüksekliğini hesaba kat
    paddingTop: Platform.OS === "android" ? 0 : 0,
  },
  container: {
    width: "100%",
    alignSelf: "center",
    alignItems: "center",
  },
});

export default memo(BackgroundGradient);
