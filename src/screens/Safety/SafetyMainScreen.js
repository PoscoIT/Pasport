import React, { memo, useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  Dimensions,
  Text,
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
    } catch (err) {
      console.log(err);
    }
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
    [data]
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
    <Background_Green>
      <Provider>
        <View style={styles.container}>
          <Card style={[styles.cardStyle, { backgroundColor: "white" }]}>
            <Card.Content>
              <Text variant="titleLarge" style={{ color: "#000" }}>
                {" "}
                {t("safetyMainScreen.message1")}
              </Text>
              <Text variant="bodyMedium" style={{ color: "#000" }}>
                {" "}
                {t("safetyMainScreen.message2")}
              </Text>
              <Text variant="bodyMedium" style={{ color: "#000" }}>
                {" "}
                {t("safetyMainScreen.ranking")}: {seqId + 1} / {liste.length} |{" "}
                {t("safetyMainScreen.monthlyPoint")}: {isTotalPoint}
              </Text>
              <Text variant="bodyMedium" style={{ color: "#000" }}>
                {" "}
                {t("safetyMainScreen.totalPoint")}: {isTotalPoint2}
              </Text>
            </Card.Content>
          </Card>

          <View>
            <View
              style={{
                flexDirection: "row",
                marginBottom: 10,
                marginHorizontal: 5,
                flexWrap: "wrap",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <Button
                textColor="#fff"
                style={styles.buttonRight}
                mode="outlined"
                onPress={() =>
                  checked || checkedFatih
                    ? null
                    : navigation.navigate("SafetyDetailScreen")
                }
              >
                {checked || checkedFatih
                  ? t("safetyMainScreen.completed")
                  : t("safetyMainScreen.answerQuestion")}
              </Button>

              <Button
                textColor="#fff"
                mode="outlined"
                style={styles.buttonRight}
                onPress={() => navigation.navigate("SafetyRules")}
              >
                {t("safetyMainScreen.safetyRules")}
              </Button>

              {isEmailPoscoAssan && (
                <Button
                  textColor="#fff"
                  style={styles.buttonRight}
                  mode="outlined"
                  onPress={() => navigation.navigate("SafetyControl")}
                >
                  {languageData
                    ? languageData[43]?.Name
                    : t("safetyMainScreen.safetyInspection")}
                </Button>
              )}
            </View>

            <ImageBackground
              resizeMode="contain"
              source={require("../../assets/safety1st.png")}
              style={styles.backgroundImage}
            />

            <Toast
              type={toast.type}
              message={toast.value}
              onDismiss={() => setToast({ value: "", type: "" })}
            />
          </View>

          <Portal>
            {isOpen && (
              <Dialog
                style={dialogContent?.DialogStyle}
                visible={isOpen}
                onDismiss={hideDialog}
              >
                <Dialog.Content>
                  <Text style={dialogContent?.TextStyle}>
                    {dialogContent?.Text}
                  </Text>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button
                    style={dialogContent?.ButtonStyle}
                    color={dialogContent?.ButtonColor}
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
    </Background_Green>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  backgroundImage: {
    flex: 1,
    height: 300,
    width: undefined,
  },
  buttonRight: {
    textAlign: "center",
    justifyContent: "center",
    backgroundColor: "#5435e8",
    borderRadius: 10,
    fontSize: 3,
    height: 55,
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
  },
  cardStyle: {
    backgroundColor: "red",
    marginTop: 10,
    width: width - 30,
  },
});

export default memo(SafetyMainScreen);
