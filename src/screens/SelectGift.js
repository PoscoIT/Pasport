import React, {memo, useEffect, useState} from 'react';
import {StyleSheet, Text, FlatList, Alert} from 'react-native';
import 'firebase/auth';
import Background_Green from '../components/Background_Green';
import CardView from '../components/cardView';
import firebase from 'firebase/compat/app';
import {InsertSelectedAward} from '../api/auth-api';
const SelectGift = ({route: {params}, navigation}) => {
  const [loading, setLoading] = useState(true);
  const [liste, setListe] = useState([]);
  const getTelNos = async () => {
    firebase
      .database()
      .ref('TST_Award/Odul/' + params.appHead)
      .on('value', snapshot => {
        let li = [];
        snapshot.forEach(child => {
          if (child.val().active == 1)
            li.push({
              title: child.val().title,
              brand: child.val().brand,
              source: child.val().source,
              id: child.val().id,
            });
        });
        setListe(li);
      });
    setLoading(false);
    return loading;
  };

  const insertRec = async (id, title, brand) => {
    if (loading) {
      return;
    }
    setLoading(true);
    const response = await InsertSelectedAward({
      awardType: params.appHead,
      selectedId: id,
      brandtitle: title,
      brand: brand,
      cardKey: params.appCardKey.toString().split(',')[0],
    }).then(() => {
      return {response};
    });
    setLoading(false);
    Alert.alert(
      'Ödül Seçimi',
      'Ödül seçimi başarılı. Talebiniz İnsan Kaynaklarına iletilmiştir.',
    );
    navigation.navigate('DashboardAward');
  };

  useEffect(() => {
    let isMounted = true;
    getTelNos().then(() => {
      if (isMounted) {
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const Item = ({title, brand, source, id}) => (
    <CardView
      title={title}
      brand={brand}
      source={{uri: source}}
      onPress={() => insertRec(id, title, brand)}
    />
  );

  const renderItem = ({item}) => (
    <Item
      title={item.title}
      brand={item.brand}
      source={item.source}
      id={item.id}
    />
  );

  const getHeader = () => {
    return <Text>{''}</Text>;
  };

  const getFooter = () => {
    if (this.loading) {
      return null;
    }
    return <Text>{''}</Text>;
  };

  return (
    <Background_Green>
      <FlatList
        style={styles.FlatList}
        data={liste}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={getHeader}
        ListFooterComponent={getFooter}
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
