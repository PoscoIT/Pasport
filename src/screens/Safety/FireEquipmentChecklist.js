import {
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  Modal,
  TextInput,
  FlatList,
  Alert,
  Dimensions,
  Platform,
  Switch,
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

import { database } from "../../database/firebaseDB";

import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";

import {
  Camera,
  getCameraDevice,
  useCameraDevice,
  useCodeScanner,
} from "react-native-vision-camera";

const FireEquipmentChecklist = () => {
  const [count, setCount] = useState(0);
  const [netInfo, setNetInfo] = useState("");
  const [scanner, setScanner] = useState(true);
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
  const [checkedCabinet, setCheckedCabinet] = useState(false);
  const [users, setUsers] = useState("");
  const [checkedBody, setCheckedBody] = useState(false);
  const [checkedValve, setCheckedValve] = useState(false);
  const [checkedHose, setCheckedHose] = useState(false);
  const [checkedNozzle, setCheckedNozzle] = useState(false);
  const [permission, setPermission] = useState(false);
  const [description, setDescription] = useState("");

  const navigation = useNavigation();
  const [pageAuthorization, setPageAuthorization] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const device = useCameraDevice("back");
  const isFocused = useIsFocused();
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
      .get(`${url}/ISGSystems/GetFireEquipment`, {
        headers: {
          "auth-token": REACT_APP_SECRET_KEY,
          "Content-type": "application/json",
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

  const getDialogInfo = async () => {
    const s = database.ref("tstapp/authorization/fireEquipmentControl");

    // Değiştirildi: get(s) yerine s.once('value')
    await s.once("value").then((snapshot) => {
      // Olası state gecikme hatasını düzeltmek için local değişken kullanıldı
      const usersList = snapshot.val().users;
      setUsers(usersList);
      setPageAuthorization(usersList.includes(employeeID));
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
      getChecklistHistory();
    },
    requestCameraPermission: true,
  });

  const addChecklist = async () => {
    const checklist = {
      EquipmentNo: qrValue,
      CabinetStatus: checkedCabinet,
      ValveStatus: checkedValve,
      HoseStatus: checkedHose,
      NozzleStatus: checkedNozzle,
      Description: description,
      CreatedID: employeeID,
      BodyStatus: checkedBody,
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
      .post(`${url}/ISGSystems/AddFireEquipmentChecklist`, formBody, {
        headers: {
          "auth-token": REACT_APP_SECRET_KEY,
        },
      })
      .then((res) => {
        if (res.data) {
          setCount(count + 1);
          setData([]);
          setCheckedCabinet(false);
          setCheckedHose(false);
          setCheckedValve(false);
          setCheckedNozzle(false);
          setDescription("");
          setCheckedBody(false);
          setQrValue("");
          Alert.alert("Başarılı", "Başarıyla Checklist Yapıldı");
          setModalVisible(false);
        } else {
          Alert.alert("Hata", "Lütfen bağlantınızı kontrol ediniz.");
        }
      })
      .catch((err) => {})
      .finally(() => {
        setModalVisible(false);
        setScan(true);
      });
  };

  //   useEffect(() => {
  //     (async () => {
  //       const status = await Camera.getCameraPermissionStatus();

  //       if (status !== "authorized" && status !== "granted") {
  //         const newStatus = await Camera.requestCameraPermission();
  //         setHasPermission(newStatus === "authorized" || newStatus === "granted");
  //       } else {
  //         setHasPermission(true);
  //       }

  //       setChecked(true);
  //     })();
  //   }, []);

  const checklistPopup = () => {
    return (
      <View>
        <View style={styles.insertView}>
          <Text>{t("fireEquipmentScreen.cabinet")} Durumu</Text>
          {Platform.OS === "ios" ? (
            <Switch
              value={checkedCabinet}
              trackColor={{ true: "red", false: "blue" }}
              onChange={() => setCheckedCabinet(!checkedCabinet)}
            />
          ) : (
            <Checkbox
              status={checkedCabinet ? "checked" : "unchecked"}
              onPress={() => {
                setCheckedCabinet(!checkedCabinet);
              }}
            />
          )}
        </View>
        <View style={styles.insertView}>
          <Text>{t("fireEquipmentScreen.valve")} Durumu</Text>
          {Platform.OS === "ios" ? (
            <Switch
              value={checkedValve}
              trackColor={{ true: "red", false: "blue" }}
              onChange={() => setCheckedValve(!checkedValve)}
            />
          ) : (
            <Checkbox
              status={checkedValve ? "checked" : "unchecked"}
              onPress={() => {
                setCheckedValve(!checkedValve);
              }}
            />
          )}
        </View>
        <View style={styles.insertView}>
          <Text>{t("fireEquipmentScreen.hose")} Durumu</Text>
          {Platform.OS === "ios" ? (
            <Switch
              value={checkedHose}
              trackColor={{ true: "red", false: "blue" }}
              onChange={() => setCheckedHose(!checkedHose)}
            />
          ) : (
            <Checkbox
              status={checkedHose ? "checked" : "unchecked"}
              onPress={() => {
                setCheckedHose(!checkedHose);
              }}
            />
          )}
        </View>
        <View style={styles.insertView}>
          <Text>{t("fireEquipmentScreen.nozzle")} Durumu</Text>
          {Platform.OS === "ios" ? (
            <Switch
              value={checkedNozzle}
              trackColor={{ true: "red", false: "blue" }}
              onChange={() => setCheckedNozzle(!checkedNozzle)}
            />
          ) : (
            <Checkbox
              status={checkedNozzle ? "checked" : "unchecked"}
              onPress={() => {
                setCheckedNozzle(!checkedNozzle);
              }}
            />
          )}
        </View>
        <View style={styles.insertView}>
          <Text>{t("fireEquipmentScreen.body")} Durumu</Text>
          {Platform.OS === "ios" ? (
            <Switch
              value={checkedBody}
              trackColor={{ true: "red", false: "blue" }}
              onChange={() => setCheckedBody(!checkedBody)}
            />
          ) : (
            <Checkbox
              status={checkedBody ? "checked" : "unchecked"}
              onPress={() => {
                setCheckedBody(!checkedBody);
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
            placeholder="Açıklama"
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
          backgroundColor: "#f3f3ff",
          width: "100%",
          paddingVertical: 15,
          marginVertical: 10,
        }}
      >
        <Text title="Ekipman Numarası:" subtitle={item.EquipmentNo} />
        <Card.Content>
          <Text style={styles.title}>
            {t("fireEquipmentScreen.cabinet")} Statü:{" "}
            {item.CabinetStatus === false ? (
              <FontAwesome color={"green"} size={20} name={"check"} />
            ) : (
              <FontAwesome color={"red"} size={20} name={"close"} />
            )}
          </Text>
          <Text style={styles.title}>
            {t("fireEquipmentScreen.valve")} Statü:{" "}
            {item.ValveStatus === false ? (
              <FontAwesome color={"green"} size={20} name={"check"} />
            ) : (
              <FontAwesome color={"red"} size={20} name={"close"} />
            )}
          </Text>
          <Text style={styles.title}>
            {t("fireEquipmentScreen.hose")} Statü:{" "}
            {item.HoseStatus === false ? (
              <FontAwesome color={"green"} size={20} name={"check"} />
            ) : (
              <FontAwesome color={"red"} size={20} name={"close"} />
            )}
          </Text>
          <Text style={styles.title}>
            {t("fireEquipmentScreen.nozzle")} Statü:{" "}
            {item.NozzleStatus === false ? (
              <FontAwesome color={"green"} size={20} name={"check"} />
            ) : (
              <FontAwesome color={"red"} size={20} name={"close"} />
            )}
          </Text>
          {/*<Text style={styles.title}>Tüp Basınç Statü: {item.TubePressureStatus===true?<AntDesign color={"green"} size={20} name={"check"}/>:<AntDesign color={"red"} size={20} name={"close"}/>}</Text>
                    <Text style={styles.title}>Tube Pin Statü: {item.TubePinStatus===true?<AntDesign color={"green"} size={20} name={"check"}/>:<AntDesign color={"red"} size={20} name={"close"}/>}</Text>*/}
          <Text style={styles.title}>
            {t("fireEquipmentScreen.controller")}: {item.CreatedEmployee}
          </Text>
          <Text style={styles.title}>MMS: {item.MMS_ID}</Text>
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
    getDialogInfo();
  }, []);

  useEffect(() => {
    getUser();
  }, []);

  // useEffect(() => {
  //   getChecklistHistory();
  // }, [qrValue, count]);

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

  //   if (!hasPermission) {
  //     return (
  //       <TouchableOpacity onPress={() => Linking.openSettings()}>
  //         <Text>Lütfen Ayarlardan Kamera İznini veriniz.</Text>
  //       </TouchableOpacity>
  //     );
  //   }

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
          isActive={scan}
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
              <Text style={styles.modalText}> Yangın Ekipman Bilgileri</Text>
              <Text>{qrValue}</Text>
              {pageAuthorization && data.length > 0 ? (
                data && data[0]?.isRecent === true ? (
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

export default FireEquipmentChecklist;
