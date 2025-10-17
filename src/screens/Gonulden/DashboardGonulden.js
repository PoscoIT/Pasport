/* eslint-disable prettier/prettier */
/* eslint-disable eqeqeq */
import React, {memo, useEffect, useState} from 'react';
import {
  Dimensions,
  ImageBackground,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import 'firebase/auth';
import firebase from 'firebase/compat/app';
import Toast from '../../components/Toast';
import Background_Green from '../../components/Background';
import {sendUserInfoName} from '../../api/auth-api';
import {Button} from 'react-native-paper';
import {getDatabase, onValue, ref} from "firebase/database";
import firebaseDB from "../../database/firebaseDB";

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full width

export const logoutUser = companyCode => {
  if (companyCode === 'TST') {
    firebase.auth().signOut();
  }
};

const DashboardGonulden = ({navigation}) => {
  const [toast, setToast] = useState({value: '', type: ''});
  const [loading, setLoading] = useState(true);
  const db = getDatabase(firebaseDB);
  const [liste, setListe] = useState([]);
  const [listeRec, setListeRec] = useState([]);
  const [fetched, setFetched] = React.useState(false);
  const getTelNos = async () => {
    await sendUserInfoName(sendResponse => {
      onValue(ref(db, 'Gonulden/CreditUsedLog'), snapshot => {

        let li = [];
        let liRec = [];
        snapshot.forEach(child => {
          child.forEach(childes => {
            if (sendResponse.uname === childes.val().fromUname) {

              li.push({
                label: childes.val().toAdSoyad,
              });
            }
            if (sendResponse.uname === childes.val().toAdSoyad) {

              liRec.push({
                label: childes.val().toAdSoyad,
              });
            }
          });
        });
        setListe(li);
        setListeRec(liRec);


      });


      setLoading(false);
      return loading;
    });
  }

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      getTelNos().then(() => {
        if (isMounted) {
          setLoading(false);
        }
      }),
    ])
      .then(() => setFetched(true))
      .catch(ex => console.error(ex));
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Background_Green>
      <View style={styles.container}>
        <View style={styles.viewCont}>
          <ImageBackground
            source={require('../../assets/wallpaper_logo.png')}
            style={styles.backgroundImage}
            resizeMode="contain"
          />
          <Button

            mode="contained"
            style={styles.button}
            onPress={() => navigation.navigate('GiveMindScreen')}>
            Mesaj Gönder(Send Message)
          </Button>
          <Button

            mode="contained"
            style={styles.button}
            onPress={() => navigation.navigate('ReceiveMindScreen')}>
            Gelen Mesaj (Inbox) ({listeRec.length})
          </Button>
          <Button

            mode="contained"
            style={styles.button}
            onPress={() => navigation.navigate('SendMindScreen')}>
            Gönderilen Mesaj (Sent) ({liste.length})
          </Button>
          <Toast
            type={toast.type}
            message={toast.value}
            onDismiss={() => setToast({value: '', type: ''})}
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
  btnText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'left',
  },
  button: {
    margin: 10,
    width: width - 30,
    height: 40,
    backgroundColor: '#57A7B3',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    height: Platform.OS == 'ios' ? height - 210 : height - 150,
  },
  viewCont: {
    alignItems: 'stretch',
    flex: 1,
  },
});

export default memo(DashboardGonulden);
