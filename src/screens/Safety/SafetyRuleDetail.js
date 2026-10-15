/* eslint-disable no-alert */
import React, { memo, useEffect, useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import Background_Green from "../../components/BackgroundGradient";
import { Dimensions, Platform } from "react-native";
import { Card, Text, List } from "react-native-paper";
import { Toggle } from "@ui-kitten/components";
import Button from "../../components/Button";
import { InsertSafetyRuleCheck, sendUserInfoName } from "../../api/auth-api";
import { auth, database } from "../../database/firebaseDB";

import { t } from "i18next";

const Separator = () => <View style={styles.separator} />;

let width = Dimensions.get("window").width; //full width
let height = Dimensions.get("window").height; //full width

const SafetyRuleDetail = ({ route: { params }, navigation }) => {
  // Değiştirildi: `db` ve `auth` tanımlamaları kaldırıldı, servisler doğrudan kullanılacak
  // const db = getDatabase(firebaseDB);
  // const auth = getAuth();

  // Değiştirildi: auth() servisi doğrudan çağrıldı
  let user = auth.currentUser;
  const isUserPoscoAssanUser = user.email.includes("@poscoassan.com");

  const [poscoAssanAccidentDate, setPoscoAssanAccidentDate] =
    useState("2020-11-13");
  const [poscoTnpcAccidentDate, setPoscoTnpcAccidentDate] =
    useState("2022-09-05");

  let d1 = new Date(
    isUserPoscoAssanUser ? poscoAssanAccidentDate : poscoTnpcAccidentDate
  );
  let t1 = d1.getTime();
  let d2 = new Date();
  let t2 = d2.getTime();
  let lastInDate = parseInt((t2 - t1) / (24 * 3600 * 1000));
  let today = new Date();

  let date =
    ("0" + today.getDate()).slice(-2) +
    "." +
    ("0" + (today.getMonth() + 1)).slice(-2) +
    "." +
    today.getFullYear();
  const [listeMulti, setListeMulti] = useState([]);
  const [listeMulti2, setListeMulti2] = useState([]);
  const [ListeSemihMulti, setListeSemihMulti] = useState([]);
  const [loading, setLoading] = useState(false);
  const [firebaseData, setFirebaseDataData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [initial, setInitial] = useState(0);
  const [finalInitial, setFinalInitial] = useState(2);
  const [firstInitial, setFirstInitial] = useState(0);
  const [limit, setLimit] = useState(1);
  let liMulti = [];
  const imageSize = Dimensions.get("window").width / 2 - 15;

  if (user) {
    if (user != null) {
      var uid = user.uid;
      // var uid = user.uid; // Bu satır gereksizdi, kaldırdım
      var uemail = user.email;
    }
  }
  let todayFull = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let hours = String(today.getHours()).padStart(2, "0");
  let min = String(today.getMinutes()).padStart(2, "0");
  let sec = String(today.getSeconds()).padStart(2, "0");
  let yyyy = today.getFullYear();
  today = mm + "-" + dd + "-" + yyyy;
  todayFull = hours + ":" + min + ":" + sec + "  " + dd + "-" + mm + "-" + yyyy;

  const getAccidentDate = async () => {
    database.ref("tstapp/").on("value", (snapshot) => {
      const { version } = snapshot.val();
      setPoscoAssanAccidentDate(version.AccidentDate);
      setPoscoTnpcAccidentDate(version.AccidentDate_Tnpc);
    });
  };

  sendUserInfoName(async (sendResponse) => {
    const dbSafetyDb = isUserPoscoAssanUser ? "SafetyDB/" : "SafetyDBTnpc/";

    await database
      .ref(
        dbSafetyDb +
          yyyy +
          "_" +
          mm +
          "_" +
          dd +
          "/" +
          sendResponse.empSicil +
          "/" +
          params.appHead
      )
      .update({
        relatedDate: today,
        insertedDateTime: todayFull,
        fromMail: uemail,
        fromUid: uid,
        searchCondit: uemail + today,
        fromUname: sendResponse.uname,
        fromSicilNo: sendResponse.empSicil,
        fromLine: sendResponse.line,
        page: "SafetyDashBoard",
        appHead: params.appHead,
      });
  });

  sendUserInfoName(async (sendResponse) => {
    const dbSafetyDb2 = isUserPoscoAssanUser ? "SafetyDB2/" : "SafetyDB2Tnpc/";

    await database
      .ref(
        dbSafetyDb2 +
          yyyy +
          "_" +
          mm +
          "_" +
          dd +
          "/" +
          params.appHead +
          "/" +
          sendResponse.empSicil
      )
      .update({
        relatedDate: today,
        insertedDateTime: todayFull,
        fromMail: uemail,
        fromUid: uid,
        searchCondit: uemail + today,
        fromUname: sendResponse.uname,
        fromSicilNo: sendResponse.empSicil,
        fromLine: sendResponse.line,
        page: "SafetyDashBoard",
        appHead: params.appHead,
      });
  });

  const imageStyle = {
    width: imageSize,
    height: height / 10,
    padding: 4,
    margin: 4,
    flexDirection: "row",
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    backgroundColor: "rgba(179,211,215,0.49)",
    flex: 1,
  };

  const insertSafetyRule = async () => {
    if (loading) {
      return;
    }
    setLoading(true);

    if (listeMulti.Content0 !== undefined && listeMulti.Content0 !== "") {
      if (ListeSemihMulti != null) {
        if (listeMulti.Content0 != "") {
          if (ListeSemihMulti.ch0 != undefined) {
            if (ListeSemihMulti.ch0 != true) {
              alert("1. Checklisti doldurmanız gerekiyor!");
              setLoading(false);
              return;
            }
          } else {
            alert("1. Checklisti doldurmanız gerekiyor!");
            setLoading(false);
            return;
          }
        }
        if (listeMulti.Content1 != "") {
          if (ListeSemihMulti.ch1 != undefined) {
            if (ListeSemihMulti.ch1 != true) {
              alert("2. Checklisti doldurmanız gerekiyor!");
              setLoading(false);
              return;
            }
          } else {
            alert("2. Checklisti doldurmanız gerekiyor!");
            setLoading(false);
            return;
          }
        }
        if (listeMulti.Content2 != "") {
          if (ListeSemihMulti.ch2 != undefined) {
            if (ListeSemihMulti.ch2 != true) {
              alert("3. Checklisti doldurmanız gerekiyor!");
              setLoading(false);
              return;
            }
          } else {
            alert("3. Checklisti doldurmanız gerekiyor!");
            setLoading(false);
            return;
          }
        }
        if (listeMulti.Content3 != "") {
          if (ListeSemihMulti.ch3 != undefined) {
            if (ListeSemihMulti.ch3 != true) {
              alert("4. Checklisti doldurmanız gerekiyor!");
              setLoading(false);
              return;
            }
          } else {
            alert("4. Checklisti doldurmanız gerekiyor!");
            setLoading(false);
            return;
          }
        }
        if (listeMulti.Content4 != "") {
          if (ListeSemihMulti.ch4 != undefined) {
            if (ListeSemihMulti.ch4 != true) {
              alert("5. Checklisti doldurmanız gerekiyor!");
              setLoading(false);
              return;
            }
          } else {
            alert("5. Checklisti doldurmanız gerekiyor!");
            setLoading(false);
            return;
          }
        }
        if (listeMulti.Content5 != "") {
          if (ListeSemihMulti.ch5 != undefined) {
            if (ListeSemihMulti.ch5 != true) {
              alert("6. Checklisti doldurmanız gerekiyor!");
              setLoading(false);
              return;
            }
          } else {
            alert("6. Checklisti doldurmanız gerekiyor!");
            setLoading(false);
            return;
          }
        }
        if (listeMulti.Content6 != "") {
          if (ListeSemihMulti.ch6 != undefined) {
            if (ListeSemihMulti.ch6 != true) {
              alert("7. Checklisti doldurmanız gerekiyor!");
              setLoading(false);
              return;
            }
          } else {
            alert("7. Checklisti doldurmanız gerekiyor!");
            setLoading(false);
            return;
          }
        }
        if (listeMulti.Content7 != "") {
          if (ListeSemihMulti.ch7 != undefined) {
            if (ListeSemihMulti.ch7 != true) {
              alert("8. Checklisti doldurmanız gerekiyor!");
              setLoading(false);
              return;
            }
          } else {
            alert("8. Checklisti doldurmanız gerekiyor!");
            setLoading(false);
            return;
          }
        }
        if (listeMulti.Content8 != "") {
          if (ListeSemihMulti.ch8 != undefined) {
            if (ListeSemihMulti.ch8 != true) {
              alert("9. Checklisti doldurmanız gerekiyor!");
              setLoading(false);
              return;
            }
          } else {
            alert("9. Checklisti doldurmanız gerekiyor!");
            setLoading(false);
            return;
          }
        }
        if (listeMulti.Content9 != "") {
          if (ListeSemihMulti.ch9 != undefined) {
            if (ListeSemihMulti.ch9 != true) {
              alert("10. Checklisti doldurmanız gerekiyor!");
              setLoading(false);
              return;
            }
          } else {
            alert("10. Checklisti doldurmanız gerekiyor!");
            setLoading(false);
            return;
          }
        }
      } else {
        alert("Checklisti doldurmanız gerekiyor!");
        setLoading(false);
        return;
      }
    }

    const response = await InsertSafetyRuleCheck({
      ch0:
        listeMulti.Content0 !== undefined && listeMulti.Content0 !== ""
          ? ListeSemihMulti != undefined
            ? ListeSemihMulti.ch0 != undefined
              ? ListeSemihMulti.ch0
              : false
            : false
          : "Not Found",
      ch1:
        listeMulti.Content1 !== undefined && listeMulti.Content1 !== ""
          ? ListeSemihMulti != undefined
            ? ListeSemihMulti.ch1 != undefined
              ? ListeSemihMulti.ch1
              : false
            : false
          : "Not Found",
      ch2:
        listeMulti.Content2 !== undefined && listeMulti.Content2 !== ""
          ? ListeSemihMulti != undefined
            ? ListeSemihMulti.ch2 != undefined
              ? ListeSemihMulti.ch2
              : false
            : false
          : "Not Found",
      ch3:
        listeMulti.Content3 !== undefined && listeMulti.Content3 !== ""
          ? ListeSemihMulti != undefined
            ? ListeSemihMulti.ch3 != undefined
              ? ListeSemihMulti.ch3
              : false
            : false
          : "Not Found",
      ch4:
        listeMulti.Content4 !== undefined && listeMulti.Content4 !== ""
          ? ListeSemihMulti != undefined
            ? ListeSemihMulti.ch4 != undefined
              ? ListeSemihMulti.ch4
              : false
            : false
          : "Not Found",
      ch5:
        listeMulti.Content5 !== undefined && listeMulti.Content5 !== ""
          ? ListeSemihMulti != undefined
            ? ListeSemihMulti.ch5 != undefined
              ? ListeSemihMulti.ch5
              : false
            : false
          : "Not Found",
      ch6:
        listeMulti.Content6 !== undefined && listeMulti.Content6 !== ""
          ? ListeSemihMulti != undefined
            ? ListeSemihMulti.ch6 != undefined
              ? ListeSemihMulti.ch6
              : false
            : false
          : "Not Found",
      ch7:
        listeMulti.Content7 !== undefined && listeMulti.Content7 !== ""
          ? ListeSemihMulti != undefined
            ? ListeSemihMulti.ch7 != undefined
              ? ListeSemihMulti.ch7
              : false
            : false
          : "Not Found",
      ch8:
        listeMulti.Content8 !== undefined && listeMulti.Content8 !== ""
          ? ListeSemihMulti != undefined
            ? ListeSemihMulti.ch8 != undefined
              ? ListeSemihMulti.ch8
              : false
            : false
          : "Not Found",
      ch9:
        listeMulti.Content9 !== undefined && listeMulti.Content9 !== ""
          ? ListeSemihMulti != undefined
            ? ListeSemihMulti.ch9 != undefined
              ? ListeSemihMulti.ch9
              : false
            : false
          : "Not Found",
      appHead: params.appHead,
      appDate: params.appDate,
      endDate: today,
    });
    if (response.error) {
      // setError(response.error); // setError tanımlı değil, yorum satırı yaptım
    } else {
      alert("Kayıt başarılı.");
    }
    setLoading(false);
    navigation.navigate("SafetyRules");
  };

  const getQuestions = async () => {
    var today = new Date();
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var dd = String(today.getDate()).padStart(2, "0");
    var yyyy = today.getFullYear();
    if (loading) {
      return;
    }
    setLoading(true);
    const dbNameSafetyRules = isUserPoscoAssanUser
      ? "SafetyRules/"
      : "SafetyRulesTNPC/";
    const dbSafetyRuleResult = isUserPoscoAssanUser
      ? "SafetyRuleResult/TST/"
      : "SafetyRuleResult/TNPC/";

    const snapshot = await database
      .ref(dbNameSafetyRules + params.appHead)
      .once("value");

    let snapshotVal = snapshot.val();
    setListeMulti(snapshotVal);
    let objectValue = Object.entries(snapshotVal);
    setFirebaseDataData(objectValue);

    objectValue
      .filter(([key, value]) => key.includes("Content"))
      .slice(firstInitial, finalInitial)
      .map((item, index) => {
        const { insertDate, summary, summaryColor, titleColor, uriList } =
          item[1];
        let uriList2 = uriList?.split(",");

        uriList2?.map((item, index2) => {
          liMulti.push({
            insertDate: insertDate,
            summary: summary,
            summaryColor: summaryColor,
            titleColor: titleColor,
            source: {
              uri: item,
            },
          });
        });
      });
    setListeMulti2(liMulti);

    await sendUserInfoName(async (sendResponse) => {
      const snapshote = await database
        .ref(
          dbSafetyRuleResult +
            yyyy +
            "_" +
            mm +
            "_" +
            dd +
            "/" +
            sendResponse.empSicil +
            "/" +
            params.appHead +
            "/"
        )
        .once("value");

      let snapshoteVal = snapshote.val();
      setListeSemihMulti(snapshoteVal);
      setLoading(false);
      return loading;
    });
  };
  const accidentDate = isUserPoscoAssanUser
  ? poscoAssanAccidentDate
  : poscoTnpcAccidentDate;

const formattedAccidentDate = accidentDate
  ? accidentDate.split("-").reverse().join(".")
  : "—";

const isVideoPage = String(params.appHead) === "9";
const isImagePage = String(params.appHead) === "8";
const isChecklistPage = !isVideoPage && !isImagePage;

const contentEntries = (firebaseData ?? []).filter(([key]) =>
  key.includes("Content"),
);

const checklistEntries = contentEntries.filter((item) => item[1] !== "");

  useEffect(() => {
    getQuestions().then(async () => {
      setLoading(false);
    });
    return () => {};
  }, [finalInitial, firstInitial]);

  useEffect(() => {
    getAccidentDate();
  }, []);

  return (
  <View style={styles.screen}>
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.container}>
        <View style={styles.summary}>
          <View style={styles.dateRow}>
            <Text style={styles.dateLabel}>
              {t("general.today")}
            </Text>
            <Text style={styles.dateValue}>{date}</Text>
          </View>

          <View style={styles.dateRow}>
            <Text style={styles.dateLabel}>
              {t("general.lastAccidentDate")}
            </Text>
            <Text style={styles.dateValue}>
              {formattedAccidentDate}
            </Text>
          </View>

          <View style={styles.counterRow}>
            <Text style={styles.counterLabel}>
              {t("general.passingTime")}
            </Text>
            <Text style={styles.counterValue}>
              {lastInDate ?? "—"}
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View style={styles.sectionAccent} />

          <Text style={styles.sectionTitle}>
            {listeMulti?.Name}
          </Text>
        </View>

        {isVideoPage && (
          <View>
            {checklistEntries.map((item, index) =>
              (firebaseData ?? [])
                .filter(([key]) => key.includes("Title" + index))
                .filter((entry) => entry[1] !== "")
                .map((titleEntry) => (
                  <List.Item
                    key={`${item[0]}-${titleEntry[0]}`}
                    style={styles.listItem}
                    title={titleEntry[1]}
                    description={listeMulti?.Name}
                    titleStyle={styles.listTitle}
                    descriptionStyle={styles.listDescription}
                    titleNumberOfLines={3}
                    descriptionNumberOfLines={2}
                    onPress={() =>
                      navigation.navigate("SafetyVideo", {
                        data: item[1],
                        title: titleEntry[1],
                        itemId: titleEntry,
                      })
                    }
                  />
                )),
            )}
          </View>
        )}

        {isImagePage && (
          <View>
            {contentEntries
              .slice()
              .sort(
                (a, b) =>
                  (Date.parse(b[1]?.insertDate) || 0) -
                  (Date.parse(a[1]?.insertDate) || 0),
              )
              .map((item, index) => {
                const cat = item[1];

                if (!cat?.uriList) {
                  return null;
                }

                const insertDate = new Date(cat.insertDate);
                const dateLabel = Number.isNaN(insertDate.getTime())
                  ? ""
                  : insertDate.toLocaleDateString("tr-TR");

                return (
                  <List.Item
                    key={item[0]}
                    style={styles.listItem}
                    title={cat.summary}
                    description={dateLabel}
                    titleStyle={styles.listTitle}
                    descriptionStyle={styles.listDescription}
                    titleNumberOfLines={3}
                    onPress={() =>
                      navigation.navigate("SafetyImage", {
                        data: cat,
                        itemId: index,
                      })
                    }
                  />
                );
              })}
          </View>
        )}

        {isChecklistPage && (
          <View style={styles.checklist}>
            {checklistEntries.map((item, index) => {
              const isChecked = !!ListeSemihMulti?.[`ch${index}`];

              return (
                <View
                  key={item[0]}
                  style={[
                    styles.checkRow,
                    index === checklistEntries.length - 1 &&
                      styles.lastCheckRow,
                  ]}
                >
                  <View
                    style={[
                      styles.numberBadge,
                      isChecked && styles.numberBadgeChecked,
                    ]}
                  >
                    <Text
                      style={[
                        styles.numberText,
                        isChecked && styles.numberTextChecked,
                      ]}
                    >
                      {index + 1}
                    </Text>
                  </View>

                  <Text style={styles.checkText}>{item[1]}</Text>

                  <View style={styles.toggleContainer}>
                    <Toggle
                      checked={isChecked}
                      status={isChecked ? "success" : "basic"}
                      accessibilityLabel={String(item[1])}
                      onChange={(isChecked) => {
                        setListeSemihMulti((previous) => ({
                          ...previous,
                          [`ch${index}`]: isChecked,
                        }));
                      }}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {isChecklistPage && (
          <View style={styles.saveContainer}>
            <Button
              mode="contained"
              buttonColor="#0B337C"
              textColor="#FFFFFF"
              style={styles.saveButton}
              contentStyle={styles.saveButtonContent}
              labelStyle={styles.saveButtonLabel}
              loading={loading}
              disabled={loading}
              onPress={insertSafetyRule}
            >
              {t("saveSafetyResults", {
                defaultValue: "Sonuçları Kaydet",
              })}
            </Button>
          </View>
        )}
      </View>
    </ScrollView>
  </View>
);
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F3F6FC",
  },

  scrollContent: {
    flexGrow: 1,
    paddingTop: 16,
    paddingBottom: 36,
  },

  container: {
    width: "100%",
    maxWidth: 680,
    alignSelf: "center",
    paddingHorizontal: 16,
  },

  summary: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E3EAF4",
    paddingHorizontal: 18,
    paddingTop: 18,
    marginBottom: 26,
  },

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  dateLabel: {
    flex: 1,
    color: "#64748B",
    fontSize: 13,
    lineHeight: 20,
    paddingRight: 12,
  },

  dateValue: {
    flex: 1,
    color: "#172B4D",
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "600",
    textAlign: "right",
  },

  counterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#EDF1F7",
    marginTop: 4,
    paddingVertical: 14,
  },

  counterLabel: {
    flex: 1,
    color: "#526581",
    fontSize: 13,
    lineHeight: 20,
    paddingRight: 12,
  },

  counterValue: {
    flexShrink: 1,
    color: "#0B337C",
    fontSize: 30,
    fontWeight: "800",
    textAlign: "right",
    fontVariant: ["tabular-nums"],
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 2,
  },

  sectionAccent: {
    width: 4,
    height: 24,
    borderRadius: 2,
    backgroundColor: "#0B337C",
    marginRight: 10,
  },

  sectionTitle: {
    flex: 1,
    color: "#172B4D",
    fontSize: 19,
    fontWeight: "700",
    lineHeight: 27,
  },

  listItem: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E3EAF4",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 10,
  },

  listTitle: {
    color: "#172B4D",
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 23,
  },

  listDescription: {
    color: "#73829B",
    fontSize: 12,
    lineHeight: 19,
    marginTop: 5,
  },

  checklist: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E3EAF4",
    paddingHorizontal: 14,
  },

  checkRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF1F7",
  },

  lastCheckRow: {
    borderBottomWidth: 0,
  },

  numberBadge: {
    minWidth: 28,
    minHeight: 28,
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: "#EFF3FA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    marginTop: 2,
  },

  numberBadgeChecked: {
    backgroundColor: "#E8F5ED",
  },

  numberText: {
    color: "#0B337C",
    fontSize: 12,
    fontWeight: "700",
  },

  numberTextChecked: {
    color: "#237247",
  },

  checkText: {
    flex: 1,
    color: "#334155",
    fontSize: 14,
    lineHeight: 23,
    paddingTop: 3,
  },

  toggleContainer: {
    flexShrink: 0,
    alignSelf: "center",
    marginLeft: 10,
  },

  saveContainer: {
    marginTop: 22,
  },

  saveButton: {
    borderRadius: 12,
  },

  saveButtonContent: {
    minHeight: 54,
    paddingVertical: 5,
  },

  saveButtonLabel: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0,
  },
});

export default memo(SafetyRuleDetail);
