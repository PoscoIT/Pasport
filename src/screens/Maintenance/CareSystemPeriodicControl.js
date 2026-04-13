import {  useEffect, useRef, useState } from "react";
import {  FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { REACT_APP_SECRET_KEY } from "@env";
import axios from "axios";
import { Swipeable } from "react-native-gesture-handler";
import { ActivityIndicator,  MD2Colors } from "react-native-paper";
import {  useCameraDevice } from "react-native-vision-camera";
import {  useIsFocused, useNavigation } from "@react-navigation/native";
import { Toast } from "toastify-react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { sendUserInfoName } from "../../api/auth-api";



const CareSystemPeriodicControl = () => {
  const [qrCodeZone, setQrCodeZone] = useState([]);

    const [employeeID, setEmployeeID] = useState("");
  const [loading,setLoading] = useState(true)


 //  const url = "https://tstapp.poscoassan.com.tr:8443";
 const url = "http://10.0.2.2:5509"
    const navigation = useNavigation()
    const isFocused = useIsFocused();

    const handleDelete = async(item) => {
   
const data = {
  QrCode:item.EQUIPMENTQRCODEZONENAME,
  employeeID:employeeID
}

  await axios.post(`${url}/WorkOrder/MMS/RemoveChecklistRoute`,data,
          {
            headers: {
              "auth-token": REACT_APP_SECRET_KEY,
              "Content-Type": "application/x-www-form-urlencoded",
            },
          },).then((res)=>{
            if(res.data.status==="Success"){
  setQrCodeZone(prev => prev.filter(i => i.EQUIPMENTQRCODEZONENAME !== item.EQUIPMENTQRCODEZONENAME));
  Toast.success("Başarıyla silindi")
            }
            else{
  Toast.error("Hata ile karşılaşıldı")
            }
          }).catch(err=>{
              Toast.error("Hata ile karşılaşıldı")
          })


};

    const renderRightActions = (item) => {
  return (
    <TouchableOpacity
      onPress={() => handleDelete(item)}
      style={{
        backgroundColor: '#ea8076',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingHorizontal: 20,
      
        flex: 1,
      }}
    >
      <Icon name="close" size={20}/>
      <Text style={{ color: 'black', fontWeight: 'bold' }}>
        Sil
      </Text>
    </TouchableOpacity>
  );
};

 const getUser = async () => {
    await sendUserInfoName((sendResponse) => {
      setEmployeeID(sendResponse.empSicil);
    });
  };
const renderLeftActions = (item) => {
  return (
    <TouchableOpacity
      onPress={() => handleDelete(item)}
      style={{
        backgroundColor: '#ea8076',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
      
        flex: 1,
      }}
    >
      <Icon name="close" size={20}/>
      <Text style={{ color: 'black', fontWeight: 'bold' }}>
        Sil
      </Text>
    </TouchableOpacity>
  );
};

 const toggleItem = (uID) => {
   navigation.navigate("CareSystemChecklist",{uID})
  };

    const renderItem = ({ item }) => {
      
     
    return (
      <Swipeable renderRightActions={() => renderRightActions(item)} renderLeftActions={()=>renderLeftActions(item)}>
      <TouchableOpacity
        onPress={() => {
          if (Number(item.Percentage) < 100) {
            toggleItem(item.EQUIPMENTQRCODEZONENAME);
          } else {
            Toast.error("Doldurulacak Checklist Maddesi Bulunmamaktadır");
          }
        }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 12,
          backgroundColor: "#fff",
        }}
      >
        <View style={{ flex: 1, marginRight: 2 }}>
          <Text style={{ fontSize: 13 }}>
            {item.EQUIPMENTQRCODEZONENAME}
          </Text>

          <View style={{
            flexDirection: "row",
            justifyContent: "space-between"
          }}>
            <View
              style={[
                styles.badge,
                {
                  backgroundColor:
                    item.Percentage >= 80
                      ? "#D1FAE5"
                      : item.Percentage >= 50
                      ? "#FEF3C7"
                      : "#FEE2E2",
                  marginTop: 5,
                },
              ]}
            >
              <Text style={{
                color:
                  item.Percentage >= 80
                    ? "#065F46"
                    : item.Percentage >= 50
                    ? "#92400E"
                    : "#991B1B",
                fontWeight: "700",
              }}>
                Tamamlanma: {item.Percentage}%
              </Text>
            </View>

            <View style={[styles.badge, { marginTop: 5 }]}>
              <Text>
                Tamamlanmayan: {item.RatioUncompletedText}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
    );
  };

const getChecklistByZone = async () => {
    setLoading(true);
    try {
      await axios
        .get(
          `${url}/WorkOrder/MMS/GetCareSystemChecklistDaily?UserID=${employeeID}`,
          {
            headers: {
          "auth-token": REACT_APP_SECRET_KEY,
        },
          },
        )
        .then((res) => {
       
          if (res.data.status === "Success") {
       
            setQrCodeZone(
             res.data.data[0]

            );
          } else {
            setQrCodeZone([]);
          }
        })
        .catch((t) => {})
    } catch (e) {
   
      setQrCodeZone([]);
    }
    setLoading(false);
  };


 useEffect(() => {
  if (isFocused) {
   
    getChecklistByZone();
  }
  
}, [isFocused,employeeID]);

  useEffect(() => {
    getUser();
  }, [employeeID]);
 


if(loading){
   return  <ActivityIndicator animating={true} color={MD2Colors.blue800} />
}


  return (
    <View style={styles.view}>
       <TouchableOpacity style={{width:"100%",flexDirection:"row",alignItems:"center"}} onPress={() => navigation.goBack()}>
        <Icon name="angle-left" size={22} color="#000" />
        <Text style={[styles.backText,{marginLeft:5}]}>Geri Dön</Text>
      </TouchableOpacity>
      {/* <View style={{ flex: 1, width: "100%", height: "100%" }}>
        <GestureDetector gesture={gesture}>
          <ReanimatedCamera
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={isActive}
            codeScanner={codeScannner}
            animatedProps={animatedProps}
          />
        </GestureDetector>
      </View> */}

        {qrCodeZone.length>0?<Text style={{fontSize:15,alignSelf:"center",margin:10,fontWeight:600}}>Günlük Checklist Listesi</Text>:null}
       
           <FlatList
             data={qrCodeZone}
             keyExtractor={(item) => item?.EQUIPMENTQRCODEZONENAME?.toString()}
             renderItem={renderItem}
             contentContainerStyle={{ paddingBottom: 100 }} // buton için boşluk
             ListEmptyComponent={
               <Text style={{ textAlign: "center", marginTop: 15 }}>
                Lütfen Checklist Rotası Oluşturunuz
               </Text>
             }
           /> 

         {/* <CareSystemChecklist selectedQrCodeZone={qrValue} /> */}
      
      
    </View>
  );
};

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
   view: {
    flex: 1,
    backgroundColor: "white",
  },
  itemText: {
    fontSize: 16,
    flexWrap: "wrap", // Uzun metinleri sar
  },
  button3: {
    width: "70%",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 25,
  },
   itemContainer: {
    paddingVertical: 16, // Satır yüksekliği
    paddingHorizontal: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
  },
  badge: {
    backgroundColor: "#E6F0FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },

  badgeText: {
    color: "#1E3A8A",
    fontWeight: "600",
    fontSize: 13,
  },
  itemText: {
    fontSize: 16,
    flexWrap: "wrap", // Uzun metinleri sar
  },
});

export default CareSystemPeriodicControl;
