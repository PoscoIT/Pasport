import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  StyleSheet,
  View,
  Platform,
  StatusBar,
} from "react-native";
import { Button } from "react-native-paper";
import { t } from "i18next";
import TextInput from "../components/TextInput";
import { sendPasswordResetEmail } from "@react-native-firebase/auth";
import { auth } from "../database/firebaseDB";

const { width, height } = Dimensions.get("window");

const ChangePasswordScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState({ value: "", error: "" });

  const triggerResetEmail = async () => {
    if (!email.value) {
      Alert.alert(t("pleaseEnterEmail"));
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.value);
      Alert.alert(t("forgotPasswordMessage"));
      navigation.goBack();
    } catch (error) {
      Alert.alert(t("unknownUser"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.safeAreaStyle}>
      {!loading && (
        <View>
          <View
            style={{
              flexDirection: "column",
              flexGrow: 1,
              marginHorizontal: 10,
              borderRadius: 30,
            }}
          >
            <TextInput
              label={t("loginScreen.email")}
              returnKeyType="done"
              value={email.value}
              onChangeText={(text) => setEmail({ value: text, error: "" })}
              error={!!email.error}
              errorText={email.error}
              autoCapitalize="none"
            />
          </View>

          <View
            style={{
              flexDirection: "column",
              flexGrow: 1,
              marginHorizontal: 60,
            }}
          >
            <Button
              onPress={triggerResetEmail}
              mode="contained"
              style={styles.button}
            >
              {t("forgotPassword")}
            </Button>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  safeAreaStyle: {
    flex: 1,
    justifyContent: "flex-start",
    height: height,
    backgroundColor: "#D6E4EF",

    paddingTop: Platform.OS === "android" ? 0 : 44,
  },
  button: {
    backgroundColor: "#196795",
    borderRadius: 10,
    marginTop: 20,
  },
});

export default ChangePasswordScreen;
