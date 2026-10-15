import {
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  Modal,
  TextInput,
  Alert,
  Dimensions,
  BackHandler,
  Linking,
  KeyboardAvoidingView,
  TextInput as NativeTextInput,
  ScrollView,
  FlatList,
  Platform

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
import { useFocusEffect, useIsFocused, useNavigation } from "@react-navigation/native";
import { Toast } from "toastify-react-native";

const PaperTracking = () => {
  const navigation = useNavigation();
  const [count, setCount] = useState(0);
  const [netInfo, setNetInfo] = useState("");
  const [ScanResult, setScanResult] = useState(false);
  const [departmentList, setDepartmentList] = useState([]);
  const [inspectionDisabled,setInspectionDisabled] = useState(false)
  const [dropDisabled,setDropDisabled] = useState(false)
  const [countDisabled,setCountDisabled] = useState(false)
  const [scan, setScan] = useState(false);
  const [data, setData] = useState([]);
  const [qrValue, setQrValue] = useState("");
  const [qrValueManual, setQrValueManual] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [description, setDescription] = useState("");
  const [employeeID, setEmployeeId] = useState("");
  const { width, height } = Dimensions.get("screen");
  const [selectedReturnMessage, setSelectedReturnMessage] = useState("");
    const [selectedLine, setSelectedLine] = useState("");
  const [returnMessageData, setReturnMessageData] = useState([]);
    const [lineData, setLineData] = useState([]);
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
  const getLineData = async () => {
    
    await axios
      .get(`${url}/Production/GetLineData`, {
        headers: {
          "auth-token": REACT_APP_SECRET_KEY,
        },
      })
      .then((res) => {
        setLineData(
          res?.data?.map(
            (item) =>
              [
                {
                  value: item.ID,
                  Name: item.NameTr,
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
    setInspectionDisabled(true)
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
      setInspectionDisabled(false)
      return;
    }

    if (
      getSelectedValue(decisionOptions, selectedIndexRatingType) === "Red" &&
      description.length <= 0
    ) {
      Alert.alert("Hata", "Lütfen Not Giriniz.");
      setInspectionDisabled(false)
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
          setSelectedLine("")
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
      .finally(() => {setInspectionDisabled(false)});
  };

  const counterAction = async () => {
    setCountDisabled(true)
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
          setSelectedLine("")

          Alert.alert("Başarılı", "Başarıyla Sayım Yapıldı");
        } else {
          Alert.alert("Hata", "Lütfen bağlantınızı kontrol ediniz.");
        }
      })
      .catch((err) => {})
      .finally(() => {
          setCountDisabled(false)
        setModalVisible(false);
      });
  };

  const dropPaper = async (status) => {
    setDropDisabled(true)
    if (status === 1 && selectedReturnMessage?.Name?.length === 0) {
      alert("Geri alma nedeni girmelisiniz");
       setDropDisabled(false)
      return;
    } else {
  if (status === 0 && selectedLine?.Name?.length === 0) {
      alert("Düşüm yapılacak hattı seçiniz");
       setDropDisabled(false)
      return;
    }
    

      const paper = {
        barcode: qrValue,
        empNo: employeeID,
        status: status,
        returnMessage: selectedReturnMessage.Name,
        selectedTeam:selectedLine.value
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
              setSelectedLine("")
            } else {
              alert("Bir hata oluştu. IT ile Görüşünüz");
            }
          })
          .catch((err) => alert("Bir hata oluştu. IT ile Görüşünüz"))
          .finally(() => {
             setDropDisabled(false)
            setModalVisible(false);
          });
      } catch (e) {
         setDropDisabled(false)
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
          <Text style={paperStyles.title}>Barkod Numarası: {item.Barcode}</Text>
          {countMethod !== "inspection" ? (
            <View>
              <Text style={paperStyles.title}>
                Kağıt Tipi:{" "}
                {item.PaperTypeName?.toString()?.toLowerCase() === "new paper"
                  ? "Sıfır Kağıt"
                  : "İkinci El"}
              </Text>
              <Text style={paperStyles.title}>Renk :{item.PaperType2}</Text>
              <Text style={paperStyles.title}>Sarım Kodu :{item.StockCode}</Text>
              <Text style={paperStyles.title}>Gram: {item.Gram}</Text>
              <Text style={paperStyles.title}>Boyut: {item.Size}</Text>
              <Text style={paperStyles.title}>Ağırlık: {item.Weight}</Text>
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
                  style={paperStyles.input2}
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
                  style={paperStyles.input2}
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
          <View style={{marginTop:10}}>
            {item.StatusCode === 0 ?<PickerModal
                style={{ width: "100%", backgroundColor: "black" }}
                Autocomplete={false}
                items={lineData}
                sortingLanguage={"tr"}
                showToTopButton={true}
                showAlphabeticalIndex={true}
                selected={selectedLine}
                autoGenerateAlphabeticalIndex={true}
                selectPlaceholderText={<Text>Düşüm Yapılacak Hattı Seçiniz</Text>}
                searchPlaceholderText={"Düşüm Yapılacak Hattı Seçiniz"}
                requireSelection={false}
                autoSort={true}
                onSelected={(item) => setSelectedLine(item)}
              />:null}
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
              right: (width * 2) / 6,
            }}
          >
            {countMethod === true && item.IsStock != 1 ? (
              <Button
              disabled={countDisabled}
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
              <View style={{ flex: 1, alignItems: "center",}}>
                <FontAwesome name={"check"} size={30} color={"#105c1c"} />
                <Text style={{ fontSize: 16 }}>Sayım Yapıldı</Text>
              </View>
            ) : countMethod === "inspection" ? (
              item.IsInspection !== 1 ? (
                <View style={{ marginBottom: -10 }}>
                  <Button
                    style={{ borderRadius: 20 }}
                    disabled={inspectionDisabled}
                  
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
              disabled={dropDisabled}
                style={{
                 width:150,
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
      if(res.data[0]){
    if(res.data[0]?.PaperTypeName!=="Recycling Paper"){
   setData(res.data);
  }
  else{
            console.log(res.data,"burda")
    Toast.error("İkinci el kağıt işlemi Canlı Kağıt Stok Durumu Ekranından Yapılmalıdır")
  }
      }
      else{
           Toast.error("Okutulan barkod bulunamadı. İkinci el kağıt işlemi Canlı Kağıt Stok Durumu Ekranından Yapılmalıdır")
      }
    
     
           
     

      // Modal'ı veri geldikten veya istek tamamlandıktan sonra açmak daha güvenlidir
      // Ancak sizin akışınızda modal zaten açık olabilir, sorun değil.
    } catch (err) {
      console.error(err);
      Alert.alert("Hata", "Veri çekilemedi.");
      setModalVisible(false);
    }
  };


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

  useEffect(()=>{
    getLineData()
  },[])

  useEffect(() => {
    getDepartmentList();
  }, [employeeID]);

useEffect(() => {
  const sub = BackHandler.addEventListener("hardwareBackPress", () => {
    if (modalVisible) {
      setModalVisible(false);
      return true;
    }
    return false;
  });

  return () => sub.remove();
}, [modalVisible]);
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

  const canInspect =
  departmentList?.[0]?.SubTeamID === 13 ||
  departmentList?.[0]?.TeamID === 10 ||
  departmentList?.[0]?.TeamID === 24 ||
  departmentList?.[0]?.SubTeamID === 7 ||
  (
    departmentList?.[0]?.TeamID === 30 &&
    departmentList?.[0]?.PositionID === 21
  );

const closePaperModal = () => {
  setModalVisible(false);
  setData([]);
  setQrValue("");
  setScan(false);
  setCount((previous) => previous + 1);
};

const closeManualModal = (isCount) => {
  if (isCount) {
    setModalVisible2(false);
  } else {
    setModalVisible1(false);
  }

  setData([]);
  setQrValue("");
  setQrValueManual("");
  setCount((previous) => previous + 1);
};

const renderAction = (title, description, icon, onPress, disabled = false) => (
  <TouchableOpacity
    style={[
      paperStyles.actionCard,
      disabled && paperStyles.actionDisabled,
    ]}
    activeOpacity={0.7}
    accessibilityRole="button"
    accessibilityState={{ disabled }}
    disabled={disabled}
    onPress={onPress}
  >
    <View style={paperStyles.iconBox}>
      <FontAwesome name={icon} size={22} color="#0B337C" />
    </View>

    <View style={paperStyles.actionContent}>
      <Text style={paperStyles.actionTitle}>{title}</Text>
      <Text style={paperStyles.actionDescription}>{description}</Text>
    </View>

    <Text style={paperStyles.chevron}>›</Text>
  </TouchableOpacity>
);

const renderPaperModal = (visible, title, onClose, manual = false) => (
  <Modal
    animationType="fade"
    transparent
    visible={visible}
    onRequestClose={onClose}
  >
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={paperStyles.modalBackdrop}
    >
      <View style={paperStyles.modalPanel}>
        <View style={paperStyles.modalHeader}>
          <Text style={paperStyles.modalTitle}>{title}</Text>

          <TouchableOpacity
            style={paperStyles.closeButton}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Kapat"
          >
            <FontAwesome name="close" size={20} color="#64748B" />
          </TouchableOpacity>
        </View>

        {manual && (
          <View style={paperStyles.searchSection}>
            <Text style={paperStyles.inputLabel}>Barkod Numarası</Text>

            <NativeTextInput
              style={paperStyles.input}
              value={qrValueManual}
              onChangeText={setQrValueManual}
              placeholder="Barkod numarası giriniz"
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
              autoCorrect={false}
              accessibilityLabel="Barkod Numarası"
            />

            <TouchableOpacity
              style={paperStyles.searchButton}
              activeOpacity={0.8}
              accessibilityRole="button"
              onPress={() => {
                setQrValue(qrValueManual);
                fetchPaperData(qrValueManual);
              }}
            >
              <Text style={paperStyles.searchButtonText}>Sorgula</Text>
            </TouchableOpacity>
          </View>
        )}

        {!manual || qrValue.length > 0 ? (
          <FlatList
            style={paperStyles.resultList}
            contentContainerStyle={paperStyles.resultContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => String(item.Id)}
            data={data}
            renderItem={renderItem}
            ListEmptyComponent={
              <View style={paperStyles.emptyState}>
                <Text style={paperStyles.emptyTitle}>
                  Kağıt bilgisi bulunamadı
                </Text>
                <Text style={paperStyles.emptyDescription}>
                  Barkod bilgisini kontrol ederek tekrar deneyin.
                </Text>
              </View>
            }
          />
        ) : (
          <View style={paperStyles.emptyState}>
            <Text style={paperStyles.emptyDescription}>
              Kağıt bilgilerini görüntülemek için barkod numarasını
              girip sorgulayın.
            </Text>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  </Modal>
);
  return (
  <View style={paperStyles.screen}>
    {!scan ? (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={paperStyles.scrollContent}
      >
        <View style={paperStyles.content}>
          <View style={paperStyles.header}>
            <View style={paperStyles.headerAccent} />
            <Text style={paperStyles.title}>Kağıt Takibi</Text>
            <Text style={paperStyles.subtitle}>
              Yapmak istediğiniz işlemi seçin.
            </Text>
          </View>

          <Text style={paperStyles.groupLabel}>KAĞIT BİLGİLERİ</Text>

          {renderAction(
            "Okut",
            "Kamera ile barkod okutun.",
            "barcode",
            () => scanAgain(false),
          )}

          {renderAction(
            "Manuel Okut",
            "Barkod numarasıyla sorgulayın.",
            "keyboard-o",
            () => {
              setModalVisible(false);
              setModalVisible1(true);
              setCountMethod(false);
            },
          )}

          <Text style={paperStyles.groupLabel}>SAYIM</Text>

          {renderAction(
            "Sayım Yap",
            "Kamera ile sayım başlatın.",
            "list-ol",
            () => scanAgain(true),
          )}

          {renderAction(
            "Manuel Sayım Yap",
            "Barkod numarası girerek sayım yapın.",
            "pencil-square-o",
            () => {
              setModalVisible2(true);
              setModalVisible(false);
              setCountMethod(true);
            },
          )}

          <Text style={paperStyles.groupLabel}>KONTROL</Text>

          {renderAction(
            "Inspection Yap",
            canInspect
              ? "Barkod okutarak kontrol başlatın."
              : "Bu işlem için yetkiniz bulunmuyor.",
            "check-square-o",
            () => {
              scanAgain("inspection");
              setCountMethod("inspection");
            },
            !canInspect,
          )}
        </View>
      </ScrollView>
    ) : (
      <View style={paperStyles.cameraContainer}>
        {device ? (
          <Camera
            style={StyleSheet.absoluteFill}
            codeScanner={codeScannner}
            device={device}
            isActive={
              scan &&
              !modalVisible &&
              !modalVisible1 &&
              !modalVisible2
            }
          />
        ) : (
          <View style={paperStyles.cameraEmpty}>
            <Text style={paperStyles.cameraText}>
              Kamera kullanılamıyor.
            </Text>
          </View>
        )}

       

        {device && (
          <View pointerEvents="none" style={paperStyles.cameraHint}>
            <Text style={paperStyles.cameraText}>
              Kamerayı kağıt üzerindeki barkoda doğrultun.
            </Text>
          </View>
        )}
      </View>
    )}

    {renderPaperModal(
      modalVisible,
      "Kağıt Bilgileri",
      closePaperModal,
    )}

    {renderPaperModal(
      modalVisible1,
      "Manuel Okut",
      () => closeManualModal(false),
      true,
    )}

    {renderPaperModal(
      modalVisible2,
      "Manuel Sayım",
      () => closeManualModal(true),
      true,
    )}
  </View>
);
};
const paperStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F3F6FC",
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 24,
    paddingBottom: 36,
  },
  content: {
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
    paddingHorizontal: 18,
  },
  header: {
    marginBottom: 24,
    paddingHorizontal: 2,
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
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 24,
    marginBottom: 8,
  },
  subtitle: {
    color: "#64748B",
    fontSize: 14,
    lineHeight: 22,
  },
  groupLabel: {
    color: "#73829B",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    marginTop: 8,
    marginBottom: 12,
    marginLeft: 4,
  },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E3EAF4",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    minHeight: 90,
  },
  actionDisabled: {
    opacity: 0.55,
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#EAF0FA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    color: "#172B4D",
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 23,
  },
  actionDescription: {
    color: "#73829B",
    fontSize: 12,
    lineHeight: 19,
    marginTop: 4,
  },
  chevron: {
    color: "#94A3B8",
    fontSize: 26,
    marginLeft: 10,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: "#172B4D",
  },
  cameraEmpty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  cameraBack: {
    position: "absolute",
    top: 20,
    left: 18,
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "rgba(11, 51, 124, 0.9)",
  },
  cameraBackText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 10,
  },
  cameraHint: {
    position: "absolute",
    left: 24,
    right: 24,
    bottom: 48,
    borderRadius: 14,
    padding: 18,
    backgroundColor: "rgba(11, 51, 124, 0.9)",
  },
  cameraText: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  modalPanel: {
    width: "100%",
    maxWidth: 640,
    height: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF1F7",
  },
  modalTitle: {
    flex: 1,
    color: "#172B4D",
    fontSize: 19,
    fontWeight: "700",
    lineHeight: 27,
    marginRight: 10,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F3F6FC",
    alignItems: "center",
    justifyContent: "center",
  },
  searchSection: {
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF1F7",
  },
  inputLabel: {
    color: "#475569",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: "#DCE5F3",
    borderRadius: 10,
    backgroundColor: "#F8FAFD",
    color: "#334155",
    fontSize: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  searchButton: {
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0B337C",
    borderRadius: 10,
    marginTop: 12,
    padding: 12,
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  resultList: {
    flex: 1,
  },
  resultContent: {
    flexGrow: 1,
    padding: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  emptyTitle: {
    color: "#334155",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  emptyDescription: {
    color: "#73829B",
    fontSize: 13,
    lineHeight: 22,
    textAlign: "center",
  },
});

export default PaperTracking;
