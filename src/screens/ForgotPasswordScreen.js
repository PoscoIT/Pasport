import {
  Alert,
  Dimensions,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Card, Text } from "react-native-paper";

import { t } from "i18next";
import TextInput from "../components/TextInput";
import { useState } from "react";
import { sendPasswordResetEmail } from "@react-native-firebase/auth";
import { auth } from "../database/firebaseDB";

const { width, height } = Dimensions.get("window");
const ForgotPasswordScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  // Değiştirildi: getAuth() satırı kaldırıldı, RNF'de buna gerek yok.
  // const auth = getAuth();

  const [email, setEmail] = useState({ value: "", error: "" });

  const triggerResetEmail = async () => {
    // Değiştirildi: sendPasswordResetEmail(auth, ...) yerine auth().sendPasswordResetEmail(...)
    await sendPasswordResetEmail(auth, email.value)
      .then(() => {
        Alert.alert(t("forgotPasswordMessage"));
        navigation.goBack(-1);
      })
      .catch(() => {
        Alert.alert(t("unknownUser"));
      });
  };

  return (
    <View style={styles.safeAreaStyle}>
      {!loading && (
        <View>
          <Card style={[styles.cardStyle]}>
            <Card.Content>
              <Text variant="titleLarge">{t("loginScreen.message1")}</Text>
              <Text variant="bodyMedium">{t("loginScreen.message2")}</Text>
            </Card.Content>
          </Card>
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
                returnKeyType="next"
                value={email.value}
                onChangeText={(text) => setEmail({ value: text, error: "" })}
                error={!!email.error}
                errorText={email.error}
                autoCapitalize="none"
                autoCompleteType="email"
                textContentType="emailAddress"
                keyboardType="email-address"
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
            <TouchableOpacity onPress={() => navigation.goBack(-1)}>
              <Text
                style={{
                  color: "black",
                  margin: 30,
                  textAlign: "center",
                  textDecorationLine: "underline",
                }}
              >
                {t("goBack")}
              </Text>
            </TouchableOpacity>
            <View
              style={{
                flexDirection: "column",
                flexGrow: 1,
                alignItems: "center",
                justifyContent: "center",
                marginVertical: 50,
              }}
            >
              <Text>{t("loginScreen.version")} 41</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  backGround: {
    width: width,
  },
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
  },
  inputContainer: {
    fontSize: 12,
  },
  leftParag: {
    fontSize: 12,
    marginLeft: 5,
    justifyContent: "center",
  },
  input2: {
    marginBottom: 10,
    backgroundColor: "transparent",
  },
  cardStyle: {
    backgroundColor: "#f6f6f6",
  },
  safeAreaStyle: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 30 : 60,
    height: height,
    backgroundColor: "#D6E4EF",
  },
  button: {
    backgroundColor: "#196795",
    borderRadius: 10,
    marginTop: 20,
  },
});
export default ForgotPasswordScreen;
