import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  ActivityIndicator,
  Alert, // Alert importu eksikti, eklendi
} from "react-native";
import {  TextInput } from "react-native-paper";
import { useEffect, useState } from "react";
import { Button, Radio, RadioGroup } from "@ui-kitten/components";
import axios from "axios";
import { sendUserInfoName } from "../../api/auth-api";
import { REACT_APP_SECRET_KEY } from "@env";
import { Toast } from "toastify-react-native";
import { useTranslation } from "react-i18next";
import { launchCamera } from "react-native-image-picker";
import { check, PERMISSIONS, request, RESULTS, openSettings } from "react-native-permissions";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
// 🔥 ScrollView yerine FlatList versiyonunu içe aktarıyoruz
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";

const CareSystemChecklist = ({ route }) => {
  const { uID,CheckTime } = route.params;
  const selectedQrCodeZone = uID;
  const selectedCheckTime = CheckTime

  // 🔥 PAGINATION STATELERİ
  const [questionList, setQuestionList] = useState([]); // Artık sadece array tutuyoruz
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); 
  const [loadingMore, setLoadingMore] = useState(false); 

  const [employeeID, setEmployeeId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [formValues, setFormValues] = useState({});

  const navigation = useNavigation();
  const { t } = useTranslation();
//const url = "http://10.0.2.2:5509"
//const url = "http://localhost:5509"
  const url = "https://tstapp.poscoassan.com.tr:8443";
  const answers = [
    { label: "OK", value: "OK" },
    { label: "NOT OK", value: "NOTOK" },
  ];

  const handleAnswerChange = (
    uID,
    index2,
    value,
    WBS,
    Wo_Path,
    CheckItem,
    Description,
    filePath
  ) => {
    setFormValues((prev) => ({
      ...prev,
      [uID]: {
        ...prev[uID],
        [index2]: {
          ...prev[uID]?.[index2],
          Answer: value ?? prev[uID]?.[index2]?.Answer,
          Description: Description ?? prev[uID]?.[index2]?.Description,
          filePath: filePath ?? prev[uID]?.[index2]?.filePath,
          WBS,
          uID,
          Wo_Path,
          CheckItem,
          CreatedID: employeeID,
          CreatedName: employeeName,
        },
      },
    }));
  };

const requestCameraPermission = async () => {
  const permission =
    Platform.OS === "android"
      ? PERMISSIONS.ANDROID.CAMERA
      : PERMISSIONS.IOS.CAMERA;

  try {
    const result = await request(permission);

    if (result === RESULTS.GRANTED) {
      return true;
    }

    if (result === RESULTS.BLOCKED) {
      Alert.alert(
        "Kamera İzni Gerekli",
        "Ayarlar'dan kamera izni vermen gerekiyor.",
        [
          { text: "İptal", style: "cancel" },
          { text: "Ayarlar", onPress: openSettings },
        ]
      );
    }

    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
};
  const captureImage = async (item, index2) => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      return;
    }
    let options = {
      mediaType: "photo",
      maxWidth: 400,
      maxHeight: 550,
      includeBase64: true,
      quality: 1,
    };
    launchCamera(options, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        alert(response.errorMessage);
        return;
      }
      const photo = response.assets?.[0];
      if (!photo) return;
      handleAnswerChange(
        item.uID,
        index2,
        formValues[item.uID]?.[index2]?.Answer,
        item.WBS,
        item.Wo_Path,
      item.CheckItem[index2],
        formValues[item.uID]?.[index2]?.Description,
        photo
      );
    });
  };

  const getUser = async () => {
    await sendUserInfoName((sendResponse) => {
      setEmployeeId(sendResponse.empSicil);
      setEmployeeName(sendResponse.uname);
    });
  };

