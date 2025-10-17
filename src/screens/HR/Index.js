import {View, Text, SafeAreaView, FlatList, StyleSheet, StatusBar, Alert} from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Fragment, useState} from "react";
import {t} from 'i18next'
import {Snackbar} from "react-native-paper";
const DATA = [
    {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        title: t("foodMenu.title"),
        to:"FoodMenu",
        icon:"food",
    },
    {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'Gönülden',
        to:"DashboardGonulden",
        icon:"email-outline"
    },

];

const Item = ({item,navigation}) => {

    return(

        <Fragment>

           <View style={styles.item} onTouchStart={() => {
                if(item?.to) {
                    navigation.navigate(item.to)
                }
                else{
                    Alert.alert(t("foodMenu.update"),t("foodMenu.updateMessage"))
            }}}>
                {item?.icon ? <Icon name={item.icon} size={24} color="#000000" style={{marginRight: 5}}/> : null}

                <Text style={styles.title}>{item.title}</Text>

            </View>

        </Fragment>

    )

}
const Index = ({navigation})=>{
    return(
        <SafeAreaView style={styles.container}>
            {/*<Text style={{textAlign:"center",fontSize:16,fontWeight:"500",marginTop:10}}>{t("hrApplications")}</Text>*/}
            <FlatList
                style={{marginTop:20}}
                data={DATA}
                renderItem={({item}) => <Item navigation={navigation} item={item} />}
                keyExtractor={item => item.id}
            />
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    item: {
        backgroundColor: '#fff',
        elevation:10,
        padding: 20,
        flex:1,
        flexDirection:"row",
        alignItems:"center",
        marginVertical: 8,

    },
    title: {
        fontSize: 16,
    },
});
export default Index