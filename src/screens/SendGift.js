/* eslint-disable no-alert */
import React, {memo, useState, useEffect} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  SafeAreaView,
  ActivityIndicator,
  LogBox,
  Alert,
} from 'react-native';
import 'firebase/auth';
import firebase from 'firebase/compat/app';
import Toast from '../components/Toast';
import {
  InsertNewAward,
  updateUserAward,
  sendMailForAward,
  sendMailForAwardLocalMail,
} from '../api/auth-api';
import {Card, Title, Paragraph, TextInput} from 'react-native-paper';
import Background_Green from '../components/Background_Green';
import PickerModal from 'react-native-picker-modal-view';
import Button from '../components/Button';

let width = Dimensions.get('window').width; //full width

const SendGift = ({route: {params}, navigation}) => {
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({value: '', type: ''});
  const [setError] = useState('');
  const [liste, setListe] = useState([{
    value: 'Müşteri Odaklılık (Customer Focus)',
    Name: 'Müşteri Odaklılık (Customer Focus)',
  },]);
  const [adSoyad, setAdSoyad] = useState();
  const [sicilNo, setsicilNo] = useState();
  const [comment, setComment] = useState({value: ''});
  const [mailInfo, setMailInfo] = useState({value: ''});
  const [selectedItem, setSelectedItem] = useState();

  const insertRec = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    if (
      adSoyad === undefined ||
      comment === undefined ||
      comment.value === ''
    ) {
      alert('Tüm alanların doldurulması  gerekiyor');
    } else {
      const response = await InsertNewAward({
        awardType: params.appHead,
        adSoyad: adSoyad.value,
        comment: comment.value,
        sicilNo: sicilNo.value,
        mailInfo: mailInfo.value,
      }).then(() => {
        return {response};
      });

      sendMailForAward(
        mailInfo.value,
        'Tebrik ederiz. <br/> Yöneticiniz tarafından 1 adet tarafınıza ' +
          params.appHead.replace('Count') +
          ' ödülü tanımlanmıştır.<br/><b>İyi günlerde kullanmanızı dileriz.</b><br/>*Ödülünüzü PASPort uygulamasını kullanarak seçebilirsiniz. ',
      ).then(() => {
        Alert.alert(
          'Bilgi',
          'Kayıt Başarılı!',
          [
            {
              text: 'OK',
            },
          ],
          {cancelable: false},
        );
      });
      sendMailForAwardLocalMail(
        mailInfo.value,
        'Tebrik ederiz. <br/> Yöneticiniz tarafından 1 adet tarafınıza ' +
          params.appHead.replace('Count') +
          ' ödülü tanımlanmıştır.<br/><b>İyi günlerde kullanmanızı dileriz.</b><br/>*Ödülünüzü PASPort uygulamasını kullanarak seçebilirsiniz. ',
      );

      if (response.error) {
        setError(response.error);
      } else {
        await updateUserAward(params.appHead);
        Alert.alert("Gift Send", "Completed");
        navigation.navigate('DashboardAward');
      }
    }
    setLoading(false);
  };

  const getTelNos = async () => {
    firebase
      .database()
      .ref('0/')
      .on('value', (snapshot) => {
        let li = [];
        snapshot.forEach((child) => {
          li.push({
            Name: child.val().AdSoyad,
            Value: child.val().SicilNo,
            cardInfo: child.val().cardInfo,
            MailAdd: child.val().MailAdd,
          });
        });
        setListe(li);
      });

    setLoading(false);
    return loading;
  };

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    let isMounted = true;
    const ac = new AbortController();
    Promise.all([
      getTelNos().then(() => {
        if (isMounted) {
          setLoading(false);
        }
      }),
    ]);
    return () => {
      isMounted = false;
      ac.abort();
    };
  }, []);

  return (
    <Background_Green>
      {loading && (
        <ActivityIndicator
          style={styles.actIndicator}
          size="large"
          color={'#444'}
        />
      )}
      {!loading && (
        <SafeAreaView style={styles.safeAreaStyle}>
          <Card style={styles.cardStyle}>
            <Card.Content>
              <Title>Değerli Yöneticimiz,</Title>
              <Paragraph>
                Ödül göndermek istediğiniz kişiyi listeden seçerek ödülünüzü
                iletebilirsiniz.
              </Paragraph>
              <Paragraph />
            </Card.Content>
          </Card>
          <View style={styles.container}>
            <View style={styles.ViewContainerRightBottom}>
              <PickerModal
                onSelected={(item) => {
                  setAdSoyad({value: item.Name});
                  setsicilNo({value: item.Value});
                  setMailInfo({value: item.MailAdd});
                  setSelectedItem(item);
                }}
                Autocomplete={false}
                items={liste}
                sortingLanguage={'tr'}
                showToTopButton={true}
                selected={selectedItem}
                showAlphabeticalIndex={true}
                autoGenerateAlphabeticalIndex={true}
                selectPlaceholderText={'Ad Soyad (Name Surname)'}
                searchPlaceholderText={'Search...'}
                requireSelection={false}
                autoSort={true}
              />
            </View>
          </View>
          <View style={styles.container}>
            <View style={styles.ViewContainerRightBottom}>
              <TextInput
                mode="fixed"
                placeholder="Açıklama (Explanation)"
                style={styles.input2}
                value={comment.value}
                onChangeText={(text) => setComment({value: text})}
                multiline={true}
                Autocomplete={false}
                maxLength={160}
                right={<TextInput.Affix text={comment.value.length + '/160'} />}
                underlineColorAndroid="transparent"
              />
            </View>
          </View>
          <View style={styles.container}>
            <View style={styles.ViewContainerRightBottom}>
              {!loading && (
                <Button
                  mode="contained"
                  style={styles.button}
                  onPress={insertRec}>
                  {' '}
                  Ödül Gönder (Send an Award)
                </Button>
              )}
            </View>
          </View>
          <Toast
            type={toast.type}
            message={toast.value}
            onDismiss={() => setToast({value: '', type: ''})}
          />
        </SafeAreaView>
      )}
    </Background_Green>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    width: width,
    backgroundColor: 'white',
    margin: 5,
  },
  ViewContainerRightBottom: {
    width: width - 10,
    margin: 5,
  },
  inputContainer: {
    fontSize: 12,
    width: '70%',
  },
  leftParag: {
    fontSize: 12,
    marginLeft: 5,
    justifyContent: 'center',
  },
  input2: {
    marginBottom: 10,
    backgroundColor: 'transparent',
  },
  cardStyle: {
    backgroundColor: 'white',
    margin: 5,
    height: 110,
  },
  safeAreaStyle: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 20,
    marginBottom: 70,
  },
});

export default memo(SendGift);