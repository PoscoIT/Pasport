/* eslint-disable prettier/prettier */
/* eslint-disable eqeqeq */
import React, {memo, useEffect, useMemo, useState} from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Text, ScrollView } from "react-native";
import 'firebase/auth';
import Background_Green from '../../components/BackgroundGradient';
import {Dimensions, Platform} from 'react-native';
import { Card, Paragraph} from 'react-native-paper';
import {getAuth} from 'firebase/auth';
import firebaseDB from '../../database/firebaseDB';
import { getDatabase, onValue, ref } from "firebase/database";
import {t} from "i18next";
const Image1 = require( '../../assets/1.png')
const Image2 = require('../../assets/2.png')
const Image3 = require( '../../assets/3.png')
const Image4 = require( '../../assets/4.png')
const Image5 = require( '../../assets/5.png')
const Image6 = require( '../../assets/6.png')
const Image7 = require( '../../assets/7.png')
const Image8 = require( '../../assets/8.png')
const Image9 = require( '../../assets/9.png')



const db = getDatabase(firebaseDB);

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full width



const SafetyRules = ({navigation}) => {
  const auth = getAuth();
  let user = auth.currentUser;
  let today = new Date();
  const isUserPoscoAssanUser = user.email.includes('@poscoassan.com');
  const [poscoAssanAccidentDate, setPoscoAssanAccidentDate] =
    useState('2020-11-13');
  const [poscoTnpcAccidentDate, setPoscoTnpcAccidentDate] =
    useState('2022-09-05');

  let d1 = new Date(isUserPoscoAssanUser?poscoAssanAccidentDate:poscoTnpcAccidentDate)

  let d2 = new Date();
  let t2 = d2.getTime();
  let t1 = d1.getTime();
  let lastInDate = parseInt((t2 - t1) / (24 * 3600 * 1000));


  let date =
    ('0' + today.getDate()).slice(-2) +
    '.' +
    ('0' + (today.getMonth() + 1)).slice(-2) +
    '.' +
    today.getFullYear();


  const getAccidentDate = async () => {
    onValue(ref(db, 'tstapp/'),
    snapshot => {

        const {version} = snapshot.val();
        setPoscoAssanAccidentDate(version.AccidentDate);
        setPoscoTnpcAccidentDate(version.AccidentDate_Tnpc);
      });
  };



  useEffect(() => {
    getAccidentDate();

  }, []);

  return (
    <Background_Green>
      <ScrollView>
      <View style={styles.container}>
        <Card style={[styles.cardStyle, {backgroundColor: 'BLUE'}]}>
          <Card.Content>
            <View style={{flexDirection: 'row'}}>
              <View style={{width: width / 2}}>
                <View>
                  <Paragraph
                    style={{
                      color: '#333',
                      fontWeight: '600',
                      fontSize: width / 22,
                      padding: 5,
                    }}>
                    {t("general.today")}:
                  </Paragraph>
                </View>
                <View>
                  <Paragraph
                    style={{
                      color: '#333',
                      fontWeight: '600',
                      fontSize: width / 22,
                      padding: 5,
                    }}>
                    {t("general.lastAccidentDate")}:
                  </Paragraph>
                </View>
                <View>
                  <Paragraph
                    style={{
                      color: '#333',
                      fontWeight: '500',
                      fontSize: width / 22,
                      padding: 5,
                    }}>
                    {t("general.passingTime")}
                  </Paragraph>
                </View>
              </View>
              <View
                style={{
                  width: width / 2 - 40,
                  alignItems: 'flex-end',
                  alignContent: 'flex-end',
                  left: 0,
                }}>
                <View>
                  <Paragraph
                    style={{
                      color: '#333',
                      fontWeight: '600',
                      fontSize: width / 22,
                      textAlign: 'right',
                      padding: 5,
                    }}>
                    {date}
                  </Paragraph>
                </View>
                <View>
                  <Paragraph
                    style={{
                      color: '#333',
                      fontWeight: '600',
                      fontSize: width / 22,
                      textAlign: 'right',
                      padding: 5,
                    }}>
                    {isUserPoscoAssanUser
                      ? poscoAssanAccidentDate.split('-').reverse().join('.')
                      : poscoTnpcAccidentDate.split('-').reverse().join('.')}
                  </Paragraph>
                </View>
                <View style={{flexDirection: 'row'}}>
                  {lastInDate? lastInDate?.toString()?.split('')?.map((item,index)=>(
                      <View style={{width: width / 8}} key={index}>
                        <Paragraph style={styles.paragCounter}>{item}</Paragraph>
                      </View>
                  )):null}




                </View>
              </View>
            </View>
          </Card.Content>
        </Card>
        <View style={styles.containerInside}>
          <View style={styles.containerInside2}>
            <View style={styles.containerInside3}>
               <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  navigation.navigate('SafetyRuleDetail', {
                    appHead: '1',
                    appDate: today,
                  });
                }}>
                <Image
                  style={styles.images}
                  source={Image1}
                />
              </TouchableOpacity> 
              
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.mehmetFatih}>TBM</Text>
              </View>
            </View>
            <View style={styles.containerInside3}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  navigation.navigate('SafetyRuleDetail', {
                    appHead: '2',
                    appDate: today,
                  });
                }}>
                <Image
                  style={styles.images}
                  source={Image2}
                />
              </TouchableOpacity> 
             
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.mehmetFatih}>{t("safetyRules.workPermit")}</Text>
              </View>
            </View>
            <View style={styles.containerInside3}>
               <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  navigation.navigate('SafetyRuleDetail', {
                    appHead: '3',
                    appDate: today,
                  });
                }}>
                 <Image
                  style={styles.images}
                  source={Image3}
                />
              </TouchableOpacity> 
             
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.mehmetFatih}>10 {t("safetyRules.safetyRules")}</Text>
              </View>
            </View>
          </View>
          <View style={styles.containerInside2}>
            <View style={styles.containerInside3}>
              
               <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  navigation.navigate('SafetyRuleDetail', {
                    appHead: '4',
                    appDate: today,
                  });
                }}>
               <Image
                  style={styles.images}
                  source={Image5}
                />
              </TouchableOpacity> 
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.mehmetFatih}>{t("safetyRules.fireStudies")}</Text>
              </View>
            </View>
            <View style={styles.containerInside3}>
              
               <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  navigation.navigate('SafetyRuleDetail', {
                    appHead: '5',
                    appDate: today,
                  });
                }}>
               <Image
                  style={styles.images}
                  source={Image6}
                />
              </TouchableOpacity> 
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.mehmetFatih}>{t("safetyRules.height")}</Text>
              </View>
            </View>
            <View style={styles.containerInside3}>
             
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  navigation.navigate('SafetyRuleDetail', {
                    appHead: '6',
                    appDate: today,
                  });
                }}>
                <Image
                  style={styles.images}
                  source={Image7}
                />
              </TouchableOpacity> 
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.mehmetFatih}>{t("safetyRules.indoorStudies")}</Text>
              </View>
            </View>
          </View>
          <View style={styles.containerInside2}>
            <View style={styles.containerInside3}>
            
               <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  navigation.navigate('SafetyRuleDetail', {
                    appHead: '7',
                    appDate: today,
                  });
                }}>
                <Image
                  style={styles.images}
                  source={Image8}
                />
              </TouchableOpacity> 
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.mehmetFatih}>{t("safetyRules.heavyLifting")}</Text>
              </View>
            </View>
            <View style={styles.containerInside3}>
             
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  navigation.navigate('SafetyRuleDetail', {
                    appHead: '8',
                    appDate: today,
                  });
                }}>
                 <Image
                  style={styles.images}
                  source={Image4}
                />
              </TouchableOpacity> 
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.mehmetFatih}>{t("safetyRules.onePoint")}</Text>
              </View>
            </View>
            <View style={styles.containerInside3}>
             
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  navigation.navigate('SafetyRuleDetail', {
                    appHead: '9',
                    appDate: today,
                  });
                }}>
                <Image
                  style={styles.images}
                  source={Image9}
                />
              </TouchableOpacity> 
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.mehmetFatih}>{t("safetyRules.safetyVideo")}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      </ScrollView>
    </Background_Green>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    height: Platform.OS == 'ios' ? height - 210 : height + 100,
  },
  containerInside: {
    backgroundColor: 'transparent',
    width: width,
    margin: 10,
    alignItems: 'center',
  },
  containerInside3: {
    alignItems: 'center',
    margin: 10,
  },
  cardStyle: {
    height: 130,
    width: width,
  },
  button: {
    padding: 5,
    marginBottom: 10,
    shadowColor: '#303838',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.85,
    height: 110,
    width: 110,
    elevation: 5,
  },
  images: {
    height: 100,
    aspectRatio: 1,
    width: 100,
    resizeMode: 'contain',
  },
  containerInside2: {
    flexDirection: 'row',
  },
  mehmetFatih: {
    flex: 1,
    flexWrap: 'wrap',
    textAlign: 'center',
    color: '#333',
    fontWeight: 'bold',
  },
  paragCounter: {
    color: '#333',
    fontWeight: '600',
    borderStyle: 'solid',
    borderWidth: 2,
    margin: 2,
    backgroundColor: '#ee5',
    padding: 5,
    textAlign: 'center',
    fontSize: width / 22,
  },
});

export default memo(SafetyRules);
