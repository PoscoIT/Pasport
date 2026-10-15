import { View, StyleSheet, Text, Dimensions,  TouchableOpacity,TextInput,FlatList,Pressable,Modal, Alert,ActivityIndicator,SectionList } from "react-native";

import { useCallback, useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { REACT_APP_SECRET_KEY } from "@env";
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from "axios";
import { Toast } from "toastify-react-native";
import i18next, { t } from "i18next";
import { sendUserInfoName } from "../../api/auth-api";
import { useFocusEffect } from "@react-navigation/native";



  


const UserCard = ({ item }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.card}
    >
      {/* Avatar */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.NameSurname?.FullName?.split(" ")
  .map(word => word.slice(0, 1))
  .join(" ").replace("Ç","C")}</Text>
      </View>

      {/* Bilgiler */}
      <View style={styles.content}>
        <Text style={styles.title}>{item.NameSurname}</Text>
       <Text style={styles.subtitle}>
            {item?.CompanyType}
          </Text>

        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: item.color },
            ]}
          />
          <Text style={styles.status}>{item?.status}</Text>
        </View>
      </View>

      {/* Sağ ok */}
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
};


const EmergencyAreaChecklist = ({navigation}) => {
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserEntry, setSelectedUserEntry] = useState(null);
    const [employeeID, setEmployeeID] = useState("");
    const [entryData,setEntryData] = useState([])
    const [emergencyData,setEmergencyData] = useState([])
    const url = "https://tstapp.poscoassan.com.tr:8443"
    const [loading,setLoading] = useState(false)
  const [loadingData,setLoadingData] = useState(false)
  const [filteredDataEntry,setFilteredDataEntry] = useState(entryData)
  const [filteredDataEmergency,setFilteredDataEmergency] = useState(emergencyData)
  const [entryCheck,setEntryCheck] = useState(false)
  const [endGatherCheck,setEndGatherCheck] = useState(false)

     const getUser = async () => {
        await sendUserInfoName((sendResponse) => {
          setEmployeeID(sendResponse.empSicil);
        });
      };

      const getData = async()=>{
  
        await axios.get(`${url}/ISGSystems/GetEmergencyChecklist`,{
           headers: { "auth-token": REACT_APP_SECRET_KEY },
        }).then((res)=>{
      
          if(res.data?.status==="success"){
  const entries = res.data.entryList || [];
      const emergencies = res.data.emergencyCheckList || [];

      setEntryData(entries);
      setEmergencyData(emergencies);


      setFilteredDataEntry(entries);
      setFilteredDataEmergency(emergencies);
          }
          else{
     setEntryData([]);
      setEmergencyData([]);
      setFilteredDataEntry([]);
      setFilteredDataEmergency([]);
          }
        }).catch((err)=>{
      setEntryData([]);
      setEmergencyData([]);
      setFilteredDataEntry([]);
      setFilteredDataEmergency([]);
        })

      }
    

   const AddChecklistRecord = async(item)=>{
  

    const newItem = {
      employeeID:item.EmployeeID,
      name:item.FullName,
      workerType:item.Detail,
      createdID:employeeID
    }

        const formBody = Object.keys(newItem)
      .map(
        (key) =>
          encodeURIComponent(key) + "=" + encodeURIComponent(newItem[key])
      )
      .join("&");
    setLoading(true)
  
 

    await axios.post(`${url}/IsgSystems/AddEmergencyRecord`,formBody,{
        headers:{
                 "auth-token": REACT_APP_SECRET_KEY,
           
        },
       
    }).then((res)=>{
        
        if(res.data?.status==="Success"){
       
  Toast.success("Başarıyla Kaydedildi");
  closeBottomSheetEntry()
        }
         else if(i18next.language === "tr" && res?.data?.messageTr){
        Toast.error(res.data.messageTr)
    }
    else if(i18next.language === "en" && res?.data?.messageEn){
        Toast.error(res.data.messageEn)
    }

    }).catch(err=>{
        Toast.error("Hata ile karşılaşıldı")
    }).finally(()=>{
      setLoading(false)
    })

  }
  const EndGathering = async () =>{
    setLoading(true)
    await axios.get(`${url}/ISGSystems/EndGathering`,{
       headers:{
             "auth-token": REACT_APP_SECRET_KEY,
          "Content-Type": "application/json",
    },
    params:{
      employeeID:employeeID
    }
    }).then((res)=>{
      if(res.data?.status==="success"){
       Toast.success("Başarıyla gönderildi");

      }
      else{
      Toast.error(t("safetyControlScreen.errorMessage"))
      }
    }).catch(err=>{}).finally(()=>{
      setLoading(false)
      getData()
    })
  }
  const RemoveChecklistRecord = async (item)=>{

  setLoading(true)

   const newItem = {
      employeeID:item.EmployeeID,
      passivedID:employeeID,
      name:item.NameSurname,

    }

        const formBody = Object.keys(newItem)
      .map(
        (key) =>
          encodeURIComponent(key) + "=" + encodeURIComponent(newItem[key])
      )
      .join("&");
    setLoading(true)
if(item){
await axios.post(`${url}/IsgSystems/RemoveEmergencyRecord` ,formBody ,{
    headers:{
             "auth-token": REACT_APP_SECRET_KEY,
        
    },
   
}).then((res)=>{
    if(res.data?.status==="success"){
Toast.success("Başarıyla Silindi");
closeBottomSheet()
    }
    else if(i18next.language === "tr" && res?.data?.messageTr){
        Toast.error(res.data.messageTr)
    }
    else if(i18next.language === "en" && res?.data?.messageEn){
        Toast.error(res.data.messageEn)
    }

}).catch(err=>{
    Toast.error("Hata ile karşılaşıldı")
}).finally(()=>{
      setLoading(false)
    })
}
else{

}
    
  }

