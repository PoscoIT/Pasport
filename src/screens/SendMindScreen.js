import { memo, useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Dimensions
} from "react-native";
import Toast from "../components/Toast";
import { sendUserInfoName } from "../api/auth-api";

import { database } from "../database/firebaseDB";


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
  <View style={styles.container}>
    <FlatList
      data={loading ? [] : liste}
      style={styles.list}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item, index) => `${item.lineva}-${index}`}
      ListHeaderComponent={
        <View style={styles.header}>
          <View style={styles.headerAccent} />

          <View style={styles.titleRow}>
            <Text style={styles.title}>Gönderilen Teşekkürler</Text>

            {!loading && (
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{liste.length}</Text>
              </View>
            )}
          </View>

          <Text style={styles.greeting}>Değerli Çalışanımız,</Text>

          <Text style={styles.subtitle}>
            Gönderdiğiniz teşekkürleri aşağıda görebilirsiniz.
          </Text>
        </View>
      }
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#0B337C" />
          ) : (
            <>
              <Text style={styles.emptyTitle}>
                Henüz teşekkür göndermediniz
              </Text>

              <Text style={styles.emptyDescription}>
                Gönderdiğiniz teşekkürler burada görünecek.
              </Text>
            </>
          )}
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.messageCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardAccent} />
            <Text style={styles.cardTitle}>{item.label}</Text>
          </View>

          <View style={styles.cardDetails}>
            <Text style={styles.primaryDetail}>{item.lineva}</Text>
            <Text style={styles.secondaryDetail}>{item.lineValue}</Text>
          </View>

          <View style={styles.messageBody}>
            <Text style={styles.messageText}>{item.value}</Text>
          </View>
        </View>
      )}
    />

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

  list: {
    flex: 1,
  },

  listContent: {
    flexGrow: 1,
    width: "100%",
    maxWidth: 680,
    alignSelf: "center",
    paddingHorizontal: 18,
    paddingTop: 26,
    paddingBottom: 40,
  },

  header: {
    marginBottom: 24,
    paddingHorizontal: 2,
  },

  headerAccent: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#0B337C",
    marginBottom: 18,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  title: {
    flex: 1,
    color: "#172B4D",
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 33,
    marginRight: 12,
  },

  countBadge: {
    minWidth: 34,
    borderRadius: 10,
    backgroundColor: "#EAF0FA",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  countText: {
    color: "#0B337C",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },

  greeting: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 22,
    marginBottom: 4,
  },

  subtitle: {
    color: "#64748B",
    fontSize: 14,
    lineHeight: 23,
  },

  messageCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E3EAF4",
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
  },

  cardAccent: {
    width: 4,
    height: 22,
    borderRadius: 2,
    backgroundColor: "#0B337C",
    marginRight: 10,
    marginTop: 2,
  },

  cardTitle: {
    flex: 1,
    color: "#0B337C",
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 24,
  },

  cardDetails: {
    marginBottom: 16,
  },

  primaryDetail: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 22,
  },

  secondaryDetail: {
    color: "#73829B",
    fontSize: 13,
    lineHeight: 21,
    marginTop: 4,
  },

  messageBody: {
    backgroundColor: "#F8FAFD",
    borderRadius: 10,
    padding: 14,
  },

  messageText: {
    color: "#475569",
    fontSize: 14,
    lineHeight: 24,
  },

  emptyContainer: {
    paddingHorizontal: 20,
    paddingVertical: 60,
    alignItems: "center",
  },

  emptyTitle: {
    color: "#334155",
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },

  emptyDescription: {
    color: "#73829B",
    fontSize: 14,
    lineHeight: 23,
    textAlign: "center",
  },
});

export default memo(SendMindScreen);
