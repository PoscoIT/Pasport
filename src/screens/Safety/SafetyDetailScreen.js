/* eslint-disable prettier/prettier */
/* eslint-disable eqeqeq */
import React, { memo, useEffect, useState } from "react";
import { StyleSheet, View, Alert, ScrollView, Text } from "react-native";
import { auth, database } from "../../database/firebaseDB";
// react-native-firebase database modülü eklendi

import Toast from "../../components/Toast";
import Background_Green from "../../components/Background_Green";
import { Dimensions, ActivityIndicator } from "react-native";
import {
  sendUserInfoName,
  InsertNewRecordSafetyFirstApplication,
  InsertNewRecordSafetyFirstApplication2,
} from "../../api/auth-api";
import { Button, Card } from "react-native-paper";
import { Radio, RadioGroup } from "@ui-kitten/components";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";

import { t } from "i18next";
import { signOut } from "@react-native-firebase/auth";

var width = Dimensions.get("window").width; //full width
var height = Dimensions.get("window").height; //full width

export const logoutUser = (companyCode) => {
  if (companyCode === "TST") {
    signOut(auth);
  }
};

const SafetyDetailScreen = ({ navigation }) => {
  const [text, setText] = React.useState("");
  const hasUnsavedChanges = Boolean(text);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [liste, setListe] = useState([]);
  const [listeMulti, setListeMulti] = useState([]);
  const Separator = () => <View style={styles.separator} />;
  const [toast, setToast] = useState({ value: "", type: "" });
  const [rand, setRand] = useState([]);
  const [rand2, setRand2] = useState([]);
  const [rand3, setRand3] = useState([]);
  const [isPlaying, setIsPlaying] = useState(true);

  let totalPoint = 0;
  const [type2Answer, settype2Answer] = useState();
  const [quest1Answer, setquest1Answer] = useState();
  const [lineInfo, setLineInfo] = useState("");
  const [quest2Answer, setquest2Answer] = useState();
  const [dbName, setDbName] = useState("");
  const [liTotal, setLiTotal] = useState([]);
  const [liMulti, setliMulti] = useState([]);
  const [deneme, setDeneme] = useState([
    { id: 1, deneme: "faith" },
    { id: 2, deneme: "faith" },
  ]);

  const [disabled, setDisabled] = useState(false);

  const getRenderName = (line) => {
    if (line !== "TNPC") {
      setDbName("safety");
    } else {
      setDbName("safetyTnpc");
    }
  };

  const getQuestions = async () => {
    sendUserInfoName(async (sendResponse) => {
      let li = [];
      let liMulti = [];
      setLineInfo(sendResponse.line);
      const response = InsertNewRecordSafetyFirstApplication2().then(() => {
        return { response };
      });
      // 👇 await kullanarak snapshot'ı bekle
      const childes = await database.ref("safety").once("value");
      const data = childes.val();

      // Bazı durumlarda data object olabilir (Firebase böyle yapar)
      const arr = Array.isArray(data) ? data : Object.values(data);

      arr?.forEach((item) => {
        if (item?.Type === 1 && item?.Active === 1) {
          li.push({
            answer: item.Answer,
            question: item.Question,
            id: item.ID,
          });
        } else if (item?.Active === 1 && item?.Type === 2) {
          liMulti.push({
            answer: item.Answer,
            question: item.Question,
            ans1: item.Ans1,
            ans2: item.Ans2,
            ans3: item.Ans3,
            id: item.ID,
          });
        }
      });

      // Sıralama işlemi
      li.sort((a, b) => b.id - a.id || b.answer - a.answer);

      // Listeyi state'e ata
      setListe(li);
      setListeMulti(liMulti);

      // 🔥 liste değil, yeni veriyi kullanalım (state async güncellenir)
      const random = Math.floor(Math.random() * li.length);
      let random2 = Math.floor(Math.random() * li.length);
      const random3 = Math.floor(Math.random() * liMulti.length);

      if (random === random2) {
        random2 = Math.floor(Math.random() * li.length);
      }

      setRand(random);
      setRand2(random2);
      setRand3(random3);
    });

    //   snapshot.val().forEach((childes) => {
    //     console.log(childes.val(), "f2");
    //     if (1 == childes.Type && 1 == childes.Active) {
    //       li.push({
    //         answer: childes.Answer,
    //         question: childes.Question,
    //         id: childes.key,
    //       });
    //     } else if (1 == childes.Active && 2 == childes.Type) {
    //       liMulti.push({
    //         answer: childes.Answer,
    //         question: childes.Question,
    //         ans1: childes.Ans1,
    //         ans2: childes.Ans2,
    //         ans3: childes.Ans3,
    //         id: childes.key,
    //       });
    //     }
    //   });
    //   if (li.length > 0) {
    //     li.sort(function (a, b) {
    //       if (a.id > b.id) {
    //         return -1;
    //       } else if (a.id < b.id) {
    //         return 1;
    //       } else {
    //         if (a.answer > b.answer) {
    //           return -1;
    //         }
    //         if (a.answer < b.answer) {
    //           return 1;
    //         }
    //         return 0;
    //       }
    //     });
    //   }
    //   let random = Math.floor(Math.random() * li.length);
    //   let random2 = Math.floor(Math.random() * li.length);
    //   let random3 = Math.floor(Math.random() * liMulti.length);

    //   if (random == random2) {
    //     random2 = Math.floor(Math.random() * li.length);
    //   }
    //   setRand(random);
    //   setRand2(random2);
    //   setRand3(random3);
    //   setListe(li);
    //   setListeMulti(liMulti);
    //   // --- Değiştirilen Kısım Bitişi ---

    setLoading(false);
    return loading;
  };

  const insertRec2 = async () => {
    if (loading) {
      return;
    }
    setIsPlaying(false);
    setLoading(true);

    if (quest1Answer !== undefined) {
      if (
        (quest1Answer == 0 && liste[rand].answer == "True") ||
        (quest1Answer == 1 && liste[rand].answer == "False")
      ) {
        totalPoint++;
      }
    } else {
      setquest1Answer(3);
    }
    if (quest2Answer !== undefined) {
      if (
        (quest2Answer == 0 && liste[rand2].answer == "True") ||
        (quest2Answer == 1 && liste[rand2].answer == "False")
      ) {
        totalPoint++;
      }
    } else {
      setquest2Answer(3);
    }
    if (type2Answer !== undefined) {
      if (
        (type2Answer == 0 && listeMulti[rand3].answer == 1) ||
        (type2Answer == 1 && listeMulti[rand3].answer == 2) ||
        (type2Answer == 2 && listeMulti[rand3].answer == 3)
      ) {
        totalPoint++;
      }
    } else {
      settype2Answer(3);
    }

    const response = await InsertNewRecordSafetyFirstApplication({
      totalPoint: totalPoint,
      question1Id: liste[rand].id,
      question2Id: liste[rand2].id,
      question3Id: listeMulti[rand3].id,
      type2Answer: type2Answer,
      quest1Answer: quest1Answer,
      quest2Answer: quest2Answer,
    }).then(() => {
      return { response };
    });

    if (response.error) {
      // setError(response.error); // setError tanımlanmamış, yorum satırı yaptım
    } else {
      let message = t("safetyDetailsScreen.firstQuestion");
      message +=
        liste[rand].answer == "True"
          ? t("safetyDetailsScreen.true")
          : t("safetyDetailsScreen.false");
      message += `\n${t("safetyDetailsScreen.secondQuestion")}:`;
      message +=
        liste[rand2].answer == "True"
          ? t("safetyDetailsScreen.true")
          : t("safetyDetailsScreen.false");
      message += `\n${t("safetyDetailsScreen.thirdQuestion")}:`;
      message +=
        listeMulti[rand3].answer + "." + t("safetyDetailsScreen.choice");
      message +=
        `\n${t("safetyDetailsScreen.totalPoint")}:` + totalPoint + " / 3";

      setDisabled(true);

      Alert.alert(
        t("safetyDetailsScreen.info"),
        message,
        [
          {
            text: t("safetyDetailsScreen.ok"),
            onPress: () => {
              navigation.replace(t("safetyApplication"));
              setDisabled(false);
            },
          },
        ],
        { cancelable: false }
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    let isMounted = true;
    getQuestions().then(() => {
      if (isMounted) {
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  if (liste.length > 0 && listeMulti.length > 0)
    return (
      <Background_Green style={styles.background_Green}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Card style={styles.cardStyle}>
            <Card.Content>
              <Text variant="titleLarge">
                {t("safetyDetailsScreen.message1")},
              </Text>
              <Text variant="bodyMedium">
                {t("safetyDetailsScreen.message2")}
              </Text>
            </Card.Content>
          </Card>
          <Separator />
          {loading && <ActivityIndicator color={"#444"} />}
          {!loading && (
            <View style={[styles.container3, { marginLeft: 20, marginTop: 5 }]}>
              <Text variant="bodyMedium" style={styles.leftParag}>
                {liste[rand].question}
              </Text>
            </View>
          )}
          {loading && <ActivityIndicator color={"#444"} />}
          {!loading && (
            <View style={[styles.container3, { marginLeft: 20 }]}>
              <RadioGroup
                selectedIndex={quest1Answer}
                onChange={(index) => {
                  setquest1Answer(index);
                  setText("abc");
                }}
              >
                <Radio>{t("safetyDetailsScreen.true")}</Radio>
                <Radio>{t("safetyDetailsScreen.false")}</Radio>
              </RadioGroup>
            </View>
          )}
          <Separator />
          {loading && <ActivityIndicator color={"#444"} />}
          {!loading && (
            <View style={[styles.container3, { marginHorizontal: 20 }]}>
              <Text variant="bodyMedium" style={styles.leftParag}>
                {liste[rand2].question}
              </Text>
            </View>
          )}
          {loading && <ActivityIndicator color={"#444"} />}
          {!loading && (
            <View style={[styles.container3, { marginLeft: 20 }]}>
              <RadioGroup
                selectedIndex={quest2Answer}
                onChange={(index) => setquest2Answer(index)}
              >
                <Radio>{t("safetyDetailsScreen.true")}</Radio>
                <Radio>{t("safetyDetailsScreen.false")}</Radio>
              </RadioGroup>
            </View>
          )}
          <Separator />
          {loading && <ActivityIndicator color={"#444"} />}
          {!loading && (
            <View style={[styles.container3, { marginLeft: 20 }]}>
              <Text variant="bodyMedium" style={styles.leftParag}>
                {listeMulti[rand3].question}
              </Text>
            </View>
          )}
          {loading && <ActivityIndicator color={"#444"} />}
          {!loading && (
            <View style={[styles.container3, { marginLeft: 20 }]}>
              <RadioGroup
                selectedIndex={type2Answer}
                onChange={(index) => settype2Answer(index)}
              >
                <Radio>{listeMulti[rand3].ans1}</Radio>
                <Radio>{listeMulti[rand3].ans2}</Radio>
                <Radio>{listeMulti[rand3].ans3}</Radio>
              </RadioGroup>
              <Separator />
            </View>
          )}
          {loading && <ActivityIndicator color={"#444"} />}
          {!loading && (
            <View style={styles.viewCont}>
              <Text></Text>
              <Button
                buttonColor="#4e7291ff"
                mode="contained"
                onPress={insertRec2}
                disabled={disabled}
              >
                Cevapları Gönder - SEND
              </Button>
              <Text></Text>
              <CountdownCircleTimer
                isPlaying={isPlaying}
                duration={40}
                colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
                size={80}
                strokeWidth={5}
                colorsTime={[30, 20, 10, 0]}
                onComplete={insertRec2}
              >
                {({ remainingTime }) => (
                  <Text style={{ fontSize: 11 }}>
                    {t("safetyDetailsScreen.remaining")}:{remainingTime}
                  </Text>
                )}
              </CountdownCircleTimer>
              <Toast
                type={toast.type}
                message={toast.value}
                onDismiss={() => setToast({ value: "", type: "" })}
              />
            </View>
          )}
        </ScrollView>
      </Background_Green>
    );
};

const styles = StyleSheet.create({
  separator: {
    borderBottomColor: "#fff",
    borderWidth: 1,
    width: "100%",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  cardStyle: {
    backgroundColor: "#d6e9f7ff",
    width: "100%",
    borderRadius: 10,
  },
  leftParag: {
    fontSize: 14,
    justifyContent: "center",
  },
  viewCont: {
    justifyContent: "center",
    alignItems: "center",
  },
  container3: {
    width: width - 10,
  },
  background_Green: {
    height: height + 70,
    width: "90%",
  },
});

export default memo(SafetyDetailScreen);
