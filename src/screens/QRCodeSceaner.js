/* eslint-disable react-native/no-inline-styles */
import React, {memo, useState} from 'react';
import {StyleSheet, Text, View, Alert} from 'react-native';
import Button from '../components/Button';
import Toast from '../components/Toast';
import Background_Green from '../components/Background_Green';
import {InsertNewQrCodeRecord} from '../api/auth-api';
import {Card, Title, Paragraph} from 'react-native-paper';

const QRCodeSceaner = ({navigation}) => {
  const [toast, setToast] = useState({value: '', type: ''});
  const [scan, setScan] = useState({value: false});
  const [ScanResult, setScanResult] = useState({value: false});
  const [result, setResult] = useState({value: null});
  const [scanner, setScanner] = useState({value: ''});
  const [loading, setLoading] = useState(false);
  const [setError] = useState('');

  const onSuccess = (e) => {
    setResult(e);
    setScan(false);
    setScanResult(true);
  };

  let scanAgain = () => {
    setScan(true);
    setScanResult(false);
  };

  const getSaveQrCode = async (QrCodeNo) => {
    if (loading) {
      return;
    }
    setLoading(true);

    const response = await InsertNewQrCodeRecord({
      QrCodeNo: QrCodeNo,
    });
    if (response.error) {
      setError(response.error);
    } else {
      Alert.alert(
        'Kayıt Başarılı',
        QrCodeNo[{text: 'Button Text', onPress: () => null}],
      );
      navigation.navigate('Dashboard');
    }
    setLoading(false);
    return {};
  };

  return (
    <Background_Green style={styles.backGround}>
      {ScanResult && !scan && (
        <View style={{flex: 1, width: '100%'}}>
          <View style={{flex: 1}}>
            {(() => {
              return (
                <View>
                  <Text style={styles.label3}>
                    {result.data} numaralı servis.
                  </Text>
                  <Text />
                  <Text />
                  <Text />
                  <Button
                    mode="contained"
                    style={styles.button3}
                    onPress={() => getSaveQrCode(result.data)}>
                    {' '}
                    Servisi Kaydet
                  </Button>
                </View>
              );
            })()}

            <Button mode="outlined" style={styles.button3} onPress={scanAgain}>
              <Text style={styles.buttonTextStyle}>Tekrar Okut</Text>
            </Button>
          </View>
        </View>
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
  back: {
    width: '100%',
    fontSize: 15,
    padding: 10,
  },
  button3: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label3: {
    color: 'black',
    fontSize: 15,
    alignSelf: 'center',
    width: '100%',
    justifyContent: 'center',
    textAlign: 'center',
  },
  cameraStyle: {
    height: 200,
    marginTop: 40,
    width: 200,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  cardStyle: {
    height: 75,
    backgroundColor: 'transparent',
    width: '100%',
  },
});

export default memo(QRCodeSceaner);
