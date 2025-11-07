import {
  Alert,
  Animated,
  Dimensions,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
} from "react-native";
import TextInput from "../../components/TextInput";
import {
  ActivityIndicator,
  Button,
  Portal,
  Provider,
  Dialog,
  DefaultTheme,
} from "react-native-paper";
import { theme } from "../../core/theme";
import React, { useEffect, useRef, useState } from "react";
import PickerModal from "react-native-picker-modal-view";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import {
  check,
  PERMISSIONS,
  request,
  RESULTS,
  openSettings,
} from "react-native-permissions";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import { REACT_APP_SECRET_KEY } from "@env";

import { sendUserInfoName } from "../../api/auth-api";

import NetInfo from "@react-native-community/netinfo";

const { width } = Dimensions.get("window");
const MyMachineScreen = ({ navigation }) => {
  const [finishDate, setFinishDate] = useState(new Date());
  const scrollViewRef = useRef(null);
  const [netInfo, setNetInfo] = useState("");
  const isLocalIP = netInfo?.startsWith("172");

  const [categoryList, setCategoryList] = useState([]);
  const url = "https://tstapp.poscoassan.com.tr:8443";

  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState(0);
  const [equipmentText, setEquipmentText] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const now = new Date();
  const [errorCurrentProblem, setErrorCurrentProblem] = useState("");
  const [mainOperatorList, setMainOperatorList] = useState([]);
  const [currentProblem, setCurrentProblem] = useState("");
  const [finishAction, setFinishAction] = useState("");
  const [filePath, setFilePath] = useState("");
  const [filePath2, setFilePath2] = useState("");
  const [visible, setVisible] = React.useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const hideDialog = () => setVisible(false);
  const [visible2, setVisible2] = React.useState(false);
  const hideDialog2 = () => setVisible2(false);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [selectedMainOperator, setSelectedMainOperator] = useState("");

  const requestCameraPermission = async () => {
    const permission =
      Platform.OS === "android"
        ? PERMISSIONS.ANDROID.CAMERA
        : PERMISSIONS.IOS.CAMERA;

    return check(permission)
      .then((result) => {
        switch (result) {
          case RESULTS.DENIED:
            return request(permission, {
              title: "Camera Permission",
              message: "TST App Kameranıza ulaşmak istiyor.",
            }).then((requestResult) => {
              if (requestResult === RESULTS.GRANTED) {
                return true;
              } else {
                return false;
              }
            });

          case RESULTS.GRANTED:
            return true;
          case RESULTS.LIMITED:
            return true;

          case RESULTS.BLOCKED:
            return false;

          default:
            return false;
        }
      })
      .catch((error) => {
        console.error("Permission check error:", error); // Hata yakalama
        return false;
      });
  };

  const requestExternalWritePermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "External Storage Write Permission",
            message: "TST App Galerinize ulaşmak istiyor.",
          }
        );

        // granted değeri PermissionsAndroid.RESULTS.GRANTED ise true döndür
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        }
        // Eğer kullanıcı "never_ask_again" işaretlediyse, ayarlara yönlendirme
        else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          Alert.alert(
            "İzin Gerekli",
            "Bu özellik için depolama izni gereklidir. Lütfen ayarlarınızdan izni etkinleştirin.",
            [
              { text: "İptal", style: "cancel" },
              {
                text: "Ayarları Aç",
                onPress: async () => {
                  openSettings();
                },
              },
            ]
          );
        } else {
          // İzin reddedildiyse, false döndür
          return false;
        }
      } catch (err) {
        console.error("İzin isteme hatası:", err);
        return false;
      }
    } else {
      // iOS için true döndür
      return true;
    }
  };
  const captureImage = async (type) => {
    let options = {
      mediaType: type,
      maxWidth: 400,
      maxHeight: 550,
      includeBase64: true,
      quality: 1,
      videoQuality: "low",
      durationLimit: 30,
      saveToPhotos: true,
    };
    let isCameraPermitted = await requestCameraPermission();
    //   let isStoragePermitted = await requestExternalWritePermission();
    if (isCameraPermitted) {
      await launchCamera(options, (response) => {
        if (response.didCancel) {
          return;
        } else if (response.errorCode == "camera_unavailable") {
          alert("Camera not available on device");
          return;
        } else if (response.errorCode == "permission") {
          alert("Permission not satisfied");
          return;
        } else if (response.errorCode == "others") {
          alert(response.errorMessage);
          return;
        }
        setVisible(false);
        setFilePath(response.assets[0]);
      });
    }
  };

  const chooseFile = async (type) => {
    let options = {
      mediaType: type,
      maxWidth: 400,
      includeBase64: true,
      maxHeight: 550,
      quality: 1,
    };
    await launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        return;
      } else if (response.errorCode == "camera_unavailable") {
        alert("Camera not available on device");
        return;
      } else if (response.errorCode == "permission") {
        alert("Permission not satisfied");
        return;
      } else if (response.errorCode == "others") {
        alert(response.errorMessage);
        return;
      }
      setVisible(false);
      setFilePath(response.assets[0]);
    });
  };
  const captureImage2 = async (type) => {
    let options = {
      mediaType: type,
      maxWidth: 400,
      maxHeight: 550,
      includeBase64: true,
      quality: 1,
      videoQuality: "low",
      durationLimit: 30,
      saveToPhotos: true,
    };
    let isCameraPermitted = await requestCameraPermission();
    //  let isStoragePermitted = await requestExternalWritePermission();
    if (isCameraPermitted) {
      await launchCamera(options, (response) => {
        if (response.didCancel) {
          return;
        } else if (response.errorCode == "camera_unavailable") {
          alert("Camera not available on device");
          return;
        } else if (response.errorCode == "permission") {
          alert("Permission not satisfied");
          return;
        } else if (response.errorCode == "others") {
          alert(response.errorMessage);
          return;
        }
        setVisible2(false);
        setFilePath2(response.assets[0]);
      });
    }
  };
  const getUser = async () => {
    await sendUserInfoName((sendResponse) => {
      setEmployeeId(sendResponse.empSicil);
      setEmployeeName(sendResponse.uname);
    });
  };
  const chooseFile2 = async (type) => {
    let options = {
      mediaType: type,
      maxWidth: 400,
      includeBase64: true,
      maxHeight: 550,
      quality: 1,
    };
    await launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        return;
      } else if (response.errorCode == "camera_unavailable") {
        alert("Camera not available on device");
        return;
      } else if (response.errorCode == "permission") {
        alert("Permission not satisfied");
        return;
      } else if (response.errorCode == "others") {
        alert(response.errorMessage);
        return;
      }
      setVisible2(false);
      setFilePath2(response.assets[0]);
    });
  };
  const sendData = async () => {
    const formdata = new FormData();
    formdata.append("categoryID", selectedCategory?.value);
    formdata.append("equipmentID", equipmentText);
    formdata.append("currentProblem", currentProblem);
    formdata.append("sicilNo", employeeId);
    formdata.append("teamID", departmentList[0]?.TeamID);
    formdata.append("hatID", departmentList[0]?.SubTeamID);
    formdata.append("employeeName", employeeName);
    formdata.append("mainOperator", selectedMainOperator?.value);

    formdata.append("finishAction", finishAction);
    formdata.append("MyMachineAfter", {
      name: filePath2?.fileName,
      type: filePath2?.type,
      uri:
        Platform.OS === "android"
          ? filePath2?.uri
          : filePath2?.uri.replace("file://", ""),
    });

    formdata.append("MyMachine", {
      name: filePath.fileName,
      type: filePath.type,
      uri:
        Platform.OS === "android"
          ? filePath.uri
          : filePath.uri.replace("file://", ""),
    });

    await axios
      .post(`${url}/WorkOrder/CreateMyMachine`, formdata, {
        headers: {
          Accept: "application/x-www-form-urlencoded",
          "auth-token": REACT_APP_SECRET_KEY,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data.status === "success") {
          alert("My Machine başarıyla oluşturuldu");

          setSelectedCategory([]);
          setCurrentProblem("");
          setFilePath("");
          setFilePath2("");
          setFinishAction("");
          setFinishDate("");
        } else {
          alert("My Machine Oluştururken hatayla karşılaşıldı", res);
        }
      })
      .catch((err) => {
        alert("My Machine Oluştururken hatayla karşılaşıldı", err);
      });
  };

  const sendForm = async () => {
    if (
      !filePath ||
      !filePath2 ||
      !currentProblem ||
      !selectedCategory ||
      !equipmentText ||
      !finishAction
    ) {
      alert("Lütfen Tüm Alanları Doldurunuz.");
    } else {
      sendData();
    }
  };
  const getCategory = async () => {
    try {
      await axios
        .get(`${url}/WorkOrder/GetMyMachineCategory`, {
          headers: {
            "auth-token": REACT_APP_SECRET_KEY,
          },
        })
        .then((res) => {
          setCategoryList(
            res.data?.map(
              (item) =>
                [
                  {
                    value: item.ID,
                    Name: item.MyMachType,
                  },
                ][0]
            )
          );
        })
        .catch((t) => console.warn("selammm"));
    } catch (e) {
      setCategoryList([]);
    }
  };
  const getDepartmentList = async () => {
    try {
      if (employeeId) {
        await axios
          .get(`${url}/UserAccount/GetDepartmentInfo`, {
            params: {
              sicilNo: employeeId,
            },
            headers: {
              "auth-token": REACT_APP_SECRET_KEY,
            },
          })
          .then((res) => {
            setDepartmentList(res.data[0]);
          })
          .catch((t) => console.warn("selammm"));
      }
    } catch (e) {
      setDepartmentList([]);
    }
  };

  const getMainOperator = async () => {
    try {
      if (employeeId) {
        await axios
          .get(`${url}/UserAccount/ListUserMainOperator`, {
            params: {
              sicilNo: employeeId,
            },
            headers: {
              "auth-token": REACT_APP_SECRET_KEY,
            },
          })
          .then((res) => {
            setMainOperatorList(
              res?.data?.map(
                (item) =>
                  [
                    {
                      value: item.EmployeeID,
                      Name: item.NameSurname,
                    },
                  ][0]
              )
            );
          })
          .catch((t) => console.warn("selammm"));
      }
    } catch (e) {
      setMainOperatorList([]);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    getCategory();
  }, [netInfo]);
  useEffect(() => {
    getMainOperator();
  }, [employeeId]);

  useEffect(() => {
    getDepartmentList();
  }, [employeeId]);

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

  return (
    <KeyboardAvoidingView>
      <ScrollView ref={scrollViewRef}>
        <Provider>
          <View style={styles.container}>
            <View style={styles.form}>
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View>
                  <View>
                    <Text>
                      <Text style={{ color: "red" }}> *</Text>Kategori
                    </Text>
                  </View>
                  <PickerModal
                    style={{ width: "100%", color: "black" }}
                    Autocomplete={false}
                    items={categoryList}
                    sortingLanguage={"tr"}
                    showToTopButton={true}
                    selected={selectedCategory}
                    showAlphabeticalIndex={true}
                    autoGenerateAlphabeticalIndex={true}
                    selectPlaceholderText={<Text>Kategori Seçiniz</Text>}
                    searchPlaceholderText={"Kategori Seçiniz"}
                    requireSelection={false}
                    autoSort={true}
                    onSelected={(item) => {
                      setSelectedCategory(item);
                    }}
                  />
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View>
                  <Text>
                    <Text style={{ color: "red" }}> *</Text>
                    Ekipman
                  </Text>
                  <TextInput
                    placeholder="Ekipman Yazınız"
                    theme={DefaultTheme}
                    onChangeText={(text) => {
                      setEquipmentText(text);
                    }}
                    value={equipmentText}
                    onFocus={() => scrollViewRef.current?.scrollToEnd()}
                    returnKeyType="next"
                    autoCapitalize="none"
                  />

                  <PickerModal
                    style={{ width: "100%", backgroundColor: "black" }}
                    Autocomplete={false}
                    items={mainOperatorList}
                    sortingLanguage={"tr"}
                    showToTopButton={true}
                    showAlphabeticalIndex={true}
                    selected={selectedMainOperator}
                    autoGenerateAlphabeticalIndex={true}
                    selectPlaceholderText={<Text>Main Operator Seçiniz</Text>}
                    searchPlaceholderText={"Main Operator Seçiniz"}
                    requireSelection={false}
                    autoSort={true}
                    onSelected={(item) => setSelectedMainOperator(item)}
                  />
                </View>
              </TouchableWithoutFeedback>

              <TextInput
                theme={DefaultTheme}
                onChangeText={(text) => {
                  setErrorCurrentProblem(text ? "" : "Bu alan zorunludur");
                  setCurrentProblem(text);
                }}
                value={currentProblem}
                onFocus={() => scrollViewRef.current?.scrollToEnd()}
                label={
                  <Text>
                    <Text style={{ color: "red" }}> *</Text>
                    Mevcut Durum/Sorun
                  </Text>
                }
                returnKeyType="next"
                autoCapitalize="none"
              />

              {filePath?.uri ? (
                <View
                  style={{
                    flex: 1,
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    flexDirection: "row",
                  }}
                >
                  <View style={{ width: action === 0 ? "100%" : "50%" }}>
                    <Animated.Image
                      source={{ uri: filePath.uri }}
                      style={{ height: 150, resizeMode: "stretch" }}
                    />
                  </View>
                </View>
              ) : null}
              <View
                style={{
                  flex: 1,
                  width: "100%",

                  marginVertical: 5,
                }}
              >
                <Icon.Button
                  name="image"
                  backgroundColor={"#69b5fa"}
                  onPress={() => setVisible(true)}
                >
                  <Text style={styles.textStyle}>Öncesi</Text>
                </Icon.Button>

                <Portal>
                  <Dialog visible={visible} onDismiss={hideDialog}>
                    <Dialog.Content>
                      <Button
                        name="image"
                        backgroundColor={"#69b5fa"}
                        onPress={() => chooseFile("photo")}
                      >
                        <Icon name={"image"} />
                        Galeri
                      </Button>
                      <Button
                        name="image"
                        backgroundColor={"#69b5fa"}
                        onPress={() => captureImage("photo")}
                      >
                        <Icon name={"camera"} />
                        Kamera
                      </Button>
                    </Dialog.Content>
                    <Dialog.Actions>
                      <Button onPress={hideDialog}>Kapat</Button>
                    </Dialog.Actions>
                  </Dialog>
                </Portal>
                <Portal>
                  <Dialog visible={visible2} onDismiss={hideDialog2}>
                    <Dialog.Content>
                      <Button
                        name="image"
                        backgroundColor={"#69b5fa"}
                        onPress={() => chooseFile2("photo")}
                      >
                        <Icon name={"image"} />
                        Galeri
                      </Button>
                      <Button
                        name="image"
                        backgroundColor={"#69b5fa"}
                        onPress={() => captureImage2("photo")}
                      >
                        <Icon name={"camera"} />
                        Kamera
                      </Button>
                    </Dialog.Content>
                    <Dialog.Actions>
                      <Button onPress={hideDialog2}>Kapat</Button>
                    </Dialog.Actions>
                  </Dialog>
                </Portal>
              </View>

              <>
                <TextInput
                  theme={DefaultTheme}
                  onChangeText={(text) => setFinishAction(text)}
                  value={finishAction}
                  onFocus={() => scrollViewRef.current?.scrollToEnd()}
                  label={
                    <Text>
                      <Text style={{ color: "red" }}> *</Text>
                      Alınan Aksiyon
                    </Text>
                  }
                  returnKeyType="next"
                  autoCapitalize="none"
                />
                <View style={{ width: "100%" }}>
                  <Icon.Button
                    name="image"
                    backgroundColor={"#69b5fa"}
                    onPress={() => setVisible2(true)}
                  >
                    <Text style={styles.textStyle}>Sonrası Fotoğraf</Text>
                  </Icon.Button>
                </View>
                {filePath2?.uri ? (
                  <View style={{ width: "100%", marginHorizontal: 5 }}>
                    <Animated.Image
                      source={{ uri: filePath2.uri }}
                      style={{ height: 150, resizeMode: "stretch" }}
                    />
                  </View>
                ) : null}
              </>

              <View
                style={{ flex: 1, alignItems: "center", marginVertical: 10 }}
              >
                {loading ? (
                  <ActivityIndicator
                    animating={true}
                    color={theme.colors.primary}
                  />
                ) : (
                  <Button
                    style={styles.button}
                    disabled={loading}
                    onPress={sendForm}
                    mode="contained"
                  >
                    Oluştur
                  </Button>
                )}
              </View>
            </View>
          </View>
        </Provider>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e3e7e8",
    width: "100%",
    alignItems: "flex-start",
    marginBottom: 40,
  },
  select: {
    margin: 5,
    height: 60,
    width: width - 10,
  },
  form: {
    backgroundColor: "white",
    width: width,
    padding: 10,

    borderRadius: 2,
  },
  buttonStyle: {
    alignItems: "center",
    backgroundColor: "#69b5fa",
    borderRadius: 10,
    padding: 5,
    color: "white",
    marginVertical: 10,
  },
  textStyle: {
    padding: 10,
    color: "white",
    textAlign: "center",
  },
  button: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    width: "60%",
    padding: 5,
    color: "white",
  },
  buttonText: {
    textAlign: "center",
    fontSize: 15,
    color: "#fff",
  },
});
export default MyMachineScreen;