const openBottomSheetEntry = (item) => {
  setSelectedUser(null);
  setSelectedUserEntry(item);
};

const openBottomSheet = (item) => {
  setSelectedUserEntry(null);
  setSelectedUser(item);
};

const closeBottomSheetEntry = () => {
  setSelectedUserEntry(null);
  getData()
};

const closeBottomSheet = () => {
  setSelectedUser(null);
    getData()
};  
 const normalizeText = (text) => {

  return text
    ?.toLocaleLowerCase('tr-TR')
    ?.replace(/ğ/g, 'g')
    ?.replace(/ü/g, 'u')
    ?.replace(/ş/g, 's')
    ?.replace(/ı/g, 'i')
    ?.replace(/ö/g, 'o')
    ?.replace(/ç/g, 'c');
};

const handleSearch = (value) => {

  setSearch(value);

  const searchValue = normalizeText(value);

  const filteredEntry = entryData.filter((item) =>
    normalizeText(item.FullName)?.includes(searchValue) ||
normalizeText(item.Detail)?.includes(searchValue)
  );

  const filteredEmergency = emergencyData.filter((item) =>
    normalizeText(item.NameSurname)?.includes(searchValue)
  || normalizeText(item.Company)?.includes(searchValue) ||
   normalizeText(item.CompanyType)?.includes(searchValue) 

  );

  setFilteredDataEntry(filteredEntry);
  setFilteredDataEmergency(filteredEmergency);
};

