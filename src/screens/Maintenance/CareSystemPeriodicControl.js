import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { REACT_APP_SECRET_KEY } from "@env";
import axios from "axios";
import { Swipeable } from "react-native-gesture-handler";
import { ActivityIndicator } from "react-native";

import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Toast } from "toastify-react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { sendUserInfoName } from "../../api/auth-api";
import { useTranslation } from "react-i18next";

const CareSystemPeriodicControl = () => {
  const [qrCodeZone, setQrCodeZone] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [employeeID, setEmployeeID] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

   const url = "https://tstapp.poscoassan.com.tr:8443";
  //const url = "http://localhost:5509"
 // const url = "http://10.0.2.2:5509";
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { t } = useTranslation();

  const handleDelete = async (item) => {
    const data = {
      QrCode: item.EQUIPMENTQRCODEZONENAME,
      employeeID: employeeID,
      CheckTime:item.CheckTime,
    };

    await axios
      .post(`${url}/WorkOrder/MMS/RemoveChecklistRoute`, data, {
        headers: {
          "auth-token": REACT_APP_SECRET_KEY,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((res) => {
        if (res.data.status === "Success") {
          setQrCodeZone((prev) =>
            prev.filter((i) => i.EQUIPMENTQRCODEZONENAME !== item.EQUIPMENTQRCODEZONENAME)
          );
          Toast.success("Başarıyla silindi");
        } else {
          Toast.error("Hata ile karşılaşıldı");
        }
      })
      .catch((err) => {
        Toast.error("Hata ile karşılaşıldı");
      });
  };

  const renderRightActions = (item) => {
    return (
      <TouchableOpacity
        onPress={() => handleDelete(item)}
        style={{
          backgroundColor: "#ea8076",
          justifyContent: "center",
          alignItems: "flex-end",
          paddingHorizontal: 20,
          flex: 1,
        }}
      >
        <Icon name="close" size={20} />
        <Text style={{ color: "black", fontWeight: "bold" }}>Sil</Text>
      </TouchableOpacity>
    );
  };

  const renderLeftActions = (item) => {
    return (
      <TouchableOpacity
        onPress={() => handleDelete(item)}
        style={{
          backgroundColor: "#ea8076",
          justifyContent: "center",
          alignItems: "flex-start",
          paddingHorizontal: 20,
          flex: 1,
        }}
      >
        <Icon name="close" size={20} />
        <Text style={{ color: "black", fontWeight: "bold" }}>Sil</Text>
      </TouchableOpacity>
    );
  };

  const getUser = async () => {
    await sendUserInfoName((sendResponse) => {
      setEmployeeID(sendResponse.empSicil);
    });
  };

  const toggleItem = (uID,CheckTime) => {
    navigation.navigate("CareSystemChecklist", { uID,CheckTime });
  };

  const renderItem = ({ item }) => {
    return (
      <Swipeable
        renderRightActions={() => renderRightActions(item)}
        renderLeftActions={() => renderLeftActions(item)}
      >
        <TouchableOpacity
          onPress={() => {
            if (Number(item.Percentage) < 100) {
              toggleItem(item.EQUIPMENTQRCODEZONENAME,item?.CheckTime);
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
            borderBottomWidth: 0.5,
            borderBottomColor: "#ccc",
          }}
        >
          <View style={{ flex: 1, marginRight: 2 }}>
            <Text style={{ fontSize: 13, fontWeight: "500" }}>
              {item.EQUIPMENTQRCODEZONENAME}
            </Text>
            <Text style={{ fontSize: 13, fontWeight: "500" }}>
               {item?.CheckTime}
            </Text>

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
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
                    fontSize: 12,
                  }}
                >
                  Tamamlanma: {item.Percentage}%
                </Text>
              </View>

              <View style={[styles.badge, { marginTop: 5 }]}>
                <Text style={{ fontSize: 12, color: "#1E3A8A", fontWeight: "600" }}>
                  Tamamlanmayan: {item.RatioUncompletedText}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };


  const getChecklistByZone = async (pageNumber = 1) => {
    if (!employeeID) return; 

    if (pageNumber === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const res = await axios.get(
        `${url}/WorkOrder/MMS/GetCareSystemChecklistDaily?page=${pageNumber}&limit=10`,
        {
          params: { UserID: employeeID },
          headers: { "auth-token": REACT_APP_SECRET_KEY },
        }
      );

      if (res.data?.status === "Success") {
        const newData = res.data.data[0] || [];

        // 🔥 Eğer 10'dan az veri geldiyse başka sayfa yoktur
        if (newData.length < 10) {
          setHasMore(false);
        }

        if (pageNumber === 1) {
          setQrCodeZone(newData);
        } else {
          setQrCodeZone((prev) => [...prev, ...newData]);
        }
      } else {
        if (pageNumber === 1) setQrCodeZone([]);
        setHasMore(false);
      }
    } catch (err) {
      if (pageNumber === 1) setQrCodeZone([]);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const renderFooter = () => {
if (loading || !loadingMore) return <View style={{ height: 40 }} />;
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="large"  />
      </View>
    );
  };

  // 🔥 ÇÖKME HATASI DÜZELTİLDİ
  const loadMoreData = () => {
 if (!loadingMore && hasMore && !loading) { 
    const nextPage = page + 1;
    setPage(nextPage);
    getChecklistByZone(nextPage);
  }
  };


  useEffect(() => {
    getUser(); 
  }, []);

  useEffect(() => {

    if (isFocused && employeeID) {
      setPage(1);
      setHasMore(true);
      getChecklistByZone(1);
    }
  }, [isFocused, employeeID]);

  if (loading && page === 1) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.view}>
      <TouchableOpacity
        style={{ width: "100%", flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 10 }}
        onPress={() => navigation.goBack()}
      >
        <Icon name="angle-left" size={22} color="#000" />
        <Text style={styles.backText}>{t("goBack")}</Text>
      </TouchableOpacity>

      {qrCodeZone.length > 0 && (
        <Text style={{ fontSize: 15, alignSelf: "center", margin: 10, fontWeight: "600" }}>
          {t("careSystem.dailyChecklist")}
        </Text>
      )}

      <FlatList
        data={qrCodeZone}

        keyExtractor={(item, index) => `${item?.EQUIPMENTQRCODEZONENAME}_${index}`}
        renderItem={renderItem}
        onEndReached={loadMoreData}
        onEndReachedThreshold={1}
        ListFooterComponent={renderFooter}
        contentContainerStyle={{ paddingBottom: 50 }}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 15 }}>
            {t("careSystem.pleaseRoute")}
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: "white",
  },
  badge: {
    backgroundColor: "#E6F0FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
  },
});

export default CareSystemPeriodicControl;