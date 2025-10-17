import React, {memo, useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  Dimensions,
  View,
  ActivityIndicator,
} from 'react-native';
import firebase, {getDatabase, onValue, ref} from 'firebase/database';
import Toast from '../components/Toast';
import {sendUserInfoName} from '../api/auth-api';
import {SectionGrid} from 'react-native-super-grid';
import Background_Green from '../components/Background_Green';
import {Card, Title, Paragraph} from 'react-native-paper';
import firebaseDB from '../database/firebaseDB';

let width = Dimensions.get('window').width; //full width

const ReceiveMindScreen = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({value: '', type: ''});
  const db = getDatabase(firebaseDB);
  const [liste, setListe] = useState([]);
  const Separator = () => <View style={styles.separator} />;

  const getTelNos = async () => {
    await sendUserInfoName(sendResponse => {
      onValue(ref(db, 'Gonulden/CreditUsedLog/'), snapshot => {
        let li = [];
        snapshot.forEach(child => {
          child.forEach(childes => {
            if (sendResponse.uname === childes.val().toAdSoyad) {
              li.push({
                label: childes.val().fromUname,
                value: childes.val().toCommente,
                lineValue: childes.val().toDeger,
                lineva: childes.val().insertedDateTime,
                relatedDate: childes.val().relatedDate,
              });
            }
          });
        });
        li.sort((a,b)=>Date.parse(a.relatedDate?.replaceAll("-","."))-Date.parse(b.relatedDate?.replaceAll("-","."))).reverse()
        /*if (li.length > 0) {
          li.sort(function (a, b) {
            if (a.relatedDate > b.relatedDate) {
              return -1;
            } else if (a.relatedDate < b.relatedDate) {
              return 1;
            } else {
              if (a.lineva > b.lineva) {
                return -1;
              }
              if (a.lineva < b.lineva) {
                return 1;
              }
              return 0;
            }
          });
        }*/
        setListe(li);
      });

      setLoading(false);
      return loading;
    });
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

  return (
    <Background_Green>
      <Card style={styles.cardStyle}>
        <Card.Content>
          <Title>Değerli Çalışanımız,</Title>
          <Paragraph>Size gelen teşekkürleri aşağıda görebilirsiniz.</Paragraph>
          <Separator />
        </Card.Content>
      </Card>
      {loading && <ActivityIndicator color={'#444'} />}
      {!loading && (
        <SectionGrid
          itemDimension={width - 10}
          fixed
          sections={[
            {
              data: liste,
            },
          ]}
          style={styles.gridView}
          renderItem={({item}) => (
            <View style={[styles.itemContainer, {backgroundColor: '#39b'}]}>
              <Text style={styles.itemName2}>{item.label}</Text>
              <Text style={styles.itemName}>{item.lineva}</Text>
              <Text style={styles.itemName}>{item.lineValue}</Text>
              <Text style={styles.itemCode}>{item.value}</Text>
            </View>
          )}
        />
      )}
      <Toast
        type={toast.type}
        message={toast.value}
        onDismiss={() => setToast({value: '', type: ''})}
      />
    </Background_Green>
  );
};

const styles = StyleSheet.create({
  gridView: {
    flex: 1,
    width: width - 10,
    marginBottom: 50,
  },
  itemContainer: {
    justifyContent: 'flex-start',
    borderRadius: 5,
    padding: 5,
    height: 120,
  },
  itemName: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  itemName2: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  itemCode: {
    fontWeight: '600',
    fontSize: 12,
    color: '#fff',
  },
  cardStyle: {
    width: '100%',
    backgroundColor: 'white',
    marginTop: 8,
    height: 90,
  },
});

export default memo(ReceiveMindScreen);
