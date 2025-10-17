import axios from 'axios';
import React,{useState,useEffect} from 'react'
import {Dimensions, View,Text} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import {  LineChart} from "react-native-gifted-charts";
import {Button} from "@ui-kitten/components";
import {t} from "i18next";
import {useNavigation} from "@react-navigation/native";
import moment from 'moment';
import { Card } from 'react-native-paper';
import {REACT_APP_SECRET_KEY} from '@env'

const ChecklistDetails = ({route}) => {
  const item = route.params
  const [details,setDetails] = useState([])
    const navigation = useNavigation()
    const [listData,setListData] = useState([])



    const {height,width} = Dimensions.get("window")

    const getDetail = async()=>{
      await axios.get(`https://tstapp.poscoassan.com.tr:8443/WorkOrder/MMS/GetCareSystemChecklistRecord/${item.uID}`,{
                           
                            headers:{
                                "auth-token":REACT_APP_SECRET_KEY
                            }
                        }).then((res)=>{
        if(res.data?.status==="Success"){
       
        const flatData = res.data.data.flat();
   


// istediğin format
const formatted = flatData.filter(item => !isNaN(Number(item.Answer))).map(item => ({
  value: isNaN(item.Answer)?0 :Number(item.Answer),
  label: moment(item.CreatedAt).format("DD.MM.YYYY"),
}));
 setListData(flatData.filter(item => isNaN(Number(item.Answer))))


          setDetails(formatted)
        }
        else{
          setDetails([])

        }
      }).catch(err=>{
            setDetails([])
          alert(t("safetyControlScreen.errorMessage"))
      })
    }

    useEffect(() => {
      getDetail()
    
      
    }, [])


  return (
    <View style={{flex:1}}>
        <ScrollView>
            {details.length>0 ?<LineChart data = {details} height={height*0.8} width={width*0.9}   spacing={50}   // x-axis item aralığı
  xAxisLabelTextStyle={{
    fontSize: 10,
    width: 70,      // her label için genişlik
    flexWrap: "wrap",
      transform: [{ rotate: "-15deg" }],
  }}/>:listData.length>0? listData.map((item,index)=>(
     <Card key={index} style={{marginVertical:15,backgroundColor:"#f8f8f8ff",borderRadius:20}}>
  
    <Card.Content>
      <Text variant="titleLarge"><Text style={{fontWeight:"bold"}}>Checlist:</Text>{item.CheckItem}</Text>
      <Text variant="bodyMedium"><Text style={{fontWeight:"bold"}}>Yanıt:</Text>{item.Answer}</Text>
          <Text variant="bodyMedium"><Text style={{fontWeight:"bold"}}>Kontrol Tarihi:</Text>{moment(item.CreatedAt).format("DD.MM.YYYY")}</Text>
          
    </Card.Content>

   
  </Card>
    // <List.Item
    //       key={index}
    //       title={`Checklist:${item.CheckItem}`}
    //       description={` Yanıt: ${item.Answer} Tarih: ${moment(item.CreatedAt).format("DD.MM.YYYY")}`}
    //     />
  )):
            <View style={{alignSelf:'center',justifyContent:'center',alignItems: 'center'}}>
                <Text style={{fontSize:16,fontWeight:"bold",marginVertical:10}}>{t("noDetails")}</Text>
                <Button onPress={()=>navigation.goBack()} style={{marginBottom:20,marginHorizontal:50,marginVertical:30}}>
                    {t("goBack")}
                </Button>
            </View>}

        </ScrollView>

     






    </View>
  )
}

export default ChecklistDetails