import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  Alert,
  BackHandler,
} from "react-native";
import { HelperText, TextInput } from "react-native-paper";
import { useEffect, useState } from "react";
import { Button, Select, SelectItem } from "@ui-kitten/components";
import axios from "axios";
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from "react-native-vision-camera";
import { REACT_APP_SECRET_KEY } from "@env";
import { useNavigation } from "@react-navigation/native";
import { sendUserInfoName } from "../../api/auth-api";
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
      getQrValue();
    },
    requestCameraPermission: true,
  });

  const getQrValue = async () => {
    await axios
      .get(
        "https://tstapp.poscoassan.com.tr:8443/Production/GetSleeveData?qrCode=45023",
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
      });
  };

  const AddCount = async () => {
    // const formData = new FormData();
    // formData.append("width", displayValue(widthData, selectedIndexWidth));
    // formData.append(
    //   "thickness",
    //   displayValue(thicknessData, selectedIndexThickness)
    // );
    // formData.append("whichWeek", whichWeek);
    // formData.append("whichSleeve", whichSleeve);
    // formData.append("prNo", qrValue);
    // formData.append("createdID", employeeID);

    const body = {
      thickness: displayValue(thicknessData, selectedIndexThickness),
      width: displayValue(widthData, selectedIndexWidth),
      whichWeek: whichWeek,
      whichSleeve: whichSleeve,
      prNo: qrValue,
      createdID: employeeID,
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
              },
            },
          ]);
        } else {
          Alert.alert("Hata", "Lütfen Tüm Alanları Doldurunuz.");
        }
      })
      .catch((err) => {
        console.log(err);
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
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (isActive === true) {
          setModalVisible(false);
          setWhichSleeve("");
          setWhichWeek("");
          setSelectedThickness("");
          setSelectedIndexWidth("");
          navigation.goBack();
          return true;
        } else {
          setIsActive(true);
          setWhichSleeve("");
          setWhichWeek("");
          setSelectedThickness("");
          setSelectedIndexWidth("");
          setModalVisible(false);

          return true;
        }
      }
    );
    return () => backHandler.remove();
  }, [isActive]);

  if (!device || !permission) {
    return (
      <Text onPress={() => Linking.openSettings()}>
        Lütfen kameraya izin verin ve cihazın hazır olduğundan emin olun. İzin
        vermek için tıklayınız.
      </Text>
    );
  }

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
          {qrCodeValue.length > 0 ? (
            <View style={{ flex: 1, backgroundColor: "#fff", height: 300 }}>
              <Text style={styles.textCenter}>Sleeve Kağıt</Text>
              <Text style={{ fontSize: 13, marginBottom: 10 }}>
                Tanımlı PR:{qrValue}
              </Text>
              <Select
                label={"Genişlik"}
                placeholder={"Genişlik Seçiniz"}
                value={displayValue(widthData, selectedIndexWidth)}
                onSelect={(index) => setSelectedIndexWidth(index)}
              >
                {widthData.map(renderOption)}
              </Select>
              <Select
                label={"Kalınlık"}
                placeholder={"Kalınlık Seçiniz"}
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
                onChangeText={(text) => setWhichWeek(text)}
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
              <Button style={styles.submitButton} onPress={onSubmit}>
                {" "}
                Kaydet
              </Button>
            </View>
          ) : (
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
  },
  input: {
    backgroundColor: "white",
    marginVertical: 10,
    marginTop: 20,
    paddingHorizontal: 10,

    fontSize: 13,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
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
