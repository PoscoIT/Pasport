import { useEffect, useRef, useState } from "react";
import { StyleSheet ,Text,TouchableOpacity} from "react-native"
import PickerModal from 'react-native-picker-modal-view';
import {REACT_APP_SECRET_KEY} from '@env'
import axios from "axios";
import { ScrollView } from "react-native-gesture-handler";
import { Card } from "react-native-paper";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import moment from "moment";


const CustomCard = ({item})=>{
   
return <Card  style={{marginVertical:15,backgroundColor:"#f8f8f8ff",borderRadius:20}}>
  
    <Card.Content>
      <Text variant="titleLarge"><Text style={{fontWeight:"bold"}}>Checklist Madde:</Text>{item.CheckItem}</Text>
      {/* <Text variant="bodyMedium"><Text style={{fontWeight:"bold"}}>Checklist:</Text>{item.EQUIPMENTQRCODEZONENAME}</Text> */}
          <Text variant="bodyMedium"><Text style={{fontWeight:"bold"}}>Son Kontrol Tarihi:</Text>{moment(item?.LastCheckDate)?.format("DD.MM.YYYY")}</Text>
               <Text variant="bodyMedium" ><Text style={{fontWeight:"bold"}}>Period:</Text>  {item.Period} Gün   {item.IsValid?<FontAwesome   name={"check"} size={20} color={"#105c1c"}/>:<FontAwesome   name={"close"} size={20} color={"#a21414ff"}/>} </Text>
     
        
    </Card.Content>

   
</Card>
}
const CareSystemPeriodicControl = ()=>{
    const [mmsLines,setMMSLines] = useState([])
      const [selectedMMSLine,setSelectedMMSLine] = useState([])
      const [qrCodeZone,setQrCodeZone] = useState([])
      const [checklistByLine,setChecklistByLine] = useState([])
    const [selectedQrCodeZone,setSelectedQrCodeZone] = useState([])
    const pickerRef = useRef(null)
    
  const url = 'https://tstapp.poscoassan.com.tr:8443';
     const getMMSList = async () => {
     
        try{
          
                await axios.get(`${url}/WorkOrder/MMS/Lines`,{
                   
                    headers:{
                        "auth-token":REACT_APP_SECRET_KEY
                    }
                }).then(res=>{
                    


                    setMMSLines(res?.data?.data?.map(item => [{
                        value: item.Line_ID,
                        Name:  item.Line,

                    }][0]))

                }).catch(t=>console.warn("selammm"))
            

        }
        catch (e) {

            setMMSLines([])
        }

    }
    const getChecklistByZone = async () => {
     
        try{
           
                await axios.get(`${url}/WorkOrder/MMS/GetCareSystemChecklistByZoneName/${selectedMMSLine.value}`,{
                   
                    headers:{
                        "auth-token":REACT_APP_SECRET_KEY
                    }
                }).then(res=>{
                   

          

            setQrCodeZone(res?.data?.data?.map((item,index) => [{
                        Id:index,
                        value: item.EQUIPMENTQRCODEZONENAME,
                        Name:  item.EQUIPMENTQRCODEZONENAME,
                        Percentage:item.Percentage
                    }][0]))


                    

                }).catch(t=>console.warn("selammm"))
            

        }
        catch (e) {

            setQrCodeZone([])
        }

    }
     const getChecklistByLine = async () => {
     
        try{

                await axios.get(`${url}/WorkOrder/MMS/GetCareSystemChecklistByLine/${selectedMMSLine.value}/${selectedQrCodeZone.value}`,{
                   
                    headers:{
                        "auth-token":REACT_APP_SECRET_KEY
                    }
                }).then(res=>{
                    

          

                    setChecklistByLine(res.data.data)
                    

                }).catch(t=>console.warn("selammm"))
            

        }
        catch (e) {

            setChecklistByLine([])
        }

    }

//      const getChecklistByLine = useMemo(async () => {
//         console.warn("burda",selectedMMSLine)
//        try {
//            const apiResponse = await axios.get(`${url}/WorkOrder/MMS/GetCareSystemChecklistByLine/${selectedMMSLine.value}`);
//            console.warn(apiResponse.data.data)
//            return setChecklistByLine(apiResponse.data.data)
//        } catch (error) {
//            return setChecklistByLine([])
//        }
//    }, [selectedMMSLine]);

    useEffect(()=>{
        getMMSList()
    },[])

      useEffect(()=>{
        if(selectedMMSLine && selectedQrCodeZone)
        getChecklistByLine()
    },[selectedMMSLine,selectedQrCodeZone])
     useEffect(()=>{
        getChecklistByZone()
    },[selectedMMSLine])

    return <ScrollView style={{backgroundColor:"white"}}>
   <PickerModal
                                            style={{width: "100%", backgroundColor: "black"}}
                                            Autocomplete={false}
                                            items={mmsLines}
                                            sortingLanguage={'tr'}
                                            showToTopButton={true}
                                            showAlphabeticalIndex={true}
                                            selected={selectedMMSLine}
                                            autoGenerateAlphabeticalIndex={true}
                                            selectPlaceholderText={<Text>
                                                Hat Seçiniz
                                            </Text>}
                                            searchPlaceholderText={"Hat Seçiniz"}
                                            requireSelection={false}
                                            autoSort={true}
                                            onSelected={item => setSelectedMMSLine(item)}/>

                                             <PickerModal
                                             style={{ width: "100%", backgroundColor: "black" }}

                                            Autocomplete={false}
                                            items={qrCodeZone}
                                            sortingLanguage={'tr'}
                                            showToTopButton={true}
                                            showAlphabeticalIndex={true}
                                            autoSort={true}
                                            ref={pickerRef}
                                       
                                            selected={selectedQrCodeZone}
                                            autoGenerateAlphabeticalIndex={true}
//                                            renderListItem={(selectedItem, listItem) => {
                                           
                                          
//     if (!listItem) return null;
//     return (
//       <TouchableOpacity
//         style={{ padding: 10, borderBottomWidth: 0.5, borderColor: "#ddd" }}
//         onPress={() => {  
           
            
              
              
//              if (pickerRef.current && typeof pickerRef.current.onClose === "function") {
//                  console.log(listItem,selectedQrCodeZone)
//                    setSelectedQrCodeZone(listItem);
//                   pickerRef.current.onClose(); 
//                 }
//          } }
//       >
//         <Text
//           style={{ flexWrap: "wrap", flexShrink: 1, fontSize: 13 }}
//           numberOfLines={0}
//         >
//           {listItem.Name}
//         </Text>
//       </TouchableOpacity>
//     );
//   }}
                                             
                                            selectPlaceholderText={<Text>
                                                Checklist Seçiniz
                                            </Text>}
                                            searchPlaceholderText={"Checklist Seçiniz"}
                                            requireSelection={false}    
                                            onSelected={item => setSelectedQrCodeZone(item)}
                                   />

                                            <Text style={{textAlign:"center",fontSize:16,fontWeight:"bold"}}>Checklist Maddeleri</Text>
                                            {checklistByLine.length>0 ?<Text  style={{fontWeight:"bold",margin:10  }}>Tamamlanma Yüzdesi: %{selectedQrCodeZone.Percentage}</Text>:null}

                                            {selectedMMSLine && selectedQrCodeZone ?checklistByLine?.map(item=>(
                                                <CustomCard key={item.uID}  item={item}></CustomCard>
                                            )):null}
                                    
    </ScrollView>
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 18, marginBottom: 8 },
  selected: { fontSize: 16, marginBottom: 20, color: "blue" },
  itemContainer: {
    paddingVertical: 16, // Satır yüksekliği
    paddingHorizontal: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
  },
  itemText: {
    fontSize: 16,
    flexWrap: "wrap", // Uzun metinleri sar
  },
});

export default CareSystemPeriodicControl