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
    setDisabled(true);

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

      Alert.alert(
        t("safetyDetailsScreen.info"),
        message,
        [
          {
            text: t("safetyDetailsScreen.ok"),
            onPress: () => {
              navigation.replace("SafetyMainScreen");
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

if (liste.length > 0 && listeMulti.length > 0) {
  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerAccent} />

            <Text style={styles.title}>
              {t("safetyDetailsScreen.message1")}
            </Text>

            <Text style={styles.subtitle}>
              {t("safetyDetailsScreen.message2")}
            </Text>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0B337C" />
            </View>
          ) : (
            <>
              <View style={styles.questionCard}>
                <View style={styles.questionHeader}>
                  <View style={styles.numberBadge}>
                    <Text style={styles.numberText}>1</Text>
                  </View>

                  <Text style={styles.questionText}>
                    {liste[rand].question}
                  </Text>
                </View>

                <RadioGroup
                  selectedIndex={quest1Answer}
                  onChange={(index) => {
                    setquest1Answer(index);
                    setText("abc");
                  }}
                >
                  <Radio
                    style={[
                      styles.option,
                      quest1Answer === 0 && styles.optionSelected,
                    ]}
                  >
                    {() => (
                      <Text style={styles.optionText}>
                        {t("safetyDetailsScreen.true")}
                      </Text>
                    )}
                  </Radio>

                  <Radio
                    style={[
                      styles.option,
                      quest1Answer === 1 && styles.optionSelected,
                    ]}
                  >
                    {() => (
                      <Text style={styles.optionText}>
                        {t("safetyDetailsScreen.false")}
                      </Text>
                    )}
                  </Radio>
                </RadioGroup>
              </View>

              <View style={styles.questionCard}>
                <View style={styles.questionHeader}>
                  <View style={styles.numberBadge}>
                    <Text style={styles.numberText}>2</Text>
                  </View>

                  <Text style={styles.questionText}>
                    {liste[rand2].question}
                  </Text>
                </View>

                <RadioGroup
                  selectedIndex={quest2Answer}
                  onChange={(index) => setquest2Answer(index)}
                >
                  <Radio
                    style={[
                      styles.option,
                      quest2Answer === 0 && styles.optionSelected,
                    ]}
                  >
                    {() => (
                      <Text style={styles.optionText}>
                        {t("safetyDetailsScreen.true")}
                      </Text>
                    )}
                  </Radio>

                  <Radio
                    style={[
                      styles.option,
                      quest2Answer === 1 && styles.optionSelected,
                    ]}
                  >
                    {() => (
                      <Text style={styles.optionText}>
                        {t("safetyDetailsScreen.false")}
                      </Text>
                    )}
                  </Radio>
                </RadioGroup>
              </View>

              <View style={styles.questionCard}>
                <View style={styles.questionHeader}>
                  <View style={styles.numberBadge}>
                    <Text style={styles.numberText}>3</Text>
                  </View>

                  <Text style={styles.questionText}>
                    {listeMulti[rand3].question}
                  </Text>
                </View>

                <RadioGroup
                  selectedIndex={type2Answer}
                  onChange={(index) => settype2Answer(index)}
                >
                  {[
                    listeMulti[rand3].ans1,
                    listeMulti[rand3].ans2,
                    listeMulti[rand3].ans3,
                  ].map((answer, index) => (
                    <Radio
                      key={index}
                      style={[
                        styles.option,
                        type2Answer === index && styles.optionSelected,
                      ]}
                    >
                      {() => (
                        <Text style={styles.optionText}>{answer}</Text>
                      )}
                    </Radio>
                  ))}
                </RadioGroup>
              </View>

              <View style={styles.submitPanel}>
                <View style={styles.timerContainer}>
                  <CountdownCircleTimer
                    isPlaying={isPlaying}
                    duration={40}
                    colors={["#0B337C", "#D99A16", "#DC2626", "#DC2626"]}
                    colorsTime={[40, 20, 10, 0]}
                    size={76}
                    strokeWidth={5}
                    onComplete={insertRec2}
                  >
                    {({ remainingTime }) => (
                      <Text
                        style={[
                          styles.timerValue,
                          remainingTime <= 10 && styles.timerUrgent,
                        ]}
                      >
                        {remainingTime}
                      </Text>
                    )}
                  </CountdownCircleTimer>

                  <Text style={styles.timerLabel}>
                    {t("safetyDetailsScreen.remaining")}
                  </Text>
                </View>

                <View style={styles.submitButtonWrapper}>
                  <Button
                    mode="contained"
                    buttonColor="#0B337C"
                    textColor="#FFFFFF"
                    style={styles.submitButton}
                    contentStyle={styles.submitButtonContent}
                    labelStyle={styles.submitButtonLabel}
                    onPress={insertRec2}
                    disabled={disabled}
                  >
                    {t("submitSafetyAnswers", {
                      defaultValue: "Cevapları Gönder",
                    })}
                  </Button>
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      <Toast
        type={toast.type}
        message={toast.value}
        onDismiss={() => setToast({ value: "", type: "" })}
      />
    </View>
  );
}
}



const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F3F6FC",
  },

  scrollContent: {
    flexGrow: 1,
    paddingTop: 22,
    paddingBottom: 36,
  },

  container: {
    width: "100%",
    maxWidth: 680,
    alignSelf: "center",
    paddingHorizontal: 16,
  },

  header: {
    paddingHorizontal: 4,
    marginBottom: 24,
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
    fontSize: 23,
    lineHeight: 32,
    fontWeight: "700",
    marginBottom: 8,
  },

  subtitle: {
    color: "#64748B",
    fontSize: 14,
    lineHeight: 23,
  },

  loadingContainer: {
    paddingVertical: 60,
    alignItems: "center",
    justifyContent: "center",
  },

  questionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E3EAF4",
    padding: 16,
    marginBottom: 16,
  },

  questionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },

  numberBadge: {
    minWidth: 30,
    minHeight: 30,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 9,
    backgroundColor: "#EAF0FA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  numberText: {
    color: "#0B337C",
    fontSize: 14,
    fontWeight: "700",
  },

  questionText: {
    flex: 1,
    color: "#253858",
    fontSize: 15,
    lineHeight: 24,
    fontWeight: "600",
    paddingTop: 2,
  },

  option: {
    minHeight: 50,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E8EDF5",
    backgroundColor: "#F8FAFD",
    marginVertical: 4,
  },

  optionSelected: {
    borderColor: "#0B337C",
    backgroundColor: "#EAF0FA",
  },

  optionText: {
    flexShrink: 1,
    color: "#334155",
    fontSize: 14,
    lineHeight: 22,
    marginLeft: 10,
  },

  submitPanel: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E3EAF4",
    borderRadius: 16,
    padding: 16,
    marginTop: 4,
  },

  timerContainer: {
    width: 96,
    alignItems: "center",
    marginVertical: 6,
  },

  timerValue: {
    color: "#0B337C",
    fontSize: 25,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
  },

  timerUrgent: {
    color: "#DC2626",
  },

  timerLabel: {
    color: "#64748B",
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center",
    marginTop: 8,
  },

  submitButtonWrapper: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 170,
    paddingHorizontal: 6,
    paddingVertical: 8,
  },

  submitButton: {
    borderRadius: 12,
  },

  submitButtonContent: {
    minHeight: 54,
    paddingVertical: 5,
  },

  submitButtonLabel: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0,
    marginHorizontal: 10,
  },
});

export default memo(SafetyDetailScreen);
