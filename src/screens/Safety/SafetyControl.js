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
  StatusBar,
  Switch
} from "react-native";

import TextInput from "../../components/TextInput";
import {
  ActivityIndicator,
  Button,
  Portal,
  Provider,
  Dialog,
  DefaultTheme,
  IconButton,
  Checkbox
} from "react-native-paper";
import { theme } from "../../core/theme";
import React, { useEffect, useMemo, useRef, useState } from "react";
import PickerModal from "react-native-picker-modal-view";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { sendUserInfoName } from "../../api/auth-api";
import { check, PERMISSIONS, request, RESULTS } from "react-native-permissions";
import axios from "axios";
import NetInfo from "@react-native-community/netinfo";
import Icon from "react-native-vector-icons/FontAwesome";
import { Radio, RadioGroup } from "@ui-kitten/components";
import i18n from "../../languages/i18n";
import { REACT_APP_SECRET_KEY } from "@env";
import { Camera, useCameraDevice, useCodeScanner } from "react-native-vision-camera";

const { height, width } = Dimensions.get("window");
const SafetyControl = ({ navigation }) => {
  const scrollViewRef = useRef(null);
  const [netInfo, setNetInfo] = useState("");

  const [qrArea, setQRArea] = useState([]);
  const url = "https://tstapp.poscoassan.com.tr:8443";
 //const url = "http://10.0.2.2:5504"
  const [employeeId, setEmployeeId] = useState("");
  const [userLine, setUserLine] = useState("");
  const [loading, setLoading] = useState(false);
  const [opinionImprovement, setOpinionImprovement] = useState("");
  const [accidentType, setAccidentType] = useState([]);
  const [defectType, setDefectType] = useState([]);
  const [defectTypeDetails, setDefectTypeDetails] = useState([]);
  const [name, setName] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [qrValue,setQrValue] = useState("")
      const device = useCameraDevice("back");
  // const [action, setAction] = useState(0);
  const [defectValue, setDefectValue] = useState("");
  const [defectDetailsValue, setDefectDetailsValue] = useState("");
  const [selectedQRArea, setSelectedQRArea] = useState("");
  const [checked, setChecked] = useState(false);
  const [probability, setProbability] = useState(null); // Olasılık
  const [severity, setSeverity] = useState(null);       // Şiddet
  const [frequency, setFrequency] = useState(null);     // Frekans
  const [area, setArea] = useState("");
  const [content, setContent] = useState("");
  const [filePath, setFilePath] = useState("");
  const [filePath2, setFilePath2] = useState("");
  const [visible, setVisible] = useState(false);
  const hideDialog = () => setVisible(false);
  const [visible2, setVisible2] = useState(false);
  const hideDialog2 = () => setVisible2(false);
  const [visible3, setVisible3] = useState(false);
  const hideDialog3 = () => setVisible3(false);
    const [qrCodeValue, setQrCodeValue] = useState([]);
    const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);
    const [isRelatedWorkMe,setIsRelatedWorkMe] = useState(false);