const onSubmit = async () => {
  const flatList = [];

  Object.entries(formValues).forEach(([uID, group]) => {
    Object.entries(group).forEach(([index, item]) => {
      flatList.push({
        ...item,
        uID,
        index: Number(index)
      });
    });
  });




  const hasMissingDescription = flatList.some((item) => {
   

    const answer = String(item.Answer || "").trim();
    const descriptionEmpty = String(item.Description || "").trim() === "";

    if (answer === "OK") return false;

    const isMeasureOutOfRange =
      item?.Method?.toString() === "Measure" &&
      answer !== "" &&
      (Number(answer) < Number(item.Criteria_LL) ||
        Number(answer) > Number(item.Criteria_HH));

    return (
      (answer !== "" && descriptionEmpty) ||
      (isMeasureOutOfRange && descriptionEmpty)
    );
  });

  if (hasMissingDescription) {
    Toast.error("Lütfen gerekli açıklamaları giriniz.");
    return;
  }

  if (flatList.length === 0) {
    Toast.error("Lütfen maddeleri doldurunuz");
    return;
  }

  try {
  
    const photosToUpload = flatList
      .filter((item) => item?.filePath?.uri)
      .map((item) => ({
        tempKey: `${item.uID}_${item.index}`,
        uri: item.filePath.uri,
        name: item.filePath.fileName || `${item.uID}_${item.index}.jpg`,
        type: item.filePath.type || "image/jpeg",
      }));

    let finalFileMap = {};
  

    if (photosToUpload.length > 0) {
      const batchSize = 5;

      for (let i = 0; i < photosToUpload.length; i += batchSize) {
        const batch = photosToUpload.slice(i, i + batchSize);
        const tempFormData = new FormData();

        batch.forEach((photo) => {
          tempFormData.append(photo.tempKey, photo);
        });

        const uploadRes = await axios.post(
          `${url}/WorkOrder/MMS/UploadTempFiles`,
          tempFormData,
          {
            headers: {
              "auth-token": REACT_APP_SECRET_KEY,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        uploadRes.data?.data?.forEach((file) => {
        finalFileMap[file.tempKey] = {
  tempFilePath: file.tempFilePath, 
  originalname: file.originalname,
};
        });
      }
    }

const formData = new FormData();
    formData.append("formValues", JSON.stringify(flatList));
formData.append("fileMap", JSON.stringify(finalFileMap));


  
    const finalResponse = await axios.post(
      `${url}/WorkOrder/MMS/CreateCareSystemChecklist`,
    formData,
       {
            headers: {
    "auth-token": REACT_APP_SECRET_KEY,
    "Content-Type": "multipart/form-data",
  },
          }
      
      
    );

    if (finalResponse.data?.status === "Success") {
      setFormValues({});
      Toast.success("Başarılı");
      navigation.goBack();
    } else {
      Toast.error(finalResponse.data?.data);
    }

  } catch (err) {
    console.error(err);
    Toast.error("Hata oluştu");
  }
};
 
  const getQuestionList = async (pageNumber = 1) => {
    if (!selectedQrCodeZone) return;

    if (pageNumber === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const encodedSelectedQrCodeZone = encodeURIComponent(selectedQrCodeZone);
          const encodedSelectedCheckTime= encodeURIComponent(selectedCheckTime);
      // Backend'e limit ve page değerlerini gönderiyoruz
      const res = await axios.get(
        `${url}/WorkOrder/MMS/GetCareSystemData/${encodedSelectedQrCodeZone}/${encodedSelectedCheckTime}?page=${pageNumber}&limit=10`,
        {
          headers: { "auth-token": REACT_APP_SECRET_KEY },
        }
      );

      if (res.data && res.data.status === "Success") {
        const newData = res.data.data || [];

        // Eğer 20'den az veri geldiyse, backend'de başka veri kalmamıştır
        if (newData.length < 10) {
          setHasMore(false);
        }

        if (pageNumber === 1) {
          setQuestionList(newData);
        } else {
          // Sayfa 2 ve sonrasında, yeni gelen verileri eskinin altına ekliyoruz
          setQuestionList((prev) => [...prev, ...newData]);
        }
      } else if (res.data && res.data.status === "Error") {
        if (pageNumber === 1) {
          Toast.error(res.data.message);
          setErrorMessage(res.data.message);
          setQuestionList([]);
        }
        setHasMore(false);
      }
    } catch (err) {
      if (pageNumber === 1) setQuestionList([]);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // İlk açılış
  useEffect(() => {
    getQuestionList(1);
    getUser();
  }, [selectedQrCodeZone]);


  const loadMoreData = () => {
    if (!loadingMore && hasMore && !loading){
      const nextPage = page + 1;
      setPage(nextPage);
      getQuestionList(nextPage);
    }
  };


 const renderItem = ({ item, index }) => {
  const showWBS = index === 0 || questionList[index - 1]?.WBS !== item.WBS;

  return (
    <View key={`${item.uID}_${index}`}>
      {showWBS && (
        <View
          style={{
            marginTop: 12,
            marginHorizontal: 16,
            paddingVertical: 8,
            paddingHorizontal: 12,
            backgroundColor: "#fff",
            borderRadius: 8,
            borderLeftWidth: 4,
            borderLeftColor: "#2f80ed",
          }}
        >
          <Text style={{ fontSize: 13, color: "#6b7280", marginBottom: 2 }}>
            WBS
          </Text>
          <Text style={{ fontSize: 13, fontWeight: "600", color: "#111827" }}>
            {item.WBS}
          </Text>
          {!!item.Wo_Path && (
            <Text style={{ fontSize: 13, color: "#374151", marginTop: 2 }}>
              {item.Wo_Path}
            </Text>
          )}
        </View>
      )}

      <View style={styles.card}>
        <View>
          <View style={styles.content}>
            {/* Sadece CheckItem dizisine göre eleman üretiyoruz */}
            {item.CheckItem?.map((item2, index2) => (
              <View key={index2} style={{ marginBottom: 16 }}>
                {item2 && (
                  <View style={{ flex: 1, flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-start" }}>
                    <Text style={styles.title}>{item2}</Text>
                    
                    <View style={{marginBottom:5  }}>
                      {/* ✅ Kontrol kaldırıldı: Her CheckItem'ın kendi fotoğraf yükleme butonu var */}
                      <TouchableOpacity
                        disabled={item.IsValid === 1}
                        style={[
                          styles.imageButton,
                          {
                            height: formValues[item.uID]?.[index2]?.filePath ? 125 : 50,
                            width: formValues[item.uID]?.[index2]?.filePath ? 125 : 100,
                          },
                        ]}
                        onPress={() => {
                          setActiveItem(null);
                          captureImage(item, index2); // Doğru iç indeks (index2) gidiyor
                        }}
                      >
                        {formValues[item.uID]?.[index2]?.filePath ? (
                          <Image
                            source={{ uri: formValues[item.uID]?.[index2]?.filePath?.uri }}
                            style={[
                              styles.thumbnail,
                              {
                                height: formValues[item.uID]?.[index2]?.filePath ? 125 : 50,
                                width: formValues[item.uID]?.[index2]?.filePath ? 125 : 100,
                              },
                            ]}
                          />
                        ) : (
                          <>
                            <Icon name="image" size={18} color="#fff" />
                            <Text style={styles.imageButtonText}>
                              {t("careSystem.addImage")}
                            </Text>
                          </>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {item?.Method?.toString() === "Measure" ? (
                  <TextInput
                    disabled={item.IsValid === 1}
                    mode="outlined"
                    style={styles.input}
                    value={formValues[item.uID]?.[index2]?.Answer || ""}
                    onChangeText={(text) =>
                      handleAnswerChange(
                        item.uID, index2, text, item.WBS, item.Wo_Path, item2,
                        formValues[item.uID]?.[index2]?.Description,
                        formValues[item.uID]?.[index2]?.filePath // Küçük harf uyumu (filePath)
                      )
                    }
                    right={<TextInput.Affix text={item.Unit} />}
                    label={t("careSystem.value")}
                    keyboardType="numeric"
                    outlineStyle={styles.inputOutline}
                  />
                ) : (
                  <View style={styles.radioWrapper}>
                    <Text style={styles.questionText}>
                      {item.Question} {item.IsValid === 1 ? <Icon name="check" size={20} color={"#4b8046"} /> : null}
                    </Text>

                    <RadioGroup
                      disabled={item.IsValid === 1}
                      selectedIndex={
                        formValues[item.uID]?.[index2]?.Answer
                          ? answers.findIndex((ans) => ans.value === formValues[item.uID][index2].Answer)
                          : -1
                      }
                      onChange={(idx) =>
                        handleAnswerChange(
                          item.uID, index2, answers[idx].value, item.WBS, item.Wo_Path, item2,
                          formValues[item.uID]?.[index2]?.Description,
                          formValues[item.uID]?.[index2]?.filePath // Küçük harf uyumu
                        )
                      }
                    >
                      {answers.map((ans) => (
                        <Radio disabled={item.IsValid === 1} key={ans.value}>
                          {ans.label}
                        </Radio>
                      ))}
                    </RadioGroup>
                  </View>
                )}

                <TextInput
                  mode="outlined"
                  style={styles.descriptionInput}
                  disabled={item.IsValid === 1}
                  value={formValues[item.uID]?.[index2]?.Description || ""}
                  onChangeText={(text) =>
                    handleAnswerChange(
                      item.uID, index2, formValues[item.uID]?.[index2]?.Answer, item.WBS, item.Wo_Path, item2,
                      text, formValues[item.uID]?.[index2]?.filePath
                    )
                  }
                  label={t("description")}
                  multiline
                  numberOfLines={3}
                  outlineStyle={styles.inputOutline}
                />
              </View>
            ))}
            {/* ❌ DIŞARIDAKİ HATALI FOTOĞRAF BUTONU BURADAN KALDIRILDI */}
          </View>
        </View>
      </View>
    </View>
  );
};

  // 🔥 LİSTE ALTINDA GÖSTERİLECEK YÜKLENİYOR SPİNNER'I
  const renderFooter = () => {
  if (loading || !loadingMore) return <View style={{ height: 40 }} />;
    return (
      <View style={{ paddingVertical: 20, paddingBottom: 100 }}>
        <ActivityIndicator size="large" color="#2156b1" />
      </View>
    );
  };

  return (
    <View
      style={{ flex: 1, width: "100%", height: "100%", backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableOpacity
        style={{ width: "100%", flexDirection: "row", alignItems: "center", paddingVertical: 10 }}
        onPress={() => navigation.goBack()}
      >
        <Icon name="angle-left" size={22} color="#000" style={{ marginLeft: 10 }} />
        <Text style={styles.backText}>{t("goBack")}</Text>
      </TouchableOpacity>
       <Text style={{fontWeight:"bold",textAlign:"center"}}>!!GÖRSEL EKLEMEK ZORUNLU DEĞİLDİR!!</Text>
      {loading   ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" />
        </View>
      ) : !loading && questionList.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ textAlign: "center" }}>{t("careSystem.relatedAreaNotFound")}</Text>
        </View>
      ) : (
        <KeyboardAwareFlatList
          style={{marginBottom:50}}
          enableOnAndroid={true}
          
          extraScrollHeight={100}
          keyboardShouldPersistTaps="handled"
          
          // 🔥 FLATLIST PROPS
          data={questionList}
       keyExtractor={(item, index) => `${item.uID}_${index}`}
          renderItem={renderItem}
          
          // 🔥 PAGINATION PROPS
          onEndReached={loadMoreData}
          onEndReachedThreshold={1} 
          ListFooterComponent={renderFooter}
        />
      )}

      {questionList.length > 0 && !loading ? (
        <View style={{ backgroundColor: "#fff", position: "absolute", bottom: 0, paddingBottom: 30, flex: 1, left: 0, right: 0 }}>
          <Button
            style={{
              marginHorizontal: 40,
              marginVertical: 10,
              borderRadius: 20,
              backgroundColor: "#2156b1",
              borderColor: "#2156b1",
            }}
            onPress={onSubmit}
          >
            {t("careSystem.completeChecklist")}
          </Button>
        </View>
      ) : null}
    </View>
  );
};


const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 16,
    borderRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 10 },
  },

  title: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 5,
    color: "#222",
    textAlign: "justify",
  
  },

  content: {
    gap: 14,
  
  },

  input: {
    backgroundColor: "#fafafa",
    fontSize:12,
    
  },

  descriptionInput: {
    backgroundColor: "#fafafa",
    minHeight: 70,
    fontSize:12
  },

  inputOutline: {
    borderRadius: 14,
    
  },

  questionText: {
    fontSize:12,
    marginBottom: 8,
    color: "#444",
  },

  radioWrapper: {
    marginTop: -10,
    
  },

  imageButton: {
    marginTop: 6,
    backgroundColor: "#68a2e3",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    flexDirection: "row",
    alignSelf:"center",
    justifyContent: "center",
     fontSize:12,
    gap: 8,
     overflow: "hidden",
     width:100,
     height:50
  },

  imageButtonText: {
    color: "#fff",
    fontWeight: "600",
     fontSize:12
  },
  thumbnail: {
  width: 125,
  height: 125,
  position: "absolute", 
  top: 0,
  right:0,
  bottom:0,
  left: 0,
},
backButton: {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: 8,
  marginLeft:5
},

backText: {
  marginLeft: 5,
  fontSize: 16,
  color: "#000",
  fontWeight: "500",
},
});



export default CareSystemChecklist;