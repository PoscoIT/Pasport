import { memo } from "react";
import {
  ImageBackground,
  StyleSheet,
  KeyboardAvoidingView,
  StatusBar,
  Dimensions,
  View,
} from "react-native";
let height = Dimensions.get("window").height; //full width

const Background = ({ children }) => (
  <View style={{ flex: 1, height: height }}>
    <ImageBackground resizeMode="repeat" style={styles.background}>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        {children}
      </KeyboardAvoidingView>
    </ImageBackground>
  </View>
);

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-start",
    height: height,

    paddingTop: Platform.OS === "android" ? 0 : 0,
    backgroundColor: "#e3f2fd",
  },
  container: {
    width: "100%",
    alignItems: "center",
  },
});

export default memo(Background);
