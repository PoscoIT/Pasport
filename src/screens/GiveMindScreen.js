import {
  View,
  Text,
  ScrollView,
  Dimensions,
  LogBox,
  StyleSheet,
  Alert,
  KeyboardAvoidingView
} from "react-native";


import { database } from "../database/firebaseDB";
import Toast from "../components/Toast";
import {
  InsertNewRecordToFirebaseCredit,
  sendUserInfoName,
  updateUserCredit,
  sendMailForGonulden,
  sendMailForGonuldenLocalMail,
} from "../api/auth-api";
import {
  Button as PaperButton,
  TextInput as PaperTextInput,
} from "react-native-paper";

import PickerModal from "react-native-picker-modal-view";
import {memo,useState,useEffect} from 'react'
import { t } from "i18next";


let height = Dimensions.get("window").height; //full width
let width = Dimensions.get("window").width; //full width

export const dataCore = [
  {
    value: "Etik (Ethics)",
    Name: "Etik (Ethics)",
  },
  {
    value: "İş Güvenliği (Safety)",
    Name: "İş Güvenliği (Safety)",
  },
  {
    value: "Sağlam Temel (Fundamental)",
    Name: "Sağlam Temel (Fundamental)",
  },
  {
    value: "Kazan-Kazan (Win-Win)",
    Name: "Kazan-Kazan (Win-Win)",
  },
  {
    value: "Yaratıcılık (Creativity)",
    Name: "Yaratıcılık (Creativity)",
  },
  {
    value: "Yardımlaşma (Cooperation)",
    Name: "Yardımlaşma (Cooperation)",
  },
  {
    value: "Öğrenme (Learning)",
    Name: "Öğrenme (Learning)",
  },
  {
    value: "Müşteri Odaklılık (Customer Focus)",
    Name: "Müşteri Odaklılık (Customer Focus)",
  },
];

