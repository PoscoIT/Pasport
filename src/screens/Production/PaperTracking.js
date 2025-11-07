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
  BackHandler,
  Linking,
} from "react-native";

import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { Card } from "react-native-paper";
import { Button } from "@ui-kitten/components";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { sendUserInfoName } from "../../api/auth-api";
import NetInfo from "@react-native-community/netinfo";
import PickerModal from "react-native-picker-modal-view";
import { REACT_APP_SECRET_KEY } from "@env";
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from "react-native-vision-camera";
import { useIsFocused, useNavigation } from "@react-navigation/native";

const PaperTracking = () => {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState(0);
  const [netInfo, setNetInfo] = useState("");
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = { backgroundColor: "white", padding: 20 };
  const [scanner, setScanner] = useState("");
  const [ScanResult, setScanResult] = useState(false);
  const [scan, setScan] = useState(false);
  const [data, setData] = useState([]);
  const [qrValue, setQrValue] = useState("");
  const [qrValueManual, setQrValueManual] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [employeeID, setEmployeeId] = useState("");
  const { width, height } = Dimensions.get("screen");
  const [selectedReturnMessage, setSelectedReturnMessage] = useState("");
  const [returnMessageData, setReturnMessageData] = useState([]);
  const [countMethod, setCountMethod] = useState(false);
  const select = useRef();
  const url = "https://tstapp.poscoassan.com.tr:8443";
  const [returnMessage, setReturnMessage] = useState("");
  const device = useCameraDevice("back");
  const [hasPermission, setHasPermission] = useState(false);
  const isFocused = useIsFocused();
  const [checked, setChecked] = useState(false);

  const getPermission = async (a) => {
    const cameraPermission = await Camera.requestCameraPermission();

    if (cameraPermission === "granted") {
      setCountMethod(a);
      setScan(true);
      setScanResult(false);
    } else {
      Linking.openSettings();
    }
  };

  let scanAgain = (a = false) => {
    getPermission(a);
  };
  let scanAgain2 = () => {
    getPermission(false);
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

  const getMessageCategory = async () => {
    await axios
      .get(`${url}/Production/GetReturnMessageCategory`, {
        headers: {
          "auth-token": REACT_APP_SECRET_KEY,
        },
      })
      .then((res) => {
        setReturnMessageData(
          res?.data?.map(
            (item) =>
              [
                {
                  value: item.id,
                  Name: item.title,
                },
              ][0]
          )
        );
      })
      .catch((err) => {
        setModalVisible(false);
      });
  };

  const counterAction = async () => {
    const paper = {
      barcode: qrValue,
      empNo: employeeID,
    };
    const formBody = Object.keys(paper)
      .map(
        (key) => encodeURIComponent(key) + "=" + encodeURIComponent(paper[key])
      )
      .join("&");

    await axios
      .post(`${url}/Production/CountPaper`, formBody, {
        headers: {
          "auth-token": REACT_APP_SECRET_KEY,
        },
      })
      .then((res) => {
        if (res.data) {
          setCount(count + 1);
          setData([]);
          setQrValue("");
          setReturnMessage("");
          setSelectedReturnMessage("");

          Alert.alert("Başarılı", "Başarıyla Sayım Yapıldı");
        } else {
          Alert.alert("Hata", "Lütfen bağlantınızı kontrol ediniz.");
        }
      })
      .catch((err) => {})
      .finally(() => {
        setModalVisible(false);
      });
  };

  const dropPaper = async (status) => {
    if (status === 1 && selectedReturnMessage?.Name?.length === 0) {
      alert("Geri alma nedeni girmelisiniz");
      return;
    } else {
      const paper = {
        barcode: qrValue,
        empNo: employeeID,
        status: status,
        returnMessage: selectedReturnMessage.Name,
      };
      const formBody = Object.keys(paper)
        .map(
          (key) =>
            encodeURIComponent(key) + "=" + encodeURIComponent(paper[key])
        )
        .join("&");
      try {
        await axios
          .post(`${url}/Production/DropPaper`, formBody, {
            headers: {
              "auth-token": REACT_APP_SECRET_KEY,
            },
          })
          .then((res) => {
            if (res.data && res.data?.message === "Success") {
              alert("Başarıyla kaydedildi");
              setCount(count + 1);
              setData([]);
              setQrValue("");
              setReturnMessage("");
              setSelectedReturnMessage("");
            } else {
              alert("Bir hata oluştu. IT ile Görüşünüz");
            }
          })
          .catch((err) => alert("Bir hata oluştu. IT ile Görüşünüz"))
          .finally(() => {
            setModalVisible(false);
          });
      } catch (e) {
        alert("Bir hata oluştu. IT ile Görüşünüz");
      }
    }
  };

  const renderItem = ({ item }) => {
    return (
      <Card
        key={item.Id}
        style={{
          borderRadius: 20,
          backgroundColor: "#f2f2f2",
          width: "100%",
          height: 400,
          marginTop: 30,
        }}
      >
        <Text style={styles.modalText}>Kağıt Bilgileri</Text>
        <Text title="Barkod Numarası:" subtitle={item.Barcode} />
        <Card.Content>
          <Text style={styles.title}>Barkod Numarası: {item.Barcode}</Text>
          <Text style={styles.title}>
            Kağıt Tipi:{" "}
            {item.PaperTypeName?.toString()?.toLowerCase() === "new paper"
              ? "Sıfır Kağıt"
              : "İkinci El"}
          </Text>
          <Text style={styles.title}>Renk :{item.PaperType2}</Text>
          <Text style={styles.title}>Sarım Kodu :{item.StockCode}</Text>
          <Text style={styles.title}>Gram: {item.Gram}</Text>
          <Text style={styles.title}>Boyut: {item.Size}</Text>
          <Text style={styles.title}>Ağırlık: {item.Weight}</Text>

          {/*   <TextInput
                            style={styles.input1}
                            value={returnMessage}
                            onChangeText={(text) => setReturnMessage(text)}
                            placeholder="Geri Alma Nedeni"
                        ></TextInput>*/}
          {/* {returnMessageData?.map(item=>(
                                <SelectItem key={item.id} title={item.title} />
                            ))}*/}

          <View>
            {item.StatusCode === 1 && !countMethod ? (
              <PickerModal
                style={{ width: "100%", backgroundColor: "black" }}
                Autocomplete={false}
                items={returnMessageData}
                sortingLanguage={"tr"}
                showToTopButton={true}
                showAlphabeticalIndex={true}
                selected={selectedReturnMessage}
                autoGenerateAlphabeticalIndex={true}
                selectPlaceholderText={<Text>Geri Alma Nedeni Seçiniz</Text>}
                searchPlaceholderText={"Geri Alma Nedeni Seçiniz"}
                requireSelection={false}
                autoSort={true}
                onSelected={(item) => setSelectedReturnMessage(item)}
              />
            ) : null}
          </View>
        </Card.Content>

        <Card.Actions>
          <View
            style={{
              position: "absolute",
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
              bottom: -40,
              right: (width * 2) / 8,
            }}
          >
            {countMethod && item.IsStock != 1 ? (
              <Button
                style={{
                  backgroundColor: "#f1a641",
                  borderColor: "#f1a641",
                  width: 100,
                }}
                onPress={() => counterAction()}
              >
                Say
              </Button>
            ) : countMethod ? (
              <View style={{ flex: 1, alignItems: "center" }}>
                <FontAwesome name={"check"} size={60} color={"#105c1c"} />
                <Text style={{ fontSize: 16 }}>Sayım Yapıldı</Text>
              </View>
            ) : (
              <Button
                style={{
                  backgroundColor:
                    item.StatusCode === 0 ? "#1b9dce" : "#396E3C",
                  borderColor: item.StatusCode === 0 ? "#1b9dce" : "#396E3C",
                }}
                onPress={() => {
                  dropPaper(item.StatusCode);
                }}
              >
                {item.StatusCode === 0 ? "Düşüm Yap" : "Stoğa Al"}
              </Button>
            )}
          </View>

          {/*  :countMethod?
                    <View style={{flex:1,alignItems:"center"}}>
                        <FontAwesome name={"check"} size={60} color={"#105c1c"}/>
                        <Text style={{fontSize:16}}>Sayım Yapıldı</Text>
                    </View>:  <Button style={{backgroundColor:item.StatusCode===0?"#1b9dce":"#396E3C",borderColor:item.StatusCode===0?"#1b9dce":"#396E3C"}}  onPress={ ()=>{
                    dropPaper(item.StatusCode)

                }}>{item.StatusCode===0?"Düşüm Yap":"Stoğa Al"}</Button>*/}
        </Card.Actions>
      </Card>
    );
  };

  const filteredData = useMemo(
    () => async () => {
      if (qrValue.length > 0 || countMethod) {
        await axios
          .get(`${url}/Production/GetAllPaper`, {
            params: {
              barcode: qrValue,
            },
            headers: {
              "auth-token": REACT_APP_SECRET_KEY,
            },
          })
          .then((res) => {
            setData(res.data);
          })
          .catch((err) => {
            setModalVisible(false);
          });
      } else {
        setData([]);
      }
    },
    [qrValue, count]
  );

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        setScan(false);
        return true; // default davranışı engeller
      }
    );

    return () => backHandler.remove();
  }, [navigation]);

  useEffect(() => {
    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetInfo(state.details.ipAddress);
    });

    return () => {
      // Unsubscribe to network state updates
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    filteredData();
  }, [filteredData]);

  useEffect(() => {
    getMessageCategory();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {!scan && (
        <View
          style={{ flex: 1, flexDirection: "column", alignItems: "center" }}
        >
          <Button
            appearance={"outline"}
            style={styles.button3}
            onPress={() => scanAgain(false)}
          >
            <Text style={styles.buttonTextStyle}>Okut</Text>
          </Button>
          <Button
            appearance={"outline"}
            status={"danger"}
            style={styles.button3}
            onPress={() => {
              setModalVisible1(true);
              setCountMethod(false);
            }}
          >
            <Text style={styles.buttonTextStyle}>Manuel Okut</Text>
          </Button>
          <Button
            appearance={"outline"}
            status={"success"}
            style={styles.button4}
            onPress={() => scanAgain(true)}
          >
            <Text style={styles.buttonTextStyle}>Sayım Yap</Text>
          </Button>
          <Button
            appearance={"outline"}
            status={"warning"}
            style={styles.button4}
            onPress={() => {
              setModalVisible2(true);
              setCountMethod(true);
            }}
          >
            <Text style={styles.buttonTextStyle}>Manuel Sayım Yap</Text>
          </Button>
        </View>
      )}

      <View style={{ flex: 1, width: "100%", height: "100%" }}>
        {scan && (
          <View
            style={{
              width: 100,
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <Button
              appearance={"ghost"}
              onPress={scanAgain2}
              // accessoryLeft={(props) => (
              //   <Icon {...props} name={"arrow-back-outline"} />
              // )}
            >
              <Text>Geri</Text>
            </Button>
          </View>
        )}
        {scan && (
          <Camera
            style={StyleSheet.absoluteFill}
            codeScanner={codeScannner}
            device={device}
            isActive={scan}
          />
        )}

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
                    setScan(false);
                    setCount(count + 1);
                  }}
                >
                  <FontAwesome name={"close"} color="#000000" size={32} />
                </TouchableOpacity>
              </View>
              <Text style={styles.modalText}>Kağıt Bilgileri</Text>

              <FlatList
                removeClippedSubviews={true}
                keyboardShouldPersistTaps="handled"
                keyExtractor={(item) => item.Id}
                data={data}
                renderItem={renderItem}
                ListEmptyComponent={
                  <View>
                    <Text>İlgili Kağıt Bilgisi bulunamadı.</Text>
                  </View>
                }
              />
            </View>
          </View>
        </Modal>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible1}
          onRequestClose={() => {
            setModalVisible1(!modalVisible1);
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
                    setData([]);
                    setQrValue("");
                    setQrValueManual("");
                    setModalVisible1(!modalVisible1);
                  }}
                >
                  <FontAwesome name={"close"} color="#000000" size={32} />
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <View style={{ flex: 1, alignItems: "center" }}>
                  <TextInput
                    style={styles.input}
                    value={qrValueManual}
                    onChangeText={(text) => setQrValueManual(text)}
                    placeholder="Barkod Numarası Giriniz"
                  />
                  <Button
                    style={styles.button3}
                    onPress={() => {
                      setQrValue(qrValueManual);
                    }}
                  >
                    <Text style={styles.buttonTextStyle}>Sorgula</Text>
                  </Button>
                </View>
              </View>
              {qrValue.length > 0 ? (
                <FlatList
                  keyExtractor={(item) => item.Id}
                  data={data}
                  renderItem={renderItem}
                  ListEmptyComponent={
                    <View>
                      <Text>İlgili Kağıt Bilgisi bulunamadı.</Text>
                    </View>
                  }
                />
              ) : null}
            </View>
          </View>
        </Modal>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible2}
          onRequestClose={() => {
            setModalVisible2(!modalVisible2);
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
                    setData([]);
                    setQrValue("");
                    setQrValueManual("");
                    setModalVisible2(!modalVisible2);
                  }}
                >
                  <FontAwesome name={"close"} color="#000000" size={32} />
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <View style={{ flex: 1, alignItems: "center" }}>
                  <TextInput
                    style={styles.input}
                    value={qrValueManual}
                    onChangeText={(text) => setQrValueManual(text)}
                    placeholder="Barkod Numarası Giriniz"
                  />
                  <Button
                    style={styles.button3}
                    onPress={() => {
                      setQrValue(qrValueManual);
                    }}
                  >
                    <Text style={styles.buttonTextStyle}>Sorgula</Text>
                  </Button>
                </View>
              </View>
              {qrValue.length > 0 ? (
                <FlatList
                  keyExtractor={(item) => item.Id}
                  data={data}
                  renderItem={renderItem}
                  ListEmptyComponent={
                    <View>
                      <Text>İlgili Kağıt Bilgisi bulunamadı.</Text>
                    </View>
                  }
                />
              ) : null}
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

export default PaperTracking;
