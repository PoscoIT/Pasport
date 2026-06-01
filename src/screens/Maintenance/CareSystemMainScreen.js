import { View, StyleSheet, Text, Dimensions } from "react-native";

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
  <View style={styles.card}>
    <Button
      appearance="outline"
      style={styles.button}
      onPress={() => navigation.navigate("CareSystemPeriodicControl")}
    >
      <Icon name="briefcase" size={16}  />
      <Text style={styles.buttonText} style={{paddingLeft:30}}>
     
   {t("careSystem.periodicControl")}
      </Text>
    </Button>

    <Button
      appearance="outline"
      status="danger"
      style={styles.button}
      onPress={() => navigation.navigate("CareSystemChecklistRoute")}
    >
      <Icon name="location-arrow" size={16} style={{paddingLeft:10}} />
      <Text style={styles.buttonText}>
   {t("careSystem.createRoute")}
      </Text>
    </Button>
  </View>
</View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },

  card: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,

    elevation: 4,
  },

  button: {
    marginVertical: 10,
    borderRadius: 10,
 
    marginHorizontal:15
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CareSystemMainScreen;
