import React, { memo, useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  Text,
  Image
} from "react-native";
import Toast from "../../components/Toast";
import Background_Green from "../../components/Background";
import NetInfo from "@react-native-community/netinfo";
import { Button, Card, Portal, Dialog, Provider } from "react-native-paper";
import { useAuth } from "../../hooks/useAuth";
import i18n from "../../languages/i18n";
import { t } from "i18next";
import { auth, database } from "../../database/firebaseDB";
import moment from "moment";
import { REACT_APP_SECRET_KEY } from "@env";
import {
  getListeStatus,
  sendUserInfoName,
  getTotalPoint2,
} from "../../api/auth-api";
import axios from "axios";
import { onAuthStateChanged } from "@react-native-firebase/auth";
import { ref, update } from "@react-native-firebase/database";

const { width, height } = Dimensions.get("window");

const SafetyMainScreen = ({ route: { params }, navigation }) => {
  const authInstance = auth;
  const checkedControl = params?.checkedControl;
  const [checkedFatih, setCheckedFatih] = useState(checkedControl || false);

  const { isOpen, setIsOpen, dialogContent } = useAuth();
  const [toast, setToast] = useState({ value: "", type: "" });
  const [checked, setChecked] = useState(true);
  const [liste, setListe] = useState([]);
  const [seqId, setSeqId] = useState(500);
  const [data, setData] = useState([]);
  const [isTotalPoint, setTotalPoint] = useState(0);
  const [isTotalPoint2, setTotalPoint2] = useState(0);
  const [email, setEmail] = useState("");

  const isEmailPoscoAssan = email.includes("@poscoassan.com");
  const url = "https://tstapp.poscoassan.com.tr:8443";

  const hideDialog = () => setIsOpen(false);

  const convertTimestamp = (timestamp) => {
    const { seconds, nanoseconds } = timestamp;
    const milliseconds = seconds * 1000 + nanoseconds / 1e6;
    return moment(milliseconds).toDate();
  };

  let today = new Date();
  let todayFull = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let hours = String(today.getHours()).padStart(2, "0");
  let min = String(today.getMinutes()).padStart(2, "0");
  let sec = String(today.getSeconds()).padStart(2, "0");
  let yyyy = today.getFullYear();
  today = `${mm}-${dd}-${yyyy}`;
  todayFull = `${hours}:${min}:${sec}  ${dd}-${mm}-${yyyy}`;

  // Dil verilerini çek
  const getLanguageData = async () => {
    try {
      const res = await axios.get(`${url}/Common/ListISGControlsData`, {
        headers: {
          "Content-type": "application/json",
          "auth-token": REACT_APP_SECRET_KEY,
        },
      });

      const mappedData = res.data.map((item) => ({
        value: item.ID,
        Name: i18n.language === "tr" ? item.NameTR : item.Name,
        Type: item.Type,
      }));

      setData(mappedData);
    } catch (err) {}
  };

  const getData = async () => {
    const user = authInstance.currentUser; // Bu kullanım modüler API'de doğru
    let uid, uemail;
    if (user) {
      uid = user.uid;
      uemail = user.email;
    }

    await sendUserInfoName(async (sendResponse) => {
      const refPath = `SafetyDB/${yyyy}_${mm}_${dd}/${sendResponse.empSicil}/General/`;

      try {
        const dbRef = ref(database, refPath);
        await update(dbRef, {
          relatedDate: today,
          insertedDateTime: todayFull,
          fromMail: uemail,
          fromUid: uid,
          searchCondit: uemail + today,
          fromUname: sendResponse.uname,
          fromSicilNo: sendResponse.empSicil,
          fromLine: sendResponse.line,
          page: "SafetyDashBoard",
        });
      } catch (error) {
        console.error("Veritabanı güncelleme hatası:", error);
      }
    });
  };

  const languageData = useMemo(
    () => data.filter((item) => item.Type === 4),
    [data],
  );

  useEffect(() => {
    getLanguageData();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authInstance, async (user) => {
      if (user) {
        await getListeStatus((res) => {
          setChecked(res.checked);
          setEmail(user.email);
          setSeqId(res.isseqId);
          setTotalPoint(res.isTotalPoint);
          setListe(res.liste);
        });

        await getTotalPoint2((res) => {
          setTotalPoint2(res.isTotalPoint);
        });
      }
    });

    // Component kaldırıldığında (unmount) dinleyiciyi temizle
    return () => unsubscribe();
  }, [authInstance]);

  useEffect(() => {
    getData();
  }, [checked]);

  return (
  <Provider>
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View style={styles.headerAccent} />

          <Text style={styles.title}>
            {t("safetyMainScreen.message1")}
          </Text>

          <Text style={styles.subtitle}>
            {t("safetyMainScreen.message2")}
          </Text>
        </View>

        <View style={styles.content}>
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {liste.length > 0 && seqId >= 0 ? seqId + 1 : "—"}
                <Text style={styles.statTotal}> / {liste.length}</Text>
              </Text>

              <Text style={styles.statLabel}>
                {t("safetyMainScreen.ranking")}
              </Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {isTotalPoint ?? 0}
              </Text>

              <Text style={styles.statLabel}>
                {t("safetyMainScreen.monthlyPoint")}
              </Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {isTotalPoint2 ?? 0}
              </Text>

              <Text style={styles.statLabel}>
                {t("safetyMainScreen.totalPoint")}
              </Text>
            </View>
          </View>

          <View style={styles.actionsCard}>
            <Button
              mode="contained"
              buttonColor={
                checked || checkedFatih ? "#E8F5ED" : "#0B337C"
              }
              textColor={
                checked || checkedFatih ? "#237247" : "#FFFFFF"
              }
              accessibilityState={{
                disabled: !!(checked || checkedFatih),
              }}
              style={styles.primaryButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              onPress={() => {
                if (!checked && !checkedFatih) {
                  navigation.replace("SafetyDetailScreen");
                }
              }}
            >
              {checked || checkedFatih
                ? t("safetyMainScreen.completed")
                : t("safetyMainScreen.answerQuestion")}
            </Button>

            <View style={styles.actionDivider} />

            <Button
              mode="outlined"
              textColor="#0B337C"
              style={styles.secondaryButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              onPress={() => navigation.navigate("SafetyRules")}
            >
              {t("safetyMainScreen.safetyRules")}
            </Button>

            <Button
              mode="outlined"
              textColor="#0B337C"
              style={[styles.secondaryButton, styles.lastButton]}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              onPress={() => navigation.navigate("SafetyControl")}
            >
              {languageData?.[43]?.Name ||
                t("safetyMainScreen.safetyInspection")}
            </Button>
          </View>

          <View style={styles.imageCard}>
            <Image
              source={require("../../assets/safety1st.png")}
              resizeMode="contain"
              style={styles.safetyImage}
              accessible={false}
            />
          </View>
        </View>
      </ScrollView>

      <Toast
        type={toast.type}
        message={toast.value}
        onDismiss={() => setToast({ value: "", type: "" })}
      />

      <Portal>
        {isOpen && (
          <Dialog
            style={[styles.dialog, dialogContent?.DialogStyle]}
            visible={isOpen}
            onDismiss={hideDialog}
          >
            <Dialog.Content>
              <Text
                style={[styles.dialogText, dialogContent?.TextStyle]}
              >
                {dialogContent?.Text}
              </Text>
            </Dialog.Content>

            <Dialog.Actions>
              <Button
                style={dialogContent?.ButtonStyle}
                textColor={dialogContent?.ButtonColor || "#0B337C"}
                onPress={hideDialog}
              >
                {t("general.close")}
              </Button>
            </Dialog.Actions>
          </Dialog>
        )}
      </Portal>
    </View>
  </Provider>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F6FC",
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 28,
  },

  header: {
    backgroundColor: "#0B337C",
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 54,
  },

  headerAccent: {
    width: 34,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#93C5FD",
    marginBottom: 18,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "700",
    lineHeight: 34,
    marginBottom: 10,
  },

  subtitle: {
    color: "#D4E2F8",
    fontSize: 14,
    lineHeight: 23,
  },

  content: {
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
    paddingHorizontal: 16,
    marginTop: -26,
  },

  statsCard: {
    flexDirection: "row",
    alignItems: "stretch",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 22,
    paddingHorizontal: 8,
    marginBottom: 18,
    shadowColor: "#0B337C",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },

  statItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },

  statValue: {
    color: "#0B337C",
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 7,
  },

  statTotal: {
    color: "#8492A8",
    fontSize: 12,
    fontWeight: "500",
  },

  statLabel: {
    color: "#64748B",
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center",
    fontWeight: "500",
  },

  statDivider: {
    width: 1,
    backgroundColor: "#E8EDF5",
    marginVertical: 4,
  },

  actionsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E8EDF5",
    padding: 18,
    marginBottom: 18,
  },

  primaryButton: {
    borderRadius: 12,
  },

  buttonContent: {
    minHeight: 54,
    paddingVertical: 5,
  },

  buttonLabel: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0,
    marginHorizontal: 10,
  },

  actionDivider: {
    height: 1,
    backgroundColor: "#EDF1F7",
    marginVertical: 18,
  },

  secondaryButton: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DCE5F3",
    backgroundColor: "#F8FAFE",
    marginBottom: 12,
  },

  lastButton: {
    marginBottom: 0,
  },

  imageCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E8EDF5",
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  safetyImage: {
    width: "100%",
    height: 180,
  },

  dialog: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
  },

  dialogText: {
    color: "#334155",
    fontSize: 15,
    lineHeight: 24,
  },
});

export default memo(SafetyMainScreen);
