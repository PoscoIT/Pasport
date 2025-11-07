import React, { memo, useEffect, useState } from "react";
import { StyleSheet, Text, FlatList, Alert } from "react-native";
import Background_Green from "../components/Background_Green";
import CardView from "../components/cardView";
import { database } from "../database/firebaseDB";
import { InsertSelectedAward } from "../api/auth-api";

const SelectGift = ({ route: { params }, navigation }) => {
  const [loading, setLoading] = useState(true);
  const [liste, setListe] = useState([]);

  const getTelNos = async () => {
    const ref = database.ref("TST_Award/Odul/" + params.appHead);
    ref.on("value", (snapshot) => {
      const li = [];
      snapshot.forEach((child) => {
        const val = child.val();
        if (val.active === 1) {
          li.push({
            title: val.title,
            brand: val.brand,
            source: val.source,
            id: val.id,
          });
        }
      });
      setListe(li);
      setLoading(false);
    });
  };

  const insertRec = async (id, title, brand) => {
    if (loading) return;

    setLoading(true);
    try {
      await InsertSelectedAward({
        awardType: params.appHead,
        selectedId: id,
        brandtitle: title,
        brand: brand,
        cardKey: params.appCardKey.toString().split(",")[0],
      });

      Alert.alert(
        "Ödül Seçimi",
        "Ödül seçimi başarılı. Talebiniz İnsan Kaynaklarına iletilmiştir."
      );
      navigation.navigate("DashboardAward");
    } catch (err) {
      console.error(err);
      Alert.alert("Hata", "Ödül seçimi sırasında bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    getTelNos();
    return () => {
      isMounted = false;
    };
  }, []);

  const Item = ({ title, brand, source, id }) => (
    <CardView
      title={title}
      brand={brand}
      source={{ uri: source }}
      onPress={() => insertRec(id, title, brand)}
    />
  );

  const renderItem = ({ item }) => (
    <Item
      title={item.title}
      brand={item.brand}
      source={item.source}
      id={item.id}
    />
  );

  return (
    <Background_Green>
      <FlatList
        style={styles.FlatList}
        data={liste}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={() => <Text>{""}</Text>}
        ListFooterComponent={() => <Text>{""}</Text>}
      />
    </Background_Green>
  );
};

const styles = StyleSheet.create({
  FlatList: {
    marginBottom: 60,
  },
});

export default memo(SelectGift);