const requestCameraPermission = async () => {
  const permission =
    Platform.OS === "android"
      ? PERMISSIONS.ANDROID.CAMERA
      : PERMISSIONS.IOS.CAMERA;

  try {
    const result = await request(permission);

    console.log("Camera permission:", result);

    if (result === RESULTS.GRANTED) {
      setCameraPermissionGranted(true);
      return true;
    }

    setCameraPermissionGranted(false);

    if (result === RESULTS.BLOCKED) {
      Alert.alert(
        "Kamera İzni Gerekli",
        "Kamera kullanabilmek için Ayarlar'dan kamera izni vermen gerekiyor.",
        [
          {
            text: "İptal",
            style: "cancel",
          },
          {
            text: "Ayarlar",
            onPress: openSettings,
          },
        ]
      );
    }

    return false;
  } catch (error) {
    console.log("Camera permission error:", error);
    setCameraPermissionGranted(false);
    return false;
  }
};

  const requestExternalWritePermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "External Storage Write Permission",
            message: "App needs write permission",
          }
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        alert("Write permission err", err);
      }
      return false;
    } else return true;
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



  const addForm = async () => {
    setLoading(true);
    let formdata = new FormData();
   
    if (
      qrValue && 
      content &&
      filePath &&
      probability !== null &&
      severity !== null &&
      frequency !== null 
    
    ) {
    
        formdata.append("EmployeeID", employeeId);
        formdata.append("QRArea", qrValue);
     
        formdata.append("DefectContent", content);
        formdata.append("isRelatedWorkMe",isRelatedWorkMe)
 
        formdata.append("Status", 21);
        formdata.append("ISGCheckList", {
          name: filePath.fileName,
          type: filePath.type,
          uri:
            Platform.OS === "android"
              ? filePath.uri
              : filePath.uri.replace("file://", ""),
        });
      
        formdata.append("InspectionType", 0);
        formdata.append("OpinionOnImprovementMeasurement", opinionImprovement);
     
        formdata.append("ClassificationOfActions", 0);
        formdata.append("RiskLevel", 0);
        formdata.append("ProbabilityLevel", 6 - probability);
        formdata.append("SeverityLevel", 6 - severity);
        formdata.append("FrequencyLevel", 6 - frequency);
      
   
        formdata.append("AccidentPreventionType", 0);

        await axios
          .post(`${url}/ISG/ISGInspectionCheckListData`, formdata, {
            headers: {
              Accept: "application/x-www-form-urlencoded",
              "auth-token": REACT_APP_SECRET_KEY,
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
         
            if (res.data?.status === "Success") {
              Alert.alert(
                languageData[40]?.Name,
                languageData[41]?.Name,
                [
                  {
                    text: languageData[39]?.Name,
                  },
                ],
                { cancelable: false }
              );
        
              setQRArea("");
              setContent("");
              setFilePath("");
              setFilePath2("");
              setProbability(null);
              setSeverity(null);
              setFrequency(null);
              setChecked(false);
              setLoading(false);
              navigation.navigate("SafetyMainScreen");
            } else {
              Alert.alert(
                languageData[38]?.Name,
                languageData[42]?.Name,
                [
                  {
                    text: languageData[39]?.Name,
                  },
                ],
                { cancelable: false }
              );
              setLoading(false);
            }
          })
          .catch((err) => console.log(err))
          .finally(() => setLoading(false));
    } else {
      Alert.alert(
        languageData[38]?.Name,
        languageData[37]?.Name,
        [
          {
            text: languageData[39]?.Name,
          },
        ],
        { cancelable: false }
      );
      setLoading(false);
    }
  };
  const getQrValue = async () => {

    setLoading(true);
  
    await axios
      .get(
        `${url}/Common/ListISGQrData/${
          qrValue
        }`,
        {
     
         
           headers: {
          "Content-type": "application/json",
          "auth-token": REACT_APP_SECRET_KEY,
        },
        },
      )
      .then((res) => {
       
        if (res.data?.status === "success") {
          setQrCodeValue(res.data.data);
      
        } else {
          setIsActive(false);

          setQrCodeValue([]);
        }
      })
      .catch((err) => {
             console.log(err)
        setQrCodeValue([]);
      })
      .finally(() => setLoading(false));
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
        console.log(codes)
        setQrValue(codes[0]?.value);
        setIsActive(false);
      
        if (qrValue) getQrValue();
      },
      requestCameraPermission: true,
    });
  const getAccidentData = async () => {
    await axios
      .get(`${url}/Common/ListISGControlsData`, {
        headers: {
          "Content-type": "application/json",
          "auth-token": REACT_APP_SECRET_KEY,
        },
      })
      .then(async (res) => {
        setAccidentType(
          res.data.map(
            (item) =>
              [
                {
                  value: item.ID,
                  Name: i18n.language === "tr" ? item.NameTR : item.Name,
                  Type: item.Type,
                  Active: item.Active,
                  ForISG: item.ForISG,
                },
              ][0]
          )
        );
      })
      .catch((err) => console.warn(err));
  };
 

  const getDefectDetailsData = async () => {
    await axios
      .get(`${url}/Common/ListISGDefectDetailData`, {
        headers: {
          "Content-type": "application/json",
          "auth-token": REACT_APP_SECRET_KEY,
        },
      })
      .then(async (res) => {
        setDefectTypeDetails(
          res.data.map(
            (item) =>
              [
                {
                  value: item.ID,
                  Name: i18n.language === "tr" ? item.NameTR : item.Name,
                  Type: item.Type,
                },
              ][0]
          )
        );
      })
      .catch((err) => console.warn(err));
  };
  // const getHttps2 = async () => {
  //   await axios
  //     .get(`${url}/Common/ListISGQrData`, {
  //       headers: {
  //         "Content-type": "application/json",
  //         "auth-token": REACT_APP_SECRET_KEY,
  //       },
  //       params: {
  //         ApplicationName: "ISGCheckList",
  //       },
  //     })
  //     .then(async (res) => {
  //       setQRArea(
  //         res.data?.map(
  //           (item) =>
  //             [
  //               {
  //                 value: item.ID,
  //                 Name:item.Name
               
               
                 
  //               },
  //             ][0]
  //         )
  //       );
  //     })
  //     .catch((err) => console.warn(err));
  // };

  const languageData = useMemo(() => {
    const arrayUniqueByKey = accidentType.filter((item) => item.Type === 4);
    return arrayUniqueByKey;
  }, [accidentType]);

 

