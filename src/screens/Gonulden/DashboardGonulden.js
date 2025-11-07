import { memo, useEffect, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { Button } from "react-native-paper";
import Toast from "../../components/Toast";
import Background_Green from "../../components/Background";
import { sendUserInfoName } from "../../api/auth-api";
import { auth, database } from "../../database/firebaseDB";
import { onValue, ref } from "@react-native-firebase/database";
import { signOut } from "@react-native-firebase/auth";

const { width, height } = Dimensions.get("window");

export const logoutUser = (companyCode) => {
  if (companyCode === "TST") {
    signOut(auth);
  }
};

const DashboardGonulden = ({ navigation }) => {
  const [toast, setToast] = useState({ value: "", type: "" });
  const [loading, setLoading] = useState(true);
  const [liste, setListe] = useState([]);
  const [listeRec, setListeRec] = useState([]);
  const [fetched, setFetched] = useState(false);

  const getTelNos = async () => {
    await sendUserInfoName((sendResponse) => {
      onValue(ref(database, "Gonulden/CreditUsedLog"), (snapshot) => {
        let li = [];
        let liRec = [];
        snapshot.forEach((child) => {
          child.forEach((childes) => {
            if (sendResponse.uname === childes.val().fromUname) {
              li.push({ label: childes.val().toAdSoyad });
            }
            if (sendResponse.uname === childes.val().toAdSoyad) {
              liRec.push({ label: childes.val().toAdSoyad });
            }
          });
        });
        setListe(li);
        setListeRec(liRec);
      });

      setLoading(false);
    });
  };

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      getTelNos().then(() => {
        if (isMounted) setLoading(false);
      }),
    ])
      .then(() => setFetched(true))
      .catch((ex) => console.error(ex));

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Background_Green>
      <View style={styles.container}>
        <View style={styles.viewCont}>
          <ImageBackground
            source={require("../../assets/wallpaper_logo.png")}
            style={styles.backgroundImage}
            resizeMode="contain"
          />
          <Button
            mode="contained"
            style={styles.button}
            onPress={() => navigation.navigate("GiveMindScreen")}
          >
            Mesaj Gönder(Send Message)
          </Button>
          <Button
            mode="contained"
            style={styles.button}
            onPress={() => navigation.navigate("ReceiveMindScreen")}
          >
            Gelen Mesaj (Inbox) ({listeRec.length})
          </Button>
          <Button
            mode="contained"
            style={styles.button}
            onPress={() => navigation.navigate("SendMindScreen")}
          >
            Gönderilen Mesaj (Sent) ({liste.length})
          </Button>
          <Toast
            type={toast.type}
            message={toast.value}
            onDismiss={() => setToast({ value: "", type: "" })}
          />
        </View>
      </View>
    </Background_Green>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    height: undefined,
    width: undefined,
    opacity: 0.7,
  },
  button: {
    margin: 10,
    width: width - 30,
    height: 40,
    backgroundColor: "#57A7B3",
  },
  container: {
    flex: 1,
    alignItems: "center",
    height: Platform.OS === "ios" ? height - 210 : height - 150,
  },
  viewCont: {
    alignItems: "stretch",
    flex: 1,
  },
});

export default memo(DashboardGonulden);
