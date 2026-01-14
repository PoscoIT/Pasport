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
  KeyboardAvoidingView,
} from "react-native";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { Card } from "react-native-paper";
import {
  Button,
  IndexPath,
  Input,
  Select,
  SelectItem,
} from "@ui-kitten/components";
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
  const [count, setCount] = useState(0);
  const [netInfo, setNetInfo] = useState("");
  const [ScanResult, setScanResult] = useState(false);
  const [departmentList, setDepartmentList] = useState([]);
  const [scan, setScan] = useState(false);
  const [data, setData] = useState([]);
  const [qrValue, setQrValue] = useState("");
  const [qrValueManual, setQrValueManual] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible3, setModalVisible3] = useState(false);
  const [description, setDescription] = useState("");
  const [employeeID, setEmployeeId] = useState("");
  const { width, height } = Dimensions.get("screen");
  const [selectedReturnMessage, setSelectedReturnMessage] = useState("");
  const [returnMessageData, setReturnMessageData] = useState([]);
  const [countMethod, setCountMethod] = useState(false);
  const url = "https://tstapp.poscoassan.com.tr:8443";
  const [returnMessage, setReturnMessage] = useState("");
  const device = useCameraDevice("back");
  const [selectedIndexProductType, setSelectedIndexProductType] =
    useState(null);
  const [selectedIndexWidth, setSelectedIndexWidth] = useState("");
  const [selectedIndexSurfaceDamageType, setSelectedIndexSurfaceDamageType] =
    useState(null);
  const [selectedIndexHumudityType, setSelectedIndexHumudityType] =
    useState(null);
  const [
    selectedIndexPaperParticiplesType,
    setSelectedIndexPaperParticiplesType,
  ] = useState(null);
  const [selectedIndexPaperSampleType, setSelectedIndexPaperSampleType] =
    useState(null);
  const [selectedIndexRatingType, setSelectedIndexRatingType] = useState(null);

  const productTypes = [
    "Billerud Beyaz Kağıt",
    "Lenk Beyaz Kağıt",
    "Billerud Kraft Kağıt",
    "Lenk Kraft Kağıt",
    "Ompack Vinil",
    "Daein Vinil",
  ];
  const decisionOptions = ["Kabul", "Şartlı Kabul", "Red"];
  const decisionOptionsSecond = ["Kabul", "Red"];
  const yesNoOptions = ["Evet", "Hayır"];

  const displayValueProductType =
    selectedIndexProductType !== null
      ? productTypes[selectedIndexProductType.row]
      : "";

  const getValue = (options, index) =>
    index !== null ? options[index.row] : "";

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

      fetchPaperData(codes[0]?.value);
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
  const getSelectedValue = (options, index) => {
    if (!index) return null;
    return options[index.row];
  };
  const inspectionAction = async () => {
    if (
      !selectedIndexWidth ||
      !selectedIndexProductType ||
      !selectedIndexSurfaceDamageType ||
      !selectedIndexHumudityType ||
      !selectedIndexPaperParticiplesType ||
      !selectedIndexPaperSampleType ||
      !selectedIndexRatingType
    ) {
      Alert.alert("Hata", "Lütfen Tüm Alanları Doldurunuz.");
      return;
    }

    if (
      getSelectedValue(decisionOptions, selectedIndexRatingType) === "Red" &&
      description.length <= 0
    ) {
      Alert.alert("Hata", "Lütfen Not Giriniz.");
      return;
    }

    const paper = {
      barcode: qrValue,
      empNo: employeeID,
      width: selectedIndexWidth,
      productType: getValue(productTypes, selectedIndexProductType),
      damageSurface: getValue(yesNoOptions, selectedIndexSurfaceDamageType),
      humudity: getValue(yesNoOptions, selectedIndexHumudityType),
      paperParticiple: getValue(
        yesNoOptions,
        selectedIndexPaperParticiplesType
      ),
      paperSample: getValue(yesNoOptions, selectedIndexPaperSampleType),
      description: description,
      rating: getValue(decisionOptions, selectedIndexRatingType),
    };
    const formBody = Object.keys(paper)
      .map(
        (key) => encodeURIComponent(key) + "=" + encodeURIComponent(paper[key])
      )
      .join("&");

    await axios
      .post(`${url}/Production/PaperInspection`, formBody, {
        headers: {
          "auth-token": REACT_APP_SECRET_KEY,
        },
      })
      .then((res) => {
        if (res.data.status == "success") {
          setData([]);
          setQrValue("");
          setScan(true);
          setReturnMessage("");
          setSelectedReturnMessage("");
          setSelectedIndexHumudityType(null);
          setSelectedIndexPaperParticiplesType(null);
          setSelectedIndexSurfaceDamageType(null);
          setSelectedIndexPaperSampleType(null);
          setSelectedIndexProductType(null);
          setSelectedIndexRatingType(null);
          setSelectedIndexWidth(null);
          setDescription("");
          setModalVisible(false);

          Alert.alert("Başarılı", "Başarıyla Inspection Yapıldı");
        } else if (res.data.status == "error") {
          Alert.alert("Başarılı", "" + res.data.message);
          return;
        } else {
          Alert.alert("Hata", "Lütfen bağlantınızı kontrol ediniz.");
          return;
        }
      })
      .catch((err) => {
        Alert.alert("Hata", "Lütfen bağlantınızı kontrol ediniz.");
        return;
      })
      .finally(() => {});
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
          setScan(true);
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
              setScan(true);
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
          backgroundColor:
            countMethod !== "inspection" ? "#f1f4f5ff" : "#fcfafaff",

          width: width - 30,
          height: countMethod !== "inspection" ? 450 : 680,

          marginTop: 30,
        }}
      >
        <Text title="Barkod Numarası:" subtitle={item.Barcode} />

        <Card.Content>
          <Text style={styles.title}>Barkod Numarası: {item.Barcode}</Text>
          {countMethod !== "inspection" ? (
            <View>
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
            </View>
          ) : (
            item.IsInspection !== 1 && (
              <View>
                <Select
                  label="Ürün Tipi"
                  style={{ marginTop: 10 }}
                  placeholder={"Lütfen Seçiniz"}
                  value={displayValueProductType}
                  selectedIndex={selectedIndexProductType}
                  onSelect={(index) => setSelectedIndexProductType(index)}
                >
                  {productTypes.map((item, index) => (
                    <SelectItem key={index} title={item} />
                  ))}
                </Select>

                <Input
                  keyboardType="numeric"
                  style={styles.input2}
                  value={selectedIndexWidth}
                  maxLength={4}
                  onChangeText={(text) => {
                    const numericText = text.replace(/[^0-9]/g, "");
                    setSelectedIndexWidth(numericText);
                  }}
                  label="Genişlik Ölçümü (Tolerans: -3<Sipariş Genişliği<3)"
                ></Input>

                <Select
                  style={{ marginTop: 10 }}
                  label="Yüzey Hasay var mı?"
                  placeholder={"Lütfen Seçiniz"}
                  value={getValue(yesNoOptions, selectedIndexSurfaceDamageType)}
                  selectedIndex={selectedIndexSurfaceDamageType}
                  onSelect={setSelectedIndexSurfaceDamageType}
                >
                  {yesNoOptions.map((item, i) => (
                    <SelectItem key={i} title={item} />
                  ))}
                </Select>

                <Select
                  style={{ marginTop: 10 }}
                  label="Islaklık & Nemlilik var mı?"
                  placeholder={"Lütfen Seçiniz"}
                  value={getValue(yesNoOptions, selectedIndexHumudityType)}
                  selectedIndex={selectedIndexHumudityType}
                  onSelect={setSelectedIndexHumudityType}
                >
                  {yesNoOptions.map((item, i) => (
                    <SelectItem key={i} title={item} />
                  ))}
                </Select>

                <Select
                  style={{ marginTop: 10 }}
                  placeholder={"Lütfen Seçiniz"}
                  label="Yan yüzeylerde kağıt partikülü var mı?"
                  value={getValue(
                    yesNoOptions,
                    selectedIndexPaperParticiplesType
                  )}
                  selectedIndex={selectedIndexPaperParticiplesType}
                  onSelect={setSelectedIndexPaperParticiplesType}
                >
                  {yesNoOptions.map((item, i) => (
                    <SelectItem key={i} title={item} />
                  ))}
                </Select>

                <Select
                  style={{ marginTop: 10 }}
                  label="Kağıt Numunesi Alındı mı?"
                  placeholder={"Lütfen Seçiniz"}
                  value={getValue(yesNoOptions, selectedIndexPaperSampleType)}
                  selectedIndex={selectedIndexPaperSampleType}
                  onSelect={setSelectedIndexPaperSampleType}
                >
                  {yesNoOptions.map((item, i) => (
                    <SelectItem key={i} title={item} />
                  ))}
                </Select>

                <Select
                  style={{ marginTop: 10 }}
                  label="Değerlendirme"
                  placeholder={"Lütfen Seçiniz"}
                  onSelect={setSelectedIndexRatingType}
                  value={getValue(decisionOptions, selectedIndexRatingType)}
                  selectedIndex={selectedIndexRatingType}
                >
                  {decisionOptions.map((item, i) => (
                    <SelectItem key={i} title={item} />
                  ))}
                </Select>
                <Input
                  keyboardType="default"
                  style={styles.input2}
                  value={description}
                  onChangeText={(text) => setDescription(text)}
                  label="Açıklama"
                ></Input>
              </View>
            )
          )}

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
            {countMethod === true && item.IsStock != 1 ? (
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
            ) : countMethod === true ? (
              <View style={{ flex: 1, alignItems: "center" }}>
                <FontAwesome name={"check"} size={60} color={"#105c1c"} />
                <Text style={{ fontSize: 16 }}>Sayım Yapıldı</Text>
              </View>
            ) : countMethod === "inspection" ? (
              item.IsInspection !== 1 ? (
                <View style={{ marginBottom: -10 }}>
                  <Button
                    style={{ borderRadius: 20 }}
                    onPress={inspectionAction}
                  >
                    <Text>Inspectionı Tamamla</Text>
                  </Button>
                </View>
              ) : (
                <View>
                  <Text>Inspectionı yapılmıştır.</Text>
                </View>
              )
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

  const fetchPaperData = async (barcodeParam) => {
    // Eğer barkod yoksa işlem yapma (CountMethod değilse)
    if (!barcodeParam && !countMethod) return;

    try {
      const res = await axios.get(`${url}/Production/GetAllPaper`, {
        params: {
          barcode: barcodeParam,
        },
        headers: {
          "auth-token": REACT_APP_SECRET_KEY,
        },
      });

      // Veri geldiyse state'i güncelle
      setData(res.data);

      // Modal'ı veri geldikten veya istek tamamlandıktan sonra açmak daha güvenlidir
      // Ancak sizin akışınızda modal zaten açık olabilir, sorun değil.
    } catch (err) {
      console.error(err);
      Alert.alert("Hata", "Veri çekilemedi.");
      setModalVisible(false);
    }
  };
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
    getMessageCategory();
  }, []);

  useEffect(() => {
    getDepartmentList();
  }, [employeeID]);

  // useEffect(() => {
  //   const values = [
  //     getSelectedValue(decisionOptions, selectedIndexSurfaceDamageType),
  //     getSelectedValue(decisionOptions, selectedIndexHumudityType),
  //     getSelectedValue(decisionOptions, selectedIndexPaperParticiplesType),
  //     getSelectedValue(yesNoOptions, selectedIndexPaperSampleType),
  //   ];

  //   // Hepsi seçilmeden değerlendirme yapma
  //   if (values.some((v) => v === null)) {
  //     setSelectedIndexRatingType(null);
  //     return;
  //   }

  //   if (values.includes("Red") || values.includes("Hayır")) {
  //     setSelectedIndexRatingType(new IndexPath(1)); // Red
  //   }
  //   // } else {
  //   //   setSelectedIndexRatingType(new IndexPath(0));
  //   // }
  //   // Hepsi Kabul ise → Kabul
  //   else if (
  //     values.every((v) => v === "Kabul") ||
  //     values.every((v) => v === "Evet")
  //   ) {
  //     setSelectedIndexRatingType(new IndexPath(0)); // Kabul
  //   }
  // }, [
  //   selectedIndexSurfaceDamageType,
  //   selectedIndexHumudityType,
  //   selectedIndexPaperParticiplesType,
  //   selectedIndexPaperSampleType,
  // ]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
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
          <Button
            appearance={"outline"}
            status={"basic"}
            disabled={
              departmentList?.[0]?.SubTeamID !== 13 &&
              departmentList?.[0]?.SubTeamID !== 7
            }
            style={styles.button5}
            onPress={() => {
              scanAgain("inspection");
              setCountMethod("inspection");
            }}
          >
            <Text>Inspection Yap</Text>
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
                  marginRight: 30,
                  marginTop: 5,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(!modalVisible);
                    setData([]);
                    setQrValue("");
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
                    setCount(count + 1);
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
                      fetchPaperData(qrValueManual);
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
                    setCount(count + 1);
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
                      fetchPaperData(qrValueManual);
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
    </KeyboardAvoidingView>
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
    height: 45,
    margin: 30,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 0,
    marginRight: 0,
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 10,
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
  button5: {
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
    fontSize: 16,
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
