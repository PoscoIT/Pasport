import {
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  Modal,
  TextInput,
  FlatList,
  Keyboard,
  Alert,
  Dimensions,
  Platform,
  Switch,
  KeyboardAvoidingView,
  Linking,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Card, Checkbox } from "react-native-paper";
import { Button } from "@ui-kitten/components";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { sendUserInfoName } from "../../api/auth-api";
import { REACT_APP_SECRET_KEY } from "@env";
import { t } from "i18next";
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from "react-native-vision-camera";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const BodyShowerChecklist = () => {
  const [count, setCount] = useState(0);
  const [netInfo, setNetInfo] = useState("");
  const [scanner, setScanner] = useState(true);
  const navigation = useNavigation();
  const [ScanResult, setScanResult] = useState(false);
  const [scan, setScan] = useState(true);
  const [data, setData] = useState([]);
  const [qrValue, setQrValue] = useState("");
  const [qrValueManual, setQrValueManual] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [employeeID, setEmployeeId] = useState("");
  const { width, height } = Dimensions.get("screen");
  const [countMethod, setCountMethod] = useState(false);
  const url = "https://tstapp.poscoassan.com.tr:8443";
  const [permission, setPermission] = useState(false);
  const [checkedWaterValve, setCheckedWaterValve] = useState(false);
  const [checkedFaultyValve, setCheckedFaultyValve] = useState(false);
  const [checkedReasonable, setCheckedReasonable] = useState(false);
  const [checkedDeformation, setCheckedDeformation] = useState(false);
  const [checkedEyeProtection, setCheckedEyeProtection] = useState(false);
  const [description, setDescription] = useState("");
  const device = useCameraDevice("back");
  const [hasPermission, setHasPermission] = useState(false);
  const [checked, setChecked] = useState(false);

  let scanAgain = (a = false) => {
    setCountMethod(a);
    setScan(true);
    setScanResult(false);
  };

  const onSuccess = (e) => {
    setModalVisible(true);

    setQrValue(e.data);

    setScan(false);
    setScanResult(true);
  };
  const getUser = async () => {
    await sendUserInfoName((sendResponse) => {
      setEmployeeId(sendResponse.empSicil);
    });
  };

  const getChecklistHistory = async () => {
    await axios
      .get(`${url}/ISGSystems/GetBodyShower`, {
        headers: {
          "auth-token": REACT_APP_SECRET_KEY,
        },
        params: {
          EquipmentNo: qrValue,
          // EquipmentNo:qrValue
        },
      })
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        setModalVisible(false);
      });
  };
  const codeScannner = useCodeScanner({
    codeTypes: [
      "qr",
      "ean-13",
      "ean-8",
      "code-128",
      "code-39",
      "code-93",
      "upc-e",
      "upc-a",
      "codabar",
      "data-matrix",
      "itf",
    ],
    onCodeScanned: (codes) => {
      setModalVisible(true);
      setQrValue(codes[0]?.value);

      setScan(false);
      setScanResult(true);
    },
    requestCameraPermission: true,
  });

  const addChecklist = async () => {
    const checklist = {
      EquipmentNo: qrValue,
      WaterValve: checkedWaterValve,
      DefectiveValve: checkedFaultyValve,
      Affordable: checkedReasonable,
      Deformation: checkedDeformation,
      Description: description,
      CreatedID: employeeID,
      ShowerProtection: checkedEyeProtection,
    };

    if (description.length > 255) {
      Alert.alert("Hata", "Açıklama 255 karakterden fazla olamaz.");
      return;
    }

    const formBody = Object.keys(checklist)
      .map(
        (key) =>
          encodeURIComponent(key) + "=" + encodeURIComponent(checklist[key])
      )
      .join("&");

    await axios
      .post(`${url}/ISGSystems/AddBodyShowerChecklist`, formBody, {
        headers: {
          "auth-token": REACT_APP_SECRET_KEY,
        },
      })
      .then((res) => {
        if (res.data) {
          setCount(count + 1);
          setData([]);
          setCheckedDeformation(false);
          setCheckedFaultyValve(false);
          setCheckedEyeProtection(false);
          setDescription("");
          setCheckedReasonable(false);
          setQrValue("");
          Alert.alert("Başarılı", "Başarıyla Checklist Yapıldı");
          setModalVisible(false);
        } else {
          Alert.alert("Hata", "Lütfen bağlantınızı kontrol ediniz.");
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setScan(true);
        setModalVisible(false);
      });
  };

  const checklistPopup = () => {
    return (
      <View>
        <View style={styles.insertView}>
          <Text>{t("fireEquipmentScreen.waterValve")}</Text>
          {Platform.OS === "ios" ? (
            <Switch
              value={checkedWaterValve}
              trackColor={{ true: "red", false: "blue" }}
              onChange={() => setCheckedWaterValve(!checkedWaterValve)}
            />
          ) : (
            <Checkbox
              status={checkedWaterValve ? "checked" : "unchecked"}
              onPress={() => {
                setCheckedWaterValve(!checkedWaterValve);
              }}
            />
          )}
        </View>
        <View style={styles.insertView}>
          <Text>{t("fireEquipmentScreen.faultyValve")}</Text>
          {Platform.OS === "ios" ? (
            <Switch
              value={checkedFaultyValve}
              trackColor={{ true: "red", false: "blue" }}
              onChange={() => setCheckedFaultyValve(!checkedFaultyValve)}
            />
          ) : (
            <Checkbox
              status={checkedFaultyValve ? "checked" : "unchecked"}
              onPress={() => {
                setCheckedFaultyValve(!checkedFaultyValve);
              }}
            />
          )}
        </View>
        <View style={styles.insertView}>
          <Text>{t("fireEquipmentScreen.reasonable")}</Text>
          {Platform.OS === "ios" ? (
            <Switch
              value={checkedReasonable}
              trackColor={{ true: "red", false: "blue" }}
              onChange={() => setCheckedReasonable(!checkedReasonable)}
            />
          ) : (
            <Checkbox
              status={checkedReasonable ? "checked" : "unchecked"}
              onPress={() => {
                setCheckedReasonable(!checkedReasonable);
              }}
            />
          )}
        </View>
        <View style={styles.insertView}>
          <Text>{t("fireEquipmentScreen.deformation")}</Text>
          {Platform.OS === "ios" ? (
            <Switch
              value={checkedDeformation}
              trackColor={{ true: "red", false: "blue" }}
              onChange={() => setCheckedDeformation(!checkedDeformation)}
            />
          ) : (
            <Checkbox
              status={checkedDeformation ? "checked" : "unchecked"}
              onPress={() => {
                setCheckedDeformation(!checkedDeformation);
              }}
            />
          )}
        </View>
        <View style={styles.insertView}>
          <Text>{t("fireEquipmentScreen.eyeProtection")}</Text>
          {Platform.OS === "ios" ? (
            <Switch
              value={checkedEyeProtection}
              trackColor={{ true: "red", false: "blue" }}
              onChange={() => setCheckedEyeProtection(!checkedEyeProtection)}
            />
          ) : (
            <Checkbox
              status={checkedEyeProtection ? "checked" : "unchecked"}
              onPress={() => {
                setCheckedEyeProtection(!checkedEyeProtection);
              }}
            />
          )}
        </View>

        <View style={styles.insertView}>
          <TextInput
            style={styles.input2}
            value={description}
            multiline={true}
            numberOfLines={4}
            onChangeText={(text) => setDescription(text)}
            placeholder={t("description")}
          />
        </View>

        <View style={{ marginTop: 15 }}>
          <Button onPress={() => addChecklist()}>
            {t("fireEquipmentScreen.submit")}
          </Button>
        </View>
      </View>
    );
  };

  const renderItem = ({ item }) => {
    return (
      <Card
        key={item.ID}
        style={{
          borderRadius: 30,
          elevation: 10,
          shadowColor: "#333",
          shadowOpacity: 0.3,
          shadowOffset: { width: 1, height: 1 },
          backgroundColor: "#f3f3f3",
          width: "100%",
          paddingVertical: 15,
          marginVertical: 10,
        }}
      >
        <Text title="Ekipman Numarası:" subtitle={item.Location} />
        <Card.Content>
          <Text style={styles.title}>
            {t("fireEquipmentScreen.waterValve")}{" "}
            {item.WaterValve === false ? (
              <FontAwesome color={"green"} size={20} name={"check"} />
            ) : (
              <FontAwesome color={"red"} size={20} name={"close"} />
            )}
          </Text>
          <Text style={styles.title}>
            {t("fireEquipmentScreen.faultyValve")}{" "}
            {item.FaultyValve === false ? (
              <FontAwesome color={"green"} size={20} name={"check"} />
            ) : (
              <FontAwesome color={"red"} size={20} name={"close"} />
            )}
          </Text>
          <Text style={styles.title}>
            {t("fireEquipmentScreen.reasonable")}{" "}
            {item.Reasonable === false ? (
              <FontAwesome color={"green"} size={20} name={"check"} />
            ) : (
              <FontAwesome color={"red"} size={20} name={"close"} />
            )}
          </Text>
          <Text style={styles.title}>
            {t("fireEquipmentScreen.deformation")}{" "}
            {item.Deformation === false ? (
              <FontAwesome color={"green"} size={20} name={"check"} />
            ) : (
              <FontAwesome color={"red"} size={20} name={"close"} />
            )}
          </Text>
          <Text style={styles.title}>
            {t("fireEquipmentScreen.eyeProtection")}{" "}
            {item.EyeProtection === false ? (
              <FontAwesome color={"green"} size={20} name={"check"} />
            ) : (
              <FontAwesome color={"red"} size={20} name={"close"} />
            )}
          </Text>
          <Text style={styles.title}>
            {t("fireEquipmentScreen.controller")}: {item.CreatedEmployee}
          </Text>
          <Text style={styles.title}>
            {t("fireEquipmentScreen.location")}: {item.Location}
          </Text>
          <Text style={styles.title}>
            {t("fireEquipmentScreen.controlDate")}:{" "}
            {item.Created_at.substring(0, 10)}
          </Text>
        </Card.Content>

        <Card.Actions
          style={{
            alignItems: "center",
            justifyContent: "center",
            bottom: 0,
            position: "absolute",
            width: "100%",
          }}
        ></Card.Actions>
      </Card>
    );
  };

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermission();

      if (cameraPermission === "granted") {
        setPermission(true);
        // Küçük delay ile başlat (bazı cihazlarda gerekli)
        setTimeout(() => setScan(true), 400);
      } else {
        Linking.openSettings();
      }
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setScan(true); // ekrana geldiğinde aktif et

      return () => {
        navigation.navigate("SafetyMainScreen");
        setScan(false); // ekrandan çıkarken pasif et
      };
    }, [])
  );

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    getChecklistHistory();
  }, [qrValue, count]);

  if (!device || !permission) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, width: "100%", height: "100%" }}>
        <Camera
          style={StyleSheet.absoluteFill}
          codeScanner={codeScannner}
          device={device}
          isActive={true}
        />

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
            setCount(count + 1);
          }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <View
                    style={{
                      width: "100%",
                      justifyContent: "flex-end",
                      alignItems: "flex-end",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        setModalVisible(!modalVisible);
                        setData([]);
                        setScan(true);
                        setCount(count + 1);
                      }}
                    >
                      <FontAwesome name={"close"} color="#000000" size={32} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.modalText}>
                    {" "}
                    Göz ve Boy Duşları, Göz Solüsyonları Kontrolleri
                  </Text>
                  <Text>{qrValue}</Text>
                  {data.length > 0 ? (
                    data[0]?.isRecent === true ? (
                      <FlatList
                        keyExtractor={(item) => item.ID}
                        data={data}
                        renderItem={renderItem}
                        ListEmptyComponent={
                          <View>
                            <Text>{t("fireEquipmentScreen.notQrCode")}</Text>
                          </View>
                        }
                      />
                    ) : (
                      checklistPopup()
                    )
                  ) : (
                    <FlatList
                      keyExtractor={(item) => item.ID}
                      renderItem={renderItem}
                      ListEmptyComponent={
                        <View>
                          <Text>{t("fireEquipmentScreen.notQrCode")}</Text>
                        </View>
                      }
                    />
                  )}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </Modal>
      </View>
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
  input2: {
    height: 80,
    borderWidth: 0.4,
    width: "100%",
    borderRadius: 10,
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
  insertView: {
    marginTop: 10,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "85%",
  },
  select: {
    flex: 1,
    margin: 2,
  },
});

export default BodyShowerChecklist;
