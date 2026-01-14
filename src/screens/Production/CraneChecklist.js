import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  Alert,
  BackHandler,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { HelperText, TextInput } from "react-native-paper";
import { useCallback, useEffect, useState } from "react";
import { Button, Radio, RadioGroup } from "@ui-kitten/components";
import axios from "axios";
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
  CameraProps,
} from "react-native-vision-camera";
import { REACT_APP_SECRET_KEY } from "@env";
import { useNavigation } from "@react-navigation/native";
import kumanda from "../../assets/kumanda.png";
import kesiciSensor from "../../assets/kesiciSensor.png";
import tongKanca from "../../assets/tongkanca.jpg";
import kopruUzeri from "../../assets/kopruUzeri.png";
import forklift from "../../assets/forklift.jpeg";
import { sendUserInfoName } from "../../api/auth-api";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Reanimated, {
  Extrapolation,
  interpolate,
  useAnimatedProps,
  useSharedValue,
} from "react-native-reanimated";

Reanimated.addWhitelistedNativeProps({ zoom: true });

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);

const CraneChecklist = () => {
  const [permission, setPermission] = useState(false);
  const [questionList, setQuestionList] = useState([]);
  const [filledQuestionList, setFilledQuestionList] = useState([]);
  const [scan, setScan] = useState(false);
  const [scanResult, setScanResult] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [qrValue, setQrValue] = useState("");
  const [machineID, setMachineID] = useState(null);
  const [isActive, setIsActive] = useState(true);
  const [isEdit, setIsEdit] = useState(false);

  // YENİ STATE: Hangi bölgenin seçildiğini tutar (Null ise liste görünür)
  const [selectedAreaID, setSelectedAreaID] = useState(null);

  const device = useCameraDevice("back");
  const [employeeID, setEmployeeId] = useState("");
  const navigation = useNavigation();
  const [filteredImageList, setFilteredImageList] = useState([]);
  const zoom = useSharedValue(device?.neutralZoom ?? 1);
  const zoomOffset = useSharedValue(0);

  const gesture = Gesture.Pinch()
    .onBegin(() => {
      zoomOffset.value = zoom.value;
    })
    .onUpdate((event) => {
      const z = zoomOffset.value * event.scale;
      zoom.value = interpolate(
        z,
        [1, 10],
        [device.minZoom, device.maxZoom],
        Extrapolation.CLAMP
      );
    });

  const animatedProps = useAnimatedProps(() => ({
    zoom: zoom.value,
  }));

  // areadID'ler API'den gelen AreaID ile eşleşmeli
  const [imageList, setImageList] = useState([
    { id: 1, areadID: 16, url: kumanda, title: "Vinç Alt Bölge Kumanda" },
    {
      id: 2,
      areadID: 17,
      url: kesiciSensor,
      title: "Vinç Alt Bölge Kesici ve Sensörler",
    },
    {
      id: 3,
      areadID: 18,
      url: tongKanca,
      title: "Vinç Alt Bölge Tong-Kanca",
    },
    { id: 4, areadID: 19, url: kumanda, title: "Vinç Üst Bölge Kumanda" },
    {
      id: 5,
      areadID: 20,
      url: kesiciSensor,
      title: "Vinç Üst Bölge Kesici ve Sensörler",
    },
    {
      id: 6,
      areadID: 21,
      url: tongKanca,
      title: "Vinç Üst Bölge Tong-Kanca",
    },
    {
      id: 7,
      areadID: 22,
      url: kopruUzeri,
      title: "Vinç Üst Bölge Köprü Üzeri",
    },
    {
      id: 8,
      areadID: 23,
      url: forklift,
      title: "Forklift",
    },
  ]);

  const [formValues, setFormValues] = useState({});

  const handleAnswerChange = (questionId, value, areaID) => {
    setFormValues((prev) => ({
      ...prev,
      [questionId]: {
        QuestionID: questionId,
        Answer: value,
        CreatedID: employeeID,
        MachineID: machineID,
        AreaID: areaID,
      },
    }));
  };
  const handleFocus = useCallback(async ({ nativeEvent }) => {
    await came?.current?.focus({
      x: Math.round(nativeEvent.pageX),
      y: Math.round(nativeEvent.pageX),
    });
  }, []);

  const getUser = async () => {
    await sendUserInfoName((sendResponse) => {
      setEmployeeId(sendResponse.empSicil);
    });
  };

  const onSubmit = async () => {
    const allFieldsFilled = questionList.every(
      (item) => String(formValues[item.ID]?.Answer || "").trim() !== ""
    );
    if (allFieldsFilled) {
      const formData = new FormData();

      const body = {
        formValues: JSON.stringify(formValues),
      };

      const formBody = Object.keys(body)
        .map(
          (key) => encodeURIComponent(key) + "=" + encodeURIComponent(body[key])
        )
        .join("&");

      await axios
        .post(
          "https://tstapp.poscoassan.com.tr:8443/Production/AddChecklistQuestion",
          formBody,
          {
            headers: {
              "auth-token": REACT_APP_SECRET_KEY,
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        )
        .then((res) => {
          if (res.data) {
            if (res.data.status === "success") {
              setFormValues({});
              alert("Başarıyla Kaydedildi");
              setIsActive(false);
              setSelectedAreaID(null);
              setModalVisible(true);
            } else {
              alert("Lütfen İlgili alanları doldurunuz.");
            }
          } else {
            alert("Hata ile Karşılaşıldı.");
          }
        })
        .catch((err) => {
          console.log(err);
          alert("Hata ile Karşılaşıldı.");
        });
    } else {
      Alert.alert("Lütfen tüm alanları doldurunuz.");
    }
  };

  const codeScannner = useCodeScanner({
    codeTypes: ["qr", "ean-13"],
    onCodeScanned: (codes) => {
      setMachineID(null);
      setModalVisible(true);
      setQrValue(codes[0]?.value);
      setIsActive(false);
      setScan(false);
      setScanResult(true);

      setSelectedAreaID(null); // Scan edince listeye dön

      let groupIDs = [];

      setQrValue(
        codes[0]?.value.replace("https://poscoassan.com.tr/machineBarcode/", "")
      );
      setMachineID(
        qrValue.startsWith("forklift")
          ? Number(qrValue.split("-")[1])
          : Number(qrValue.split("-")[0])
      );
      const isForklift = qrValue.startsWith("forklift");

      // Eğer gelen ID 16,17,18 grubundaysa
      if (qrValue.split("-")[1] === "1" && !isForklift) {
        groupIDs = [16, 17, 18];
      }
      // Eğer gelen ID 19,20,21,22 grubundaysa
      else if (qrValue.split("-")[1] === "2" && !isForklift) {
        groupIDs = [19, 20, 21, 22];
      } else if (isForklift) {
        groupIDs = [23];
      }

      const filteredImages = imageList.filter((img) =>
        groupIDs.includes(img.areadID)
      );

      setFilteredImageList(filteredImages);
    },
    requestCameraPermission: true,
  });

  const getQuestionList = async (areaID, barcode) => {
    // URL'deki '18' dinamik olmalı mı kontrol edin

    await axios
      .get(
        `https://tstapp.poscoassan.com.tr:8443/Production/GetChecklistQuestion/${
          areaID + "-" + barcode
        }/${employeeID}`,
        {
          headers: {
            "auth-token": REACT_APP_SECRET_KEY,
          },
        }
      )
      .then((res) => {
        if (res.data?.status === "success") {
          setQuestionList(res.data.data);
          setIsEdit(res.data.isEdit);
        } else if (res.data?.status === "warning") {
          setFilledQuestionList(res.data.data);
          setIsEdit(false);
        } else {
          alert("Veri Bulunamadı.");
          setQuestionList([]);
          setFilledQuestionList([]);
          setIsEdit(false);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermission();
      if (cameraPermission === "granted") {
        setPermission(true);
        setTimeout(() => setScan(true), 400);
      } else {
        Linking.openSettings();
      }
    })();
  }, []);

  useEffect(() => {
    getUser();
  }, []);

  // BackHandler: Eğer bir bölge içindeysek ana listeye dönsün
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (selectedAreaID) {
          setSelectedAreaID(null); // Detaydan listeye dön
          setQuestionList([]);
          setFilledQuestionList([]);
          setIsEdit(false);
          return true;
        }
        if (isActive === true) {
          setModalVisible(false);
          setIsEdit(false);
          navigation.goBack();
          return true;
        } else {
          setIsActive(true);
          setModalVisible(false);
          setIsEdit(false);
          return true;
        }
      }
    );
    return () => backHandler.remove();
  }, [selectedAreaID, isActive]);

  if (!device || !permission) {
    return (
      <Text onPress={() => Linking.openSettings()}>
        Lütfen kameraya izin verin.
      </Text>
    );
  }

  // YARDIMCI FONKSİYON: Bölge Seçimi
  const handleAreaSelect = (areaID) => {
    // Burada o bölgeye ait soru var mı kontrolü yapılabilir
    setSelectedAreaID(areaID);

    getQuestionList(areaID, qrValue);
  };

  return (
    <View style={styles.view}>
      <View style={{ flex: 1, width: "100%", height: "100%" }}>
        <GestureDetector gesture={gesture}>
          <ReanimatedCamera
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={isActive}
            codeScanner={codeScannner}
            animatedProps={animatedProps}
          />
        </GestureDetector>
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
          {selectedAreaID === null ? (
            <>
              <Text
                style={[styles.textCenter, { fontSize: 18, marginTop: 20 }]}
              >
                Kontrol Bölgeleri
              </Text>
              <FlatList
                data={filteredImageList}
                nestedScrollEnabled={true}
                scrollEnabled={false}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={() => (
                  <Text
                    style={{
                      textAlign: "center",
                      marginTop: 20,
                      color: "gray",
                    }}
                  >
                    Bu QR koda ait tanımlı bölge bulunamadı.
                  </Text>
                )}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.cardItem}
                    onPress={() => handleAreaSelect(item.areadID)}
                  >
                    <Image
                      source={item.url}
                      style={{
                        width: "100%",
                        height: 120,
                        resizeMode: "stretch",
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                      }}
                    />
                    <View style={{ padding: 10 }}>
                      <Text style={{ fontWeight: "bold", textAlign: "center" }}>
                        {item.title}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              />

              {filledQuestionList.length > 0 && (
                <Button
                  style={styles.submitButton}
                  status="primary"
                  onPress={() => {
                    setIsActive(true);
                    setModalVisible(false);
                    setIsEdit(false);
                  }}
                >
                  Tekrar Okut
                </Button>
              )}
            </>
          ) : (
            <View>
              <View style={styles.headerBar}>
                <Button
                  size="small"
                  appearance="ghost"
                  status="basic"
                  onPress={() => {
                    setSelectedAreaID(null);
                    setQuestionList([]);
                    setFilledQuestionList([]);
                    setIsEdit(false);
                  }}
                >
                  {"< Geri Dön"}
                </Button>
                <Text
                  style={{ fontWeight: "bold", fontSize: 16, marginRight: 20 }}
                >
                  {imageList.find((x) => x.areadID === selectedAreaID)?.title}
                </Text>
              </View>

              {questionList.length > 0 &&
                questionList
                  .filter((q) => q.AreaID === selectedAreaID) // Sadece seçili bölge
                  .map((item) => {
                    const answers = Object.entries(item)
                      .filter(
                        ([key, value]) =>
                          key.includes("Answer") && value !== null
                      )
                      .map(([key, value]) => ({ key, value }));

                    return (
                      <View key={item.ID} style={styles.questionContainer}>
                        {(item.Type === 1 || item.Type === 2) && (
                          <View>
                            <Text style={styles.questionText}>
                              {item.Question}
                            </Text>
                            <RadioGroup
                              selectedIndex={
                                formValues[item.ID] !== undefined
                                  ? answers.findIndex(
                                      (ans) =>
                                        ans.value ===
                                        formValues[item.ID]?.Answer
                                    )
                                  : null
                              }
                              onChange={(index) => {
                                handleAnswerChange(
                                  item.ID,
                                  answers[index].value,
                                  item.AreaID
                                );
                              }}
                              style={styles.radio}
                            >
                              {answers.map((ans) => (
                                <Radio key={ans.key}>{ans.value}</Radio>
                              ))}
                            </RadioGroup>
                          </View>
                        )}

                        {(item.Type === 3 || item.Type === 4) && (
                          <View>
                            <TextInput
                              style={styles.input}
                              value={formValues[item.ID]?.Answer || ""}
                              onChangeText={(text) =>
                                handleAnswerChange(item.ID, text, item.AreaID)
                              }
                              right={<TextInput.Affix text={item.Uom} />}
                              label={item.Question}
                              keyboardType={
                                item.Type === 3 ? "numeric" : "default"
                              }
                              // Hata varsa inputun rengini kırmızı yapar (Opsiyonel)
                              error={(() => {
                                const val = formValues[item.ID]?.Answer;
                                if (!val) return false;
                                // Virgülü noktaya çevirip sayıya dönüştürüyoruz (Tr klavye önlemi)
                                const numVal = parseFloat(
                                  val.toString().replace(",", ".")
                                );
                                const min = parseFloat(item.MinimumValue);
                                const max = parseFloat(item.MaximumValue);

                                // Min ve Max tanımlıysa ve değer aralık dışındaysa true döner
                                if (
                                  !isNaN(min) &&
                                  !isNaN(max) &&
                                  !isNaN(numVal)
                                ) {
                                  return numVal < min || numVal > max;
                                }
                                return false;
                              })()}
                            />

                            {/* HelperText Mantığı */}
                            <HelperText
                              type="error"
                              visible={(() => {
                                const val = formValues[item.ID]?.Answer;
                                // Değer boşsa hata gösterme
                                if (!val) return false;

                                const numVal = parseFloat(
                                  val.toString().replace(",", ".")
                                );
                                const min = parseFloat(item.MinimumValue);
                                const max = parseFloat(item.MaximumValue);

                                // Min ve Max API'den geliyorsa ve sayı ise kontrol et
                                if (
                                  !isNaN(min) &&
                                  !isNaN(max) &&
                                  !isNaN(numVal)
                                ) {
                                  return numVal < min || numVal > max;
                                }
                                return false;
                              })()}
                            >
                              {/* Dinamik Hata Mesajı */}
                              Değer {item.MinimumValue} ile {item.MaximumValue}{" "}
                              arasında olmalıdır!
                            </HelperText>
                          </View>
                        )}
                        <View style={styles.divider} />
                      </View>
                    );
                  })}

              {/* Dolu Liste Gösterme Modu (Read Only) */}
              {filledQuestionList.length > 0 &&
                filledQuestionList
                  .filter((q) => q.AreaID === selectedAreaID)
                  .map((item, index) => {
                    const answers = Object.entries(item)
                      .filter(
                        ([key, value]) =>
                          key.startsWith("Answer") && value !== null
                      )
                      .map(([key, value]) => ({ key, value }));

                    return (
                      <View key={item.ID} style={styles.questionContainer}>
                        {index === 0 ? (
                          <Text style={styles.questionText}>
                            {item.CreatedPerson} -{" "}
                            {new Intl.DateTimeFormat("tr-TR", {
                              day: "2-digit",

                              month: "2-digit",

                              year: "numeric",

                              hour: "2-digit",

                              minute: "2-digit",

                              hour12: false,

                              timeZone: "UTC",
                            }).format(
                              new Date(filledQuestionList[0]?.CreatedAt)
                            )}
                          </Text>
                        ) : null}
                        <Text style={styles.questionText}>{item.Question}</Text>
                        {item.Type === 1 || item.Type === 2 ? (
                          <RadioGroup
                            style={styles.radio}
                            selectedIndex={answers.findIndex(
                              (ans) =>
                                ans.value?.toLowerCase()?.trim() ===
                                item.ChecklistAnswer?.toLowerCase()?.trim()
                            )}
                          >
                            {answers.map((ans) => (
                              <Radio disabled={true} key={ans.key}>
                                {ans.value}
                              </Radio>
                            ))}
                          </RadioGroup>
                        ) : (
                          <TextInput
                            style={styles.input}
                            value={item.ChecklistAnswer}
                            disabled={true}
                            label={item.Question}
                          />
                        )}
                        <View style={styles.divider} />
                      </View>
                    );
                  })}
              {questionList.length > 0 && isEdit ? (
                <View style={{ margin: 20, alignItems: "center" }}>
                  <Button
                    status="primary"
                    style={{ borderRadius: 50, width: "75%", marginBottom: 30 }}
                    onPress={() => {
                      onSubmit();
                      setSelectedAreaID(null);
                      setQuestionList([]);
                      setFilledQuestionList([]);
                      setIsEdit(false);
                    }}
                  >
                    Checklist'i Tamamla
                  </Button>
                </View>
              ) : null}
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
    fontWeight: "bold",
  },
  cardItem: {
    backgroundColor: "white",
    margin: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f5f5f5",
    marginBottom: 10,
  },
  questionContainer: {
    marginHorizontal: 15,
    marginBottom: 10,
  },
  questionText: {
    textAlign: "justify",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "white",
    marginVertical: 5,
    fontSize: 14,
  },
  radio: {
    flexDirection: "row",
    flexWrap: "wrap", // Şıklar yan yana sığmazsa aşağı geçsin
  },
  submitButton: {
    marginHorizontal: 30,
    borderRadius: 10,
    paddingVertical: 12,
  },
  divider: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#cacaca",
    marginVertical: 10,
  },
});

export default CraneChecklist;
