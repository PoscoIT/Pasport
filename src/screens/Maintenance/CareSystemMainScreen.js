import { View, StyleSheet, Text, Dimensions } from "react-native";

import { useState } from "react";

import { Button } from "@ui-kitten/components";

import { useNavigation } from "@react-navigation/native";

const CareSystemMainScreen = () => {
  const [count, setCount] = useState(0);
  const [netInfo, setNetInfo] = useState("");
  const containerStyle = { backgroundColor: "white", padding: 20 };
  const [ScanResult, setScanResult] = useState(false);
  const [scan, setScan] = useState(false);
  const [data, setData] = useState([]);
  const [qrValue, setQrValue] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [employeeID, setEmployeeId] = useState("");
  const { width, height } = Dimensions.get("screen");
  const [selectedReturnMessage, setSelectedReturnMessage] = useState("");
  const [returnMessageData, setReturnMessageData] = useState([]);
  const [countMethod, setCountMethod] = useState(false);
  const url = "https://tstapp.poscoassan.com.tr:8443";
  const [returnMessage, setReturnMessage] = useState("");
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1 }}>
      {!scan && (
        <View
          style={{ flex: 1, flexDirection: "column", alignItems: "center" }}
        >
          <Button
            appearance={"outline"}
            style={styles.button3}
            onPress={() => {
              navigation.navigate("CareSystemPeriodicControl");
            }}
          >
            <Text style={styles.buttonTextStyle}>
              Periyodik Checklist Kontrolü
            </Text>
          </Button>
          <Button
            appearance={"outline"}
            status={"danger"}
            style={styles.button3}
            onPress={() => {
              navigation.navigate("CareSystemChecklist");
            }}
          >
            <Text style={styles.buttonTextStyle}> Okut</Text>
          </Button>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
  },
  input1: {
    height: 40,
    margin: 30,
    marginLeft: 0,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "white",
    width: "100%",
    padding: 10,
  },
  input: {
    height: 40,
    margin: 30,
    borderWidth: 1,
    borderRadius: 10,
    width: "100%",
    padding: 10,
  },
  centeredViewManual: {
    flex: 1,

    width: "100%",
  },
  button3: {
    width: "70%",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  button4: {
    width: "70%",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    color: "#fff",
  },
  linearGradient: {
    flex: 1,
  },
  modalText: {
    textAlign: "center",
  },
  modalView: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 35,

    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: "#777",
  },
  cameraStyle: {
    height: "100%",
    marginTop: 40,
    width: "100%",
    flex: 1,
    alignSelf: "center",
    justifyContent: "center",
  },
  textBold: {
    fontWeight: "500",
    color: "#000",
  },
  buttonText: {
    fontSize: 21,
    color: "rgb(0,122,255)",
  },
  buttonTouchable: {
    padding: 16,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 192,
  },
  select: {
    flex: 1,
    margin: 2,
  },
});

export default CareSystemMainScreen;