const EntryCheck = async() =>{
     
  await axios.get(`${url}/ISGSystems/EntryCheck?EmployeeID=${employeeID}`,{
    headers:{
             "auth-token": REACT_APP_SECRET_KEY,
  }
       
  }).then((res)=>{
console.log(res.data)
    if(res?.data?.status==="success" && res.data?.viewer===true){
setEndGatherCheck(res.data?.isgApprover)
setEntryCheck(res.data?.viewer)
    }
    else{
   navigation.navigate("SafetyMainScreen")
      setEndGatherCheck(false)
setEntryCheck(false)
    }
  }).catch((err)=>{
    
   navigation.navigate("SafetyMainScreen")
       setEndGatherCheck(false)
setEntryCheck(false)
  })
}

 
   useEffect(() => {
      getUser(); 
    }, []);

    useEffect(()=>{
      getData()
    },[])

  useFocusEffect(
  useCallback(() => {
    if (!employeeID) return;

    EntryCheck();
  }, [employeeID])
);



    if(loadingData){
      return <View style={{display:"flex",flex:1,flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
        <ActivityIndicator size={48}/>
      </View>
    }

  

  return (
<View style={styles.container}>

  {/* İSTATİSTİKLER */}
  <View style={styles.statsContainer}>

    <View style={[styles.statCard, styles.entryCard]}>
      <Text style={styles.statNumber}>
        {entryData?.length ?? 0}
      </Text>

      <Text style={styles.statLabel}>
        {t("emergencyAreaChecklist.entryTitle")}
      </Text>
    </View>

    <View style={[styles.statCard, styles.emergencyCard]}>
      <Text style={styles.statNumber}>
        {emergencyData?.length ?? 0}
      </Text>

      <Text style={styles.statLabel}>
      {t("emergencyAreaChecklist.emergencyChecklistTitle")}
      </Text>
    </View>

  </View>
  {endGatherCheck===true? <View style={styles.statsContainer}>

    <View style={[styles.finishCardView, styles.finishCard]}>
      

      <TouchableOpacity style={styles.statLabel} onPress={EndGathering}>
        <Text>
   {t("emergencyAreaChecklist.endGathering")}
        </Text>
     
      </TouchableOpacity>
    </View>

    

  </View>:null}
 
  



  {/* SEARCH */}
  {entryCheck===true?<View style={styles.searchContainer}>

    <Text style={styles.searchIcon}>
      🔍
    </Text>

    <TextInput
      style={styles.input}
      value={search}
      onChangeText={handleSearch}
      placeholder={t("emergencyAreaChecklist.searchPerson")}
      placeholderTextColor="#94A3B8"
      returnKeyType="search"
    />

    {search.length > 0 && (
      <TouchableOpacity
        onPress={() => handleSearch('')}
        style={styles.clearButton}
      >
        <Text style={styles.clear}>
          ✕
        </Text>
      </TouchableOpacity>
    )}

  </View>:null}
  


  {/* LİSTELER */}
  <SectionList
    sections={[
  {
    title:     t("emergencyAreaChecklist.unRegisteredPerson"),
    count: filteredDataEntry?.length ?? 0,
    type: 'entry',
    data: filteredDataEntry ?? [],
  },
  {
    title:  t("emergencyAreaChecklist.completeChecklistPerson"),
    count: filteredDataEmergency?.length ?? 0,
    type: 'emergency',
    data: filteredDataEmergency ?? [],
  },
]}

    keyExtractor={(item, index) =>
      String(item?.ID ?? index)
    }

    stickySectionHeadersEnabled={false}

    showsVerticalScrollIndicator={false}

    contentContainerStyle={styles.sectionListContent}

    keyboardShouldPersistTaps="handled"

    renderSectionHeader={({ section }) => (
      <View style={styles.sectionHeader}>

        <View style={styles.sectionTitleContainer}>

          <View
            style={[
              styles.sectionIndicator,
              section.type === 'entry'
                ? styles.entryIndicator
                : styles.emergencyIndicator,
            ]}
          />

          <Text style={styles.sectionTitle}>
            {section.title}
          </Text>

        </View>

        <View
          style={[
            styles.countBadge,
            section.type === 'entry'
              ? styles.entryBadge
              : styles.emergencyBadge,
          ]}
        >
          <Text
            style={[
              styles.countBadgeText,
              section.type === 'entry'
                ? styles.entryBadgeText
                : styles.emergencyBadgeText,
            ]}
          >
            {section.count}
          </Text>
        </View>

      </View>
    )}

   renderItem={({ item, section }) => {
  const isEntry = section.type === 'entry';

  const name = isEntry
    ? item?.FullName
    : item?.NameSurname;

  const subtitle = isEntry
    ? item?.Detail
    : item?.CompanyType;

  return (
    <Pressable
      onPress={() => {
        

        if (section.type === 'entry') {
          openBottomSheetEntry(item);
        } else if (section.type === 'emergency') {
          openBottomSheet(item);
        }
      }}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {name
            ?.split(' ')
            ?.filter(Boolean)
            ?.map(word => word.slice(0, 1))        
            ?.join('')
            ?.toUpperCase().replace("Ç","C")}
        </Text>
      </View>

      <View style={styles.content}>

        <Text
          style={styles.title}
          numberOfLines={1}
        >
          {name}
        </Text>

        {!!subtitle && (
          <Text
            style={styles.subtitle}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        )}

        {/* <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: item?.color || '#94A3B8',
              },
            ]}
          />

          <Text style={styles.status}>
            {item?.status || 'Durum bilgisi yok'}
          </Text>
        </View> */}

      </View>

      <View style={styles.arrowContainer}>
        <Text style={styles.arrow}>›</Text>
      </View>

    </Pressable>
  );
}}

    renderSectionFooter={({ section }) => (
      section.data?.length > 0
        ? <View style={styles.sectionBottomSpace} />
        : null
    )}

    ListEmptyComponent={
      <View style={styles.emptyContainer}>

        <View style={styles.emptyIcon}>
          <Text style={styles.emptyIconText}>
            👤
          </Text>
        </View>

        <Text style={styles.emptyTitle}>
        {t("emergencyAreaChecklist.notRecord")}
        </Text>

        <Text style={styles.emptyText}>
         {t("emergencyAreaChecklist.noPersonMatching")}
        </Text>

      </View>
    }
  />


 {/* Giriş Yapan Modal */}
   <Modal
    visible={!!selectedUserEntry}
    transparent={true}
    animationType="slide"
    statusBarTranslucent={true}
    
    onRequestClose={closeBottomSheet}
  >
    <View style={styles.overlay}>

      <View style={styles.bottomSheet}>

        {/* Handle */}
        <View style={styles.handle} />

        {selectedUserEntry && (
          <>
            {/* Header */}
            <View style={styles.sheetHeader}>

              <View style={styles.largeAvatar}>
                <Text style={styles.largeAvatarText}>
                  {selectedUserEntry?.FullName?.split(" ")
  .map(word => word.slice(0, 1))
  .join(" ").replace("Ç","C")}
                </Text>
              </View>

              <View>
                <Text style={styles.sheetTitle}>
                  {selectedUserEntry.FullName}
                </Text>
              </View>

            </View>

            <View style={styles.divider} />
            {entryCheck===true?  <Pressable disabled={loading} style={styles.action} onPress={()=>{
  
                AddChecklistRecord(selectedUserEntry)
            }}>
                    <Icon name="check" size={21}    color="#22C55E"    strokeWidth={2.5}/>
         

              <Text style={styles.actionText}>
            {t("emergencyAreaChecklist.here")}
              </Text>

          
            </Pressable>
   :null}

    


           

            {/* Close */}
            <Pressable
              style={styles.closeButton}
              onPress={closeBottomSheetEntry}
            >
              <Text style={styles.closeButtonText}>
             {t("emergencyAreaChecklist.close")}
              </Text>
            </Pressable>

          </>
        )}

      </View>

    </View>
  </Modal>

 
  <Modal
    visible={!!selectedUser}
    transparent={true}
    animationType="slide"
    statusBarTranslucent={true}
    
    onRequestClose={closeBottomSheet}
  >
    <View style={styles.overlay}>

      <View style={styles.bottomSheet}>

        {/* Handle */}
        <View style={styles.handle} />

        {selectedUser && (
          <>
            {/* Header */}
            <View style={styles.sheetHeader}>

              <View style={styles.largeAvatar}>
                <Text style={styles.largeAvatarText}>
                  {selectedUser?.NameSurname?.split(" ")
  .map(word => word.slice(0, 1))
  .join(" ").replace("Ç","C")}
                </Text>
              </View>

              <View>
                <Text style={styles.sheetTitle}>
                  {selectedUser.NameSurname}
                </Text>
              </View>

            </View>

            <View style={styles.divider} />

{entryCheck===true?   <Pressable disabled={loading} style={styles.action} onPress={()=>{
           RemoveChecklistRecord(selectedUser)
            }}>
             <Icon name="close" size={21}    color="#da2834"    strokeWidth={2.5}/>

              <Text
                style={[
                  styles.actionText,
                  styles.deleteText,
                ]}
              >
              {t("emergencyAreaChecklist.notHere")}
              </Text>

           
            </Pressable>
:null}
       
  

           

            {/* Close */}
            <Pressable
              style={styles.closeButton}
              onPress={closeBottomSheet}
            >
              <Text style={styles.closeButtonText}>
              {t("emergencyAreaChecklist.close")}
              </Text>
            </Pressable>

          </>
        )}

      </View>

    </View>
  </Modal>

</View>


  );
};
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  /* ----------------------------- */
  /* STATS */
  /* ----------------------------- */

  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
  },

  statCard: {
    flex: 1,
    height: 92,
    borderRadius: 18,

    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,

    elevation: 3,
  },
   finishCardView: {
    flex: 1,
    height: 46,
    borderRadius: 18,

    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,

    elevation: 3,
  },

  entryCard: {
    backgroundColor: '#EEF4FF',
    borderWidth: 1,
    borderColor: '#DCE8FF',
  },
   finishCard: {
    backgroundColor: '#e2f1eb',
    borderWidth: 1,
    borderColor: '#DCE8FF',
  },

  emergencyCard: {
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FFE0E3',
  },

  statNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
  },

  statLabel: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },


  /* ----------------------------- */
  /* SEARCH */
  /* ----------------------------- */

  searchContainer: {
    height: 50,

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: '#E2E8F0',

    borderRadius: 15,

    marginHorizontal: 16,
    marginBottom: 10,

    paddingHorizontal: 13,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.03,
    shadowRadius: 5,

    elevation: 1,
  },

  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },

  input: {
    flex: 1,
    height: '100%',

    fontSize: 15,
    color: '#0F172A',
  },

  clearButton: {
    width: 30,
    height: 30,

    borderRadius: 15,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#F1F5F9',
  },

  clear: {
    fontSize: 13,
    color: '#64748B',
  },


  /* ----------------------------- */
  /* SECTION LIST */
  /* ----------------------------- */

  sectionListContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },

  sectionHeader: {
    height: 48,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginTop: 4,
  },

  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  sectionIndicator: {
    width: 4,
    height: 20,
    borderRadius: 3,
    marginRight: 9,
  },

  entryIndicator: {
    backgroundColor: '#4F46E5',
  },

  emergencyIndicator: {
    backgroundColor: '#EF4444',
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',

    letterSpacing: 0.2,
  },

  countBadge: {
    minWidth: 30,
    height: 26,

    paddingHorizontal: 8,

    borderRadius: 13,

    alignItems: 'center',
    justifyContent: 'center',
  },

  entryBadge: {
    backgroundColor: '#E0E7FF',
  },

  emergencyBadge: {
    backgroundColor: '#FEE2E2',
  },

  countBadgeText: {
    fontSize: 12,
    fontWeight: '800',
  },

  entryBadgeText: {
    color: '#4338CA',
  },

  emergencyBadgeText: {
    color: '#DC2626',
  },


  /* ----------------------------- */
  /* PERSON CARD */
  /* ----------------------------- */

  card: {
    minHeight: 78,

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#FFFFFF',

    borderRadius: 16,

    paddingHorizontal: 13,
    paddingVertical: 12,

    marginBottom: 8,

    borderWidth: 1,
    borderColor: '#E8EDF3',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.035,
    shadowRadius: 5,

    elevation: 1,
  },

  cardPressed: {
    backgroundColor: '#F8FAFC',
    transform: [
      {
        scale: 0.985,
      },
    ],
  },


  /* ----------------------------- */
  /* AVATAR */
  /* ----------------------------- */

  avatar: {
    width: 48,
    height: 48,

    borderRadius: 24,

    backgroundColor: '#EEF2FF',

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: '#E0E7FF',
  },

  avatarText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4F46E5',
  },


  /* ----------------------------- */
  /* CONTENT */
  /* ----------------------------- */

  content: {
    flex: 1,
    marginLeft: 12,
    minWidth: 0,
  },

  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },

  subtitle: {
    marginTop: 3,

    fontSize: 13,
    color: '#64748B',
  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    marginTop: 5,
  },

  statusDot: {
    width: 7,
    height: 7,

    borderRadius: 4,

    marginRight: 6,
  },

  status: {
    flex: 1,

    fontSize: 11.5,
    fontWeight: '600',

    color: '#64748B',
  },


  /* ----------------------------- */
  /* ARROW */
  /* ----------------------------- */

  arrowContainer: {
    width: 30,
    height: 30,

    borderRadius: 15,

    backgroundColor: '#F8FAFC',

    alignItems: 'center',
    justifyContent: 'center',

    marginLeft: 8,
  },

  arrow: {
    fontSize: 24,
    lineHeight: 27,

    color: '#94A3B8',
  },


  /* ----------------------------- */
  /* SECTION SPACING */
  /* ----------------------------- */

  sectionBottomSpace: {
    height: 8,
  },


  /* ----------------------------- */
  /* EMPTY */
  /* ----------------------------- */

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',

    paddingVertical: 50,
    paddingHorizontal: 30,
  },

  emptyIcon: {
    width: 64,
    height: 64,

    borderRadius: 32,

    backgroundColor: '#F1F5F9',

    alignItems: 'center',
    justifyContent: 'center',

    marginBottom: 12,
  },

  emptyIconText: {
    fontSize: 26,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
  },

  emptyText: {
    textAlign: 'center',

    marginTop: 5,

    fontSize: 13,
    lineHeight: 19,

    color: '#94A3B8',
  },


  /* ----------------------------- */
  /* MODAL */
  /* ----------------------------- */

  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },

  bottomSheet: {
    backgroundColor: '#FFFFFF',

    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,

    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 30,
  },

  handle: {
    width: 42,
    height: 5,

    borderRadius: 3,

    backgroundColor: '#CBD5E1',

    alignSelf: 'center',

    marginBottom: 22,
  },

  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  largeAvatar: {
    width: 64,
    height: 64,

    borderRadius: 32,

    backgroundColor: '#EEF2FF',

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 14,
  },

  largeAvatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4F46E5',
  },

  sheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },

  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 20,
  },

  action: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
  },

  actionText: {
    flex: 1,
    fontSize: 16,
    color: '#334155',
    fontWeight: '500',
    marginLeft: 5,
  },

  deleteText: {
    color: '#EF4444',
  },

  closeButton: {
    height: 52,

    borderRadius: 14,

    backgroundColor: '#F1F5F9',

    alignItems: 'center',
    justifyContent: 'center',

    marginTop: 16,
  },

  closeButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },

});


export default EmergencyAreaChecklist;
