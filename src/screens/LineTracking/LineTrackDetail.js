import { useEffect, useState } from "react";
import { StyleSheet, ScrollView, View, Text } from "react-native";

import { firestore } from "../../database/firebaseDB";

import { getLineTrackAuth } from "../../api/auth-api";
import { Card } from "react-native-paper";

// Değiştirildi: db tanımı kaldırıldı, servis doğrudan kullanılacak
// const db = getFirestore(firebaseDB);

const LineTrackDetail = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [authorizated, setAuthorized] = useState(false);
  const [userArr, setUserArr] = useState([]);

  // Değiştirildi: Collection referansı @react-native-firebase formatına çevrildi
  const collectionRef = firestore.collection("entitiesSub");

  const getData = async () => {
    setIsLoading(true);
    await getLineTrackAuth((item) => {
      if (item.LineTracking !== 1) {
        setAuthorized(false);
        navigation.goBack();
      } else {
        setAuthorized(true);
        setIsLoading(false);
      }
    });

    // Değiştirildi: query() ve where() Web v9 formatından @react-native-firebase formatına çevrildi
    const q = collectionRef.where("Line", "==", route.params.userkey);

    // Değiştirildi: getDocs(q) yerine q.get() kullanıldı
    const data = await q.get();

    // Bu satır (snapshot işleme) aynı kalabilir, .docs ve .data() uyumludur
    setUserArr(data.docs.map((item) => item.data()));
    setIsLoading(false);
  };

  useEffect(() => {
    getData();

    /*setUserArr(snapshot.docs.map(doc => {
            doc.data()
          }
          ))*/
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inputGroup}>
        <Text />
        <Text style={styles.textViewer}>LATESTS COILS</Text>
      </View>
      {userArr.map((item, i) => {
        return (
          <Card key={i} style={styles.container}>
            <Card.Content
              style={
                item.ONIKI != "Y" &&
                (route.params.userkey == "BAL" || route.params.userkey == "APF")
                  ? styles.containeredRed
                  : styles.containered
              }
            >
              <Text>{item.CoilNr}</Text>
              {route.params.userkey == "BAL" ||
              route.params.userkey == "APF" ? (
                <Text>
                  {"Steel Grade: "}
                  {item.steelgrade}
                </Text>
              ) : (
                <Text>
                  {"Steel Grade: "}
                  {item.steelgrade}
                </Text>
              )}

              {route.params.userkey == "BAL" ||
              route.params.userkey == "APF" ? (
                <Text>
                  {"Thickness: "}
                  {item.exitThick}
                </Text>
              ) : (
                <Text>
                  {"Entry Thick.: "}
                  {item.EntryThick}
                </Text>
              )}
              {route.params.userkey == "BAL" ||
              route.params.userkey == "APF" ? (
                <Text>
                  {"Width: "}
                  {item.width}
                </Text>
              ) : (
                <Text>
                  {"Exit Thick.: "}
                  {item.exitThick}
                </Text>
              )}
              {route.params.userkey == "BAL" ||
              route.params.userkey == "APF" ? (
                <Text>
                  {"Surface Quality Grade: "}
                  {item.PDI_ORDER_USAGE_CD}
                </Text>
              ) : (
                <Text>
                  {"Order Usage Cd: "}
                  {item.PDI_ORDER_USAGE_CD}
                </Text>
              )}
              {route.params.userkey == "BAL" ||
              route.params.userkey == "APF" ? (
                <Text>
                  {"Abn. Code: "}
                  {item.ONIKI}
                </Text>
              ) : (
                <Text>
                  {"Surface Finish Code: "}
                  {item.PDI_SURFACE_FINISH_CD}
                </Text>
              )}
              {route.params.userkey == "BAL" ||
              route.params.userkey == "APF" ? (
                <Text>{item.ORKUNICIN}</Text>
              ) : (
                <Text>
                  {"Defect/Abn Code: "}
                  {item.ORKUNICIN}
                </Text>
              )}

              <Text>
                {"Start Date: "}
                {item.StartDate}
              </Text>
              <Text>
                {"End Date: "}
                {item.endDate}
              </Text>
            </Card.Content>
          </Card>
        );
      })}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  containered: {
    padding: 5,
    backgroundColor: "lightgreen",
  },
  containeredRed: {
    padding: 5,
    backgroundColor: "pink",
  },
  textinfo: {
    margin: 15,
    textAlign: "center",
    fontSize: 17,
  },
  preloader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
});
export default LineTrackDetail;
