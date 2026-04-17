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
const url = "http://localhost:5509"

  const answers = [
    { label: "OK", value: "OK" },
    { label: "NOT OK", value: "NOTOK" },
  ];

  // 🔥 State update
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
          Description:
            Description ?? prev[uID]?.[index2]?.Description,
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


 const captureImage = async (item, index2 = -1) => {
  let options = {
    mediaType: "photo",
    maxWidth: 400,
    maxHeight: 550,
    includeBase64: true,
    quality: 1,
  };

  await launchCamera(options, (response) => {
    if (response.didCancel) return;
    if (response.errorCode) {
      alert(response.errorMessage);
      return;
    }

    const photo = response.assets[0];

    handleAnswerChange(
      item.uID,
      index2,
      formValues[item.uID]?.[index2]?.Answer,
      item.WBS,
      item.Wo_Path,
      index2 === -1 ? null : item.CheckItem[index2],
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
  const [formValues, setFormValues] = useState({});
  const onSubmit = async () => {
   const flatList = [];

Object.entries(formValues).forEach(([uID, group]) => {
  Object.entries(group).forEach(([index, item]) => {
    flatList.push({
      ...item,
      uID,
      index: Number(index), // -1 = genel
      isGeneral: Number(index) === -1,
    });
  });
});


// 🔥 VALIDATION
const hasEmptyAnswer = flatList.some(item => {
  if (item.isGeneral) return false; // genel için answer zorunlu değil
  return String(item.Answer || "").trim() === "";
});

if (hasEmptyAnswer) {
  Toast.error("Lütfen tüm cevapları giriniz.");
  return;
}

const hasMissingDescription = flatList.some((item, index2) => {
  if (item.isGeneral) return false;

  const answerRaw = item.Answer;
  const answer = String(answerRaw || "").trim();
  const descriptionEmpty = String(item.Description || "").trim() === "";


  if (answer === "OK") return false;


  const isMeasureOutOfRange =
    item?.Method?.toString() === "Measure" &&
    answer !== "" &&
    (
      Number(answer) < Number(item.Criteria_LL) ||
      Number(answer) > Number(item.Criteria_HH)
    );


  return (
    (answer !== "" && descriptionEmpty) ||
    (isMeasureOutOfRange && descriptionEmpty)
  );
});

if (hasMissingDescription) {
  Toast.error("Lütfen gerekli açıklamaları giriniz.");
  return;
}

const usedUIDs = [
  ...new Set(
    flatList
      .filter(item => item.index !== -1 && String(item.Answer || "").trim() !== "")
      .map(item => item.uID)
  ),
];

const hasMissingGeneralImage = usedUIDs.some((uID) => {
  const generalItem = flatList.find(
    (item) => item.uID === uID && item.index === -1
  );

  return !generalItem?.filePath?.uri;
});

if (hasMissingGeneralImage) {
  Toast.error("Doldurulan kayıtlar için genel görsel zorunludur.");
  return;
}

if (flatList.length === 0) {
  Toast.error("Lütfen maddeleri doldurunuz");
  return;
}



const formData = new FormData();

// JSON payload
formData.append("formValues", JSON.stringify(flatList));

// 🔥 IMAGE EKLE (KEY ÇAKIŞMAZ)
flatList.forEach((item) => {
  if (item.filePath?.uri) {
    const key = `${item.uID}_${item.index}`; // 🔥 artık unique

    formData.append(key, {
      uri: item.filePath.uri,
      name: item.filePath.fileName || `${key}.jpg`,
      type: item.filePath.type || "image/jpeg",
    });
  }
});



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
        fontSize: 13,
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
                        <View style={{flex:1,flexDirection:"column",alignItems:"flex-start",justifyContent:"flex-start"}}>
                <Text style={styles.title}>{item2} 
             
                </Text>
                <View>
                  {item.CheckItem.length>1? <TouchableOpacity
                 disabled={item.IsValid===1}
  style={[styles.imageButton,{height:formValues[item.uID]?.[index2]?.filePath?125:50,width:formValues[item.uID]?.[index2]?.filePath?125:100}]}
  onPress={() => {
    setActiveItem(null);
     captureImage(item, index2)
  }}
>
   {formValues[item.uID]?.[index2]?.filePath ?  (
  <Image
    source={{ uri:    formValues[item.uID]?.[index2]   
                          ?.filePath?.uri}}
    style={[styles.thumbnail,{height:formValues[item.uID]?.[index2]?.filePath?125:50,width:formValues[item.uID]?.[index2]?.filePath?125:100}]}
  />
  ) : (
    <>
      <Icon name="image" size={18} color="#fff" />
      <Text style={styles.imageButtonText}>
        {t("careSystem.addImage")}
      </Text>
    </>
  )}
</TouchableOpacity>:null}
                  
</View>
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
                  {formValues[item.uID]?.[index2]?.Answer?.trim()==="NOTOK" || (item?.Method?.toString() === "Measure"  && (formValues[item.uID]?.[index2]?.Answer?.trim()<item.Criteria_LL || formValues[item.uID]?.[index2]?.Answer?.trim()>item.Criteria_HH )) &&  <TextInput mode="outlined" style={styles.descriptionInput} disabled={item.IsValid===1} value={ formValues[item.uID]?.[index2]?.Description || ""|| ""} 
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
  style={[styles.imageButton,{height:formValues[item.uID]?.[-1]?.filePath?125:50,width:formValues[item.uID]?.[-1]?.filePath?125:100}]}
  onPress={() => {
    setActiveItem(null);
      captureImage(item, -1);
  }}
>
  {formValues[item.uID]?.[-1]?.filePath ? (
  <Image
    source={{ uri: formValues[item.uID]?.[-1]?.filePath?.uri }}
    style={[styles.thumbnail,{height:formValues[item.uID]?.[-1]?.filePath?125:50,width:formValues[item.uID]?.[-1]?.filePath?125:100}]}
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
