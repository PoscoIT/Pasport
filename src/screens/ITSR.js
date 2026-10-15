import {
  View,
  Text,
  TextInput,
  Alert,
  Platform,
  StyleSheet,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import  {useEffect, useState} from 'react';
import axios from 'axios';
import {sendUserInfoName} from '../api/auth-api';
import NetInfo from '@react-native-community/netinfo';
import {useTranslation} from "react-i18next";


import {REACT_APP_SECRET_KEY} from '@env';
import {useNavigation} from "@react-navigation/native";
import { Button as PaperButton } from "react-native-paper";

let width = Dimensions.get('window').width; //full width
const ITSR = ({ route }) => {
const {t} = useTranslation()
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [netInfo, setNetInfo] = useState('');
    const navigation = useNavigation()

    useEffect(() => {
        // Subscribe to network state updates
        const unsubscribe = NetInfo.addEventListener(state => {
            setNetInfo(state.details.ipAddress);
        });

        return () => {
            // Unsubscribe to network state updates
            unsubscribe();
        };
    }, []);







    const url = "https://tstapp.poscoassan.com.tr:8443/WorkOrder/CreateITSR"
    const onSubmit = async () => {
        await sendUserInfoName(async sendResponse => {
            if (text) {
                const {uname, empSicil} = sendResponse;
                const details = {
                    EmployeeName: uname,
                    EmployeeID: empSicil,
                    Comment: text,
                };

                const formBody = Object.keys(details)
                    .map(
                        key =>
                            encodeURIComponent(key) + '=' + encodeURIComponent(details[key]),
                    )
                    .join('&');

                setLoading(true);
                try {
                    await axios
                        .post(url, formBody, {
                            headers: {
                                'auth-token': REACT_APP_SECRET_KEY,
                            },
                        })
                        .then(res => {

                            if (res.data.status === 'Success') {

                                Alert.alert('Başarılı', 'Başarıyla Kaydedildi');
                                setText('');
                            } else {
                                Alert.alert('Hata', 'Hata ile Karşılaşıldı');
                            }
                        })
                        .catch(err => {

                            Alert.alert('Hata', 'Hata ile Karşılaşıldı');
                        })
                        .finally(() => {
                            setLoading(false);
                        });
                } catch (e) {
                    Alert.alert('Hata', 'Hata ile Karşılaşıldı');
                }
            } else {
                Alert.alert('Hata', 'Hata ile Karşılaşıldı');
            }
        }).catch(err=>console.log(err))
    };
  
  return (
  <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={styles.container}
  >
    <ScrollView
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.formContainer}>
        <View style={styles.header}>
          <View style={styles.headerAccent} />

          <Text style={styles.title}>
            {t("itSr.createITRequest")}
          </Text>
        </View>

        <View style={styles.requestCard}>
  <Text style={styles.inputLabel}>
    {t("itSr.request")}
  </Text>

  <TextInput
    multiline
    numberOfLines={6}
    style={styles.textInput}
    value={text}
    onChangeText={setText}
    placeholder={t("itSr.request")}
    placeholderTextColor="#94A3B8"
    accessibilityLabel={t("itSr.request")}
    autoCapitalize="sentences"
    editable={!loading}
  />
</View>

      <PaperButton
  mode="contained"
  buttonColor="#0B337C"
  textColor="#FFFFFF"
  style={styles.button}
  contentStyle={styles.buttonContent}
  labelStyle={styles.buttonLabel}
  onPress={onSubmit}
  loading={loading}
  disabled={loading}
>
  {t("itSr.createITRequest")}
</PaperButton>
      </View>
    </ScrollView>
  </KeyboardAvoidingView>
);
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F6FC",
  },

  scrollContent: {
    flexGrow: 1,
    paddingTop: 28,
    paddingBottom: 36,
  },

  formContainer: {
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
    paddingHorizontal: 20,
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

  title: {
    color: "#172B4D",
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 33,
  },

  requestCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E3EAF4",
    padding: 16,
    marginBottom: 22,
  },

  textInput: {
    minHeight: 200,
    backgroundColor: "#FFFFFF",
    color: "#334155",
    fontSize: 15,
    lineHeight: 24,
    textAlignVertical: "top",
  },

  button: {
    borderRadius: 12,
  },

  buttonContent: {
    minHeight: 54,
    paddingVertical: 5,
  },

  buttonLabel: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0,
  },
  inputLabel: {
  color: "#0B337C",
  fontSize: 14,
  fontWeight: "600",
  marginBottom: 12,
},
});
export default ITSR;
