import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  Alert,
  Modal,
  BackHandler,
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { HelperText, TextInput, ActivityIndicator } from "react-native-paper";
import { useCallback, useEffect, useState } from "react";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
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
import { FlatList } from "react-native-gesture-handler";


const CustomAlert = ({ visibleMethod,message,onClose }) => {
  return (
    <Modal transparent={true} visible={visibleMethod} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          
        
          <Image 
            source={require("../../assets/poscoAlert.jpeg")} 
            style={styles.image} 
          />
          
          <Text style={styles.title}>{message}</Text>
       
          
          {/* Action Button */}
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
          
        </View>
      </View>
    </Modal>
  );
};
const Item = ({ item, onPress, backgroundColor, textColor }) => {
  return (
 <TouchableOpacity
  onPress={onPress}
  activeOpacity={0.85}
  style={[
    styles.card,
    { backgroundColor: backgroundColor || "#fff" }
  ]}
>
  <View style={styles.header}>
    <View style={styles.iconBox}>
      <Text style={styles.iconText}>PR</Text>
    </View>

    <View style={styles.headerContent}>
      <Text style={[styles.title, { color: textColor || "#333" }]}>
        PR No: {item.PR}
      </Text>

      <Text style={styles.subTitle}>
        Kullanım Bilgileri
      </Text>
    </View>
  </View>


  <View style={styles.divider} />


  <View style={styles.infoRow}>
    <Text style={styles.label}>
      Kullanım Sayısı
    </Text>
    <Text style={styles.value}>
      {item.SayimNo}
    </Text>
  </View>


  <View style={styles.infoRow}>
    <Text style={styles.label}>
      Kullanım Tipi
    </Text>
    <Text style={styles.value}>
      {item.UsageComment}
    </Text>
  </View>


</TouchableOpacity>
  );
};
const SleeveCount = () => {
  const [permission, setPermission] = useState(false);
  const [qrCodeValue, setQrCodeValue] = useState([]);
  const [modalVisible2,setModalVisible2] = useState(false)
  const [selectedIndexWidth, setSelectedIndexWidth] = useState("");
  const [selectedIndexThickness, setSelectedThickness] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [qrValue, setQrValue] = useState("");
  const [isActive, setIsActive] = useState(false);
  const device = useCameraDevice("back");
  const [widthData, setWidthData] = useState([]);
  const [thicknessData, setThichknessData] = useState([]);
  const [whichWeek, setWhichWeek] = useState("");
  const [whichSleeve, setWhichSleeve] = useState("");
  const navigation = useNavigation();
  const [employeeID, setEmployeeId] = useState("");
  const [usageValue, setUsageValue] = useState(0);
  const [scrapReason, setScrapReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchWeek,setSearchWeek] = useState("")
  const [searchOrder,setSearchOrder] = useState("")
  const [departmentList, setDepartmentList] = useState([]);
  const [searchData,setSearchData] = useState([])
  const [maxValue,setMaxValue] = useState([])
    const [selectedId, setSelectedId] = useState();
    const [searchButtonLoading,setSearchButtonLoading] = useState(false)
  const [searchPRNo,setSearchPRNo] = useState("")
  const [totalUsage,setTotalUsage] = useState("")
  const [alertVisible, setAlertVisible] = useState(false);
  const [isActive2,setIsActive2] = useState(false)
  const isWhichSleeveInvalid = () => {
    if (!whichSleeve) return false;

    const strVal = whichSleeve.toString().trim();

    if (!/^[1-9]\d*$/.test(strVal)) return true;

    const numVal = Number(strVal);
    const min = 0;

    const maxStr = qrCodeValue[0]?.TotalQuantity?.toString().trim();
    if (!/^\d+$/.test(maxStr)) return true;

    const max = Number(maxStr);

    return numVal <= min || numVal > max;
  };

  const isWeekInvalid = () => {
    if (!whichWeek) return false;

    const strVal = whichWeek.toString().trim();

    if (!/^[1-9]\d*$/.test(strVal)) return true;

    const numVal = Number(strVal);
    const min = 0;
    const max = 52;

    return numVal <= min || numVal > max;
  };

  const [formValues, setFormValues] = useState({});


  const onSearch = async()=>{
    setMaxValue(false)
    setSearchButtonLoading(true)
    if(searchOrder && searchWeek){
      const searchData = {
        hafta:searchWeek,
        order:searchOrder,
        prNo:searchPRNo,
        sicilNo:employeeID
      }
      await axios.get("https://tstapp.poscoassan.com.tr:8443/Production/GetSleeveDetails",{
        params:searchData,
       headers: {
                "auth-token": REACT_APP_SECRET_KEY,
                       "Content-Type": "application/json",
              },
      }).then((res)=>{
   
        if(res?.data?.status==="success"){
     
          if(res.data?.usageValue===true){
         setMaxValue(true)
         setAlertVisible(true)
         setTotalUsage(res.data?.maxValue)

          }
   
        
          setSearchData(res.data.data)
        }
        else{
           Alert.alert("UYARI",'Kayıt Bulunamadı')
          setSearchData([])
        }
      }).catch((err)=>{
        setSearchData([])
      }).finally(()=>{
     
         setSearchButtonLoading(false)
      })
    }
    else{
         Alert.alert("Hata", "Lütfen İlgili Alanları Doldurunuz");
          setSearchButtonLoading(false)
    }
  }
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
    return data[selectedIndex?.row];
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
      setIsActive2(false)
      if (qrValue) getQrValue();
    },
    requestCameraPermission: true,
  });

   const codeScannnerUsage = useCodeScanner({
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
    
  
      setIsActive(false)
      setIsActive2(false);
     
      if (codes[0]?.value) getQrValueUsage(codes[0]?.value);
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
            },
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

    setLoading(true);

    await axios
      .get(
        `https://tstapp.poscoassan.com.tr:8443/Production/GetSleeveData?qrCode=${qrValue}`,
        {
          headers: {
            "auth-token": REACT_APP_SECRET_KEY,
          },
        },
      )
      .then((res) => {
        if (res.data?.status === "success") {
          setQrCodeValue(res.data.data);
          setWidthData(res.data.value?.Width);
          setThichknessData(res.data.value?.thickness);
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


    const getQrValueUsage = async (prNo) => {

    setLoading(true);
  

    await axios
      .get(
        `https://tstapp.poscoassan.com.tr:8443/Production/GetQrValue?prNo=${prNo}`,
        {
          headers: {
            "auth-token": REACT_APP_SECRET_KEY,
          },
        },
      )
      .then((res) => {
      
        if (res.data?.status === "Success") {
       
          setSearchPRNo(prNo);
          setSearchWeek(res.data?.data[0]?.Week?.toString())
              setModalVisible2(true);
        } else {
       
          setSearchWeek("")
          setSearchPRNo("");
          Alert.alert("Hata",res?.data?.message?res.data?.message:"Kayıt Bulunamadı")
            //  setIsActive(false);
            //   setModalVisible2(false);
        }
      })
      .catch((err) => {
       
        setSearchPRNo("");
           setSearchWeek("")
      
               Alert.alert("Hata","Kayıt Bulunamadı")
            //         setIsActive(false)
            // setModalVisible2(false);
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
        (key) => encodeURIComponent(key) + "=" + encodeURIComponent(body[key]),
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
        },
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
            "Belirlenen tarih aralığında tekrar kayıt açılamaz",
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
          setIsActive(false)
          setWhichSleeve("");
          setWhichWeek("");
          setSelectedThickness("");
          setSelectedIndexWidth("");
          
          setScrapReason("");
          setSearchPRNo("")
          setSearchData([])
          setSearchOrder("")
          setSearchWeek("")
            setMaxValue(false)
            setTotalUsage("")
                setAlertVisible(false)
                    setSearchPRNo("")
          navigation.goBack();
          return true;
        } else {
          setIsActive(false);
          setWhichSleeve("");
          setWhichWeek("");
          setSelectedThickness("");
          setSelectedIndexWidth("");
          setModalVisible(false);
          setScrapReason("");
                setSearchPRNo("")
              setSearchData([])
          setSearchOrder("")
          setSearchWeek("")
            setMaxValue(false)
                setAlertVisible(false)
            setTotalUsage("")
                setSearchPRNo("")

          return true;
        }
      },
    );
    return () => backHandler.remove();
  }, [isActive,isActive2]);

  useFocusEffect(
    useCallback(() => {
      // BURASI: Sayfaya girildiğinde çalışır (Opsiyonel)
      // console.log('Sayfaya girildi');
      setIsActive(false)
   
      return () => {
        setModalVisible(false);
        setModalVisible2(false)
        setWhichSleeve("");
        setWhichWeek("");
        setSelectedThickness("");
        setSelectedIndexWidth("");
        setScrapReason("");
        setSearchPRNo("")
              setSearchPRNo("")
            setSearchData([])
          setSearchOrder("")
          setSearchWeek("")
          setMaxValue(false)
          setTotalUsage("")
              setAlertVisible(false)
      };
    }, []),
  );

  // if (!device || !permission) {Q
  //   return (
  //     <Text onPress={() => Linking.openSettings()}>
  //       Lütfen kameraya izin verin ve cihazın hazır olduğundan emin olun. İzin
  //       vermek için tıklayınız.
  //     </Text>
  //   );
  // }
  
  if(maxValue===true){
    return <CustomAlert   onClose={() => {
      setAlertVisible(false)
      setMaxValue(false)
    }} visibleMethod={alertVisible} message={`Kullanım yapılması durumunda ${totalUsage} olarak belirlenen sayı aşılacaktır. Sorgulanan sleeve'in kullanılması durumunda hat duruşlarına ve buna bağlı kalite kusurlarına sebebiyet verebilir`}/>
  }

  return (
    <View style={styles.view}>
      <View style={{ flex: 1, width: "100%", height: "100%" }}>
      {/* <Button style={{borderRadius:10,width:100}}>Kullanım</Button>
        <Button>Görüntüle</Button> */}
        <View style={styles.container}>
      <TouchableOpacity style={styles.buttonPrimary} onPress={()=>
        {
          setIsActive(true)
        }
      }>
        <Text style={styles.textPrimary}>Kullanım</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonSecondary} onPress={()=>setIsActive2(true)}>
        <Text style={styles.textSecondary}>Kullanım Görüntüle</Text>
      </TouchableOpacity>
    </View>
    {isActive&&  <Camera
          style={StyleSheet.absoluteFill}
          codeScanner={codeScannner}
          device={device}
        isActive={isActive}
       />}
        {isActive2&&  <Camera
          style={StyleSheet.absoluteFill}
          codeScanner={codeScannnerUsage}
          device={device}
        isActive={isActive2}
       />}
      
     
      </View>
        {modalVisible2 && (
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
          {!loading && searchPRNo.length > 0 ? (
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ flex: 1, backgroundColor: "#fff", height: "100%" }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                display:"flex",
                alignItems:"flex-start",
                justifyContent:"flex-start"
                }}
              >
                <Button
                  size="small"
                  appearance="ghost"
                  status="basic"
                  onPress={() => {
                    setIsActive(false);
                    setModalVisible(false)
                        setIsActive2(false);
                    setSearchPRNo("")
                    setWhichSleeve("");
                    setWhichWeek("");
                    setSelectedThickness("");
                    setSelectedIndexWidth("");
                    setModalVisible2(false);
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
                {searchPRNo?.replace("-", " ")?.replace("i", "ı")?.toUpperCase()}
              </Text>
          
           
  <TextInput
                keyboardType="numeric"
                style={styles.input}
                value={searchPRNo}
       
                onChangeText={(text) => {
               
                  setSearchPRNo(text);
                }}
            
                placeholder="PR No"
              ></TextInput>
            

              <TextInput
                keyboardType="numeric"
                style={styles.input}
                value={searchWeek}
              
                onChangeText={(text) => {
                  const onlyInteger = text.replace(/[^0-9]/g, "");
                  setSearchWeek(onlyInteger);
                }}
            
                placeholder="Kaçıncı Hafta"
              ></TextInput>
           

              <TextInput
                keyboardType="numeric"
                style={styles.input}
                value={searchOrder}
                onChangeText={(text) => setSearchOrder(text)}
             
                placeholder="Kaçıncı Sleeve"
              ></TextInput>
          
           
            
          

              <Button disabled={searchButtonLoading} style={styles.submitButton} onPress={onSearch}>
                {" "}
                Ara
              </Button>
              {searchData?.length>0?searchData.map((item,index)=>{
                return <Item key={index} item={item}/>
              }):null}
              {/* <KeyboardAwareFlatList        data={searchData}
          renderItem={renderItem}
               contentContainerStyle={{ paddingBottom: 50 }}
          keyExtractor={item => item.ID}
          ListHeaderComponent={<>
          <Text style={{textAlign:"center",fontWeight:"bold"}}>Kullanım Bilgileri</Text>
          </>}
              ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 15 }}>
           Bulunamadı
          </Text>
        }
          extraData={selectedId}>

              </KeyboardAwareFlatList> */}
            </KeyboardAvoidingView>
          ) : searchPRNo.length == 0 && !loading ? (
            <View>
              <Text
                onPress={() => {
                  setIsActive2(true);
                  setModalVisible2(false);
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
                     setIsActive(false);
                    setModalVisible(false)
                        setIsActive2(false);
                    setSearchPRNo("")
                    setWhichSleeve("");
                    setWhichWeek("");
                    setSelectedThickness("");
                    setSelectedIndexWidth("");
                    setModalVisible2(false);
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
                      <Radio
                   
                  >
                    Ebat Düşümü
                  </Radio>
                </RadioGroup>
              
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
    container: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    padding: 10,
  },
  buttonPrimary: {
    flex: 1,
    backgroundColor: "#2957c5",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    elevation: 3,
  },
  buttonSecondary: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2957c5",
  },
  textPrimary: {
    color: "#fff",
    fontWeight: "bold",
  },
  textSecondary: {
    color: "#2957c5",
    fontWeight: "bold",
  },
    item: {
    padding: 16,
    borderRadius: 12,
    elevation: 3, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  spacing: {
    marginTop: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
    card: {
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 16,
    borderRadius: 16,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,

    elevation: 5,
  },


  header: {
    flexDirection: "row",
    alignItems: "center",
  },


  iconBox: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: "#df1460",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },


  iconText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },


  headerContent: {
    flex:1,
  },


  title: {
    fontSize: 17,
    fontWeight: "700",
  },


  subTitle: {
    marginTop:4,
    color:"#888",
    fontSize:13,
  },


  divider:{
    height:1,
    backgroundColor:"#eee",
    marginVertical:14,
  },


  infoRow:{
    flexDirection:"row",
    justifyContent:"space-between",
    marginBottom:10,
  },


  label:{
    color:"#777",
    fontSize:14,
    fontWeight:"500",
  },


  value:{
    color:"#222",
    fontSize:14,
    fontWeight:"600",
    maxWidth:"55%",
    textAlign:"right",
  },
   overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    width: 140,
    height: 140,
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
export default SleeveCount;
