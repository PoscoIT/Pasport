import { memo, useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from "react-native";
import { Button as PaperButton } from "react-native-paper";
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
  <View style={styles.container}>
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.content}>
        <View style={styles.header}>
         <View style={styles.logoContainer}>
  <Image
    source={require("../../assets/wallpaper_logo.png")}
    style={styles.logo}
    resizeMode="contain"
  />
</View>

          <Text style={styles.title}>Mesajlar</Text>
          <Text style={styles.subtitle}>Messages</Text>
        </View>

        <PaperButton
          mode="contained"
          buttonColor="#0B337C"
          textColor="#FFFFFF"
          style={styles.composeButton}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
          onPress={() => navigation.navigate("GiveMindScreen")}
        >
          Mesaj Gönder / Send Message
        </PaperButton>

        <View style={styles.mailbox}>
          <TouchableOpacity
            style={styles.mailRow}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`Gelen mesajlar, ${listeRec.length} mesaj`}
            onPress={() => navigation.navigate("ReceiveMindScreen")}
          >
            <View style={styles.mailText}>
              <Text style={styles.mailTitle}>Gelen Mesajlar</Text>
              <Text style={styles.mailSubtitle}>Inbox</Text>
            </View>

            <View style={styles.countBadge}>
              <Text style={styles.countText}>{listeRec.length}</Text>
            </View>

            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.mailRow}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`Gönderilen mesajlar, ${liste.length} mesaj`}
            onPress={() => navigation.navigate("SendMindScreen")}
          >
            <View style={styles.mailText}>
              <Text style={styles.mailTitle}>Gönderilen Mesajlar</Text>
              <Text style={styles.mailSubtitle}>Sent</Text>
            </View>

            <View style={[styles.countBadge, styles.sentBadge]}>
              <Text style={[styles.countText, styles.sentCountText]}>
                {liste.length}
              </Text>
            </View>

            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>

    <Toast
      type={toast.type}
      message={toast.value}
      onDismiss={() => setToast({ value: "", type: "" })}
    />
  </View>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F6FC",
  },

  scrollContent: {
    flexGrow: 1,
    paddingTop: 32,
    paddingBottom: 36,
  },

  content: {
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
    paddingHorizontal: 20,
  },

header: {
  alignItems: "center",
  marginBottom: 24,
},

logoContainer: {
  width: "100%",
  height: 200,
  backgroundColor: "#FFFFFF",
  borderRadius: 18,
  borderWidth: 1,
  borderColor: "#E3EAF4",
  padding: 12,
  marginBottom: 20,
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
},

logo: {
  width: "100%",
  height: "100%",
},
  title: {
    color: "#172B4D",
    fontSize: 27,
    fontWeight: "700",
    lineHeight: 36,
  },

  subtitle: {
    color: "#73829B",
    fontSize: 14,
    lineHeight: 22,
    marginTop: 4,
  },

  composeButton: {
    borderRadius: 12,
    marginBottom: 24,
  },

  buttonContent: {
    minHeight: 56,
    paddingVertical: 5,
  },

  buttonLabel: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0,
    marginHorizontal: 10,
  },

  mailbox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E3EAF4",
    overflow: "hidden",
  },

  mailRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 92,
    paddingHorizontal: 18,
    paddingVertical: 20,
  },

  mailText: {
    flex: 1,
    paddingRight: 12,
  },

  mailTitle: {
    color: "#172B4D",
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 23,
  },

  mailSubtitle: {
    color: "#8492A8",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },

  countBadge: {
    minWidth: 34,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "#EAF0FA",
  },

  countText: {
    color: "#0B337C",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    fontVariant: ["tabular-nums"],
  },

  sentBadge: {
    backgroundColor: "#F1F5F9",
  },

  sentCountText: {
    color: "#64748B",
  },

  chevron: {
    color: "#94A3B8",
    fontSize: 26,
    marginLeft: 12,
  },

  divider: {
    height: 1,
    backgroundColor: "#EDF1F7",
    marginHorizontal: 18,
  },
});

export default memo(DashboardGonulden);
