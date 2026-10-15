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
  <View style={styles.categoryWrapper}>
    <TouchableOpacity
      style={styles.categoryCard}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={labelText}
      onPress={() =>
        navigation.navigate("SafetyRuleDetail", {
          appHead,
          appDate: today,
        })
      }
    >
      <View style={styles.imageContainer}>
        <Image style={styles.categoryImage} source={image} />
      </View>

      <Text style={styles.categoryLabel}>{labelText}</Text>
    </TouchableOpacity>
  </View>
);

const accidentDate = isUserPoscoAssanUser
  ? poscoAssanAccidentDate
  : poscoTnpcAccidentDate;

const formattedAccidentDate = accidentDate
  ? accidentDate.split("-").reverse().join(".")
  : "—";

return (
  <View style={styles.screen}>
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.container}>
       <View style={styles.summaryCard}>
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

  <View style={styles.counterPanel}>
    <View style={styles.counterAccent} />

    <View style={styles.counterContent}>
      <Text style={styles.counterLabel}>
        {t("general.passingTime")}
      </Text>

      <Text style={styles.counterValue}>
        {lastInDate ?? "—"}
      </Text>
    </View>
  </View>
</View>

        <View style={styles.sectionHeader}>
          <View style={styles.sectionAccent} />
          <Text style={styles.sectionTitle}>
            {t("safetyRules.safetyRules")}
          </Text>
        </View>

        <View style={styles.categoryGrid}>
          {renderButton(Image1, "1", "TBM")}
          {renderButton(Image2, "2", t("safetyRules.workPermit"))}
          {renderButton(
            Image3,
            "3",
            `10 ${t("safetyRules.safetyRules")}`,
          )}
          {renderButton(Image5, "4", t("safetyRules.fireStudies"))}
          {renderButton(Image6, "5", t("safetyRules.height"))}
          {renderButton(Image7, "6", t("safetyRules.indoorStudies"))}
          {renderButton(Image8, "7", t("safetyRules.heavyLifting"))}
          {renderButton(Image4, "8", t("safetyRules.onePoint"))}
          {renderButton(Image9, "9", t("safetyRules.safetyVideo"))}
        </View>
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
    paddingVertical: 20,
  },

  container: {
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
    paddingHorizontal: 16,
  },

  summaryCard: {
  backgroundColor: "#FFFFFF",
  borderRadius: 16,
  borderWidth: 1,
  borderColor: "#E3EAF4",
  padding: 20,
  marginBottom: 24,
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

counterPanel: {
  flexDirection: "row",
  alignItems: "stretch",
  backgroundColor: "#F0F4FB",
  borderRadius: 12,
  marginTop: 8,
  overflow: "hidden",
},

counterAccent: {
  width: 4,
  backgroundColor: "#0B337C",
},

counterContent: {
  flex: 1,
  paddingHorizontal: 18,
  paddingVertical: 16,
},

counterLabel: {
  color: "#526581",
  fontSize: 13,
  lineHeight: 20,
  marginBottom: 4,
},

counterValue: {
  color: "#0B337C",
  fontSize: 38,
  fontWeight: "800",
  fontVariant: ["tabular-nums"],
},
  counterDigit: {
    minWidth: 42,
    minHeight: 54,
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginHorizontal: 3,
    marginBottom: 6,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  counterText: {
    color: "#0B337C",
    fontSize: 28,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
  },

  sectionAccent: {
    width: 4,
    height: 22,
    borderRadius: 2,
    backgroundColor: "#0B337C",
    marginRight: 10,
  },

  sectionTitle: {
    flex: 1,
    color: "#172B4D",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 25,
  },

  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -5,
  },

  categoryWrapper: {
    width: "33.333333%",
    paddingHorizontal: 5,
    marginBottom: 12,
  },

  categoryCard: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E3EAF4",
    paddingHorizontal: 7,
    paddingTop: 16,
    paddingBottom: 14,
    minHeight: 152,
  },

  imageContainer: {
    width: "100%",
    maxWidth: 76,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  categoryImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },

  categoryLabel: {
    color: "#334155",
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default memo(SafetyRules);
