import {
  View,
  Text,
  TextInput as NativeTextInput,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  StyleSheet,
  Dimensions
} from "react-native";

import {
  Provider,
  Portal,
  Dialog,
  Button as PaperButton,
    ActivityIndicator,
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
  <Provider>
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        ref={scrollViewRef}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.form}>
          <View style={styles.header}>
            <View style={styles.headerAccent} />

            <Text style={styles.title}>Aksiyon Kaydı</Text>
            <Text style={styles.subtitle}>
              Mevcut sorunu ve uyguladığınız aksiyonu belirtin.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ekipman Bilgileri</Text>

            <View style={styles.field}>
              <Text style={styles.label}>
                Kategori <Text style={styles.required}>*</Text>
              </Text>

              <View style={styles.pickerContainer}>
                <PickerModal
                  style={styles.picker}
                  Autocomplete={false}
                  items={categoryList}
                  sortingLanguage="tr"
                  showToTopButton
                  selected={selectedCategory}
                  showAlphabeticalIndex
                  autoGenerateAlphabeticalIndex
                  selectPlaceholderText={<Text>Kategori Seçiniz</Text>}
                  searchPlaceholderText="Kategori Seçiniz"
                  requireSelection={false}
                  autoSort
                  onSelected={(item) => {
                    Keyboard.dismiss();
                    setSelectedCategory(item);
                  }}
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>
                Ekipman <Text style={styles.required}>*</Text>
              </Text>

              <NativeTextInput
                placeholder="Ekipman yazınız"
                placeholderTextColor="#94A3B8"
                style={styles.input}
                value={equipmentText}
                onChangeText={setEquipmentText}
                autoCapitalize="none"
                accessibilityLabel="Ekipman"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Main Operator</Text>

              <View style={styles.pickerContainer}>
                <PickerModal
                  style={styles.picker}
                  Autocomplete={false}
                  items={mainOperatorList}
                  sortingLanguage="tr"
                  showToTopButton
                  showAlphabeticalIndex
                  selected={selectedMainOperator}
                  autoGenerateAlphabeticalIndex
                  selectPlaceholderText={
                    <Text>Main Operator Seçiniz</Text>
                  }
                  searchPlaceholderText="Main Operator Seçiniz"
                  requireSelection={false}
                  autoSort
                  onSelected={(item) => {
                    Keyboard.dismiss();
                    setSelectedMainOperator(item);
                  }}
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepText}>1</Text>
              </View>

              <Text style={styles.sectionHeading}>
                Mevcut Durum / Sorun
                <Text style={styles.required}> *</Text>
              </Text>
            </View>

            <NativeTextInput
              multiline
              numberOfLines={5}
              style={[styles.input, styles.textArea]}
              value={currentProblem}
              onChangeText={(text) => {
                setErrorCurrentProblem(text ? "" : "Bu alan zorunludur");
                setCurrentProblem(text);
              }}
              placeholder="Mevcut durumu veya tespit edilen sorunu yazınız."
              placeholderTextColor="#94A3B8"
              autoCapitalize="sentences"
              accessibilityLabel="Mevcut Durum / Sorun"
            />

            {!!filePath?.uri && (
              <View style={styles.photoContainer}>
                <Text style={styles.photoLabel}>ÖNCESİ</Text>
                <Image
                  source={{ uri: filePath.uri }}
                  style={styles.photo}
                  resizeMode="contain"
                  accessibilityLabel="Aksiyon öncesi fotoğraf"
                />
              </View>
            )}

            <PaperButton
              mode="outlined"
              textColor="#0B337C"
              style={styles.photoButton}
              contentStyle={styles.buttonContent}
              onPress={() => {
                Keyboard.dismiss();
                setVisible(true);
              }}
            >
              {filePath?.uri
                ? "Öncesi Fotoğrafını Değiştir"
                : "Öncesi Fotoğrafı Ekle"}
            </PaperButton>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepText}>2</Text>
              </View>

              <Text style={styles.sectionHeading}>
                Alınan Aksiyon
                <Text style={styles.required}> *</Text>
              </Text>
            </View>

            <NativeTextInput
              multiline
              numberOfLines={5}
              style={[styles.input, styles.textArea]}
              value={finishAction}
              onChangeText={setFinishAction}
              placeholder="Sorunu gidermek için yapılan işlemleri yazınız."
              placeholderTextColor="#94A3B8"
              autoCapitalize="sentences"
              accessibilityLabel="Alınan Aksiyon"
            />

            {!!filePath2?.uri && (
              <View style={styles.photoContainer}>
                <Text style={styles.photoLabel}>SONRASI</Text>
                <Image
                  source={{ uri: filePath2.uri }}
                  style={styles.photo}
                  resizeMode="contain"
                  accessibilityLabel="Aksiyon sonrası fotoğraf"
                />
              </View>
            )}

            <PaperButton
              mode="outlined"
              textColor="#0B337C"
              style={styles.photoButton}
              contentStyle={styles.buttonContent}
              onPress={() => {
                Keyboard.dismiss();
                setVisible2(true);
              }}
            >
              {filePath2?.uri
                ? "Sonrası Fotoğrafını Değiştir"
                : "Sonrası Fotoğrafı Ekle"}
            </PaperButton>
          </View>

          <PaperButton
            mode="contained"
            buttonColor="#0B337C"
            textColor="#FFFFFF"
            style={styles.submitButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.submitLabel}
            loading={loading}
            disabled={loading}
            onPress={sendForm}
          >
            Oluştur
          </PaperButton>
        </View>
      </ScrollView>

      <Portal>
        <Dialog
          visible={visible}
          onDismiss={hideDialog}
          style={styles.dialog}
        >
          <Dialog.Title style={styles.dialogTitle}>
            Öncesi Fotoğrafı
          </Dialog.Title>

          <Dialog.Content>
            <PaperButton
              mode="outlined"
              textColor="#0B337C"
              style={styles.dialogOption}
              contentStyle={styles.buttonContent}
              onPress={() => chooseFile("photo")}
            >
              Galeri
            </PaperButton>

            <PaperButton
              mode="outlined"
              textColor="#0B337C"
              style={styles.dialogOption}
              contentStyle={styles.buttonContent}
              onPress={() => captureImage("photo")}
            >
              Kamera
            </PaperButton>
          </Dialog.Content>

          <Dialog.Actions>
            <PaperButton textColor="#64748B" onPress={hideDialog}>
              Kapat
            </PaperButton>
          </Dialog.Actions>
        </Dialog>

        <Dialog
          visible={visible2}
          onDismiss={hideDialog2}
          style={styles.dialog}
        >
          <Dialog.Title style={styles.dialogTitle}>
            Sonrası Fotoğrafı
          </Dialog.Title>

          <Dialog.Content>
            <PaperButton
              mode="outlined"
              textColor="#0B337C"
              style={styles.dialogOption}
              contentStyle={styles.buttonContent}
              onPress={() => chooseFile2("photo")}
            >
              Galeri
            </PaperButton>

            <PaperButton
              mode="outlined"
              textColor="#0B337C"
              style={styles.dialogOption}
              contentStyle={styles.buttonContent}
              onPress={() => captureImage2("photo")}
            >
              Kamera
            </PaperButton>
          </Dialog.Content>

          <Dialog.Actions>
            <PaperButton textColor="#64748B" onPress={hideDialog2}>
              Kapat
            </PaperButton>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </KeyboardAvoidingView>
  </Provider>
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
    paddingBottom: 40,
  },

  form: {
    width: "100%",
    maxWidth: 680,
    alignSelf: "center",
    paddingHorizontal: 16,
  },

  header: {
    paddingHorizontal: 4,
    marginBottom: 24,
  },

  headerAccent: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#0B337C",
    marginBottom: 16,
  },

  title: {
    color: "#172B4D",
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 33,
    marginBottom: 8,
  },

  subtitle: {
    color: "#64748B",
    fontSize: 14,
    lineHeight: 23,
  },

  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E3EAF4",
    padding: 18,
    marginBottom: 16,
  },

  sectionTitle: {
    color: "#172B4D",
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 25,
    marginBottom: 4,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  stepBadge: {
    minWidth: 30,
    minHeight: 30,
    borderRadius: 9,
    padding: 5,
    backgroundColor: "#EAF0FA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  stepText: {
    color: "#0B337C",
    fontSize: 14,
    fontWeight: "700",
  },

  sectionHeading: {
    flex: 1,
    color: "#172B4D",
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 24,
  },

  field: {
    marginTop: 18,
  },

  label: {
    color: "#475569",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 20,
    marginBottom: 8,
  },

  required: {
    color: "#DC2626",
  },

  pickerContainer: {
    minHeight: 52,
    justifyContent: "center",
    backgroundColor: "#F8FAFD",
    borderWidth: 1,
    borderColor: "#DCE5F3",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  picker: {
    width: "100%",
    color: "#334155",
  },

  input: {
    minHeight: 52,
    backgroundColor: "#F8FAFD",
    borderWidth: 1,
    borderColor: "#DCE5F3",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#334155",
    fontSize: 14,
  },

  textArea: {
    minHeight: 140,
    textAlignVertical: "top",
    lineHeight: 23,
  },

  photoContainer: {
    marginTop: 16,
    backgroundColor: "#F8FAFD",
    borderWidth: 1,
    borderColor: "#E3EAF4",
    borderRadius: 12,
    overflow: "hidden",
  },

  photoLabel: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
  },

  photo: {
    width: "100%",
    height: 210,
  },

  photoButton: {
    marginTop: 16,
    borderRadius: 10,
    borderColor: "#CBD8EE",
  },

  buttonContent: {
    minHeight: 52,
    paddingVertical: 5,
  },

  submitButton: {
    borderRadius: 12,
    marginTop: 6,
  },

  submitLabel: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0,
  },

  dialog: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
  },

  dialogTitle: {
    color: "#172B4D",
    fontSize: 19,
    fontWeight: "700",
  },

  dialogOption: {
    borderRadius: 10,
    borderColor: "#DCE5F3",
    marginTop: 12,
  },
});
export default MyMachineScreen;
