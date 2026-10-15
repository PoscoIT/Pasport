import {
  Alert,
  Dimensions,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.accent} />

          <Text style={styles.title}>
            {t("forgotPassword")}
          </Text>

          <Text style={styles.subtitle}>
            {t("resetPasswordDescription", {
              defaultValue:
                t("forgotPasswordTitle"),
            })}
          </Text>

          <View
            pointerEvents="none"
            style={styles.decorationLarge}
          />
          <View
            pointerEvents="none"
            style={styles.decorationSmall}
          />
        </View>

        <View style={styles.form}>
          <View style={styles.inputWrapper}>
            <TextInput
              label={t("loginScreen.email")}
              returnKeyType="done"
              value={email.value}
              onChangeText={(text) =>
                setEmail({ value: text, error: "" })
              }
              error={!!email.error}
              errorText={email.error}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              keyboardType="email-address"
            />
          </View>

          <Button
            onPress={triggerResetEmail}
            mode="contained"
            buttonColor="#0B337C"
            textColor="#FFFFFF"
            style={styles.button}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
          >
            {t("sendResetLink", {
              defaultValue: t("forgotPasswordButton"),
            })}
          </Button>

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            accessibilityRole="button"
          >
            <Text style={styles.backButtonText}>
              {t("goBack")}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerLine} />

          <Text style={styles.versionText}>
            {t("loginScreen.version")} 59
          </Text>

          <View style={styles.footerLine} />
        </View>
      </ScrollView>
    )}
  </View>
);
}
const styles = StyleSheet.create({
  safeAreaStyle: {
    flex: 1,
    backgroundColor: "#0B337C",
    paddingTop:
      Platform.OS === "android"
        ? (StatusBar.currentHeight ?? 0) + 16
        : 60,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: "#F3F6FC",
    paddingBottom: 32,
  },
  header: {
    backgroundColor: "#0B337C",
    paddingHorizontal: 30,
    paddingTop: 32,
    paddingBottom: 70,
    overflow: "hidden",
  },
  accent: {
    width: 38,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#93C5FD",
    marginBottom: 24,
    zIndex: 1,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "700",
    lineHeight: 39,
    marginBottom: 14,
    zIndex: 1,
  },
  subtitle: {
    color: "#D4E2F8",
    fontSize: 15,
    lineHeight: 24,
    maxWidth: 340,
    zIndex: 1,
  },
  decorationLarge: {
    position: "absolute",
    width: 210,
    height: 210,
    borderRadius: 105,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.16)",
    right: -100,
    top: -65,
  },
  decorationSmall: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    right: -70,
    bottom: -40,
  },
  form: {
    width: "90%",
    maxWidth: 440,
    alignSelf: "center",
    marginTop: -30,
    padding: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    shadowColor: "#0B337C",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
  inputWrapper: {
    width: "100%",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#0B337C",
    borderRadius: 12,
  },
  buttonContent: {
    minHeight: 54,
    paddingVertical: 4,
  },
  buttonLabel: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0,
    marginHorizontal: 8,
  },
  backButton: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#F0F4FB",
  },
  backButtonText: {
    color: "#0B337C",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 36,
    paddingHorizontal: 60,
  },
  footerLine: {
    flex: 1,
    maxWidth: 55,
    height: 1,
    backgroundColor: "#D5DEED",
  },
  versionText: {
    color: "#73829B",
    fontSize: 12,
    marginHorizontal: 14,
  },
});
export default ForgotPasswordScreen;
