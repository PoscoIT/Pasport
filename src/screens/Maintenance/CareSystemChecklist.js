import {
  View,
  Text,
  StyleSheet,

  TouchableOpacity,
 
  Platform,
  Image
} from "react-native";
import { ActivityIndicator, TextInput } from "react-native-paper";
import { useEffect, useRef, useState } from "react";
import { Button, Radio, RadioGroup } from "@ui-kitten/components";
import axios from "axios";
import { sendUserInfoName } from "../../api/auth-api";
import { REACT_APP_SECRET_KEY } from "@env";

import {  useCameraDevice } from "react-native-vision-camera";
import { Toast } from "toastify-react-native";
import { useTranslation } from "react-i18next";
import { launchCamera } from "react-native-image-picker";
import { check, PERMISSIONS, request, RESULTS } from "react-native-permissions";
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const CareSystemChecklist = ({ route }) => {

    const { uID } = route.params;
    const selectedQrCodeZone = uID
     
  const [questionList, setQuestionList] = useState([]);
  const [employeeID, setEmployeeId] = useState("");
  const [employeeName, setEmployeeName] = useState("");

  const [loading,setLoading] = useState(true)
  const [activeItem, setActiveItem] = useState(null);
  const [errorMessage,setErrorMessage] = useState("")
  const navigation = useNavigation()
    const device = useCameraDevice("back");
    const {t} = useTranslation()
  //  const url = "https://tstapp.poscoassan.com.tr:8443"
const url = "http://10.0.2.2:5509"

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
  setFormValues(prev => ({
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
        CreatedID: employeeID,
        CreatedName: employeeName,
        Wo_Path,
        CheckItem,
      }
    }
  }));
};
//  const handleAnswerChange = (
//   uID,
//   index2,
//   value,
//   WBS,
//   Wo_Path,
//   CheckItem,
//   Description,
//   filePath
// ) => {
 
//   setFormValues(prev => {
  
//    if (index2 === null) {
//   return {
//     ...prev,
//     [uID]: {
//       ...prev[uID],
//       0: {
//         ...prev[uID]?.[0],
//         Description,
//         filePath
//       }
//     }
//   };
// }

   
//     return {
//       ...prev,
//       [uID]: {
//         ...prev[uID],
//         [index2]: {
//           ...prev[uID]?.[index2],
//           Answer: value,
//           WBS,
//           uID,
//           CreatedID:employeeID,
//           CreatedName:employeeName,
//           Wo_Path,
//           CheckItem,
//           Description,
//           filePath
//         }
//       }
//     };
//   });
// };
 const requestCameraPermission = async () => {
  const permission =
    Platform.OS === "android"
      ? PERMISSIONS.ANDROID.CAMERA
      : PERMISSIONS.IOS.CAMERA;

  try {
    const result = await check(permission);

    switch (result) {
      case RESULTS.DENIED:
        const requestResult = await request(permission);
        return requestResult === RESULTS.GRANTED;

      case RESULTS.GRANTED:
      case RESULTS.LIMITED:
        return true;

      case RESULTS.BLOCKED:
        Alert.alert(
          "Kamera İzni Gerekli",
          "Kamerayı kullanmak için ayarlardan izin vermen gerekiyor.",
          [
            { text: "İptal", style: "cancel" },
            {
              text: "Ayarlar",
              onPress: () => openSettings(),
            },
          ]
        );
        return false;

      default:
        return false;
    }
  } catch (error) {
    console.error("Permission error:", error);
    return false;
  }
};


  // const captureImage = async (selectedItem) => {
  //  const hasPermission = await requestCameraPermission();


  // if (!hasPermission) {
  //   alert("Kamera izni verilmedi");
  //   return;
  // }
  // setCameraVisible(true);
  // setActiveItem(selectedItem); // 👈 item + index burada tutuluyor

  // };

   const captureImage = async (item) => {
  
      let options = {
        mediaType: "photo",
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
     const photo = response.assets[0];

  //   // 🔥 BURASI ÖNEMLİ
   handleAnswerChange(
  item.uID,
  0, // ✅ null yerine 0
  formValues[item.uID]?.[0]?.Answer,
  item.WBS,
  item.Wo_Path,
  item.CheckItem,
  formValues[item.uID]?.[0]?.Description,
  photo
);
  });

  
        
}
else{
  Toast.error("Lütfen kamera izni veriniz")
}
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

    const formData = new FormData();

