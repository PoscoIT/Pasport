import {
    View,
    Alert,
    StyleSheet,
    Dimensions,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Keyboard,
    Button
} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {sendUserInfoName} from '../api/auth-api';
import NetInfo from '@react-native-community/netinfo';
import {useTranslation} from "react-i18next";
import TextInput from "../components/TextInput";
import {theme} from "../core/theme";
import {REACT_APP_SECRET_KEY} from '@env';
import {useNavigation} from "@react-navigation/native";


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
    const theme = {
        colors: {
            placeholder: 'black',
            text: 'black',
            primary: '#4a8a94',
            underlineColor: 'transparent',
            background: 'white',
        },
    };
    return (<KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{flex: 1}}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{flex: 1}}>
                    <TextInput
                        multiline={true}
                        numberOfLines={4}

                        style={{textAlignVertical: 'top', height: 150}}
                        value={text}
                        onChangeText={text => setText(text)}
                        name="decription"
                        label={t("itSr.request")}
                    />
                    <Button color={theme.colors.primary} style={styles.button}  onPress={onSubmit} title={t("itSr.createITRequest")}>
                    </Button>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>

    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#181e34',
    },
    textIntput: {
        height: 300,
    },
    formContainer: {
        padding: 8,
        flex: 1,
    },
    button: {
        margin: 10,
        width: width - 30,
        height: 40,

    },
});
export default ITSR;
