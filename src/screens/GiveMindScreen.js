import React, { memo, useState, useEffect } from "react";
import { StyleSheet, Dimensions, View, LogBox, Alert } from "react-native";
import { database } from "../database/firebaseDB";
import Toast from "../components/Toast";
import {
  InsertNewRecordToFirebaseCredit,
  sendUserInfoName,
  updateUserCredit,
  sendMailForGonulden,
  sendMailForGonuldenLocalMail,
} from "../api/auth-api";
import { Card, Text, TextInput } from "react-native-paper";
import Background_Green from "../components/Background_Green";
import PickerModal from "react-native-picker-modal-view";
import Button from "../components/Button";
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
    <Background_Green>
      <Card style={styles.cardStyle}>
        <Card.Content>
          <Text variant="titleLarge">{t("loginScreen.message1")},</Text>
          <Text variant="bodyMedium">{t("loginScreen.message2")}</Text>
          <Text variant="bodyMedium">
            Kalan Teşekkür Miktarı (Remaining Thanks) : {creditPoint}
          </Text>
        </Card.Content>
      </Card>
      <View>
        <View style={styles.container}>
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
            sortingLanguage={"tr"}
            showToTopButton={true}
            selected={selectedItem}
            showAlphabeticalIndex={true}
            autoGenerateAlphabeticalIndex={true}
            selectPlaceholderText={"Ad Soyad (Name Surname)"}
            searchPlaceholderText={"Search..."}
            requireSelection={false}
            autoSort={true}
          />
        </View>
        <View style={styles.container}>
          <PickerModal
            onSelected={(item) => {
              setDeger({ value: item.value });
              setSelectedItem2(item);
            }}
            Autocomplete={false}
            items={dataCore}
            sortingLanguage={"tr"}
            showToTopButton={true}
            selected={selectedItem2}
            selectPlaceholderText={"İlgili Değer (Related Core Value)"}
            searchPlaceholderText={"Search..."}
            requireSelection={false}
            autoSort={true}
          />
        </View>
        <View style={styles.containerAciklama}>
          <TextInput
            mode="fixed"
            placeholder="Açıklama (Explanation)"
            style={styles.input2}
            value={commente.value}
            onChangeText={(text) => setCommente({ value: text })}
            multiline={true}
            Autocomplete={false}
            maxLength={160}
            right={<TextInput.Affix text={commente.value.length + "/160"} />}
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={styles.container}>
          {!loading && (
            <Button mode="contained" style={styles.button} onPress={insertRec}>
              {" "}
              Teşekkür Gönder (Send)
            </Button>
          )}
        </View>
        <View style={styles.listItemViewer}>
          <View style={styles.ViewContainerRightBottom}>
            <Card>
              <Card.Content>
                <Text variant="titleLarge">{t("gonuldenScreen.safety")}</Text>
                <Text variant="bodyMedium">
                  {t("gonuldenScreen.safetyMessage")}
                </Text>
              </Card.Content>
            </Card>
          </View>
          <View style={styles.ViewContainerRightBottom}>
            <Card>
              <Card.Content>
                <Text variant="titleLarge">{t("gonuldenScreen.ethics")}</Text>
                <Text variant="bodyMedium">
                  {t("gonuldenScreen.ethicsMessage")}
                </Text>
              </Card.Content>
            </Card>
          </View>
          <View style={styles.ViewContainerRightBottom}>
            <Card>
              <Card.Content>
                <Text variant="titleLarge">
                  {t("gonuldenScreen.fundamental")}
                </Text>
                <Text variant="bodyMedium">
                  {t("gonuldenScreen.fundamentalMessage")}
                </Text>
              </Card.Content>
            </Card>
          </View>
          <View style={styles.ViewContainerRightBottom}>
            <Card>
              <Card.Content>
                <Text variant="titleLarge">{t("gonuldenScreen.winWin")}</Text>
                <Text variant="bodyMedium">
                  {t("gonuldenScreen.winWinMessage")}
                </Text>
              </Card.Content>
            </Card>
          </View>
          <View style={styles.ViewContainerRightBottom}>
            <Card>
              <Card.Content>
                <Text variant="titleLarge">
                  {t("gonuldenScreen.creativity")}
                </Text>
                <Text variant="bodyMedium">
                  {t("gonuldenScreen.creativityMessage")}
                </Text>
              </Card.Content>
            </Card>
          </View>
        </View>
        <Toast
          type={toast.type}
          message={toast.value}
          onDismiss={() => setToast({ value: "", type: "" })}
        />
      </View>
    </Background_Green>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 5,
    height: 60,
    width: width - 10,
  },
  containerAciklama: {
    margin: 5,
    height: 90,
    width: width - 10,
  },
  itemStyle: {
    fontSize: 15,
    height: 75,
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
  },
  ViewContainerRightBottom: {
    width: width - 10,
    margin: 5,
  },
  inputContainer: {
    fontSize: 12,
    width: width - 10,
  },
  leftParag: {
    fontSize: 12,
    marginLeft: 5,
    justifyContent: "center",
  },
  input2: {
    marginBottom: 10,
    backgroundColor: "transparent",
    width: width - 10,
  },
  cardStyle: {
    backgroundColor: "white",
    margin: 5,
    width: width - 10,
  },
  safeAreaStyle: {
    flex: 1,
    justifyContent: "center",
    marginTop: 240,
  },
  listItemViewer: {
    paddingBottom: 100,
  },
});

export default memo(GiveMindScreen);
