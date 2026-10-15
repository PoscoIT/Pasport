import { useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  StatusBar,
  ScrollView
} from "react-native";
import { Button } from "react-native-paper";

import { emailValidator, passwordValidator } from "../core/utils";
import { loginUser } from "../api/auth-api";
import TextInput from "../components/TextInput";
import { Card, Text } from "react-native-paper";
import { t } from "i18next";

const { width, height } = Dimensions.get("window"); //full width

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [country1, setCountry1] = useState({ value: "" });
  const _onLoginPressed = async () => {
    if (loading) {
      return;
    }

    try {
      const emailError = emailValidator(email.value);
      const passwordError = passwordValidator(password.value);

      if (emailError || passwordError) {
        setEmail({ ...email, error: emailError });
        setPassword({ ...password, error: passwordError });
        return;
      } else {
        setLoading(true);
        const response = await loginUser({
          email: email.value,
          password: password.value,
          company: country1.value,
        });
        if (response.error) {
          setError(response.error);
        }
        setLoading(false);
      }
    } catch (error) {
      alert(error.message || error.toString());
    }
  };
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#196795" />
      </View>
    );
  }

  return (
  <View style={[styles.safeAreaStyle, loginStyles.screen]}>
  {!loading && (
    <ScrollView
      contentContainerStyle={loginStyles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={loginStyles.header}>
        <View style={loginStyles.accent} />

        <Text style={loginStyles.title}>
          {t("loginScreen.message1")}
        </Text>

        <Text style={loginStyles.subtitle}>
          {t("loginScreen.message2")}
        </Text>

        <View style={loginStyles.decorationLarge} />
        <View style={loginStyles.decorationSmall} />
      </View>

      <View style={loginStyles.form}>
        <View style={loginStyles.inputWrapper}>
          <TextInput
            label={t("loginScreen.email")}
            returnKeyType="next"
            value={email.value}
            onChangeText={(text) => setEmail({ value: text, error: "" })}
            error={!!email.error}
            errorText={email.error}
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            keyboardType="email-address"
          />
        </View>

        <View style={loginStyles.inputWrapper}>
          <TextInput
            label={t("loginScreen.password")}
            returnKeyType="done"
            value={password.value}
            onChangeText={(text) =>
              setPassword({ value: text, error: "" })
            }
            error={!!password.error}
            errorText={password.error}
            secureTextEntry
            autoCapitalize="none"
            eyeIcon
          />
        </View>

        <TouchableOpacity
          style={loginStyles.forgotPassword}
          onPress={() => navigation.navigate("ForgotPasswordScreen")}
          accessibilityRole="button"
        >
          <Text style={loginStyles.forgotPasswordText}>
            {t("forgotPassword")}
          </Text>
        </TouchableOpacity>

        {!!error && (
          <View style={loginStyles.errorBox}>
            <Text style={loginStyles.errorText}>{error}</Text>
          </View>
        )}

        <Button
          mode="contained"
          onPress={_onLoginPressed}
          buttonColor="#0F766E"
          textColor="#FFFFFF"
          style={loginStyles.loginButton}
          contentStyle={loginStyles.loginButtonContent}
          labelStyle={loginStyles.loginButtonLabel}
        >
          {t("loginScreen.login")}
        </Button>
      </View>

      <View style={loginStyles.footer}>
        <View style={loginStyles.footerLine} />
        <Text style={loginStyles.versionText}>
          {t("loginScreen.version")} 59
        </Text>
        <View style={loginStyles.footerLine} />
      </View>
    </ScrollView>
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
    backgroundColor: "#fff",
  },
  safeAreaStyle: {
    flex: 1,
    justifyContent: "flex-start",
    height: height,
    backgroundColor: "#D6E4EF",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 30 : 60,
  },
  button: {
    backgroundColor: "#196795",
    borderRadius: 10,
    marginTop: 20,
  },
});

const loginStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F3F6FC",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  header: {
    backgroundColor: "#0B337C",
    paddingHorizontal: 30,
    paddingTop: 48,
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
    marginBottom: 12,
    zIndex: 1,
  },
  subtitle: {
    color: "#D4E2F8",
    fontSize: 15,
    lineHeight: 24,
    maxWidth: 320,
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
    marginBottom: 10,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    paddingVertical: 12,
    paddingLeft: 12,
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#0B337C",
    fontSize: 13,
    fontWeight: "600",
  },
  errorBox: {
    backgroundColor: "#FFF1F2",
    borderLeftWidth: 3,
    borderLeftColor: "#E11D48",
    borderRadius: 10,
    padding: 12,
    marginBottom: 18,
  },
  errorText: {
    color: "#BE123C",
    fontSize: 13,
    lineHeight: 20,
  },
  loginButton: {
    backgroundColor: "#0B337C",
    borderRadius: 12,
  },
  loginButtonContent: {
    minHeight: 54,
  },
  loginButtonLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
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

export default LoginScreen;
