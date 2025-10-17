import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native'
import { TextInput} from 'react-native-paper';
import {useEffect, useState} from "react";
import {Button} from "@ui-kitten/components";
import axios from "axios";
import {sendUserInfoName} from "../../api/auth-api";
import { useNavigation } from '@react-navigation/native';
import {REACT_APP_SECRET_KEY} from '@env'
const CareSystemChecklist = ()=>{

    const [questionList,setQuestionList] = useState([])
    const [employeeID,setEmployeeId] = useState("")
   const [employeeName,setEmployeeName] = useState("")
   const navigation = useNavigation()
    const handleAnswerChange = (questionId, value,wbs,wbsPath,checklistName) => {
        setFormValues(prev => ({
            ...prev,
            [questionId]: {
                answer:value,
                wbs,
                wbsPath,
                createdID:employeeID,
                createdName:employeeName,
                checklistName:checklistName
            },
        }));
       

    };
       const getUser = async () => {
              await sendUserInfoName(sendResponse => {
      
                  setEmployeeId(sendResponse.empSicil)
                 setEmployeeName(sendResponse.uname)
      
              })
          };
    const [formValues, setFormValues] = useState({});
    const onSubmit = async() => {
     

   const allFieldsFilled = questionList.data.every(item =>
  String(formValues[item.uID]?.answer || '').trim() !== ''
);
    if(allFieldsFilled){
        await axios.post("https://tstapp.poscoassan.com.tr:8443/WorkOrder/MMS/CreateCareSystemChecklist",{formValues},{
                           
                            headers:{
                                "auth-token":REACT_APP_SECRET_KEY
                            }
                        }).then((res)=>{
        if(res.data){
            if(res.data.status==="Success"){
                      setFormValues({})
                      alert("Başarıyla Kaydedildi")

            }
            else{
                 alert("Lütfen İlgili alanları doldurunuz.")
            }

        }
        else{
            alert("Hata ile Karşılaşıldı.")
        }})

  
    }
    else{
        alert("Lütfen tüm alanları doldurunuz.")
    }
  

   

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
    }


    const getQuestionList = async ()=>{
        await axios.get(`https://tstapp.poscoassan.com.tr:8443/WorkOrder/MMS/GetCareSystemData/CGPL PRE_CheckSheet(210. COOLANT FILTERATıON UNIT)_R365_300015`,{
                           
                            headers:{
                                "auth-token":REACT_APP_SECRET_KEY
                            }
                        }).then((res)=>{
           
            if(res.data){

               
                setQuestionList(res.data)

            }
            else{
                alert("Veri Bulunamadı.")
                setQuestionList([])
            }
        }).catch((err)=>  setQuestionList([]))
    }


    useEffect(()=>{
         
        getQuestionList()
    },[])

        useEffect(()=>{
            getUser()
        },[])


    return (
    <ScrollView  style={styles.view}>
      {questionList?.data? <Text style={styles.textCenter}>{questionList?.data[0]?.EQUIPMENTQRCODEZONENAME?.toUpperCase()} </Text>:null} 
         {questionList?.data?.map(item => {
         

            return (
                <View key={item.uID}>
                   {/*  {(item.Type === 1 || item.Type === 2) && (
                        <View style={{ flex: 1, flexDirection: 'column', marginHorizontal: 10 }}>
                            <Text style={{ textAlign: 'justify', fontSize: 13 }}>{item.Question}</Text>
                            <RadioGroup
                                selectedIndex={
                                    formValues[item.ID] !== undefined
                                        ? answers.findIndex(ans => ans.value === formValues[item.uID])
                                        : null
                                }
                                onChange={index => handleAnswerChange(item.uID, answers[index].value)}
                                style={styles.radio}
                            >
                                {answers.map(ans => (
                                    <Radio key={ans.key}>{ans.value}</Radio>
                                ))}
                            </RadioGroup>
                            <View
                                style={{
                                    borderBottomWidth: 0.5,
                                    borderBottomColor: '#cacaca',
                                    marginBottom: 5,
                                }}
                            />
                        </View>
                    )} */}
                  
{/* onPress={()=>navigation.navigate("ChecklistDetails",item)} */}
                    {item?<TouchableOpacity style={{ textAlign: 'justify', fontSize: 13,marginHorizontal:10 }} onPress={()=>navigation.navigate("ChecklistDetails",item)}>
                        <Text>{item?.CheckItem}</Text>
                        <Text style={{fontWeight:"bold"}}> Alan:{item?.Wo_Path?.toUpperCase()}</Text>
                    </TouchableOpacity>:null}
                  
                        <TextInput
                        mode='outlined'
                            key={item.uID}
                            style={styles.input}
                            theme={{roundness:20}}
                            value={formValues[item.uID] || ''}                      
                            onChangeText={text => handleAnswerChange(item.uID, text,item.WBS,item.Wo_Path,item.CheckItem)}
                            right={<TextInput.Affix text={item.Unit} />}
                            label={item.Question}
                            keyboardType={'numeric'}
                        />
          
                </View>
            );
        })}
        {questionList.length>0?  <Button style={{marginBottom:20,marginHorizontal:90,marginVertical:20,borderRadius:10}} onPress={onSubmit}>
            Checklisti Tamamla
        </Button>:
            <View>
            <Text style={styles.textCenter}>İlgili Alan Bulunamadı</Text> 
            <Button style={{marginBottom:20,marginHorizontal:50}}>
                Tekrar Okut
            </Button>
        </View>
        }




    </ScrollView>
    )

}
const styles = StyleSheet.create({
    view:{
      flex:1,
      backgroundColor:"white",
      marginTop:1
    },
    textCenter:{
        textAlign:"center",
        fontSize:16,
        marginHorizontal:10,
        marginVertical:10,
        fontWeight:"bold"
    },
    input: {
        backgroundColor:"white",
        margin: 6,
        fontSize:13,
        height:40,
     
    borderRadius:50,
        borderTopRightRadius:20,
        borderTopLeftRadius:20,
        borderBottomEndRadius:20,
        borderBottomStartRadius:20,
        padding: 4,
    },
    radio:{
    flex:1,
        flexDirection:"row",
        margin: 1,
        padding: 10,
    }
})
export default CareSystemChecklist