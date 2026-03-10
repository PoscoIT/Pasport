import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { ActivityIndicator, Dialog, Portal, RadioButton, TextInput } from "react-native-paper";
import { useEffect, useRef, useState } from "react";
import { Button, Radio, RadioGroup } from "@ui-kitten/components";
import axios from "axios";
import { sendUserInfoName } from "../../api/auth-api";
import { useNavigation } from "@react-navigation/native";
import { REACT_APP_SECRET_KEY } from "@env";
import Icon from "react-native-vector-icons/FontAwesome";
import { launchCamera } from "react-native-image-picker";
import { PERMISSIONS, RESULTS } from "react-native-permissions";
import { Camera, useCameraDevice } from "react-native-vision-camera";
import { Toast } from "toastify-react-native";

const CareSystemChecklist = ({ selectedQrCodeZone, showCamera }) => {
  const [questionList, setQuestionList] = useState([]);
  const [employeeID, setEmployeeId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [cameraVisible, setCameraVisible] = useState(false);
  const [filePath, setFilePath] = useState([]);
  const hideDialog = () => setVisible(false);
  const [visible, setVisible] = useState(false);
  const [loading,setLoading] = useState(true)
  const [activeItem, setActiveItem] = useState(null);

  const handleCapture = (photo) => {
    // photo.uri veya photo.base64 hangisini kullanıyorsan
    const value = photo?.uri;

    if (!activeItem) return;

    handleAnswerChange(
      activeItem.uID,
      activeItem.Answer,
      activeItem.WBS,
      activeItem.Wo_Path,
      activeItem.CheckItem,
      activeItem.Description,
    );

    setActiveItem(null);
  };
  const navigation = useNavigation();
  const answers = [
    { label: "OK", value: "OK" },
    { label: "NOT OK", value: "NOTOK" },
  ];
  const handleAnswerChange = (
    questionId,
    value,
    wbs,
    wbsPath,
    checklistName,
    description,
  ) => {
    setFormValues((prev) => ({
      ...prev,
      [questionId]: {
        Answer: value,
        uID: questionId,
        WBS: wbs,
        WbsPath: wbsPath,
        CreatedID: employeeID,
        CreatedName: employeeName,
        ChecklistName: checklistName,
        Description: description,
      },
    }));
  };
  const requestCameraPermission = async () => {
    const permission = await Camera.requestCameraPermission();
    return permission === "granted";
  };
  const CameraScreen = ({ onCapture, onClose }) => {
    const camera = useRef(null);
    const device = useCameraDevice("back");

    if (!device) return null;

    const takePhoto = async () => {
      try {
        const photo = await camera.current.takePhoto({
          qualityPrioritization: "quality",
        });

        onCapture(photo);
        onClose();
      } catch (e) {}
    };

    return (
      <View style={{ flex: 1, backgroundColor: "black" }}>
        <Camera
          ref={camera}
          style={{ flex: 1 }}
          device={device}
          isActive={showCamera}
          photo={true}
        />
        <TouchableOpacity style={styles.captureBtn} onPress={takePhoto}>
          <Text style={styles.captureText}>
            <Icon name="camera" size={24} />
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeText}>
            <Icon name="close" size={24} />
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const captureImage = async (item) => {
    const hasPermission = await requestCameraPermission();
    setActiveItem(item);

    if (!hasPermission) {
      alert("Kamera izni verilmedi");
      return;
    }

    setVisible(false);
    setCameraVisible(true);
  };

  const getUser = async () => {
    await sendUserInfoName((sendResponse) => {
      setEmployeeId(sendResponse.empSicil);
      setEmployeeName(sendResponse.uname);
    });
  };
  const [formValues, setFormValues] = useState({});
  const onSubmit = async () => {
    const allFieldsFilled = questionList.data.every(
      (item) => String(formValues[item.uID]?.Answer || "").trim() !== "",
    );

    await axios
      .post(
        "http://10.0.2.2:5509/WorkOrder/MMS/CreateCareSystemChecklist",
        { formValues },
        {
          headers: {
            "auth-token": REACT_APP_SECRET_KEY,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      )
      .then((res) => {
        if (res.data) {
          if (res.data.status === "Success") {
            setFormValues({});
            alert("Başarıyla Kaydedildi");
          } else {
            alert("Lütfen İlgili alanları doldurunuz.");
          }
        } else {
          alert("Hata ile Karşılaşıldı.");
        }
      });

    /*  await axios.post("").then((res)=>{
        if(res.data){
            if(res.data.status==="Success"){
                

            }
            else{
                 alert("Lütfen İlgili alanları doldurunuz.")
            }

        }
        else{
            alert("Hata ile Karşılaşıldı.")
        }
    }) */
  };

  const getQuestionList = async () => {
  
    if (selectedQrCodeZone) {
      await axios
        .get(
          `http://10.0.2.2:5509/WorkOrder/MMS/GetCareSystemData/BAL PRE_CheckSheet(200. ENTRY HYDRAULIC SYSTEM)_R365_300015`,
          {
            headers: {
              "auth-token": REACT_APP_SECRET_KEY,
            },
          },
        )
        .then((res) => {
          if (res.data) {
            if(res.data.status==="Success")
            setQuestionList(res.data)
          else if (res.data.status==="Error"){
            Toast.error(res.data.message)
            setQuestionList([])
          }
          } else {
            alert("Veri Bulunamadı.");
            setQuestionList([]);
          }
        })
        .catch((err) => setQuestionList([])).finally(()=>{
            setLoading(false)
        })
    }
      setLoading(false)
  };

  useEffect(() => {
    getQuestionList();
  }, [selectedQrCodeZone]);

  useEffect(() => {
    getUser();
  }, []);

  return (
    <ScrollView style={styles.view}>
      {/* {questionList?.data ? (
        <Text style={styles.textCenter}>
          {questionList?.data[0]?.EQUIPMENTQRCODEZONENAME?.toUpperCase()}{" "}
        </Text>
      ) : null} */}
      {questionList?.data?.map((item) => {
        return (
          <View key={item.uID}>
       

            <View style={styles.card}>
              {item?.CheckItem && (
                <Text style={styles.title}>{item.CheckItem}</Text>
              )}

              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
              >
                <View style={styles.content}>
                  {/* Measure Input */}
                  {item?.Method === "Measure" ? (
                    <TextInput
                      mode="outlined"
                      style={styles.input}
                      value={formValues[item.uID]?.Answer || ""}
                      onChangeText={(text) =>
                        handleAnswerChange(
                          item.uID,
                          text,
                          item.WBS,
                          item.Wo_Path,
                          item.CheckItem,
                          formValues[item.uID]?.Description,
                        )
                      }
                      right={<TextInput.Affix text={item.Unit} />}
                      label="Değer"
                      keyboardType="numeric"
                      outlineStyle={styles.inputOutline}
                    />
                  ) : (
                    <View style={styles.radioWrapper}>
                      <Text style={styles.questionText}>{item.Question}</Text>

                      <RadioGroup
                        selectedIndex={
                          formValues[item.uID]?.Answer
                            ? answers.findIndex(
                                (ans) =>
                                  ans.value === formValues[item.uID].Answer,
                              )
                            : -1
                        }
                        onChange={(index) =>
                          handleAnswerChange(
                            item.uID,
                            answers[index].value,
                            item.WBS,
                            item.Wo_Path,
                            item.CheckItem,
                            formValues[item.uID]?.Description,
                          )
                        }
                      >
                        {answers.map((ans) => (
                          <Radio key={ans.value}>{ans.label}</Radio>
                        ))}
                      </RadioGroup>
                    </View>
                  )}

                
                  <TextInput
                    mode="outlined"
                    style={styles.descriptionInput}
                    value={formValues[item.uID]?.Description || ""}
                    onChangeText={(text) =>
                      handleAnswerChange(
                        item.uID,
                        formValues[item.uID]?.Answer,
                        item.WBS,
                        item.Wo_Path,
                        item.CheckItem,
                        text,
                      )
                    }
                    label="Açıklama"
                    multiline
                    numberOfLines={3}
                    outlineStyle={styles.inputOutline}
                  />

                
                  <TouchableOpacity
                    style={styles.imageButton}
                    onPress={() => {
                      setActiveItem(null);
                      captureImage(item);
                    }}
                  >
                    <Icon name="image" size={18} color="#fff" />
                    <Text style={styles.imageButtonText}>Görsel Ekle</Text>
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
            </View>
          </View>
        );
      })}
      {
      questionList.length > 0 && !loading ? (
        <Button
          style={{
            marginBottom: 20,
            marginHorizontal: 90,
            marginVertical: 20,
            borderRadius: 20,
            backgroundColor: "#2156b1",
            borderColor: "#2156b1",
          }}
          onPress={onSubmit}
        >
          Checklisti Tamamla
        </Button>
      ) :
       loading?
        <ActivityIndicator size="24px" color="#9E9E9E"/>
      :(
        <View>
          <Text style={{textAlign:"center"}}>İlgili Alan Bulunamadı</Text>
        </View>
      )}
    </ScrollView>
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
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
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
    marginTop: 4,
  },

  imageButton: {
    marginTop: 6,
    backgroundColor: "#68a2e3",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
     fontSize:12,
    gap: 8,
  },

  imageButtonText: {
    color: "#fff",
    fontWeight: "600",
     fontSize:12
  },
});
export default CareSystemChecklist;
