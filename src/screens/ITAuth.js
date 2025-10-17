import {
    View,
    Alert,
    StyleSheet,
    Dimensions,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Keyboard,
    Button, Text, Platform
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import axios from 'axios';
import {sendUserInfoName} from '../api/auth-api';
import NetInfo from '@react-native-community/netinfo';
import {useTranslation} from "react-i18next";
import TextInput from "../components/TextInput";
import {REACT_APP_SECRET_KEY} from '@env';
import PickerModal from "react-native-picker-modal-view";
import i18n from "../languages/i18n";
import {Input} from "@ui-kitten/components";


let width = Dimensions.get('window').width; //full width
const ITAuth = () => {
    const {t} = useTranslation()
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [categoryList,setCategoryList] = useState([])
    const url = 'https://tstapp.poscoassan.com.tr:8443';
    const [area,setArea] = useState([])
    const [reasonList,setReasonList] = useState([])
    const [category,setCategory] = useState([])
    const [reason,setReason] = useState([])
    const [duration,setDuration] = useState(category?.Duration?.toString())
    const [areaList, setAreaList] = useState([{
        "Name": "Production Area",
        "Value": "Production Area",
        "Id": 1
    },{
        "Name": "Office Area",
        "Value": "Office Area",
        "Id": 2
    },]);

    const getHttps = async () => {
        await axios.get(`${url}/ITRequests/ITAuthCategory`, {
            headers: {
                'Content-type': 'application/json',
                'auth-token': REACT_APP_SECRET_KEY,
            },

        }).then(async (res) => {

            setCategoryList(res.data?.map(item => [{
                Value: item.ID,
                Name: i18n.language==="tr"?item.Req_Type_Tr: item.Req_Type,
                Area_Name:item.Area_Name,
                Duration:item.Req_Type_Duration

            }][0]))
        }).catch(err => console.warn(err))
    }
    const getHttps2 = async () => {
        await axios.get(`${url}/ITRequests/ITAuthReason`, {
            headers: {
                'Content-type': 'application/json',
                'auth-token': REACT_APP_SECRET_KEY,
            },

        }).then(async (res) => {

            setReasonList(res.data?.map(item => [{
                Value: item.ID,
                Name: i18n.language==="tr"?item.Reason_Tr: item.Reason,


            }][0]))
        }).catch(err => console.warn(err))
    }

    const categoryUniqueList = useMemo(() => {
        let item=0


        const arrayUniqueByKey = categoryList?.filter(item => item.Area_Name===area.Name)?.map(item => [{
            Value: item.Value,
            Name: item.Name,
            Duration:item.Duration
        }][0])

        if (typeof (arrayUniqueByKey) !== 'undefined') {
            return arrayUniqueByKey
        } else {
            return []
        }


    }, [area,categoryList])


    const onSubmit = async () => {
        await sendUserInfoName(async sendResponse => {
            if (text && reason.Value && category.Value && area.Value && duration ) {
               if(duration>category?.Duration){
                   Alert.alert('Hata', `${t("itAuth.durationErrorMessage")}: ${category?.Duration}`);
               }
               else{
                   const {uname, empSicil} = sendResponse;
                   const details = {
                       EmployeeName: uname,
                       EmployeeID: empSicil,
                       Description: text,
                       Reason:reason.Value,
                       Category:category.Value,
                       Area:area.Value,
                       Request_Day:duration
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
                           .post(url+"/ITRequests/ITAuthCreate", formBody, {
                               headers: {
                                   'auth-token': REACT_APP_SECRET_KEY,
                               },
                           })
                           .then(res => {

                               if (res.data.status === 'Success') {

                                   Alert.alert(t("safetyControlScreen.info"), t("safetyControlScreen.savedSuccesffuly"));
                                   setText('');
                               } else {
                                   Alert.alert('Hata', res.data.message);
                               }
                           })
                           .catch(err => {

                               Alert.alert(t("safetyControlScreen.info"), t("safetyControlScreen.errorMessage"));
                           })
                           .finally(() => {
                               setLoading(false);
                           });
                   } catch (e) {
                       Alert.alert(t("safetyControlScreen.info"), t("safetyControlScreen.errorMessage"));
                   }
               }
            } else {
                Alert.alert(t("safetyControlScreen.error"), t("safetyControlScreen.pleaseFillAll"));
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


    useEffect(() => {
        getHttps()
    }, [])
    useEffect(() => {
        getHttps2()
    }, [])


    return (<KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{flex: 1}}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

                    <View>
                        <View>
                            <Text>
                                <Text style={{color: 'red'}}> *</Text>
                                {t("itAuth.area")}
                            </Text>
                        </View>

                            <PickerModal
                                style={{width: "100%", color: "black"}}
                                Autocomplete={false}
                                items={areaList}
                                sortingLanguage={'tr'}
                                showToTopButton={true}
                                showAlphabeticalIndex={true}
                                autoGenerateAlphabeticalIndex={true}

                                searchPlaceholderText={"Alan"}
                                requireSelection={false}
                                autoSort={true}
                                onSelected={item => {

                                    setArea(item)
                                }}/>
                    </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View>
                <View>
                    <Text>
                        <Text style={{color: 'red'}}> *</Text>
                        {t("itAuth.category")}
                    </Text>
                </View>
                {categoryUniqueList ?
                    <PickerModal
                        style={{width: "100%", color: "black"}}
                        Autocomplete={false}
                        items={categoryUniqueList}
                        sortingLanguage={'tr'}
                        showToTopButton={true}
                        searchPlaceholderText={"Kategori"}
                        requireSelection={false}

                        onSelected={item => {
                            setCategory(item)
                           /* setLine(item)
                            setArea("")*/
                        }}/> : null}
                </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View>
                    <View>
                        <Text>
                            <Text style={{color: 'red'}}> *</Text>
                            {t("itAuth.reason")}
                        </Text>
                    </View>



                {reasonList ?
                    <PickerModal
                        style={{width: "100%", color: "black"}}
                        Autocomplete={false}
                        items={reasonList}
                        sortingLanguage={'tr'}
                        showToTopButton={true}



                        searchPlaceholderText={"Neden"}
                        requireSelection={false}

                        onSelected={item => {
                            setReason(item)
                            /* setLine(item)
                             setArea("")*/
                        }}/> : null}
                </View>
            </TouchableWithoutFeedback>
            <View>
                <Text>
                    <Text style={{color: 'red'}}> *</Text>
                    {t("itAuth.duration")}
                </Text>
            </View>
                <TextInput  value={duration}        onChangeText={text => setDuration(text)}>

                </TextInput>


                <View style={{flex: 1}}>
                    <TextInput
                        multiline={true}
                        numberOfLines={4}

                        style={{textAlignVertical: 'top', height: 100}}
                        value={text}
                        onChangeText={text => setText(text)}
                        name="decription"
                        label={t("itAuth.duration")}
                    />
                    <Button color={theme.colors.primary} style={styles.button}     onPress={onSubmit} title={t("itAuth.createRequest")}>
                    </Button>
                </View>

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
export default ITAuth;
