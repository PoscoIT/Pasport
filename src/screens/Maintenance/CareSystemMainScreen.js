import { View, StyleSheet, Text, ScrollView,TouchableOpacity } from "react-native";

import { useState } from "react";

import { Button } from "@ui-kitten/components";

import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import Icon from 'react-native-vector-icons/FontAwesome';



const CareSystemMainScreen = () => {


  const url = "https://tstapp.poscoassan.com.tr:8443";
  const {t} = useTranslation()

  const navigation = useNavigation();

return (
  <View style={styles.container}>
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.actionCard}
          activeOpacity={0.7}
          accessibilityRole="button"
          onPress={() => navigation.navigate("CareSystemPeriodicControl")}
        >
          <View style={styles.iconContainer}>
            <Icon name="briefcase" size={22} color="#0B337C" />
          </View>

          <Text style={styles.actionTitle}>
            {t("careSystem.periodicControl")}
          </Text>

          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          activeOpacity={0.7}
          accessibilityRole="button"
          onPress={() => navigation.navigate("CareSystemChecklistRoute")}
        >
          <View style={styles.iconContainer}>
            <Icon name="location-arrow" size={23} color="#0B337C" />
          </View>

          <Text style={styles.actionTitle}>
            {t("careSystem.createRoute")}
          </Text>

          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </View>
);
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F6FC",
  },

  scrollContent: {
    flexGrow: 1,
    paddingTop: 24,
    paddingBottom: 36,
  },

  content: {
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
    paddingHorizontal: 20,
  },

  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 100,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E3EAF4",
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 22,
    marginBottom: 16,
  },

  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: "#EAF0FA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },

  actionTitle: {
    flex: 1,
    color: "#172B4D",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
  },

  chevron: {
    color: "#94A3B8",
    fontSize: 28,
    marginLeft: 12,
  },
});

export default CareSystemMainScreen;
