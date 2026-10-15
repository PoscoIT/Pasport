import {
  View,
  Text,
  TextInput as NativeTextInput,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  StyleSheet,
  Dimensions
} from "react-native";

import { Button as PaperButton } from "react-native-paper";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { sendUserInfoName } from "../api/auth-api";
import NetInfo from "@react-native-community/netinfo";
import { useTranslation } from "react-i18next";
import TextInput from "../components/TextInput";
import { REACT_APP_SECRET_KEY } from "@env";
import PickerModal from "react-native-picker-modal-view";
import i18n from "../languages/i18n";

let width = Dimensions.get("window").width; //full width
const ITAuth = () => {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const url = "https://tstapp.poscoassan.com.tr:8443";
  const [area, setArea] = useState([]);
  const [reasonList, setReasonList] = useState([]);
  const [category, setCategory] = useState([]);
  const [reason, setReason] = useState([]);
  const [duration, setDuration] = useState(category?.Duration?.toString());
  const [areaList, setAreaList] = useState([
    {
      Name: "Production Area",
      Value: "Production Area",
      Id: 1,
    },
    {
      Name: "Office Area",
      Value: "Office Area",
      Id: 2,
    },
  ]);

  const getHttps = async () => {
    await axios
      .get(`${url}/ITRequests/ITAuthCategory`, {
        headers: {
          "Content-type": "application/json",
          "auth-token": REACT_APP_SECRET_KEY,
        },
      })
      .then(async (res) => {
        setCategoryList(
          res.data?.map(
            (item) =>
              [
                {
                  Value: item.ID,
                  Name:
                    i18n.language === "tr" ? item.Req_Type_Tr : item.Req_Type,
                  Area_Name: item.Area_Name,
                  Duration: item.Req_Type_Duration,
                },
              ][0]
          )
        );
      })
      .catch((err) => console.warn(err));
  };
  const getHttps2 = async () => {
    await axios
      .get(`${url}/ITRequests/ITAuthReason`, {
        headers: {
          "Content-type": "application/json",
          "auth-token": REACT_APP_SECRET_KEY,
        },
      })
      .then(async (res) => {
        setReasonList(
          res.data?.map(
            (item) =>
              [
                {
                  Value: item.ID,
                  Name: i18n.language === "tr" ? item.Reason_Tr : item.Reason,
                },
              ][0]
          )
        );
      })
      .catch((err) => console.warn(err));
  };

  const categoryUniqueList = useMemo(() => {
    let item = 0;

    const arrayUniqueByKey = categoryList
      ?.filter((item) => item.Area_Name === area.Name)
      ?.map(
        (item) =>
          [
            {
              Value: item.Value,
              Name: item.Name,
              Duration: item.Duration,
            },
          ][0]
      );

    if (typeof arrayUniqueByKey !== "undefined") {
      return arrayUniqueByKey;
    } else {
      return [];
    }
  }, [area, categoryList]);

  const onSubmit = async () => {
    await sendUserInfoName(async (sendResponse) => {
      if (text && reason.Value && category.Value && area.Value && duration) {
        if (duration > category?.Duration) {
          Alert.alert(
            "Hata",
            `${t("itAuth.durationErrorMessage")}: ${category?.Duration}`
          );
        } else {
          const { uname, empSicil } = sendResponse;
          const details = {
            EmployeeName: uname,
            EmployeeID: empSicil,
            Description: text,
            Reason: reason.Value,
            Category: category.Value,
            Area: area.Value,
            Request_Day: duration,
          };

          const formBody = Object.keys(details)
            .map(
              (key) =>
                encodeURIComponent(key) + "=" + encodeURIComponent(details[key])
            )
            .join("&");

          setLoading(true);
          try {
            await axios
              .post(url + "/ITRequests/ITAuthCreate", formBody, {
                headers: {
                  "auth-token": REACT_APP_SECRET_KEY,
                },
              })
              .then((res) => {
                if (res.data.status === "Success") {
                  Alert.alert(
                    t("safetyControlScreen.info"),
                    t("safetyControlScreen.savedSuccesffuly")
                  );
                  setText("");
                } else {
                  Alert.alert("Hata", res.data.message);
                }
              })
              .catch((err) => {
                Alert.alert(
                  t("safetyControlScreen.info"),
                  t("safetyControlScreen.errorMessage")
                );
              })
              .finally(() => {
                setLoading(false);
              });
          } catch (e) {
            Alert.alert(
              t("safetyControlScreen.info"),
              t("safetyControlScreen.errorMessage")
            );
          }
        }
      } else {
        Alert.alert(
          t("safetyControlScreen.error"),
          t("safetyControlScreen.pleaseFillAll")
        );
      }
    }).catch((err) => console.log(err));
  };
  const theme = {
    colors: {
      placeholder: "black",
      text: "black",
      primary: "#4a8a94",
      underlineColor: "transparent",
      background: "white",
    },
  };

  useEffect(() => {
    getHttps();
  }, []);
  useEffect(() => {
    getHttps2();
  }, []);

 return (
  <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={styles.container}
  >
    <ScrollView
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.formContainer}>
        <View style={styles.header}>
          <View style={styles.headerAccent} />

          <Text style={styles.title}>
            {t("itAuth.createRequest")}
          </Text>
        </View>

        <View style={styles.formCard}>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>
              {t("itAuth.area")}
              <Text style={styles.required}> *</Text>
            </Text>

            <View style={styles.pickerContainer}>
              <PickerModal
                style={styles.picker}
                Autocomplete={false}
                items={areaList}
                sortingLanguage="tr"
                showToTopButton
                showAlphabeticalIndex
                autoGenerateAlphabeticalIndex
                searchPlaceholderText={t("itAuth.area")}
                requireSelection={false}
                autoSort
                onSelected={(item) => {
                  Keyboard.dismiss();
                  setArea(item);
                }}
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>
              {t("itAuth.category")}
              <Text style={styles.required}> *</Text>
            </Text>

            {categoryUniqueList ? (
              <View style={styles.pickerContainer}>
                <PickerModal
                  style={styles.picker}
                  Autocomplete={false}
                  items={categoryUniqueList}
                  sortingLanguage="tr"
                  showToTopButton
                  searchPlaceholderText={t("itAuth.category")}
                  requireSelection={false}
                  onSelected={(item) => {
                    Keyboard.dismiss();
                    setCategory(item);
                  }}
                />
              </View>
            ) : null}
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>
              {t("itAuth.reason")}
              <Text style={styles.required}> *</Text>
            </Text>

            {reasonList ? (
              <View style={styles.pickerContainer}>
                <PickerModal
                  style={styles.picker}
                  Autocomplete={false}
                  items={reasonList}
                  sortingLanguage="tr"
                  showToTopButton
                  searchPlaceholderText={t("itAuth.reason")}
                  requireSelection={false}
                  onSelected={(item) => {
                    Keyboard.dismiss();
                    setReason(item);
                  }}
                />
              </View>
            ) : null}
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>
              {t("itAuth.duration")}
              <Text style={styles.required}> *</Text>
            </Text>

            <NativeTextInput
              value={String(duration ?? "")}
              onChangeText={setDuration}
              style={styles.input}
              placeholder={t("itAuth.duration")}
              placeholderTextColor="#94A3B8"
              accessibilityLabel={t("itAuth.duration")}
            />
          </View>

          <View style={styles.divider} />

          <View>
            <Text style={styles.fieldLabel}>
              {t("itAuth.description", {
                defaultValue: "Açıklama",
              })}
            </Text>

            <NativeTextInput
              multiline
              numberOfLines={5}
              style={[styles.input, styles.textArea]}
              value={text}
              onChangeText={setText}
              placeholder={t("itAuth.descriptionPlaceholder", {
                defaultValue: "Talebinizle ilgili ayrıntıları yazın.",
              })}
              placeholderTextColor="#94A3B8"
              accessibilityLabel={t("itAuth.description", {
                defaultValue: "Açıklama",
              })}
              autoCapitalize="sentences"
            />
          </View>
        </View>

        <PaperButton
          mode="contained"
          buttonColor="#0B337C"
          textColor="#FFFFFF"
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
          onPress={onSubmit}
        >
          {t("itAuth.createRequest")}
        </PaperButton>
      </View>
    </ScrollView>
  </KeyboardAvoidingView>
);
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F6FC",
  },

  scrollContent: {
    flexGrow: 1,
    paddingTop: 26,
    paddingBottom: 36,
  },

  formContainer: {
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
    paddingHorizontal: 20,
  },

  header: {
    paddingHorizontal: 2,
    marginBottom: 24,
  },

  headerAccent: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#0B337C",
    marginBottom: 18,
  },

  title: {
    color: "#172B4D",
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 33,
  },

  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E3EAF4",
    padding: 18,
    marginBottom: 22,
  },

  field: {
    marginBottom: 20,
  },

  fieldLabel: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 21,
    marginBottom: 9,
  },

  required: {
    color: "#DC2626",
  },

  pickerContainer: {
    minHeight: 52,
    justifyContent: "center",
    backgroundColor: "#F8FAFD",
    borderWidth: 1,
    borderColor: "#DCE5F3",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  picker: {
    width: "100%",
    color: "#334155",
  },

  input: {
    minHeight: 52,
    backgroundColor: "#F8FAFD",
    borderWidth: 1,
    borderColor: "#DCE5F3",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#334155",
    fontSize: 15,
  },

  divider: {
    height: 1,
    backgroundColor: "#EDF1F7",
    marginBottom: 20,
  },

  textArea: {
    minHeight: 140,
    textAlignVertical: "top",
    lineHeight: 23,
  },

  button: {
    borderRadius: 12,
  },

  buttonContent: {
    minHeight: 54,
    paddingVertical: 5,
  },

  buttonLabel: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0,
  },
});
export default ITAuth;
