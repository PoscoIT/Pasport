import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from 'react-native-reanimated';
import {DrawerContentScrollView} from "@react-navigation/drawer";
import {useNavigation} from "@react-navigation/native";

const AccordionItem = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const height = useSharedValue(0);
    const navigation = useNavigation();

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
        height.value = isOpen ? 0 : 70 // Açılma yüksekliğini ayarlayın
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            height: withTiming(height.value, {duration: 300}),
        };
    });

    return (
        <DrawerContentScrollView {...props} >
                <TouchableOpacity onPress={toggleAccordion} style={{paddingLeft:20}}>
                <Text style={{position:"fixed",bottom:10}}>
                    IT

                </Text>
                </TouchableOpacity>
            <Animated.View style={[styles.accordionContent, animatedStyle]}>
                <TouchableOpacity style={styles.accordionContent} onPress={()=>navigation.navigate("ITSR")}>
                    <Text >
                        IT SR
                    </Text>

                </TouchableOpacity>
                <TouchableOpacity style={styles.accordionContent} onPress={()=>navigation.navigate("ITAuth")}>
                    <Text style={{marginTop:5}}>
                        IT Yetki Talebi
                    </Text>

                </TouchableOpacity>
            </Animated.View>
        </DrawerContentScrollView>
    );
}
const styles = StyleSheet.create({

    drawerTitle: {
        fontSize: 18,

        fontWeight: 'bold',
    },
    accordionHeader: {
        paddingLeft:20,

    },
    accordionHeaderText: {
        fontSize: 14,


    },
    accordionContent: {
        overflow: 'hidden',
        backgroundColor: '#fff',
        paddingHorizontal: 15,
    },
    accordionContentText: {
        fontSize: 14,

    },
    screenContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    screenText: {
        fontSize: 20,
    },
});

export default AccordionItem;
