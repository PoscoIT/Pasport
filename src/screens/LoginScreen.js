import React, { memo, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Dimensions,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Button } from "react-native-paper";

import { emailValidator, passwordValidator } from "../core/utils";
import { loginUser } from "../api/auth-api";
import Toast from "../components/Toast";
import TextInput from "../components/TextInput";
import { Card, Title, Paragraph } from "react-native-paper";
import { t } from "i18next";
import Icon from "react-native-vector-icons/FontAwesome";

const { width, height } = Dimensions.get("window"); //full width

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [country1, setCountry1] = useState("");
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
    return <ActivityIndicator />;
  }

  return (
    <SafeAreaView style={styles.safeAreaStyle}>
      {!loading && (
        <View style={{ borderTopWidth: 1, borderTopColor: "#dcdcdc" }}>
          <Card style={[styles.cardStyle]}>
            <Card.Content>
              <Title>{t("loginScreen.message1")},</Title>
              <Paragraph>{t("loginScreen.message2")}</Paragraph>
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
                marginHorizontal: 10,
                borderRadius: 30,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <TextInput
                  label={t("loginScreen.password")}
                  returnKeyType="done"
                  value={password.value}
                  onChangeText={(text) =>
                    setPassword({ value: text, error: "" })
                  }
                  error={!!password.error}
                  errorText={password.error}
                  secureTextEntry={true}
                  autoCapitalize="none"
                  eyeIcon={true}
                />
              </View>

              <TouchableOpacity
                onPress={() => navigation.navigate("ForgotPasswordScreen")}
              >
                <Text
                  style={{
                    color: "black",
                    margin: 10,
                    textAlign: "right",
                    textDecorationLine: "underline",
                  }}
                >
                  {t("forgotPassword")}
                </Text>
              </TouchableOpacity>

              {error ? (
                <Text style={{ color: "red", margin: 10 }}>{error}</Text>
              ) : null}
            </View>
            <View
              style={{
                flexDirection: "column",
                flexGrow: 1,
                marginHorizontal: 60,
              }}
            >
              <Button
                mode="contained"
                style={styles.button}
                onPress={_onLoginPressed}
              >
                {t("loginScreen.login")}
              </Button>
            </View>
            <View
              style={{
                flexDirection: "column",
                flexGrow: 1,
                alignItems: "center",
                justifyContent: "center",
                marginVertical: 50,
              }}
            >
              <Text>{t("loginScreen.version")} 40</Text>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
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
  },
  button: {
    backgroundColor: "#196795",
    borderRadius: 10,
    marginTop: 20,
  },
});

export default memo(LoginScreen);