const GiveMindScreen = ({ navigation }) => {
  // Değiştirildi: db ve auth tanımlamaları kaldırıldı
  // const db = getDatabase(firebaseDB);
  // const auth = getAuth();

  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ value: "", type: "" });
  const [setError] = useState("");
  const [creditPoint, setcreditPoint] = useState();
  const [liste, setListe] = useState([]);
  const [response, setResponse] = useState();
  const [deger, setDeger] = useState();
  const [adSoyad, setAdSoyad] = useState();
  const [sicilNo, setsicilNo] = useState();
  const [commente, setCommente] = useState({ value: "" });
  const [lineInfo, setlineInfo] = useState({ value: "" });
  const [mailInfo, setMailInfo] = useState({ value: "" });
  const [selectedItem, setSelectedItem] = useState();
  const [selectedItem2, setSelectedItem2] = useState();

  const insertRec = async () => {
    if (loading) {
      return;
    }

    setLoading(true);
    if (
      creditPoint === undefined ||
      deger === undefined ||
      deger.value === "" ||
      adSoyad === undefined ||
      commente === undefined ||
      commente.value === ""
    ) {
      alert("Tüm alanların doldurulması  gerekiyor");
    } else {
      const response = await InsertNewRecordToFirebaseCredit({
        creditPoint: creditPoint,
        deger: deger.value,
        adSoyad: adSoyad.value,
        commente: commente.value,
        sicilNo: sicilNo.value,
        lineValue: lineInfo.value,
        mailInfo: mailInfo.value,
      }).then(() => {
        return { response };
      });

      sendMailForGonulden(
        mailInfo.value,
        "<b>İlgili Değer:</b> " +
          deger.value +
          "<br/><b>Açıklama:</b> " +
          commente.value +
          "<br/><b>Gönderen:</b> "
      )
        .then((res) => {
          Alert.alert(
            "Bilgi",
            "Kayıt Başarılı!",
            [
              {
                text: "OK",
              },
            ],
            { cancelable: false }
          );
        })
        .catch((err) => console.warn(err));
      sendMailForGonuldenLocalMail(
        mailInfo.value,
        "<b>İlgili Değer:</b> " +
          deger.value +
          "<br/><b>Açıklama:</b> " +
          commente.value +
          "<br/><b>Gönderen:</b> "
      )
        .then((res) => {
          Alert.alert(
            "Bilgi",
            "Kayıt Başarılı!",
            [
              {
                text: "OK",
              },
            ],
            { cancelable: false }
          );
        })
        .catch((err) => console.warn(err));
      if (response.error) {
        setError(response.error);
      } else {
        await updateUserCredit((responsed) => {});
        await navigation.navigate("DashboardGonulden");
      }
    }
    setLoading(false);
  };

  const getTelNos = async () => {
    await sendUserInfoName(async (sendResponse) => {
      if (sendResponse?.error) {
        setError(sendResponse.error);
      } else {
        if (sendResponse?.credit !== undefined) {
          if (sendResponse?.credit <= 0) {
            alert(
              "Bu ayki teşekkür krediniz bitmiştir.(Your credit over for this month!)"
            );
            await navigation.navigate("DashboardGonulden");
          } else {
            setcreditPoint(sendResponse?.credit);
          }
        }
      }
    }).then(async () => {
      await sendUserInfoName((sendResponse) => {
        database.ref("0/").on("value", (snapshot) => {
          let li = [];
          snapshot.forEach((child) => {
            if (sendResponse.line !== child.val().Line) {
              li.push({
                Name: child.val().AdSoyad,
                value: child.val().SicilNo,
                lineValue: child.val().Line,
                MailAdd: child.val().MailAdd,
              });
            }
          });
          setListe(li);
        });
      });
    });

    setLoading(false);
    return loading;
  };

  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
    /* let isMounted = true;

         const ac = new AbortController();
         Promise.all([
           getTelNos().then(() => {
             if (isMounted) {
               setLoading(false);
             }
           }),
         ]);
         return () => {
           isMounted = false;
           ac.abort();
         };*/

    getTelNos();
    // Değiştirildi: [auth] dependency kaldırıldı, [] ile mount'ta çalıştırıldı
  }, []);

  return (
  <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={styles.screen}
  >
    <ScrollView
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerAccent} />

          <Text style={styles.title}>
            {t("loginScreen.message1")}
          </Text>

          <Text style={styles.subtitle}>
            {t("loginScreen.message2")}
          </Text>
        </View>

        <View style={styles.creditPanel}>
          <View style={styles.creditInfo}>
            <Text style={styles.creditTitle}>
              Kalan Teşekkür Miktarı
            </Text>
            <Text style={styles.creditSubtitle}>Remaining Thanks</Text>
          </View>

          <Text style={styles.creditValue}>{creditPoint ?? 0}</Text>
        </View>

        <View style={styles.formCard}>
          <View style={styles.field}>
            <Text style={styles.label}>Ad Soyad / Name Surname</Text>

            <View style={styles.pickerContainer}>
              <PickerModal
                onSelected={(item) => {
                  setAdSoyad({ value: item.Name });
                  setsicilNo({ value: item.value });
                  setlineInfo({ value: item.lineValue });
                  setMailInfo({ value: item.MailAdd });
                  setSelectedItem(item);
                }}
                Autocomplete={false}
                items={liste}
                sortingLanguage="tr"
                showToTopButton
                selected={selectedItem}
                showAlphabeticalIndex
                autoGenerateAlphabeticalIndex
                selectPlaceholderText="Ad Soyad (Name Surname)"
                searchPlaceholderText="Search..."
                requireSelection={false}
                autoSort
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>
              İlgili Değer / Related Core Value
            </Text>

            <View style={styles.pickerContainer}>
              <PickerModal
                onSelected={(item) => {
                  setDeger({ value: item.value });
                  setSelectedItem2(item);
                }}
                Autocomplete={false}
                items={dataCore}
                sortingLanguage="tr"
                showToTopButton
                selected={selectedItem2}
                selectPlaceholderText="İlgili Değer (Related Core Value)"
                searchPlaceholderText="Search..."
                requireSelection={false}
                autoSort
              />
            </View>
          </View>

          <View>
            <Text style={styles.label}>Açıklama / Explanation</Text>

            <PaperTextInput
              mode="outlined"
              placeholder="Açıklama (Explanation)"
              placeholderTextColor="#94A3B8"
              style={styles.textInput}
              outlineStyle={styles.inputOutline}
              outlineColor="#DCE5F3"
              activeOutlineColor="#0B337C"
              textColor="#334155"
              value={commente.value ?? ""}
              onChangeText={(text) => setCommente({ value: text })}
              multiline
              maxLength={160}
              editable={!loading}
              accessibilityLabel="Açıklama / Explanation"
            />

            <Text style={styles.characterCount}>
              {(commente.value ?? "").length}/160
            </Text>
          </View>

          <PaperButton
            mode="contained"
            buttonColor="#0B337C"
            textColor="#FFFFFF"
            style={styles.submitButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            loading={loading}
            disabled={loading}
            onPress={insertRec}
          >
            Teşekkür Gönder / Send
          </PaperButton>
        </View>

        <View style={styles.valuesPanel}>
          {[
            ["safety", "safetyMessage"],
            ["ethics", "ethicsMessage"],
            ["fundamental", "fundamentalMessage"],
            ["winWin", "winWinMessage"],
            ["creativity", "creativityMessage"],
          ].map(([titleKey, messageKey], index) => (
            <View
              key={titleKey}
              style={[
                styles.valueRow,
                index === 4 && styles.lastValueRow,
              ]}
            >
              <View style={styles.valueMarker} />

              <View style={styles.valueContent}>
                <Text style={styles.valueTitle}>
                  {t(`gonuldenScreen.${titleKey}`)}
                </Text>

                <Text style={styles.valueDescription}>
                  {t(`gonuldenScreen.${messageKey}`)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>

    <Toast
      type={toast.type}
      message={toast.value}
      onDismiss={() => setToast({ value: "", type: "" })}
    />
  </KeyboardAvoidingView>
);
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F3F6FC",
  },

  scrollContent: {
    flexGrow: 1,
    paddingTop: 24,
    paddingBottom: 40,
  },

  content: {
    width: "100%",
    maxWidth: 640,
    alignSelf: "center",
    paddingHorizontal: 16,
  },

  header: {
    paddingHorizontal: 4,
    marginBottom: 22,
  },

  headerAccent: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#0B337C",
    marginBottom: 16,
  },

  title: {
    color: "#172B4D",
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 33,
    marginBottom: 8,
  },

  subtitle: {
    color: "#64748B",
    fontSize: 14,
    lineHeight: 23,
  },

  creditPanel: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EAF0FA",
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 18,
    marginBottom: 18,
  },

  creditInfo: {
    flex: 1,
    paddingRight: 16,
  },

  creditTitle: {
    color: "#0B337C",
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 22,
  },

  creditSubtitle: {
    color: "#64748B",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 3,
  },

  creditValue: {
    flexShrink: 1,
    color: "#0B337C",
    fontSize: 32,
    fontWeight: "800",
    textAlign: "right",
    fontVariant: ["tabular-nums"],
  },

  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E3EAF4",
    padding: 18,
    marginBottom: 24,
  },

  field: {
    marginBottom: 20,
  },

  label: {
    color: "#334155",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 21,
    marginBottom: 8,
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

  textInput: {
    minHeight: 140,
    backgroundColor: "#F8FAFD",
    fontSize: 14,
    textAlignVertical: "top",
  },

  inputOutline: {
    borderRadius: 10,
  },

  characterCount: {
    color: "#8492A8",
    fontSize: 12,
    textAlign: "right",
    marginTop: 7,
  },

  submitButton: {
    borderRadius: 12,
    marginTop: 20,
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

  valuesPanel: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E3EAF4",
    paddingHorizontal: 18,
  },

  valueRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF1F7",
  },

  lastValueRow: {
    borderBottomWidth: 0,
  },

  valueMarker: {
    width: 5,
    height: 20,
    borderRadius: 3,
    backgroundColor: "#0B337C",
    marginTop: 2,
    marginRight: 12,
  },

  valueContent: {
    flex: 1,
  },

  valueTitle: {
    color: "#172B4D",
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 23,
    marginBottom: 6,
  },

  valueDescription: {
    color: "#64748B",
    fontSize: 13,
    lineHeight: 22,
  },
});

export default memo(GiveMindScreen);
