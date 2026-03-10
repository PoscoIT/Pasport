import { useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PickerModal from "react-native-picker-modal-view";
import { REACT_APP_SECRET_KEY } from "@env";
import axios from "axios";

import { Button } from "@ui-kitten/components";
import { sendUserInfoName } from "../../api/auth-api";
import {
  ActivityIndicator,
  Card,
  Checkbox,
  MD2Colors,
  TextInput,
} from "react-native-paper";
import { Toast } from "toastify-react-native";
import Icon from 'react-native-vector-icons/FontAwesome';

const CareSystemChecklistRoute = () => {
  const [mmsLines, setMMSLines] = useState([]);
  const [selectedMMSLine, setSelectedMMSLine] = useState([]);
  const [qrCodeZone, setQrCodeZone] = useState([]);
  const [checklistByLine, setChecklistByLine] = useState([]);
  const [selectedQrCodeZone, setSelectedQrCodeZone] = useState([]);
  const [employeeID, setEmployeeID] = useState("");
    const [assignEmployeeID, setAssignEmployeeID] = useState("");
  const [loading, setLoading] = useState(false);
  const pickerRef = useRef(null);
  const [disabled, setDisabled] = useState(false);
  const [showSearchButton, setShowSearchButton] = useState(true);
  const [showAddButton, setShowAddButton] = useState(true);

  const getUser = async () => {
    await sendUserInfoName((sendResponse) => {
      setEmployeeID(sendResponse.empSicil);
    });
  };
  // const url = "https://tstapp.poscoassan.com.tr:8443";
  const url = "http://10.0.2.2:5509";
  const [data, setData] = useState([
    { id: 1, name: "Elma" },
    { id: 2, name: "Armut" },
    { id: 3, name: "Muz" },
  ]);
  const toggleItem = (uID) => {
    setQrCodeZone((prev) =>
      prev.map((item) =>
        item.EQUIPMENTQRCODEZONENAME === uID
          ? { ...item, checked: !item.checked, WorkAssignedID:assignEmployeeID ,CreatedID:employeeID }
          : item,
      ),
    );
  };
  const onSubmit = async () => {
    setDisabled(true);
    const filteredData = qrCodeZone.filter((item) => item.checked === true);

    if (filteredData.length > 0) {
      await axios
        .post(
          `${url}/WorkOrder/MMS/CreateChecklistRoute`,
          { formValues: filteredData },
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
              Toast.success("Başarıyla Kayıt Yapılmıştır.");
                getChecklistByZone();
            }
          } else {
            Toast.error("Hata ile karşılaşıldı.");
          }
        })
        .catch((err) => Toast.error("Bağlantı problemi", err))
        .finally(() => setDisabled(false));
    } else {
      Toast.error("Lütfen en az 1 tane seçim yapınız.");
      setDisabled(false);
    }
  };
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => toggleItem(item.EQUIPMENTQRCODEZONENAME)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",

          padding: 12,
        }}
      >
        <View style={{ flex: 1, marginRight: 2 }}>
          <Text style={{ flexShrink: 1, textAlign: "left", fontSize: 13 }}>
            {item.EQUIPMENTQRCODEZONENAME}
          </Text>
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
            <Text
              style={{
                color:
                  item.Percentage >= 80
                    ? "#065F46"
                    : item.Percentage >= 50
                    ? "#92400E"
                    : "#991B1B",
                fontWeight: "700",
              }}
            >
        Tamamlanma:   {item.Percentage}%
            </Text>
          </View>
        </View>
        {item.disabled===false?<Checkbox
          style={{ alignSelf: "center" }}
          status={item.checked ? "checked" : "unchecked"}
          disabled={item.disabled}
          onPress={() => 
          
            
      toggleItem(item.EQUIPMENTQRCODEZONENAME)
    }
          
        
          
        />:<Icon name="check" size={20} color={"#4b8046"} />}

        
      </TouchableOpacity>
    );
  };

  const getMMSList = async () => {
    try {
      await axios
        .get(`${url}/WorkOrder/MMS/Lines`, {
          headers: {
            "auth-token": REACT_APP_SECRET_KEY,
          },
        })
        .then((res) => {
          setMMSLines(
            res?.data?.data?.map(
              (item) =>
                [
                  {
                    value: item.Line_ID,
                    Name: item.Line,
                  },
                ][0],
            ),
          );
        })
        .catch((t) => console.warn("selammm"));
    } catch (e) {
      setMMSLines([]);
    }
  };
  // const getChecklistByLine = async () => {
  //   setLoading(true);
  //   if (selectedMMSLine.value && employeeID.length === 6) {
  //     try {
  //       await axios
  //         .get(
  //           `${url}/WorkOrder/MMS/GetCareSystemChecklistByLine/${selectedMMSLine.value}/${selectedQrCodeZone.value}`,
  //           {
  //             headers: {
  //               "auth-token": REACT_APP_SECRET_KEY,
  //             },
  //           },
  //         )
  //         .then((res) => {
  //           const formatted = res.data.data.map((item) => ({
  //             ...item,
  //             checked: item.checked ?? false,
  //           }));
  //           setChecklistByLine(formatted);
  //         })
  //         .catch((t) => console.warn("selammm"));
  //     } catch (e) {
  //       setChecklistByLine([]);
  //     }
  //   } else {
  //     Alert.alert("Lütfen tüm alanları doldurunuz.");
  //   }
  //   setLoading(false);
  // };

  const getChecklistByZone = async () => {
    setLoading(true);
    try {
      await axios
        .get(
          `${url}/WorkOrder/MMS/GetCareSystemChecklistByZoneName/${selectedMMSLine.value}/${assignEmployeeID}`,
          {
            headers: {
              "auth-token": REACT_APP_SECRET_KEY,
            },
          },
        )
        .then((res) => {
          if (res.data.status === "Success") {
            const formatted = res.data.data.map((item) => ({
              ...item,
              checked: item.checked ?? false,
            }));

            setQrCodeZone(
              formatted,

              // res?.data?.data?.map(
              //   (item, index) =>
              //     [
              //       {
              //         Id: index,
              //         value: item.EQUIPMENTQRCODEZONENAME,
              //         Name: item.EQUIPMENTQRCODEZONENAME,
              //         Percentage: item.Percentage,
              //       },
              //     ][0],
              // ),
            );
          } else {
            setQrCodeZone([]);
          }
        })
        .catch((t) => console.warn("selammm"));
    } catch (e) {
      setQrCodeZone([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    getMMSList();
  }, []);
  useEffect(() => {
    getUser();
  }, []);

  // useEffect(() => {
  //   getChecklistByZone();
  // }, [selectedMMSLine]);

  // useEffect(() => {
  //   if (selectedMMSLine && selectedQrCodeZone) getChecklistByLine();
  // }, [selectedMMSLine, selectedQrCodeZone]);

  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <Card style={styles.card}>
      <Card.Content>

      

        <TextInput
          mode="outlined"
          label="Employee ID"
          value={assignEmployeeID}
          keyboardType="numeric"
          maxLength={6}
          placeholder="Enter Employee ID"
          left={<TextInput.Icon icon="account-outline" />}
          style={styles.input}
          outlineStyle={styles.inputOutline}
          theme={{ roundness: 14 }}
          onChangeText={(text) => {
            setAssignEmployeeID(text);
            setShowSearchButton(true);
            setShowAddButton(false);
          }}
        />

        <View style={[styles.pickerContainer,{marginTop:15,backgroundColor:"#fff"}]}>
          <PickerModal
            items={mmsLines}
            selected={selectedMMSLine}
            sortingLanguage={"tr"}
            showToTopButton={true}
            showAlphabeticalIndex={true}
            autoGenerateAlphabeticalIndex={true}
            autoSort={true}
            Autocomplete={false}
            requireSelection={false}
            selectPlaceholderText={<Text style={styles.placeholder}>Hat Seçiniz</Text>}
            searchPlaceholderText={"Hat Ara"}
            onSelected={(item) => {
              setSelectedMMSLine(item);
              setShowSearchButton(true);
              setShowAddButton(false);
            }}
          />
        </View>

      </Card.Content>
    </Card>

      {/* <PickerModal
        style={{ width: "100%", backgroundColor: "black", fontSize: 14 }}
        Autocomplete={false}
        items={qrCodeZone}
        sortingLanguage={"tr"}
        showToTopButton={true}
        showAlphabeticalIndex={true}
        autoSort={true}
        ref={pickerRef}
        selected={selectedQrCodeZone}
        autoGenerateAlphabeticalIndex={true}
        selectPlaceholderText={<Text>Checklist Seçiniz</Text>}
        searchPlaceholderText={"Checklist Seçiniz"}
        requireSelection={false}
        onSelected={(item) => {
          setSelectedQrCodeZone(item);
          setShowSearchButton(true);
          setShowAddButton(false);
        }}
      /> */}

      <View
        style={{
          marginVertical: 15,

          width: "50%",
          alignSelf: "center",
        }}
      >
        {showSearchButton && (
          <Button
            style={{
              marginVertical: 5,
              borderRadius: 20,
              backgroundColor: "#2156b1",
              borderColor: "#2156b1",
            }}
            onPress={() => {
              getChecklistByZone();
              setShowSearchButton(false);
              setShowAddButton(true);
            }}
          >
            Search
          </Button>
        )}
      </View>
      {!loading && qrCodeZone.length >= 0 ? (
        <View style={{ flex: 1, borderTopWidth: 0.5 }}>
          <FlatList
            data={qrCodeZone}
            keyExtractor={(item) => item?.EQUIPMENTQRCODEZONENAME?.toString()}
            renderItem={renderItem}
            style={{ flex: 1 }}
            ListEmptyComponent={<Text style={{textAlign:"center",marginTop:15}}>İlgili Alan Bulunamadı.</Text>}
            ListFooterComponent={
              showAddButton && qrCodeZone.length>0 &&(
                <Button
                  disabled={disabled}
                  style={{
                    marginBottom: 20,
                    marginHorizontal: 90,
                    marginVertical: 20,
                    borderRadius: 20,
                    backgroundColor: "#2156b1",
                    borderColor: "#2156b1",
                  }}
                  onPress={() => onSubmit()}
                >
                  Rota Oluştur
                </Button>
              )
            }
          />
        </View>
      ) : loading ? (
        <ActivityIndicator animating={true} color={MD2Colors.blue800} />
      ) : null}
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
  button3: {
    width: "70%",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 25,
  },
    pickerContainer: {
    borderWidth: 1,
    borderColor: "#dcdcdc",
    borderRadius: 14,
    padding: 12,
    backgroundColor: "#fafafa",
  },
    card: {
    margin: 8,
    borderRadius: 16,
    elevation: 4,
    backgroundColor:"#fff"
  },
    input: {
  
    backgroundColor: "#fff",
  
  }
 
});

export default CareSystemChecklistRoute;