const flatList = [];


// flatten
Object.values(formValues).forEach(group => {
  Object.values(group).forEach(item => {
    flatList.push(item);
  });
});

// JSON olarak ekle
formData.append("formValues", JSON.stringify(flatList));

// image’ları ekle (uID ile bağlayacağız)
flatList.forEach((item, index) => {
  if (item.filePath?.uri) {
    formData.append(`${item.uID}_${index}`, {
      uri: item.filePath.uri,
      name: item.filePath.fileName,
      type: item.filePath.type,
    });
  }
});

const hasMissingFile = flatList.some(item => !item.filePath?.uri);

const hasMissingDescription = flatList.some(item => {
  console.log(item)
  const answer = String(item.Answer || "").trim();

  // Eğer Not Ok ise description zorunlu değil
  if (answer === "OK") return false;

  // Diğer durumlarda description boşsa hata
  return String(item.Description || "").trim() === "";
});

if (hasMissingDescription) {
  Toast.error("Lütfen gerekli açıklamaları giriniz.");
  return;
}

if(flatList.length===0){
    Toast.error("Lütfen maddeleri doldurunuz");
  return;
}

if (hasMissingFile) {
  Toast.error("Lütfen doldurulan alanlar için dosya ekleyin.");
  return;
}



    await axios
      .post(
        `${url}/WorkOrder/MMS/CreateCareSystemChecklist`,
       formData,
        {
         headers: {
        "auth-token": REACT_APP_SECRET_KEY,
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
        },
      )
      .then((res) => {
      
        if (res.data) {
          if (res.data.status === "Success") {
            setFormValues({});
            Toast.success(t("safetyControlScreen.savedSuccesffuly"));
            navigation.goBack()
          } else {
           Toast.error(t("careSystem.pleaseEnterValue"));
          }
        } else {
           Toast.error(t("safetyControlScreen.errorMessage"));
        }
      });

   
  };


  const getQuestionList = async () => {
  
    if (selectedQrCodeZone) {
      await axios
        .get(
          `${url}/WorkOrder/MMS/GetCareSystemData/${selectedQrCodeZone}`,
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
            setErrorMessage(res.data.message)
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






  if (device == null) return <Text>Kamera bulunamadı</Text>;
  return (

             
          
    <View style={{ flex: 1, width: "100%", height: "100%",paddingBottom:130,backgroundColor:"#fff" }}    behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <TouchableOpacity style={{width:"100%",flexDirection:"row",alignItems:"center"}} onPress={() => navigation.goBack()}>
        <Icon name="angle-left" size={22} color="#000" />
        <Text style={[styles.backText,{marginLeft:5}]}>Geri Dön</Text>
      </TouchableOpacity>

<KeyboardAwareScrollView style={styles.view}    enableOnAndroid={true}
  extraScrollHeight={200}
  keyboardShouldPersistTaps="handled" >
      {questionList?.data?.map((item,index) => {
          const showWBS =
    index === 0 || questionList?.data[index - 1].WBS !== item.WBS;
        return (
          <View key={item.uID}>
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
    <Text
      style={{
        fontSize: 13,
        color: "#6b7280",
        marginBottom: 2,
      }}
    >
      WBS
    </Text>

    <Text
      style={{
        fontSize: 16,
        fontWeight: "600",
        color: "#111827",
      }}
    >
      {item.WBS}
    </Text>

    {!!item.Wo_Path && (
      <Text
        style={{
          fontSize: 13,
          color: "#374151",
          marginTop: 2,
        }}
      >
        {item.Wo_Path}
      </Text>
    )}
  </View>
)}

            <View style={styles.card}>
            
            

              <View
           
              >
                <View style={styles.content}>
                  {item.CheckItem.map((item2,index2)=>
                  <View key={index2}>
                      {item2 && (
                        <View style={{flex:1,flexDirection:"row",alignItems:"flex-end",justifyContent:"flex-start"}}>
                <Text style={styles.title}>{item2} 
                   {/* {item.IsValid===1?
                 <View style={{flex:1,alignItems:"center",justifyContent:"center",alignSelf:"flex-start",flexDirection:"row"}}>
                  <Text>Girişi Yapılmıştır</Text>
                  <Icon name="check" size={20} color={"#4b8046"} />
                  </View>
                :<Icon name="close" size={20} color={"#ef443f"} />}  */}
                </Text>
               
                </View>
              )}
                     {item?.Method?.toString() === "Measure" ? (
                    <TextInput
                    disabled={item.IsValid===1}
                      mode="outlined"
                      style={styles.input}
                  value={formValues[item.uID]?.[index2]?.Answer || ""}
                   onChangeText={(text) =>
  handleAnswerChange(
    item.uID,
    index2,
    text,
    item.WBS,
    item.Wo_Path,
    item2, // önemli: item değil item2
    formValues[item.uID]?.[index2]?.Description,
        formValues[item.uID]?.[index2]?.FilePath,
  )
}
                      right={<TextInput.Affix text={item.Unit} />}
                      label="Değer"
                      keyboardType="numeric"
                      outlineStyle={styles.inputOutline}
                    />
                  ) : (
                    <View style={styles.radioWrapper}>
                      <Text style={styles.questionText}>{item.Question}  {item.IsValid===1?<Icon name="check" size={20} color={"#4b8046"} />:null}</Text>
                     

                      <RadioGroup
                       disabled={item.IsValid===1}
                      selectedIndex={
  formValues[item.uID]?.[index2]?.Answer
    ? answers.findIndex(
        (ans) =>
          ans.value === formValues[item.uID][index2].Answer,
      )
    : -1
}
                       onChange={(index) =>
  handleAnswerChange(
    item.uID,
    index2,
    answers[index].value,
    item.WBS,
    item.Wo_Path,
    item2,
    formValues[item.uID]?.[index2]?.Description,
            formValues[item.uID]?.[index2]?.FilePath,
  )
}
                      >
                        {answers.map((ans) => (
                          <Radio disabled={item.IsValid===1} key={ans.value}>{ans.label}</Radio>
                        ))}
                      </RadioGroup>
                    </View>
                  )}
                  {formValues[item.uID]?.[index2]?.Answer.trim()==="NOTOK"&&  <TextInput mode="outlined" style={styles.descriptionInput} disabled={item.IsValid===1} value={ formValues[item.uID]?.[index2]?.Description || ""|| ""} 
                   onChangeText={(text) =>
      handleAnswerChange(
        item.uID,
        index2,
        formValues[item.uID]?.[index2]?.Answer,
        item.WBS,
        item.Wo_Path,
        item2,
        text,
        formValues[item.uID]?.[index2]?.filePath
      )
    }
                  label={t("description")} multiline numberOfLines={3} outlineStyle={styles.inputOutline} />}
                 

             
                  </View>)}
               
                 

                
                 

                
                <TouchableOpacity
                 disabled={item.IsValid===1}
  style={[styles.imageButton,{height:formValues[item.uID]?.[0]?.filePath?125:50,width:formValues[item.uID]?.[0]?.filePath?125:100}]}
  onPress={() => {
    setActiveItem(null);
    captureImage({
      ...item,
      index: item.uID,
    });
  }}
>
  {formValues[item.uID]?.[0]?.filePath ? (
  <Image
    source={{ uri: formValues[item.uID]?.[0]?.filePath?.uri }}
    style={[styles.thumbnail,{height:formValues[item.uID]?.[0]?.filePath?125:50,width:formValues[item.uID]?.[0]?.filePath?125:100}]}
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
            </View>
          </View>
        );
      })}
      {
       
       loading?
        <ActivityIndicator size="24px" color="#9E9E9E"/>
      :!loading && questionList.length===0?(
        <View>
       
          <TouchableOpacity style={{width:"100%",flexDirection:"row",alignItems:"center"}} onPress={() => navigation.goBack()}>
               <Icon name="angle-left" size={22} color="#000" />
               <Text style={[styles.backText,{marginLeft:5}]}>Geri Dön</Text>
             </TouchableOpacity>
   <Text style={{textAlign:"center"}}>      {t("careSystem.relatedAreaNotFound")}</Text>
        </View>
      ):null}
      </KeyboardAwareScrollView>
      {questionList.length > 0 && !loading ? (
        <View style={{backgroundColor:"#fff",position:"absolute",bottom:40,flex:1,left:0,right:0}}>
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
       {t("careSystem.completeChecklist")}
        </Button>
        </View>
      ):null}
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
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 0,
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
