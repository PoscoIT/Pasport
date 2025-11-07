/* eslint-disable prettier/prettier */
/* eslint-disable eqeqeq */
import { memo, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";
import Background_Green from "../../components/BackgroundGradient";
import { Card, Text } from "react-native-paper";
import { t } from "i18next";
import { auth, database } from "../../database/firebaseDB";

const Image1 = require("../../assets/1.png");
const Image2 = require("../../assets/2.png");
const Image3 = require("../../assets/3.png");
const Image4 = require("../../assets/4.png");
const Image5 = require("../../assets/5.png");
const Image6 = require("../../assets/6.png");
const Image7 = require("../../assets/7.png");
const Image8 = require("../../assets/8.png");
const Image9 = require("../../assets/9.png");

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const SafetyRules = ({ navigation }) => {
  const user = auth.currentUser;
  const today = new Date();
  const isUserPoscoAssanUser = user?.email.includes("@poscoassan.com");

  const [poscoAssanAccidentDate, setPoscoAssanAccidentDate] =
    useState("2020-11-13");
  const [poscoTnpcAccidentDate, setPoscoTnpcAccidentDate] =
    useState("2022-09-05");

  const d1 = new Date(
    isUserPoscoAssanUser ? poscoAssanAccidentDate : poscoTnpcAccidentDate
  );
  const d2 = new Date();
  const lastInDate = parseInt(
    (d2.getTime() - d1.getTime()) / (24 * 3600 * 1000)
  );

  const date =
    ("0" + today.getDate()).slice(-2) +
    "." +
    ("0" + (today.getMonth() + 1)).slice(-2) +
    "." +
    today.getFullYear();

  const getAccidentDate = async () => {
    const refDB = database.ref("tstapp/");
    refDB.on("value", (snapshot) => {
      const val = snapshot.val();
      if (val?.version) {
        setPoscoAssanAccidentDate(val.version.AccidentDate);
        setPoscoTnpcAccidentDate(val.version.AccidentDate_Tnpc);
      }
    });
  };

  useEffect(() => {
    getAccidentDate();
  }, []);

  const renderButton = (image, appHead, labelText) => (
    <View style={styles.containerInside3}>
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate("SafetyRuleDetail", { appHead, appDate: today })
        }
      >
        <Image style={styles.images} source={image} />
      </TouchableOpacity>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.mehmetFatih}>{labelText}</Text>
      </View>
    </View>
  );

  return (
    <Background_Green>
      <ScrollView>
        <View style={styles.container}>
          <Card style={[styles.cardStyle, { backgroundColor: "BLUE" }]}>
            <Card.Content>
              <View style={{ flexDirection: "row" }}>
                <View style={{ width: width / 2 }}>
                  <Text style={styles.paragraphTitle}>
                    {t("general.today")}:
                  </Text>
                  <Text style={styles.paragraphTitle}>
                    {t("general.lastAccidentDate")}:
                  </Text>
                  <Text style={styles.paragraphTitle}>
                    {t("general.passingTime")}
                  </Text>
                </View>
                <View
                  style={{
                    width: width / 2 - 40,
                    alignItems: "flex-end",
                    alignContent: "flex-end",
                    left: 0,
                  }}
                >
                  <Text style={styles.paragraphTitle}>{date}</Text>
                  <Text style={styles.paragraphTitle}>
                    {isUserPoscoAssanUser
                      ? poscoAssanAccidentDate.split("-").reverse().join(".")
                      : poscoTnpcAccidentDate.split("-").reverse().join(".")}
                  </Text>
                  <View style={{ flexDirection: "row" }}>
                    {lastInDate
                      ?.toString()
                      ?.split("")
                      ?.map((item, index) => (
                        <View style={{ width: width / 8 }} key={index}>
                          <Text style={styles.paragCounter}>{item}</Text>
                        </View>
                      ))}
                  </View>
                </View>
              </View>
            </Card.Content>
          </Card>

          <View style={styles.containerInside}>
            <View style={styles.containerInside2}>
              {renderButton(Image1, "1", "TBM")}
              {renderButton(Image2, "2", t("safetyRules.workPermit"))}
              {renderButton(Image3, "3", `10 ${t("safetyRules.safetyRules")}`)}
            </View>
            <View style={styles.containerInside2}>
              {renderButton(Image5, "4", t("safetyRules.fireStudies"))}
              {renderButton(Image6, "5", t("safetyRules.height"))}
              {renderButton(Image7, "6", t("safetyRules.indoorStudies"))}
            </View>
            <View style={styles.containerInside2}>
              {renderButton(Image8, "7", t("safetyRules.heavyLifting"))}
              {renderButton(Image4, "8", t("safetyRules.onePoint"))}
              {renderButton(Image9, "9", t("safetyRules.safetyVideo"))}
            </View>
          </View>
        </View>
      </ScrollView>
    </Background_Green>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",

    height: Platform.OS === "ios" ? height - 210 : height + 100,
  },
  containerInside: {
    backgroundColor: "transparent",
    width: width,
    margin: 10,
    alignItems: "center",
  },
  containerInside2: {
    flexDirection: "row",
  },
  containerInside3: {
    alignItems: "center",
    margin: 10,
  },
  cardStyle: {
    height: 130,
    width: width,
  },
  paragraphTitle: {
    color: "#333",
    fontWeight: "600",
    fontSize: width / 22,
    padding: 5,
  },
  button: {
    padding: 5,
    marginBottom: 10,
    shadowColor: "#303838",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.85,
    height: 110,
    width: 110,
    elevation: 5,
  },
  images: {
    height: 100,
    aspectRatio: 1,
    width: 100,
    resizeMode: "contain",
  },
  mehmetFatih: {
    flex: 1,
    flexWrap: "wrap",
    textAlign: "center",
    color: "#333",
    fontWeight: "bold",
  },
  paragCounter: {
    color: "#333",
    fontWeight: "600",
    borderStyle: "solid",
    borderWidth: 2,
    margin: 2,
    backgroundColor: "#ee5",
    padding: 5,
    textAlign: "center",
    fontSize: width / 22,
  },
});

export default memo(SafetyRules);
