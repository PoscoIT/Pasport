import {Alert, Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Button, Card, Paragraph, Title} from "react-native-paper";
import {t} from "i18next";
import TextInput from "../components/TextInput";
import React, {useState} from "react";
import {getAuth,sendPasswordResetEmail} from "firebase/auth";

const {width, height} = Dimensions.get('window');
const ChangePasswordScreen = ({navigation})=>{
    const [loading, setLoading] = useState(false);
    const auth = getAuth();
    const [password, setPassword] = useState({value: '', error: ''});
    const triggerResetEmail = async () => {
        await sendPasswordResetEmail(auth, email.value).then(()=>{
            Alert.alert(t("forgotPasswordMessage"))
            navigation.goBack(-1)
        }).catch(()=>{
            Alert.alert(t("unknownUser"))
        })


    }

    return(
        <SafeAreaView style={styles.safeAreaStyle}>
            {!loading && (
                <View>

                    <View>
                        <View style={{flexDirection: "column", flexGrow: 1, marginHorizontal: 10, borderRadius: 30}}>
                            <TextInput
                                label={t("loginScreen.password")}
                                returnKeyType="done"
                                value={password.value}
                                onChangeText={text => setPassword({value: text, error: ''})}
                                error={!!password.error}
                                errorText={password.error}
                                secureTextEntry
                                autoCapitalize="none"
                                eyeIcon={true}
                            />
                        </View>
                        <View style={{flexDirection: "column", flexGrow: 1, marginHorizontal: 10, borderRadius: 30}}>
                            <TextInput
                                label={t("loginScreen.password")}
                                returnKeyType="done"
                                value={password.value}
                                onChangeText={text => setPassword({value: text, error: ''})}
                                error={!!password.error}
                                errorText={password.error}
                                secureTextEntry
                                autoCapitalize="none"
                                eyeIcon={true}
                            />
                        </View>
                        <View style={{flexDirection: "column", flexGrow: 1, marginHorizontal: 60}}>
                            <Button
                                onPress={triggerResetEmail}
                                mode="contained"
                                style={styles.button}
                            >
                                {t("forgotPassword")}
                            </Button>
                        </View>

                    </View>

                </View>
            )}
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    backGround: {
        width: width,

    },
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    inputContainer: {
        fontSize: 12,
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
        backgroundColor: '#f6f6f6',
    },
    safeAreaStyle: {
        flex: 1,
        justifyContent: 'flex-start',
        height: height,
        backgroundColor: "#D6E4EF"
    },
    button: {
        backgroundColor: "#196795",
        borderRadius: 10,
        marginTop: 20
    }
});
export default ChangePasswordScreen