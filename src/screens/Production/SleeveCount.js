import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  Alert,
  BackHandler,
  KeyboardAvoidingView,
} from "react-native";
import { HelperText, TextInput, ActivityIndicator } from "react-native-paper";
import { useCallback, useEffect, useState } from "react";
import {
  Button,
  Select,
  SelectItem,
  RadioGroup,
  Radio,
} from "@ui-kitten/components";
import axios from "axios";
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from "react-native-vision-camera";
import { REACT_APP_SECRET_KEY } from "@env";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { sendUserInfoName } from "../../api/auth-api";
import { t } from "i18next";
const SleeveCount = () => {
  const [permission, setPermission] = useState(false);
  const [qrCodeValue, setQrCodeValue] = useState([]);
  const [selectedIndexWidth, setSelectedIndexWidth] = useState("");
  const [selectedIndexThickness, setSelectedThickness] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [qrValue, setQrValue] = useState("");
  const [isActive, setIsActive] = useState(true);
  const device = useCameraDevice("back");
  const widthData = ["1010", "1280", "1535"];
  const thicknessData = ["10", "15"];
  const [whichWeek, setWhichWeek] = useState("");
  const [whichSleeve, setWhichSleeve] = useState("");
  const navigation = useNavigation();
  const [employeeID, setEmployeeId] = useState("");
  const [usageValue, setUsageValue] = useState(0);
  const [scrapReason, setScrapReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [departmentList, setDepartmentList] = useState([]);
  const isWhichSleeveInvalid = () => {
    if (!whichSleeve) return false;

    const numVal = parseFloat(whichSleeve.toString().replace(",", "."));
    const min = 0;
    const max = parseFloat(qrCodeValue[0]?.TotalQuantity);

    if (isNaN(numVal) || isNaN(max)) return false;

    return numVal < min || numVal > max;
  };

  const isWeekInvalid = () => {
    if (!whichWeek) return false;

    const numVal = parseFloat(whichWeek.toString().replace(",", "."));
    const min = 0;
    const max = 52;

    if (isNaN(numVal) || isNaN(max)) return false;

    return numVal <= min || numVal > max;
  };

  const [formValues, setFormValues] = useState({});
  const onSubmit = () => {
    if (isWhichSleeveInvalid() || isWeekInvalid()) {
      Alert.alert("Hata", "Lütfen aralık dışında bir değer girmeyiniz.");
    } else if (usageValue === 1 && scrapReason.length < 1) {
      Alert.alert("Hata", "Lütfen Hurdalama sebebini belirtiniz");
    } else if (usageValue === 1 && scrapReason.length > 255) {
      Alert.alert("Hata", "Hurdalama sebebi 255 karakterden büyük olamaz");
    } else if (usageValue === 2 && scrapReason.length < 1) {
      Alert.alert("Hata", "Lütfen Not belirtiniz");
    } else if (usageValue === 2 && scrapReason.length > 255) {
      Alert.alert("Hata", "Not 255 karakterden büyük olamaz");
    } else if (usageValue === 3 && scrapReason.length < 1) {
      Alert.alert("Hata", "Lütfen Geri İade Nedeni belirtiniz");
    } else if (usageValue === 3 && scrapReason.length > 255) {
      Alert.alert("Hata", "Geri İade Nedeni 255 karakterden büyük olamaz");
    } else if (
      displayValue(thicknessData, selectedIndexThickness) &&
      displayValue(widthData, selectedIndexWidth) &&
      whichSleeve &&
      whichWeek
    ) {
      AddCount();
    } else {
      Alert.alert("Hata", "Lütfen Tüm Alanları Doldurunuz.");
    }
  };
  const renderOption = (title) => <SelectItem title={title} />;
  const displayValue = (data, selectedIndex) => {
    return data[selectedIndex.row];
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
      setIsActive(false);
      if (qrValue) getQrValue();
    },
    requestCameraPermission: true,
  });

  const getDepartmentList = async () => {
    try {
      if (employeeID) {
        await axios
          .get(
            `https://tstapp.poscoassan.com.tr:8443/UserAccount/GetDepartmentInfo`,
            {
              params: {
                sicilNo: employeeID,
              },
              headers: {
                "auth-token": REACT_APP_SECRET_KEY,
              },
            }
          )
          .then((res) => {
            setDepartmentList(res.data[0]);
          })
          .catch((t) => setDepartmentList([]));
      }
    } catch (e) {
      setDepartmentList([]);
    }
  };

  const getQrValue = async () => {
    setQrCodeValue([]);
    setLoading(true);

    await axios
      .get(
        `https://tstapp.poscoassan.com.tr:8443/Production/GetSleeveData?qrCode=${qrValue}`,
        {
          headers: {
            "auth-token": REACT_APP_SECRET_KEY,
          },
        }
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
        setQrCodeValue([]);
      })
      .finally(() => setLoading(false));
  };

  const AddCount = async () => {
    const body = {
      thickness: displayValue(thicknessData, selectedIndexThickness),
      width: displayValue(widthData, selectedIndexWidth),
      whichWeek: whichWeek,
      whichSleeve: whichSleeve,
      prNo: qrValue,
      createdID: employeeID,
      scrapReason: scrapReason,
      usage: usageValue,
    };

    const formBody = Object.keys(body)
      .map(
        (key) => encodeURIComponent(key) + "=" + encodeURIComponent(body[key])
      )
      .join("&");

    await axios
      .post(
        "https://tstapp.poscoassan.com.tr:8443/Production/PostSleeveCount",
        formBody,
        {
          headers: {
            "auth-token": REACT_APP_SECRET_KEY,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((res) => {
        if (res.data.status === "success") {
          Alert.alert("Kayıt Başarılı", "Başarıyla Kayıt Oluşturdunuz.", [
            {
              text: "OK",
              onPress: () => {
                setModalVisible(false);
                setIsActive(true);
                setWhichSleeve("");
                setWhichWeek("");
                setSelectedThickness("");
                setSelectedIndexWidth("");
                setScrapReason("");
              },
            },
          ]);
        } else if (res.data.status === "warning") {
          Alert.alert(
            "Hata",
            "Belirlenen tarih aralığında tekrar kayıt açılamaz"
          );
        } else {
          Alert.alert("Hata", "Lütfen Tüm Alanları Doldurunuz.");
        }
      })
      .catch((err) => {
        Alert.alert("Hata", "Lütfen Tüm Alanları Doldurunuz.");
      });
  };

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermission();

      if (cameraPermission === "granted") {
        setPermission(true);
        // Küçük delay ile başlat (bazı cihazlarda gerekli)
        setTimeout(() => {}, 400);
      } else {
        Linking.openSettings();
      }
    })();
  }, []);

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    getDepartmentList();
  }, [employeeID]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (isActive === true) {
          setModalVisible(false);
          setWhichSleeve("");
          setWhichWeek("");
          setSelectedThickness("");
          setSelectedIndexWidth("");
          setScrapReason("");
          navigation.goBack();
          return true;
        } else {
          setIsActive(true);
          setWhichSleeve("");
          setWhichWeek("");
          setSelectedThickness("");
          setSelectedIndexWidth("");
          setModalVisible(false);
          setScrapReason("");

          return true;
        }
      }
    );
    return () => backHandler.remove();
  }, [isActive]);

  useFocusEffect(
    useCallback(() => {
      // BURASI: Sayfaya girildiğinde çalışır (Opsiyonel)
      // console.log('Sayfaya girildi');
      setIsActive(true);
      return () => {
        setModalVisible(false);
        setWhichSleeve("");
        setWhichWeek("");
        setSelectedThickness("");
        setSelectedIndexWidth("");
        setScrapReason("");
      };
    }, [])
  );

  // if (!device || !permission) {
  //   return (
  //     <Text onPress={() => Linking.openSettings()}>
  //       Lütfen kameraya izin verin ve cihazın hazır olduğundan emin olun. İzin
  //       vermek için tıklayınız.
  //     </Text>
  //   );
  // }

  return (
    <View style={styles.view}>
      <View style={{ flex: 1, width: "100%", height: "100%" }}>
        <Camera
          style={StyleSheet.absoluteFill}
          codeScanner={codeScannner}
          device={device}
          isActive={isActive}
        />
      </View>
      {modalVisible && (
        <ScrollView
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,

            backgroundColor: "white",
          }}
        >
          {!loading && qrCodeValue.length > 0 ? (
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ flex: 1, backgroundColor: "#fff", height: "100%" }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                }}
              >
                <Button
                  size="small"
                  appearance="ghost"
                  status="basic"
                  onPress={() => {
                    setIsActive(true);
                    setWhichSleeve("");
                    setWhichWeek("");
                    setSelectedThickness("");
                    setSelectedIndexWidth("");
                    setModalVisible(false);
                    setScrapReason("");
                  }}
                >
                  {"< Geri Dön"}
                </Button>
                <Text style={[styles.textCenter]}>Sleeve Kağıt</Text>
              </View>

              <Text style={{ fontSize: 13, marginBottom: 10 }}>
                Tanımlı PR:
                {"  "}
                {qrValue.replace("-", " ").replace("i", "ı").toUpperCase()}
              </Text>
              <View>
                <RadioGroup
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    flexWrap: "wrap",
                  }}
                  selectedIndex={usageValue}
                  onChange={(index) => setUsageValue(index)}
                >
                  <Radio>Kullanım</Radio>

                  <Radio
                    disabled={
                      departmentList?.[0]?.SubTeamID !== 13 &&
                      departmentList?.[0]?.SubTeamID !== 7
                    }
                  >
                    Hurda
                  </Radio>

                  <Radio>Müşteri</Radio>
                  <Radio>Geri İade</Radio>
                </RadioGroup>
                {/* <RadioButton.Group
                  onValueChange={(newValue) => setUsageValue(newValue)}
                  value={usageValue}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <RadioButton value="1" />
                      <Text>Kullanım</Text>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginLeft: 30,
                      }}
                    >
                      <RadioButton value="2" />
                      <Text>Hurda ya da Müşteri</Text>
                    </View>
                  </View>
                </RadioButton.Group> */}
              </View>

              <Select
                label="Genişlik"
                placeholder="Genişlik Seçiniz"
                value={displayValue(widthData, selectedIndexWidth)}
                onSelect={(index) => setSelectedIndexWidth(index)}
              >
                {widthData.map(renderOption)}
              </Select>
              <Select
                label="Kalınlık"
                placeholder="Kalınlık Seçiniz"
                value={displayValue(thicknessData, selectedIndexThickness)}
                style={{ marginTop: 20 }}
                onSelect={(index) => setSelectedThickness(index)}
              >
                {thicknessData.map(renderOption)}
              </Select>

              <TextInput
                keyboardType="numeric"
                style={styles.input}
                value={whichWeek}
                onChangeText={(text) => {
                  const onlyInteger = text.replace(/[^0-9]/g, "");
                  setWhichWeek(onlyInteger);
                }}
                error={isWeekInvalid()}
                placeholder="Kaçıncı Hafta"
              ></TextInput>
              {isWeekInvalid() ? (
                <HelperText type="error" visible={isWeekInvalid()}>
                  {/* Dinamik Hata Mesajı */}
                  {whichWeek <= 0
                    ? "Değer 0'dan büyük değer olmalı"
                    : "Değer 52'den fazla olamaz"}
                </HelperText>
              ) : null}

              <TextInput
                keyboardType="numeric"
                style={styles.input}
                value={whichSleeve}
                onChangeText={(text) => setWhichSleeve(text)}
                error={isWhichSleeveInvalid()}
                placeholder="Kaçıncı Sleeve"
              ></TextInput>
              {isWhichSleeveInvalid() ? (
                <HelperText type="error" visible={isWhichSleeveInvalid()}>
                  Değer {qrCodeValue[0]?.TotalQuantity}'den fazla olamaz
                </HelperText>
              ) : null}
              {usageValue == 1 ? (
                <View>
                  <TextInput
                    keyboardType="default"
                    style={styles.input}
                    value={scrapReason}
                    onChangeText={(text) => setScrapReason(text)}
                    placeholder="Hurdalama Nedeni"
                  ></TextInput>
                </View>
              ) : null}
              {usageValue == 2 ? (
                <View>
                  <TextInput
                    keyboardType="default"
                    style={styles.input}
                    value={scrapReason}
                    onChangeText={(text) => setScrapReason(text)}
                    placeholder="Not"
                  ></TextInput>
                </View>
              ) : null}
              {usageValue == 3 ? (
                <View>
                  <TextInput
                    keyboardType="default"
                    style={styles.input}
                    value={scrapReason}
                    onChangeText={(text) => setScrapReason(text)}
                    placeholder="Geri İade Nedeni"
                  ></TextInput>
                </View>
              ) : null}

              <Button style={styles.submitButton} onPress={onSubmit}>
                {" "}
                Kaydet
              </Button>
            </KeyboardAvoidingView>
          ) : qrCodeValue.length == 0 && !loading ? (
            <View>
              <Text
                onPress={() => {
                  setIsActive(true);
                  setModalVisible(false);
                }}
              >
                İlgili PR numarası bulunamadı. Tekrar Okutmak için Tıklayınız
              </Text>
            </View>
          ) : (
            <ActivityIndicator
              animating={true}
              size={35}
              style={{ marginTop: 30 }}
            />
          )}
        </ScrollView>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: "white",
  },
  textCenter: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
    fontWeight: "bold",
    marginLeft: 50,
  },
  input: {
    backgroundColor: "#FFFFFF",
    marginVertical: 12,
    paddingHorizontal: 10,

    fontSize: 13,
    color: "#333",

    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",

    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,

    elevation: 1,
  },
  radio: {
    flex: 1,
    flexDirection: "row",
    margin: 1,
    padding: 10,
  },
  submitButton: {
    marginHorizontal: 80,
    marginVertical: 20,
    borderRadius: 10,
    paddingVertical: 12,
  },
});
export default SleeveCount;
