import React from 'react';
import {FlatList, SafeAreaView, TouchableOpacity, View, Text, StyleSheet, Dimensions, Alert} from "react-native";




const ForkliftReservationViewer = (props) => {
    const homeOptions = [
        {
            name: "Beast shedule",
            body: "Create and manage your workout shedule",
            description:"açıklamaaasad",
            totalTime:"15",
            line:"TLL",
            id: "1",
        },
        {
            name: "Pre-Made Workouts",
            body: "Use one of our pre-made workouts",
            description:"açıklamaaasad",
            totalTime:"30",
            line:"TLL",
            id: "2",
        },
        {
            name: "Statistics",
            body: "Analyse your personal statistics",
            description:"açıklamaaasaddsadasdasdasdasdasdasdasdasdasdasdasdasdasdsadasddsasadsdadasdasddasdasdsadasdasdasdasdasddsaaçıklamaaasaddsadasdasdasdasdasdasdasdasdasdasdasdasdasdsadasddsasadsdadasdasddasdasdsadasdasdasdasdasddsaaçıklamaaasaddsadasdasdasdasdasdasdasdasdasdasdasdasdasdsadasddsasadsdadasdasddasdasdsadasdasdasdasdasddsa",
            totalTime:"40",
            line:"TLL",
            id: "3",
        },
        {
            name: "History",
            body: "Keep track of your workout history",
            description:"açıklamaaasad",
            totalTime:"55",
            line:"STL",
            id: "4",
        },
        {
            name: "History",
            body: "Keep track of your workout history",
            description:"açıklamaaasad",
            totalTime:"65",
            line:"SPM",
            id: "5",
        },
        {
            name: "History",
            body: "Keep track of your workout history",
            description:"açıklamaaasad",
            totalTime:"45",
            line:"CGPL",
            id: "6",
        },
        {
            name: "History",
            body: "Keep track of your workout history",
            description:"açıklamaaasad",
            totalTime:"70",
            line:"TLL",
            id: "7",
        },
        {
            name: "History",
            body: "Keep track of your workout history",
            description:"açıklamaaasad",
            totalTime:"80",
            line:"TLL",
            id: "8",
        },
        {
            name: "History",
            body: "Keep track of your workout history",
            description:"açıklamaaasad",
            totalTime:"90",
            line:"TLL",
            id: "9",
        },
        {
            name: "History",
            body: "Keep track of your workout history",
            description:"açıklamaaasad",
            totalTime:"100",
            line:"TLL",
            id: "10",
        },
    ];
    const HomeCard = (props) => {
        return (
            <TouchableOpacity onPress={() => Alert.alert("tıklandı")}>
                <View style={styles.container}>
                    <View style={styles.cardContainer}>
                        {/*<Image style={styles.imageStyle} source={props.info.image} />*/}

                        <View style={styles.infoStyle}>
                         <Text style={styles.titleStyle}>{props.info.line}</Text>
                              <Text style={styles.bodyTextStyle}> Oluşturan Kişi={props.info.name}</Text>
                            <Text style={styles.bodyTextStyle}>Rezervasyon Tarihi={props.info.body}</Text>
                            <Text ellipsizeMode={"tail"} numberOfLines={4} style={styles.bodyTextStyle}>Nedeni= {props.info.description}</Text>
                            <Text style={styles.bodyTextStyle}>Tahmini Süre = {props.info.totalTime}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };


    return(
        <SafeAreaView style={{flex:1}}>
            <FlatList
                data={homeOptions}
                renderItem={({ item }) => {
                    return <HomeCard info={item} />;
                }}
                keyExtractor={(homeOption) => homeOption.id}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    )

}
const deviceWidth = Math.round(Dimensions.get("window").width);
const offset = 25;
const radius = 20;
const styles = StyleSheet.create({
    container: {
        width: deviceWidth - 20,
        marginTop: 20,
    },
    cardContainer: {
        margin: 10,
        marginTop:0,
        width: deviceWidth - offset,
        backgroundColor: "#ffffff",
        height: 170,
        borderRadius: radius,

    },
    imageStyle: {
        height: 130,
        width: deviceWidth - 25,
        borderTopLeftRadius: radius,
        borderTopRightRadius: radius,
        opacity: 0.95,
    },
    titleStyle: {
        color: "#222121",
        textAlign: "center",
        fontSize: 20,
        fontWeight: "800",
    },
    bodyTextStyle: {
        fontWeight: "400",
        color: "#2c2828",
        textAlign: "center",
    },
    infoStyle: {
        marginHorizontal: 10,
        marginVertical: 1,
        textAlign:"left"
    }
})


export default ForkliftReservationViewer;