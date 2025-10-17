import React, {memo, useEffect, useMemo, useState} from 'react';
import {StyleSheet, View, ImageBackground, Text} from 'react-native';
import Toast from '../../components/Toast';
import Background_Green from '../../components/Background';
import {Dimensions, Platform} from 'react-native';
import {
    getListeStatus,
    sendUserInfoName,
    getTotalPoint2
} from '../../api/auth-api';
import {Button, Card, Title, Paragraph, Portal, Dialog, Provider} from 'react-native-paper';
import {getAuth} from 'firebase/auth';
import { db } from '../../database/firebaseDB';
import { useAuth } from '../../hooks/useAuth';
import {t, use} from "i18next";
import axios from "axios";
import i18n from "../../languages/i18n";
import NetInfo from "@react-native-community/netinfo";
import { Timestamp} from 'firebase/firestore';
import moment from "moment";

import {REACT_APP_SECRET_KEY} from '@env';







let width = Dimensions.get('window').width; //full width
let height = Dimensions.get('window').height; //full width

const SafetyMainScreen = ({route:{params},navigation}) => {
  const auth = getAuth();

    const   checkedControl  = params?.checkedControl;
    const [checkedFatih,setCheckedFatih] = useState(checkedControl?checkedControl:false)
    const hideDialog = async() => {
        setIsOpen(false)

    };

    const {isOpen,setIsOpen,dialogContent} = useAuth()
    const convertTimestamp  = (timestamp) => {

        //extract the seconds and nanos values from your Firestore timestamp object
        const { seconds, nanoseconds } = timestamp;
        //combine the seconds and nanos values into a single timestamp in milliseconds
        const milliseconds = seconds * 1000 + nanoseconds / 1e6;
        //use Moment.js to convert the timestamp to a date
        return moment(milliseconds).toDate();
    }

  const [toast, setToast] = useState({value: '', type: ''});
  const [checked, setchecked] = useState(true);
  const [liste, setListe] = useState([]);
  const [isseqId, setseqId] = useState(500);

  const [data,setData] = useState([])
  const [isTotalPoint, setTotalPoint] = useState(0);
  const [isTotalPoint2, setTotalPoint2] = useState(0);
    const [email, setEmail] = useState('');
    const isEmailPoscoAssan = email.includes('@poscoassan.com');
    const [netInfo, setNetInfo] = useState('');
    const url = 'https://tstapp.poscoassan.com.tr:8443';
    let today = new Date(convertTimestamp(Timestamp.now()));
    let todayFull = new Date(convertTimestamp(Timestamp.now()));
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let hours = String(today.getHours()).padStart(2, '0');
    let min = String(today.getMinutes()).padStart(2, '0');
    let sec = String(today.getSeconds()).padStart(2, '0');
    let yyyy = today.getFullYear();
    today = mm + '-' + dd + '-' + yyyy;
    todayFull = hours + ':' + min + ':' + sec + '  ' + dd + '-' + mm + '-' + yyyy;



    const getLanguageData = async () => {


        await axios.get(`${url}/Common/ListISGControlsData`, {

            headers: {
                'Content-type': 'application/json',
                'auth-token': REACT_APP_SECRET_KEY,

            },

        
        }).then((res) => {


            setData(res.data.map(item => [{
                value: item.ID,
                Name: i18n.language === "tr" ? item.NameTR : item.Name,
                Type: item.Type

            }][0]))

        }).catch(err => console.log(err))
    }



    const getData = async()=>{
        let user = auth.currentUser;
        if (user) {
            if (user != null) {
                let uid = user.uid;
                let uemail = user.email;
            }
        }
        await sendUserInfoName(async sendResponse => {
            await db.ref(
                        'SafetyDB/' +
                        yyyy +
                        '_' +
                        mm +
                        '_' +
                        dd +
                        '/' +
                        sendResponse.empSicil +
                        '/General/',
                    )
                    .update({
                        relatedDate: today,
                        insertedDateTime: todayFull,
                        fromMail: uemail,
                        fromUid: uid,
                        searchCondit: uemail + today,
                        fromUname: sendResponse.uname,
                        fromSicilNo: sendResponse.empSicil,
                        fromLine: sendResponse.line,
                        page: 'SafetyDashBoard',
                    });
        }).catch(err=>console.log(err));

        auth.onAuthStateChanged(async (user) => {

            if (user) {
             const data2 =    await getListeStatus((responsed) => {
                    setchecked(responsed.checked);
                    setEmail(user.email)
                    setseqId(responsed.isseqId);
                    setTotalPoint(responsed.isTotalPoint);
                    setListe(responsed.liste);

                }).catch(err=>console.log(err))

                await getTotalPoint2((responsed) => {
                    setTotalPoint2(responsed.isTotalPoint);
                    return;
                }).catch(err=>console.log(err));
            }

        });
    }
    const languageData = useMemo(() => {
        const arrayUniqueByKey = data.filter(item => item.Type ===4)
        return arrayUniqueByKey
    }, [netInfo,data])

    useEffect(() => {
        getLanguageData()
    },[netInfo]);

 useEffect(() => {

   getData()
    },[checked]);

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







    return (
            <Background_Green>
                <Provider>
                <View style={styles.container}>
                    <Card style={[styles.cardStyle, {backgroundColor: 'white'}]}>
                        <Card.Content >
                            <Title style={{color:"#000"}}>{t("safetyMainScreen.message1")}</Title>
                            <Paragraph style={{color:"#000"}}>
                                {t("safetyMainScreen.message2")}{' '}
                            </Paragraph>
                            <Paragraph style={{color:"#000"}}>
                                {t("safetyMainScreen.ranking")}: {isseqId + 1} / {liste.length} | {t("safetyMainScreen.monthlyPoint")}:{' '}
                                {isTotalPoint}
                            </Paragraph>
                            <Paragraph style={{color:"#000"}}>{t("safetyMainScreen.totalPoint")}: {isTotalPoint2}</Paragraph>
                        </Card.Content>
                    </Card>
                    <View >
                        <View style={{flexDirection: 'row',marginBottom:10,marginHorizontal:5,flexWrap:"wrap",justifyContent:"space-around",alignItems:"center"}}>
                            <Button
                                textColor={"#fff"}

                                style={styles.buttonRight}
                                mode="outlined"
                                onPress={() => (checked || checkedFatih)?null: navigation.navigate('SafetyDetailScreen')}>
                                {(checked || checkedFatih)? (
                                    t("safetyMainScreen.completed")


                                ):t("safetyMainScreen.answerQuestion")}



                            </Button>
                            <Button
                                textColor={"#fff"}
                                mode="outlined"
                                style={styles.buttonRight}
                                onPress={() => navigation.navigate('SafetyRules')}>

                                    {t("safetyMainScreen.safetyRules")}

                            </Button>
                            {isEmailPoscoAssan? <Button
                                textColor={"#fff"}
                                style={styles.buttonRight}
                                mode="outlined"
                                onPress={() => navigation.navigate('SafetyControl')}>

                                {languageData?languageData[43]?.Name:t("safetyMainScreen.safetyInspection")}

                            </Button>:null}


                        </View>

                       {/* {isEmailPoscoAssan?<View style={{justifyContent:"flex-start",alignContent:"center",alignItems:"center"}}>
                            <Button
                                mode="contained"
                                style={styles.buttonCenter}
                                onPress={() => navigation.navigate('SafetyControl')}>
                                <Text
                                    style={{
                                        flex: 1, width: 1,
                                        textAlign: 'center',
                                        textAlignVertical: 'center',
                                        color: 'white',
                                        fontWeight: '500',
                                        textTransform:"capitalize",
                                        flexDirection: 'row',
                                        alignItems: 'center',

                                    }}>
                                    {languageData?languageData[43]?.Name:t("safetyMainScreen.safetyInspection")}
                                </Text>
                            </Button>
                        </View>:null}*/}

                        <ImageBackground
                            resizeMode="contain"
                            source={require('../../assets/safety1st.png')}
                            style={styles.backgroundImage}
                        />


                        <Toast
                            type={toast.type}
                            message={toast.value}
                            onDismiss={() => setToast({value: '', type: ''})}
                        />
                    </View>
                </View>
                <Portal>
                    {isOpen===true? <Dialog  style={dialogContent?.DialogStyle} visible={isOpen} onDismiss={hideDialog}>
                        <Dialog.Content>

                            <Text style={dialogContent?.TextStyle}>{dialogContent?.Text}</Text>
                        </Dialog.Content>
                        <Dialog.Actions >
                            <Button style={dialogContent?.ButtonStyle} color={dialogContent?.ButtonColor} onPress={hideDialog}>{t("general.close")}</Button>
                        </Dialog.Actions>
                    </Dialog>:null}

                </Portal>
                </Provider>
            </Background_Green>

        );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',


  },
  backgroundImage: {
    flex: 1,
    height: 300,
    width: undefined,
  },
  button: {
    height:50,
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#5533f8',
    fontSize: 3,
    alignItems:"center",
    flexGrow: 1,
    margin: 10,
  },
    buttonCenter: {
        height:50,
        justifyContent: 'flex-start',
        borderRadius: 10,
        backgroundColor: '#5533f8',
        fontSize: 3,
        flexDirection: 'row',
        alignItems:"center",
        alignContent:"center",
    },
  buttonRight: {
    textAlign:"center",
    justifyContent: 'center',
      backgroundColor: '#5435e8',
    borderRadius: 10,
    fontSize: 3,
      height:55,
    flexDirection: 'row',
    alignItems:"center",
    margin: 10,
  },
  cardStyle: {

    backgroundColor: 'red',
    marginTop: 10,
    width: width - 30,
  },

});

export default memo(SafetyMainScreen);
