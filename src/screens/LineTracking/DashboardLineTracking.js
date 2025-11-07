import { useEffect, useState } from "react";
import { StyleSheet, Dimensions, ActivityIndicator, View } from "react-native";
import Background_Green from "../../components/Background_Green";
import { Card, Text } from "react-native-paper";
import { getLineTrackAuth } from "../../api/auth-api";

import { firestore } from "../../database/firebaseDB";

let width = Dimensions.get("window").width; //full width
let height = Dimensions.get("window").height; //full width

const DashboardLineTracking = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [authorizated, setAuthorized] = useState(false);
  const [userArr, setUserArr] = useState([]);

  // Değiştirildi: getData fonksiyonu kaldırıldı ve useEffect içine taşındı
  // useEffect'in bir listener (onSnapshot) için cleanup fonksiyonu döndürmesi gerekir.
  useEffect(() => {
    setIsLoading(true);

    // Auth kontrolü (Bu fonksiyonun RNF kullandığını varsayıyoruz)
    getLineTrackAuth((item) => {
      if (item.LineTracking !== 1) {
        setAuthorized(false);
        navigation.goBack();
      } else {
        setAuthorized(true);
        setIsLoading(false);
      }
    });

    // Değiştirildi: onSnapshot(collection(db, ...)) yerine RNF syntax'ı kullanıldı
    const subscriber = firestore
      .collection("entities")
      .onSnapshot((snapshot) => {
        setUserArr(snapshot.docs.map((item) => item.data()));
      });

    // useEffect'ten cleanup fonksiyonu döndürülüyor
    // Component unmount olduğunda listener'ı kapatır.
    return () => subscriber();
  }, []); // Boş dependency array, component mount olduğunda çalışır.

  if (
    isLoading && (
      <View style={styles.preloader}>
        <ActivityIndicator size="large" color="#9E9E9E" />
      </View>
    )
  ) {
    if (!authorizated) {
      return (
        <View style={styles.preloader}>
          <Card style={styles.cardStyle}>
            <Card.Content>
              <Text variant="titleLarge">FORBIDDEN AREA</Text>
            </Card.Content>
          </Card>
          <ActivityIndicator size="large" color="#9E9E9E" />
        </View>
      );
    }
  }

  return (
    <Background_Green>
      <Card style={styles.cardStyle}>
        <Card.Content>
          <Text variant="titleLarge">Line Tracking Module</Text>
          <Text />
        </Card.Content>
      </Card>
      <View style={styles.listItemViewer}>
        {userArr.length > 0 &&
          userArr.map((item, i) => {
            return (
              <Card
                key={i}
                style={[
                  styles.container,
                  item.Status?.includes("S/D") && styles.stop,
                ]}
                onPress={() => {
                  navigation.navigate("LineTrackDetail", {
                    userkey: item.LINE,
                  });
                }}
              >
                <Card.Content>
                  <Text>{item.LINE}</Text>
                  <View style={styles.containered}>
                    <Text>Work Type: {item.WORK_TYPE}</Text>
                    <Text>Status: {item.Status}</Text>
                    <Text>Today Total Wght: {item.WGHT} Ton</Text>
                    <Text>
                      {"Today Abn Wght: "}
                      {item.ABNWEIGHTS}
                      {" Ton "}
                      {item.ABNCAUSECODES != 0 && "("}
                      {item.ABNCAUSECODES != 0 &&
                        item.ABNCAUSECODES.slice(0, -1)}
                      {item.ABNCAUSECODES != 0 && ")"}
                    </Text>
                  </View>
                </Card.Content>
              </Card>
            );
          })}
      </View>
    </Background_Green>
  );
};
const styles = StyleSheet.create({
  container: {
    margin: 6,
    width: width - 10,
  },
  stop: {
    backgroundColor: "#f1aaaa",
  },
  containered: {
    padding: 3,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
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
  cardStyle: {
    backgroundColor: "white",
    margin: 5,
    height: 70,
    width: width - 10,
  },
  listItemViewer: {
    paddingBottom: 10,
    height: height,
  },
});
export default DashboardLineTracking;
