import {
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  Modal,
  FlatList,
  Alert,
  Dimensions,
  Linking,
  KeyboardAvoidingView,
 
  TextInput as NativeTextInput,
  ScrollView,

  Platform,
 
} from "react-native";

import {  useEffect,  useState } from "react";
import axios from "axios";
import { Card } from "react-native-paper";
import {
  Button,
} from "@ui-kitten/components";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { sendUserInfoName } from "../../api/auth-api";
import NetInfo from "@react-native-community/netinfo";
import { REACT_APP_SECRET_KEY } from "@env";
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from "react-native-vision-camera";
import { Toast } from "toastify-react-native";


const PaperTrackingSecond = ({navigation}) => {
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
  const [employeeID, setEmployeeId] = useState("");
  const { width, height } = Dimensions.get("screen");


  const [returnMessageData, setReturnMessageData] = useState([]);
  const [countMethod, setCountMethod] = useState(false);
 const url = "https://tstapp.poscoassan.com.tr:8443";
 //const url = "http://10.0.2.2:5506"
  const [returnMessage, setReturnMessage] = useState("");
  const device = useCameraDevice("back");

  

  const productTypes = [
    "Billerud Beyaz Kağıt",
    "Lenk Beyaz Kağıt",
    "Billerud Kraft Kağıt",
    "Lenk Kraft Kağıt",
    "Ompack Vinil",
    "Daein Vinil",
  ];


 

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

  
 
  const getSelectedValue = (options, index) => {
    if (!index) return null;
    return options[index.row];
  };
 
  const counterAction = async (status) => {
    const paper = {
      barcode: qrValue,
      empNo: employeeID,
      Status2:status
    };
    const formBody = Object.keys(paper)
      .map(
        (key) => encodeURIComponent(key) + "=" + encodeURIComponent(paper[key])
      )
      .join("&");

    await axios
      .post(`${url}/Production/CountPaperSecond`, formBody, {
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

   

      const paper = {
        barcode: qrValue,
        empNo: employeeID,
        Status2: status,
  
      };
      const formBody = Object.keys(paper)
        .map(
          (key) =>
            encodeURIComponent(key) + "=" + encodeURIComponent(paper[key])
        )
        .join("&");
      try {
        await axios
          .post(`${url}/Production/DropPaperSecond`, formBody, {
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
    
  };

  const renderItem = ({ item }) => {
    return (
      <Card
        key={item.Id}
        style={{
          borderRadius: 20,
          backgroundColor:
            "#f1f4f5ff" ,

          width: width - 30,
          height: countMethod !== "inspection" ? 300 : 680,

          marginTop: 30,
        }}
      >
        <Text title="Barkod Numarası:" subtitle={item.Barcode} />

        <Card.Content>
          <Text style={stockStyles.title}>Barkod Numarası: {item.Barcode}</Text>
     
            <View>
              <Text style={stockStyles.title}>
                Kağıt Tipi:{" "}
                İkinci El
              </Text>
              <Text style={stockStyles.title}>Renk :{item.PaperType2}</Text>
              <Text style={stockStyles.title}>Sarım Kodu :{item.StockCode}</Text>
              <Text style={stockStyles.title}>Gram: {item.Gram}</Text>
              <Text style={stockStyles.title}>Boyut: {item.Size}</Text>
              <Text style={stockStyles.title}>Ağırlık: {item.Weight}</Text>
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
            {item.Status2 === 1 ? (
              <Button
                style={{
                  backgroundColor:
                   "#1b9dce" ,
                  borderColor:"#1b9dce" ,
                  width: 150,
                }}
                onPress={() => counterAction(3)}
              >
                Stoğa Al
              </Button>
            ) :  (
              <Button
                style={{
                 width:150,
                  backgroundColor:
                  "#1b9dce" ,
                  borderColor:   "#1b9dce" ,
                }}
              
                onPress={() => {
                  if(item.Status2===3){
dropPaper(4);
                  }
                  else{
                    Alert.alert("İşlem yapılamamaktadır.")
                  }
                  
                }}
              >
                {item.Status2 === 1 ? "Stoğa Al" :item.Status2===3? "Stoktan Düş":item.Status2===4?"Stoktan Düşüldü":null}
              </Button>
            )}
          </View>

     
        </Card.Actions>
      </Card>
    );
  };

  const fetchPaperData = async (barcodeParam) => {
    // Eğer barkod yoksa işlem yapma (CountMethod değilse)
    if (!barcodeParam && !countMethod) return;

    try {
      const res = await axios.get(`${url}/Production/GetAllPaperSecond`, {
        params: {
          barcode: barcodeParam,
        },
        headers: {
          "auth-token": REACT_APP_SECRET_KEY,
        },
      });

if(res.data){
  if(res.data[0]?.PaperTypeName==="Recycling Paper"){
   setData(res.data);
  }
  else{
    Toast.error("Sadece ikinci el kağıt işlemi yapılmalıdır.")
  }
     

}
  


  
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


const closeStockModal = () => {
  setModalVisible(false);
  setData([]);
  setQrValue("");
  setScan(false);
  setCount((previous) => previous + 1);
};

const closeManualStockModal = (isStockOut) => {
  if (isStockOut) {
    setModalVisible2(false);
  } else {
    setModalVisible1(false);
  }

  setData([]);
  setQrValue("");
  setQrValueManual("");
  setCount((previous) => previous + 1);
};

const openManualStockModal = (isStockOut) => {
  setData([]);
  setQrValue("");
  setQrValueManual("");
  setModalVisible(false);
  setModalVisible1(!isStockOut);
  setModalVisible2(isStockOut);
  setCountMethod(isStockOut);
};

const renderStockAction = (title, description, icon, onPress) => (
  <TouchableOpacity
    style={stockStyles.actionCard}
    activeOpacity={0.7}
    accessibilityRole="button"
    onPress={onPress}
  >
    <View style={stockStyles.iconBox}>
      <FontAwesome name={icon} size={22} color="#0B337C" />
    </View>

    <View style={stockStyles.actionContent}>
      <Text style={stockStyles.actionTitle}>{title}</Text>
      <Text style={stockStyles.actionDescription}>{description}</Text>
    </View>

    <Text style={stockStyles.chevron}>›</Text>
  </TouchableOpacity>
);

const renderStockModal = (visible, title, onClose, manual = false) => (
  <Modal
    animationType="fade"
    transparent
    visible={visible}
    onRequestClose={onClose}
  >
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={stockStyles.modalBackdrop}
    >
      <View style={stockStyles.modalPanel}>
        <View style={stockStyles.modalHeader}>
          <Text style={stockStyles.modalTitle}>{title}</Text>

          <TouchableOpacity
            style={stockStyles.closeButton}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Kapat"
          >
            <FontAwesome name="close" size={20} color="#64748B" />
          </TouchableOpacity>
        </View>

        <FlatList
          style={stockStyles.resultList}
          contentContainerStyle={stockStyles.resultContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => String(item.Id)}
          data={!manual || qrValue.length > 0 ? data : []}
          renderItem={renderItem}
          ListHeaderComponent={
            manual ? (
              <View style={stockStyles.searchSection}>
                <Text style={stockStyles.inputLabel}>
                  Barkod Numarası
                </Text>

                <NativeTextInput
                  style={stockStyles.input}
                  value={qrValueManual}
                  onChangeText={setQrValueManual}
                  placeholder="Barkod numarası giriniz"
                  placeholderTextColor="#94A3B8"
                  autoCapitalize="none"
                  autoCorrect={false}
                  accessibilityLabel="Barkod Numarası"
                />

                <TouchableOpacity
                  style={stockStyles.searchButton}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  onPress={() => {
                    setQrValue(qrValueManual);
                    fetchPaperData(qrValueManual);
                  }}
                >
                  <Text style={stockStyles.searchButtonText}>
                    Sorgula
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={stockStyles.emptyState}>
              {manual && !qrValue.length ? (
                <Text style={stockStyles.emptyDescription}>
                  Kağıt bilgilerini görüntülemek için barkod
                  numarasını girip sorgulayın.
                </Text>
              ) : (
                <>
                  <Text style={stockStyles.emptyTitle}>
                    Kağıt bilgisi bulunamadı
                  </Text>
                  <Text style={stockStyles.emptyDescription}>
                    Barkod bilgisini kontrol ederek tekrar deneyin.
                  </Text>
                </>
              )}
            </View>
          }
        />
      </View>
    </KeyboardAvoidingView>
  </Modal>
);

  return (
  <View style={stockStyles.screen}>
    {!scan ? (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={stockStyles.scrollContent}
      >
        <View style={stockStyles.content}>
          <View style={stockStyles.header}>
            <View style={stockStyles.headerAccent} />

            <Text style={stockStyles.title}>Stok İşlemleri</Text>
            <Text style={stockStyles.subtitle}>
              Stoğa giriş veya stoktan çıkış işlemini seçin.
            </Text>
          </View>

          <Text style={stockStyles.groupLabel}>STOĞA GİRİŞ</Text>

          {renderStockAction(
            "Stoğa Al",
            "Kamera ile barkod okutarak ilerleyin.",
            "sign-in",
            () => scanAgain(false),
          )}

          {renderStockAction(
            "Manuel Stoğa Al",
            "Barkod numarasını elle girin.",
            "keyboard-o",
            () => openManualStockModal(false),
          )}

          <Text style={stockStyles.groupLabel}>STOKTAN ÇIKIŞ</Text>

          {renderStockAction(
            "Stoktan Düş",
            "Kamera ile barkod okutarak ilerleyin.",
            "sign-out",
            () => scanAgain(true),
          )}

          {renderStockAction(
            "Manuel Stoktan Düş",
            "Barkod numarasını elle girin.",
            "keyboard-o",
            () => openManualStockModal(true),
          )}
        </View>
      </ScrollView>
    ) : (
      <View style={stockStyles.cameraContainer}>
        {device  ? (
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
          <View style={stockStyles.cameraEmpty}>
            <Text style={stockStyles.cameraText}>
              Kamera kullanılamıyor.
            </Text>
          </View>
        )}

       

        {device && (
          <View pointerEvents="none" style={stockStyles.cameraHint}>
            <Text style={stockStyles.cameraText}>
              Kamerayı kağıt üzerindeki barkoda doğrultun.
            </Text>
          </View>
        )}
      </View>
    )}

    {renderStockModal(
      modalVisible,
      "Kağıt Bilgileri",
      closeStockModal,
    )}

    {renderStockModal(
      modalVisible1,
      "Manuel Stoğa Al",
      () => closeManualStockModal(false),
      true,
    )}

    {renderStockModal(
      modalVisible2,
      "Manuel Stoktan Düş",
      () => closeManualStockModal(true),
      true,
    )}
  </View>
);
};
const stockStyles = StyleSheet.create({
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
    marginTop: 12,
    marginBottom: 12,
    marginLeft: 4,
  },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 94,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E3EAF4",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
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
  resultList: {
    flex: 1,
  },
  resultContent: {
    flexGrow: 1,
    padding: 16,
  },
  searchSection: {
    paddingBottom: 18,
    marginBottom: 16,
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
  emptyState: {
    paddingHorizontal: 12,
    paddingVertical: 36,
    alignItems: "center",
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

export default PaperTrackingSecond;