const renderRiskSection = (
  title,
  description,
  options,
  selectedIndex,
  onChange,
) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>
      {title} <Text style={styles.required}>*</Text>
    </Text>

    <Text style={styles.sectionDescription}>{description}</Text>

    <RadioGroup
      selectedIndex={selectedIndex ?? undefined}
      onChange={onChange}
    >
      {options.map((option, index) => (
        <Radio
          key={index}
          style={[
            styles.radioOption,
            selectedIndex === index && styles.radioOptionSelected,
          ]}
        >
          {() => (
            <Text
              style={[
                styles.radioText,
                selectedIndex === index && styles.radioTextSelected,
              ]}
            >
              {option}
            </Text>
          )}
        </Radio>
      ))}
    </RadioGroup>
  </View>
);


  const getUser = async () => {
    await sendUserInfoName((sendResponse) => {
      setEmployeeId(sendResponse.empSicil);
      setName(sendResponse.uname);
      setUserLine(sendResponse.line);
    });
  };
useEffect(() => {
  if (isActive) {
    requestCameraPermission();
  }
}, [isActive]);
  useEffect(() => {
    getUser();
  }, []);
  useEffect(() => {
    getAccidentData();
  }, [netInfo]);




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
    <View style={styles.screen}>
      {isActive ? (
        <View style={styles.cameraContainer}>
          {cameraPermissionGranted && device ? (
            <>
              <Camera
                style={StyleSheet.absoluteFill}
                codeScanner={codeScannner}
                device={device}
                isActive={isActive}
              />

              <View
                pointerEvents="none"
                style={styles.cameraMessage}
              >
                <Text style={styles.cameraTitle}>QR kodu okutun</Text>
                <Text style={styles.cameraDescription}>
                  Kamerayı ilgili alanın QR koduna doğrultun.
                </Text>
              </View>
            </>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>
                {cameraPermissionGranted
                  ? "Kamera kullanılamıyor"
                  : "Kamera izni gerekli"}
              </Text>

              <Text style={styles.emptyDescription}>
                {cameraPermissionGranted
                  ? "Kamera bağlantısını kontrol edip tekrar deneyin."
                  : "QR kodu okutmak için uygulamaya kamera izni verin."}
              </Text>
            </View>
          )}
        </View>
      ) : qrCodeValue?.length > 0 ? (
        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.form}>
              <View style={styles.header}>
                <View style={styles.headerAccent} />
                <Text style={styles.pageTitle}>Risk Değerlendirmesi</Text>
                <Text style={styles.pageDescription}>
                  Gözleminizi ve risk düzeyini aşağıdaki alanlardan belirtin.
                </Text>
              </View>

              <View style={styles.section}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>
                    {languageData[12]?.Name}
                  </Text>
                  <Text style={styles.infoValue}>{name || "—"}</Text>
                </View>

                <View style={styles.infoDivider} />

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>
                    {languageData[13]?.Name}
                  </Text>
                  <Text style={styles.infoValue}>{qrValue || "—"}</Text>
                </View>
              </View>

              {renderRiskSection(
                "Olasılık",
                "Gerçekleşme ihtimalini seçin.",
                [
                  "Kesin",
                  "Yüksek",
                  "Olası",
                  "Mümkün",
                  "Beklenmez fakat mümkün",
                  "Beklenmez",
                ],
                probability,
                setProbability,
              )}

              {renderRiskSection(
                "Şiddet",
                "Olası sonucun etkisini seçin.",
                [
                  "Çok Ölümlü Kaza",
                  "Öldürücü Kaza",
                  "Kalıcı Hasar",
                  "Önemli Hasar",
                  "Küçük hasar",
                  "Ucuz atlatma",
                ],
                severity,
                setSeverity,
              )}

              {renderRiskSection(
                "Frekans",
                "Maruz kalma sıklığını seçin.",
                [
                  "Hemen Hemen",
                  "Sık sık",
                  "Arasıra",
                  "Sık Değil",
                  "Seyrek",
                  "Çok Seyrek",
                ],
                frequency,
                setFrequency,
              )}

              <View style={styles.section}>
                <View style={styles.relatedWorkRow}>
                  <Text style={styles.relatedWorkText}>
                    İşi ben mi yapacağım?
                  </Text>

                  {Platform.OS === "android" ? (
                    <Checkbox
                      status={isRelatedWorkMe ? "checked" : "unchecked"}
                      color="#0B337C"
                      onPress={() =>
                        setIsRelatedWorkMe((previous) => !previous)
                      }
                    />
                  ) : (
                    <Switch
                      value={isRelatedWorkMe}
                      trackColor={{
                        true: "#0B337C",
                        false: "#CBD5E1",
                      }}
                      onValueChange={setIsRelatedWorkMe}
                    />
                  )}
                </View>

                <View style={styles.field}>
                  <Text style={styles.fieldLabel}>
                    {languageData[22]?.Name}
                    <Text style={styles.required}> *</Text>
                  </Text>

                  <TextInput
                    theme={DefaultTheme}
                    value={content}
                    onChangeText={setContent}
                    multiline
                    autoCapitalize="sentences"
                    style={styles.textArea}
                  />
                </View>

                <View style={styles.field}>
                  <Text style={styles.fieldLabel}>
                    {languageData[23]?.Name}
                  </Text>

                  <TextInput
                    theme={DefaultTheme}
                    value={opinionImprovement}
                    onChangeText={setOpinionImprovement}
                    multiline
                    autoCapitalize="sentences"
                    style={styles.textArea}
                  />
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  {languageData[25]?.Name}
                </Text>

                {!!filePath?.uri && (
                  <View style={styles.photoContainer}>
                    <Animated.Image
                      source={{ uri: filePath.uri }}
                      resizeMode="contain"
                      style={styles.photo}
                    />
                  </View>
                )}

                <Button
                  mode="outlined"
                  textColor="#0B337C"
                  style={styles.photoButton}
                  contentStyle={styles.buttonContent}
                  onPress={() => {
                    Keyboard.dismiss();
                    setVisible(true);
                  }}
                >
                  {languageData[25]?.Name}
                </Button>
              </View>

              <Button
                mode="contained"
                buttonColor="#0B337C"
                textColor="#FFFFFF"
                style={styles.submitButton}
                contentStyle={styles.buttonContent}
                labelStyle={styles.submitLabel}
                loading={loading}
                disabled={loading}
                onPress={addForm}
              >
                {languageData[24]?.Name}
              </Button>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      ) : (
        <View style={styles.emptyState}>
          <View style={styles.emptyAccent} />

          <Text style={styles.emptyTitle}>
            QR bilgisi bulunamadı
          </Text>

          <Text style={styles.emptyDescription}>
            İlgili alanın QR kodunu yeniden okutun.
          </Text>

          <Button
            mode="contained"
            buttonColor="#0B337C"
            textColor="#FFFFFF"
            style={styles.retryButton}
            contentStyle={styles.buttonContent}
            onPress={() => {
              setQrCodeValue([]);
              setIsActive(true);
            }}
          >
            Tekrar Okut
          </Button>
        </View>
      )}

      <Portal>
        <Dialog
          visible={visible}
          onDismiss={hideDialog}
          style={styles.dialog}
        >
          <Dialog.Title style={styles.dialogTitle}>
            {languageData[25]?.Name}
          </Dialog.Title>

          <Dialog.Content>
            <Button
              mode="outlined"
              textColor="#0B337C"
              style={styles.dialogOption}
              contentStyle={styles.buttonContent}
              onPress={() => {
                hideDialog();
                chooseFile("photo");
              }}
            >
              {languageData[33]?.Name}
            </Button>

            <Button
              mode="outlined"
              textColor="#0B337C"
              style={styles.dialogOption}
              contentStyle={styles.buttonContent}
              onPress={() => {
                hideDialog();
                captureImage("photo");
              }}
            >
              {languageData[32]?.Name}
            </Button>
          </Dialog.Content>

          <Dialog.Actions>
            <Button textColor="#64748B" onPress={hideDialog}>
              {languageData[31]?.Name}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  </Provider>
);
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F3F6FC",
  },

  keyboardContainer: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingVertical: 22,
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

  pageTitle: {
    color: "#172B4D",
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 33,
    marginBottom: 8,
  },

  pageDescription: {
    color: "#64748B",
    fontSize: 14,
    lineHeight: 22,
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
  },

  sectionDescription: {
    color: "#73829B",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 4,
    marginBottom: 14,
  },

  required: {
    color: "#DC2626",
  },

  infoRow: {
    paddingVertical: 3,
  },

  infoLabel: {
    color: "#73829B",
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 5,
  },

  infoValue: {
    color: "#172B4D",
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 23,
  },

  infoDivider: {
    height: 1,
    backgroundColor: "#EDF1F7",
    marginVertical: 14,
  },

  radioOption: {
    minHeight: 48,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginVertical: 4,
    backgroundColor: "#F8FAFD",
    borderWidth: 1,
    borderColor: "#E8EDF5",
    borderRadius: 10,
  },

  radioOptionSelected: {
    backgroundColor: "#EAF0FA",
    borderColor: "#0B337C",
  },

  radioText: {
    flexShrink: 1,
    color: "#475569",
    fontSize: 14,
    lineHeight: 22,
    marginLeft: 10,
  },

  radioTextSelected: {
    color: "#0B337C",
    fontWeight: "600",
  },

  relatedWorkRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 16,
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF1F7",
  },

  relatedWorkText: {
    flex: 1,
    color: "#172B4D",
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 22,
    marginRight: 12,
  },

  field: {
    marginTop: 16,
  },

  fieldLabel: {
    color: "#475569",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 20,
    marginBottom: 8,
  },

  textArea: {
    minHeight: 100,
    backgroundColor: "#F8FAFD",
    textAlignVertical: "top",
  },

  photoContainer: {
    marginTop: 16,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#F0F4FA",
  },

  photo: {
    width: "100%",
    height: 220,
  },

  photoButton: {
    borderRadius: 12,
    borderColor: "#CBD8EE",
    marginTop: 16,
  },

  buttonContent: {
    minHeight: 52,
    paddingVertical: 4,
  },

  submitButton: {
    borderRadius: 12,
    marginTop: 4,
  },

  submitLabel: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0,
  },

  cameraContainer: {
    flex: 1,
    backgroundColor: "#F3F6FC",
  },

  cameraMessage: {
    position: "absolute",
    left: 24,
    right: 24,
    bottom: 48,
    padding: 20,
    borderRadius: 16,
    backgroundColor: "rgba(11, 51, 124, 0.92)",
  },

  cameraTitle: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },

  cameraDescription: {
    color: "#D4E2F8",
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
  },

  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 24,
  },

  emptyAccent: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#0B337C",
    marginBottom: 22,
  },

  emptyTitle: {
    color: "#172B4D",
    fontSize: 21,
    lineHeight: 29,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },

  emptyDescription: {
    color: "#64748B",
    fontSize: 14,
    lineHeight: 23,
    textAlign: "center",
  },

  retryButton: {
    borderRadius: 12,
    marginTop: 24,
    minWidth: 180,
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
export default SafetyControl;