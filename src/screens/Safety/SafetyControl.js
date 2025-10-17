import {
    Alert,
    Animated,
    Dimensions,
    PermissionsAndroid,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
    TouchableWithoutFeedback,
    Keyboard,
    KeyboardAvoidingView, SafeAreaView,
} from "react-native";
import TextInput from '../../components/TextInput';
import {ActivityIndicator, Button, Portal, Provider, Dialog,DefaultTheme} from 'react-native-paper';
import {theme} from "../../core/theme";
import React, {useEffect, useMemo, useRef, useState} from "react";
import PickerModal from 'react-native-picker-modal-view';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {sendUserInfoName,} from '../../api/auth-api';
import {check, PERMISSIONS, request, RESULTS} from "react-native-permissions";
import axios from "axios";
import NetInfo from "@react-native-community/netinfo";
import Icon from 'react-native-vector-icons/FontAwesome';
import {Radio, RadioGroup} from "@ui-kitten/components";
import i18n from "../../languages/i18n";
import {REACT_APP_SECRET_KEY} from '@env'




const {height, width} = Dimensions.get("window")
const SafetyControl = ({navigation}) => {
    const scrollViewRef = useRef(null);
    const [netInfo, setNetInfo] = useState('');

    const [lineList, setLineList] = useState([])
    const url = 'https://tstapp.poscoassan.com.tr:8443';

    const [employeeId, setEmployeeId] = useState("")
    const [userLine, setUserLine] = useState("")
    const [loading, setLoading] = useState(false)
    const [opinionImprovement, setOpinionImprovement] = useState("")
    const [accidentType, setAccidentType] = useState([])
    const [defectType, setDefectType] = useState([])
    const [defectTypeDetails, setDefectTypeDetails] = useState([])
    const [name, setName] = useState("")
    const [action, setAction] = useState(0)
    const [defectValue, setDefectValue] = useState("")
    const [defectDetailsValue, setDefectDetailsValue] = useState("")
    const [checked, setChecked] = useState(false);
    const [line, setLine] = useState("")

    const [inspectionType, setInspectionType] = useState(userLine === "IS GUVENLIGI TAKIMI" ? {
        value: 5,
        Name: "Safety Patrol"
    } : {value: 0, Name: "Safety Audit"})
    const [area, setArea] = useState("")
    const [content, setContent] = useState("")
    const [filePath, setFilePath] = useState("");
    const [filePath2, setFilePath2] = useState("");
    const [visible, setVisible] = React.useState(false);
    const hideDialog = () => setVisible(false);
    const [visible2, setVisible2] = React.useState(false);
    const hideDialog2 = () => setVisible2(false);
    const [visible3, setVisible3] = React.useState(false);
    const hideDialog3 = () => setVisible3(false);
    const requestCameraPermission = async config => {
        const permission = Platform.OS === "android"
            ? PERMISSIONS.ANDROID.CAMERA
            : PERMISSIONS.IOS.CAMERA
        return check(permission).then((result) => {
            switch (result) {
                case RESULTS.DENIED:
                    return request(permission, {
                        title: 'Camera Permission ',
                        message:
                            'TST App Kameranıza ulaşmak istiyor.'
                    }).then((result) => {
                        if (result === RESULTS.GRANTED) {
                            return true
                        } else {
                            return false
                        }
                    })
                case RESULTS.GRANTED:
                    return true
                case RESULTS.BLOCKED:
                    return false
                default:
                    return false
            }
        })
    };
    const requestExternalWritePermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'External Storage Write Permission',
                        message: 'App needs write permission',
                    },
                );
                // If WRITE_EXTERNAL_STORAGE Permission is granted
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {

                alert('Write permission err', err);
            }
            return false;
        } else return true;
    };
    const captureImage = async (type) => {

        let options = {
            mediaType: type,
            maxWidth: 400,
            maxHeight: 550,
            includeBase64: true,
            quality: 1,
            videoQuality: 'low',
            durationLimit: 30,
            saveToPhotos: true,
        };
        let isCameraPermitted = await requestCameraPermission();
        //   let isStoragePermitted = await requestExternalWritePermission();
        if (isCameraPermitted ) {
            await launchCamera(options, (response) => {
                if (response.didCancel) {
                    return;
                } else if (response.errorCode == 'camera_unavailable') {
                    alert('Camera not available on device');
                    return;
                } else if (response.errorCode == 'permission') {
                    alert('Permission not satisfied');
                    return;
                } else if (response.errorCode == 'others') {
                    alert(response.errorMessage);
                    return;
                }
                setVisible(false)
                setFilePath(response.assets[0]);
            });
        }
    };

    const chooseFile = async (type) => {
        let options = {
            mediaType: type,
            maxWidth: 400,
            includeBase64: true,
            maxHeight: 550,
            quality: 1,
        };
        await launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                return;
            } else if (response.errorCode == 'camera_unavailable') {
                alert('Camera not available on device');
                return;
            } else if (response.errorCode == 'permission') {
                alert('Permission not satisfied');
                return;
            } else if (response.errorCode == 'others') {
                alert(response.errorMessage);
                return;
            }
            setVisible(false)
            setFilePath(response.assets[0]);
        });
    };
    const captureImage2 = async (type) => {
        let options = {
            mediaType: type,
            maxWidth: 400,
            maxHeight: 550,
            includeBase64: true,
            quality: 1,
            videoQuality: 'low',
            durationLimit: 30,
            saveToPhotos: true,
        };
        let isCameraPermitted = await requestCameraPermission();
        //   let isStoragePermitted = await requestExternalWritePermission();
        if (isCameraPermitted ) {
            await launchCamera(options, (response) => {
                if (response.didCancel) {
                    return;
                } else if (response.errorCode == 'camera_unavailable') {
                    alert('Camera not available on device');
                    return;
                } else if (response.errorCode == 'permission') {
                    alert('Permission not satisfied');
                    return;
                } else if (response.errorCode == 'others') {
                    alert(response.errorMessage);
                    return;
                }
                setVisible2(false)
                setFilePath2(response.assets[0]);
            });
        }
    };
    const chooseFile2 = async (type) => {
        let options = {
            mediaType: type,
            maxWidth: 400,
            includeBase64: true,
            maxHeight: 550,
            quality: 1,
        };
        await launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                return;
            } else if (response.errorCode == 'camera_unavailable') {
                alert('Camera not available on device');
                return;
            } else if (response.errorCode == 'permission') {
                alert('Permission not satisfied');
                return;
            } else if (response.errorCode == 'others') {
                alert(response.errorMessage);
                return;
            }
            setVisible2(false)
            setFilePath2(response.assets[0]);
        });
    };

    const addForm = async () => {
        setLoading(true)
        let formdata = new FormData()
        if (line && (areaUniqueList?.length>0?area:true) && content && filePath && action!==null && inspectionType && defectValue  && accidentValue) {
            if (action === 1 && !opinionImprovement) {
                Alert.alert(
                    languageData[38]?.Name,

                    languageData[37]?.Name,
                    [
                        {
                            text: languageData[39]?.Name
                        },
                    ],
                    {cancelable: false},
                );
                setLoading(false)
            } else if((action===1  && opinionImprovement && filePath2) || action===0 ||  action===2) {


                formdata.append("EmployeeID", employeeId)
                formdata.append("Line", line.value)
                {areaUniqueList?.length>0?formdata.append("Area", area.value):null}
                formdata.append("DefectContent", content)
                formdata.append("Status", action === 0 ? 13 : 18)
                formdata.append("ISGCheckList", {
                    name: filePath.fileName,
                    type: filePath.type,
                    uri:
                        Platform.OS === 'android' ? filePath.uri : filePath.uri.replace('file://', ''),
                })
                filePath2&&(formdata.append("ISGCheckListAfter", {
                    name: filePath2?.fileName,
                    type: filePath2?.type,
                    uri:
                        Platform.OS === 'android' ? filePath2?.uri : filePath2?.uri.replace('file://', ''),
                }))
                formdata.append("InspectionType", inspectionType.value)
                formdata.append("OpinionOnImprovementMeasurement", opinionImprovement)
                formdata.append("ClassificationOfActions", action)
                formdata.append("RiskLevel", defectValue.value)
                 // formdata.append("SubDefectType", defectDetailsValue.value)
                formdata.append("AccidentPreventionType", accidentValue.value)


                await axios.post(`${url}/ISG/ISGInspectionCheckListData`, formdata, {
                    headers: {
                        Accept: "application/x-www-form-urlencoded",
                        'auth-token': REACT_APP_SECRET_KEY,
                        "Content-Type": "multipart/form-data"
                    },
                }).then((res) => {


                    if (res.data?.status === "Success") {
                        Alert.alert(
                            languageData[40]?.Name,
                            languageData[41]?.Name,
                            [
                                {
                                    text:languageData[39]?.Name,
                                },
                            ],
                            {cancelable: false},
                        );
                        setArea("")
                        setLine("")
                        setContent("")
                        setFilePath("")
                        setChecked(false)
                        setLoading(false)
                        navigation.navigate("SafetyMainScreen")
                    } else {
                        Alert.alert(
                            languageData[38]?.Name,
                            languageData[42]?.Name,
                            [
                                {
                                    text:languageData[39]?.Name,
                                },
                            ],
                            {cancelable: false},
                        );
                        setLoading(false)
                    }

                }).catch(err => console.warn(err)).finally(() => setLoading(false))
            }
        } else {
            Alert.alert(
                languageData[38]?.Name,
                languageData[37]?.Name,
                [
                    {
                        text:languageData[39]?.Name
                    },
                ],
                {cancelable: false},
            );
            setLoading(false)
        }
    }
    const getAccidentData = async () => {
        await axios.get(`${url}/Common/ListISGControlsData`, {
            headers: {
                'Content-type': 'application/json',
                'auth-token': REACT_APP_SECRET_KEY,
            },
        }).then(async (res) => {

            setAccidentType(res.data.map(item => [{
                value: item.ID,
                Name: i18n.language==="tr"?item.NameTR: item.Name,
                Type: item.Type,
                Active:item.Active,
                ForISG:item.ForISG

            }][0]))
        }).catch(err => console.warn(err))
    }
    const getDefectData = async () => {
        await axios.get(`${url}/Common/ListISGDefectData`, {
            headers: {
                'Content-type': 'application/json',
                'auth-token': REACT_APP_SECRET_KEY,
            },

        }).then(async (res) => {

            setDefectType(res.data.map(item => [{
                value: item.ID,
                Name: i18n.language==="tr"?item.NameTR: item.Name,
            }][0]))
        }).catch(err => console.warn(err))
    }
    const riskLevel = [
        {id:1,value:1,Name:"Düşük-Low"},
        {id:2,value:2,Name:"Orta-Medium"},
        {id:3,value:3,Name:"Yüksek-High"},
    ]
    const getDefectDetailsData = async () => {
        await axios.get(`${url}/Common/ListISGDefectDetailData`, {
            headers: {
                'Content-type': 'application/json',
                'auth-token': REACT_APP_SECRET_KEY,
            },
        }).then(async (res) => {

            setDefectTypeDetails(res.data.map(item => [{
                value: item.ID,
                Name: i18n.language==="tr"?item.NameTR: item.Name,
                Type: item.Type
            }][0]))
        }).catch(err => console.warn(err))
    }
    const getHttps2 = async () => {
        await axios.get(`${url}/Common/ListTeamData`, {
            headers: {
                'Content-type': 'application/json',
                'auth-token': REACT_APP_SECRET_KEY,
            },
            params: {
                ApplicationName: "ISGCheckList"
            }
        }).then(async (res) => {

            setLineList(res.data?.map(item => [{
                value: item.ID,
                Name: i18n.language==="tr"?item.NameForISG: item.NameForISGEn,
                Value1: item["ListSubTeams.ID"],
                TeamID: item["ListSubTeams.TeamID"],
                ForISG: item["ListSubTeams.ForISG"],
                NameTr:item[i18n.language==="tr"?"ListSubTeams.NameTr":"ListSubTeams.Name"]
            }][0]))
        }).catch(err => console.warn(err))
    }
    const accidentList = useMemo(() => {
        const arrayUniqueByKey = accidentType.filter(item => item.Type ===1 && item.Active===1)
        return arrayUniqueByKey
    }, [accidentType])
    const languageData = useMemo(() => {
        const arrayUniqueByKey = accidentType.filter(item => item.Type ===4)
        return arrayUniqueByKey
    }, [accidentType])

    const lineUniqueList = useMemo(() => {
        const arrayUniqueByKey = lineList.filter((a, i) => lineList.findIndex((s) => a.Name === s.Name) === i)
        return arrayUniqueByKey
    }, [lineList])

    const defectDetailsList = useMemo(() => {
        const arrayUniqueByKey = defectTypeDetails.filter(item => item.Type === defectValue?.value)
        return arrayUniqueByKey
    }, [defectValue])

    const inspectionList = useMemo(() => {
        const arrayUniqueByKey = accidentType.filter(item => item.Type === 2 && item.Active===1).filter(item=>userLine !== "IS GUVENLIGI TAKIMI"?item.ForISG===0:item.ForISG<2)
        return arrayUniqueByKey
    }, [accidentType,userLine])
    const selectedItem = userLine === "İş Güvenliği Takımı" ? {
        value: 18,
        Name: languageData[34]?.Name
    } : {value: 15, Name: languageData[35]?.Name}
    const [accidentValue, setAccidentValue] = useState({value: 23, Name: languageData[28]?.Name})
    const selectedItemAccident = {value: 23, Name: languageData[28]?.Name}

    const areaUniqueList = useMemo(() => {

        const arrayUniqueByKey = lineList?.filter(item => item.TeamID === line.value && item.ForISG === 1)?.map(item => [{
            value: item.Value1,
            Name: item.NameTr,
        }][0])
        if (typeof (arrayUniqueByKey) !== 'undefined') {
            return arrayUniqueByKey
        } else {
            return []
        }


    }, [lineUniqueList, line])

    const getUser = async () => {
        await sendUserInfoName(sendResponse => {
            setEmployeeId(sendResponse.empSicil)
            setName(sendResponse.uname)
            setUserLine(sendResponse.line)
        })
    };


    useEffect(() => {
        getUser()
    }, [])
    useEffect(() => {
        getAccidentData()
    }, [netInfo])
    useEffect(() => {
        getDefectData()
    }, [netInfo])
    useEffect(() => {
        getDefectDetailsData()
    }, [netInfo])
    useEffect(() => {
        getHttps2()
    }, [netInfo])

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
        <SafeAreaView style={styles.container}>
        <ScrollView keyboardShouldPersistTaps={"always"}>
                <Provider>


                <View style={styles.container}>
                    <Text style={{
                        backgroundColor: "white",
                        width: "100%",
                        textAlign: "center",
                        fontSize: 16,
                        color:"#000",
                        fontWeight: "600"
                    }}>      {languageData[36]?.Name}</Text>
                        <View style={styles.form}>

                        <TouchableWithoutFeedback  onPress={Keyboard.dismiss}>
                            <TextInput

                                theme={DefaultTheme}
                                disabled={true}

                                label={languageData[12]?.Name}
                                value={name}
                                returnKeyType="next"
                                autoCapitalize="none"
                            />
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View>
                                <View>
                                    <Text       >
                                        <Text style={{color: 'red'}}> *</Text>
                                        {languageData[13]?.Name}
                                    </Text>
                                </View>
                                {lineUniqueList ?
                                    <PickerModal
                                        style={{width: "100%", color: "black"}}
                                        Autocomplete={false}
                                        items={lineUniqueList}
                                        sortingLanguage={'tr'}
                                        showToTopButton={true}
                                        showAlphabeticalIndex={true}
                                        autoGenerateAlphabeticalIndex={true}
                                        selectPlaceholderText={<Text>
                                            {languageData[27]?.Name}
                                        </Text>}
                                        searchPlaceholderText={languageData[29]?.Name}
                                        requireSelection={false}
                                        autoSort={true}
                                        onSelected={item => {
                                            setLine(item)
                                            setArea("")
                                        }}/> : null}
                            </View>
                        </TouchableWithoutFeedback>
                            {areaUniqueList?.length>0?  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                <View>
                                    <Text>
                                        <Text style={{color: 'red'}}> *</Text>
                                        {languageData[14]?.Name}
                                    </Text>
                                    {areaUniqueList  ?
                                        <PickerModal
                                            style={{width: "100%", backgroundColor: "black"}}
                                            Autocomplete={false}
                                            items={areaUniqueList}
                                            sortingLanguage={'tr'}
                                            showToTopButton={true}
                                            showAlphabeticalIndex={true}
                                            autoGenerateAlphabeticalIndex={true}
                                            selectPlaceholderText={<Text>
                                                {languageData[27]?.Name}
                                            </Text>}
                                            searchPlaceholderText={languageData[29]?.Name}
                                            requireSelection={false}
                                            autoSort={true}
                                            onSelected={item => setArea(item)}/> : null}
                                </View>
                            </TouchableWithoutFeedback>:null}

                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View>
                                <View>
                                    <Text>
                                        <Text style={{color: 'red'}}> *</Text>
                                        {languageData[15]?.Name}
                                    </Text>
                                </View>
                                {inspectionList ? <PickerModal
                                    style={{width: "100%", backgroundColor: "black"}}
                                    Autocomplete={false}
                                    items={inspectionList}
                                    sortingLanguage={'tr'}
                                    showToTopButton={true}
                                    showAlphabeticalIndex={true}
                                    autoGenerateAlphabeticalIndex={true}
                                    selectPlaceholderText={<Text>
                                        <Text style={{color: 'red'}}> *</Text>
                                        {languageData[27]?.Name}
                                    </Text>}
                                    searchPlaceholderText={languageData[29]?.Name}
                                    requireSelection={false}
                                    autoSort={true}
                                    onSelected={item => setInspectionType(item)}/> : null}
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View>
                                <View>
                                    <Text>
                                        <Text style={{color: 'red'}}> *</Text>
                                        {languageData[16]?.Name}
                                    </Text>
                                </View>
                                {accidentList ?
                                    <PickerModal
                                        style={{width: "100%", backgroundColor: "red"}}
                                        Autocomplete={false}
                                        items={accidentList}
                                        sortingLanguage={'tr'}
                                        showToTopButton={true}
                                        showAlphabeticalIndex={true}

                                        autoGenerateAlphabeticalIndex={true}
                                        selectPlaceholderText={<Text>
                                            <Text style={{color: 'red'}}> *</Text>
                                            {languageData[27]?.Name}
                                        </Text>}
                                        searchPlaceholderText={languageData[29]?.Name}
                                        requireSelection={false}
                                        autoSort={true}
                                        onSelected={item => setAccidentValue(item)}/> : null}
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View>
                                <View>
                                    <Text>
                                        <Text style={{color: 'red'}}> *</Text>
                                        {languageData[17]?.Name}
                                    </Text>
                                </View>

                                    <PickerModal
                                        style={{width: "100%", backgroundColor: "black"}}
                                        Autocomplete={false}
                                        items={riskLevel}
                                        sortingLanguage={'tr'}
                                        showToTopButton={true}
                                        showAlphabeticalIndex={true}
                                        autoGenerateAlphabeticalIndex={true}
                                        selectPlaceholderText={<Text>
                                            <Text style={{color: 'red'}}> *</Text>
                                            {languageData[27]?.Name}
                                        </Text>}
                                        searchPlaceholderText={languageData[29]?.Name}
                                        requireSelection={false}
                                        autoSort={true}
                                        onSelected={item => setDefectValue(item)}/>
                            </View>
                        </TouchableWithoutFeedback>

                        <View >
                            <Text>{languageData[19]?.Name}</Text>
                            <RadioGroup
                                style={{flex:1,flexDirection:"row",justifyContent:"flex-start",flexWrap:"wrap"}}
                                selectedIndex={action}
                                onChange={index => setAction(index)}>
                                <Radio>{languageData[20]?.Name}</Radio>
                                <Radio>{languageData[21]?.Name}</Radio>
                                <Radio>{languageData[44]?.Name}</Radio>
                            </RadioGroup>
                        </View>
                        <KeyboardAvoidingView style={{ flex: 1, justifyContent: 'center' }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>


                            <TextInput
                                theme={DefaultTheme}

                                onChangeText={text => setContent(text)}
                                value={content}

                                label={
                                    <Text>
                                        <Text style={{color: 'red'}}> *</Text>
                                        {languageData[22]?.Name}
                                    </Text>
                                }

                                returnKeyType="next"
                                autoCapitalize="none"
                            />

                        </KeyboardAvoidingView>
                            <TextInput
                                theme={DefaultTheme}
                                onChangeText={text => setOpinionImprovement(text)}
                                value={opinionImprovement}
                                returnKeyType="next"

                                label={
                                    <Text>
                                        {action === 1 ? <Text style={{color: 'red'}}> *</Text> : null}
                                        {languageData[23]?.Name}

                                    </Text>
                                }
                                autoCapitalize="none"
                            />


                        {filePath?.uri || filePath2?.uri ? <View style={{
                            flex: 1,
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            flexDirection: "row"
                        }}>
                            <View style={{width: action===0?"100%": "50%"}}>
                                <Animated.Image
                                    source={{uri: filePath.uri}}
                                    style={{height: 150, resizeMode: "stretch"}}
                                />
                            </View>
                            {action===1?
                            <View style={{width: "50%", marginHorizontal: 5}}>
                                <Animated.Image
                                    source={{uri: filePath2.uri}}
                                    style={{height: 150, resizeMode: "stretch"}}
                                />
                            </View>:null}
                        </View> : null}
                        <View style={{
                            flex: 1,
                            width: "100%",
                            justifyContent: "space-around",
                            alignItems: "flex-start",
                            maxHeight: 100,
                            flexDirection: "row",
                            marginVertical: 5
                        }}>
                            <Icon.Button name="image" backgroundColor={"#69b5fa"} onPress={() => setVisible(true)}>
                                <Text style={styles.textStyle}>{languageData[25]?.Name}</Text>
                            </Icon.Button>
                            {action===1? <Icon.Button name="image" backgroundColor={"#69b5fa"} onPress={() => setVisible2(true)}>
                                <Text style={styles.textStyle}>{languageData[26]?.Name}</Text>
                            </Icon.Button>:null}

                            <Portal>
                                <Dialog visible={visible} onDismiss={hideDialog}>
                                    <Dialog.Content>
                                        <Button name="image" backgroundColor={"#69b5fa"}
                                                onPress={() => chooseFile('photo')}>
                                            <Icon name={"image"}/>{languageData[33]?.Name}
                                        </Button>
                                        <Button name="image" backgroundColor={"#69b5fa"}
                                                onPress={() => captureImage('photo')}>
                                            <Icon name={"camera"}/>{languageData[32]?.Name}
                                        </Button>
                                    </Dialog.Content>
                                    <Dialog.Actions>
                                        <Button onPress={hideDialog}>{languageData[31]?.Name}</Button>
                                    </Dialog.Actions>
                                </Dialog>
                            </Portal>
                            <Portal>
                                <Dialog visible={visible2} onDismiss={hideDialog2}>
                                    <Dialog.Content>
                                        <Button name="image" backgroundColor={"#69b5fa"}
                                                onPress={() => chooseFile2('photo')}>
                                            <Icon name={"image"}/>{languageData[33]?.Name}
                                        </Button>
                                        <Button name="image" backgroundColor={"#69b5fa"}
                                                onPress={() => captureImage2('photo')}>
                                            <Icon name={"camera"}/>{languageData[32]?.Name}
                                        </Button>
                                    </Dialog.Content>
                                    <Dialog.Actions>
                                        <Button onPress={hideDialog2}>{languageData[31]?.Name}</Button>
                                    </Dialog.Actions>
                                </Dialog>
                            </Portal>
                        </View>
                        <View style={{flex: 1, alignItems: "center", marginVertical: 10}}>
                            {loading ? <ActivityIndicator animating={true} color={theme.colors.primary}/> :
                                <Button style={styles.button} disabled={loading} onPress={addForm}
                                        color={theme.colors.primary}
                                        mode="contained">
                                    {languageData[24]?.Name}
                                </Button>}
                        </View>
                
                    </View>
                </View>





                </Provider>
</ScrollView>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#e3e7e8",
        width: "100%",
        alignItems: 'flex-start',
        marginBottom: 40,
    },
    select: {
        margin: 5,
        height: 60,
        width: width - 10,
    },
    form: {
        backgroundColor: "white",
        width: width,
        padding: 10,
       
        borderRadius: 2,

    },
    buttonStyle: {
        alignItems: 'center',
        backgroundColor: "#69b5fa",
        borderRadius: 10,
        padding: 5,
        color: "white",
        marginVertical: 10,

    },
    textStyle: {
        padding: 10,
        color: 'white',
        textAlign: 'center',
    },
    button: {
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
        borderRadius: 10,
        width: "60%",
        padding: 5,
        color: "white",

    },
    buttonText: {
        textAlign: 'center',
        fontSize: 15,
        color: '#fff'
    }
})
export default SafetyControl