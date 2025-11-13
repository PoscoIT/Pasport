import { memo, useState, useEffect } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  ActivityIndicator,
  FlatList,
} from "react-native";
import Toast from "../components/Toast";
import { sendUserInfoName } from "../api/auth-api";
import Background_Green from "../components/Background_Green";
import { Card, Text } from "react-native-paper";
import { database } from "../database/firebaseDB";
import { ScrollView } from "react-native-gesture-handler";

let width = Dimensions.get("window").width; // full width

const SendMindScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ value: "", type: "" });
  const [liste, setListe] = useState([]);
  const Separator = () => <View style={styles.separator} />;

  const getTelNos = async () => {
    await sendUserInfoName((sendResponse) => {
      const refDB = database.ref("Gonulden/CreditUsedLog/");
      refDB.on("value", (snapshot) => {
        const li = [];
        snapshot.forEach((child) => {
          child.forEach((childes) => {
            const val = childes.val();
            if (sendResponse.uname === val.fromUname) {
              li.push({
                label: val.toAdSoyad,
                value: val.toCommente,
                lineValue: val.toDeger,
                lineva: val.insertedDateTime,
                relatedDate: val.relatedDate,
              });
            }
          });
        });

        li.sort(
          (a, b) =>
            Date.parse(a.relatedDate?.replaceAll("-", ".")) -
            Date.parse(b.relatedDate?.replaceAll("-", "."))
        ).reverse();

        setListe(li);
        setLoading(false);
      });
    });
  };

  useEffect(() => {
    let isMounted = true;
    getTelNos();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Background_Green>
      {loading && <ActivityIndicator color={"#444"} />}
      <ScrollView>
        <Card style={styles.cardStyle}>
          <Card.Content>
            <Text variant="titleLarge">Değerli Çalışanımız,</Text>
            <Text variant="bodyMedium">
              Gönderdiğiniz teşekkürleri aşağıda görebilirsiniz.
            </Text>
            <Separator />
          </Card.Content>
        </Card>
        {!loading && (
          <FlatList
            style={styles.gridView}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            data={liste}
            keyExtractor={(item) => item.lineva}
            renderItem={({ item }) => (
              <View style={[styles.itemContainer, { backgroundColor: "#39b" }]}>
                <Text style={styles.itemName2}>{item.label}</Text>
                <Text style={styles.itemName}>{item.lineva}</Text>
                <Text style={styles.itemName}>{item.lineValue}</Text>
                <Text style={styles.itemCode}>{item.value}</Text>
              </View>
            )}
          />
          // <SectionGrid
          //   itemDimension={width - 10}
          //   fixed
          //   sections={[
          //     {
          //       data: liste,
          //     },
          //   ]}
          //   style={styles.gridView}
          //   renderItem={({ item }) => (
          //     <View style={[styles.itemContainer, { backgroundColor: "#39b" }]}>
          //       <Text style={styles.itemName2}>{item.label}</Text>
          //       <Text style={styles.itemName}>{item.lineva}</Text>
          //       <Text style={styles.itemName}>{item.lineValue}</Text>
          //       <Text style={styles.itemCode}>{item.value}</Text>
          //     </View>
          //   )}
          // />
        )}
        <Toast
          type={toast.type}
          message={toast.value}
          onDismiss={() => setToast({ value: "", type: "" })}
        />
      </ScrollView>
    </Background_Green>
  );
};

const styles = StyleSheet.create({
  gridView: {
    marginBottom: 50,
    paddingBottom: 50,
    marginTop: 20,
  },
  itemContainer: {
    justifyContent: "flex-start",
    borderRadius: 5,
    padding: 5,
    marginBottom: 10,
    height: 120,
  },
  itemName: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
  itemName2: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
  itemCode: {
    fontWeight: "600",
    fontSize: 11,
    color: "#fff",
  },
  cardStyle: {
    width: "100%",
    backgroundColor: "white",
    marginTop: 8,
    height: 90,
  },
  separator: {
    marginVertical: 4,
  },
});

export default memo(SendMindScreen);
