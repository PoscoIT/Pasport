/* eslint-disable prettier/prettier */
import React, {memo, useState} from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import 'firebase/auth';
import firebase from 'firebase/compat/app';
import Background_Green from '../components/Background_Green';
import {Card, Paragraph, Title, Button} from 'react-native-paper';
import {getTitleStatus} from '../api/auth-api';
import {getAuth} from "firebase/auth";

var width = Dimensions.get('window').width; //full width

const DashboardAward = ({navigation}) => {
  const [titleStatus, setTitleStatus] = useState('');
  const [cardStatus, setCardStatus] = useState('');
  const [eliteStatus, setEliteStatus] = useState('');
  const [prestigeStatus, setPrestigeStatus] = useState('');
  const [premiumStatus, setPremiumStatus] = useState('');
  const [starStatus, setStarStatus] = useState('');
  const [EliteCountweekAgoRandom, setEliteCountweekAgoRandom] = useState('');
  const [PrestigeCountweekAgoRandom, setPrestigeCountweekAgoRandom] = useState('');
  const [PremiumCountweekAgoRandom, setPremiumCountweekAgoRandom] = useState('');
  const [StarCountweekAgoRandom, setStarCountweekAgoRandom] = useState('');
  const auth = getAuth()

  auth.onAuthStateChanged(async (user) => {
    if (user) {
      getTitleStatus((responsed) => {
        setCardStatus(responsed.cardStatus);
        setTitleStatus(responsed.title);
        setEliteStatus(responsed.eliteCredit);
        setPrestigeStatus(responsed.prestigeCredit);
        setPremiumStatus(responsed.premiumCredit);
        setStarStatus(responsed.starCredit);
        setEliteCountweekAgoRandom(responsed.EliteCountweekAgoRandom);
        setPrestigeCountweekAgoRandom(responsed.PrestigeCountweekAgoRandom);
        setPremiumCountweekAgoRandom(responsed.PremiumCountweekAgoRandom);
        setStarCountweekAgoRandom(responsed.StarCountweekAgoRandom);
      });
    }
  });
  return (
    <Background_Green style={styles.backGround}>
      {titleStatus == 1 && (
        <Card style={styles.cardStyle}>
          <Card.Content>
            <Title>Dear Manager,</Title>
            <Paragraph>You have,</Paragraph>
            <Paragraph>{eliteStatus} pcs Elite-Card,</Paragraph>
            <Paragraph>{prestigeStatus} pcs Prestige-Card,</Paragraph>
            <Paragraph>{premiumStatus} pcs Premium Card,</Paragraph>
            <Paragraph>{starStatus} pcs Star Card.</Paragraph>
          </Card.Content>
        </Card>
      )}
      {(titleStatus == 2 || titleStatus == undefined) && (
        <Card style={styles.cardStyleEmp}>
          <Card.Content>
            <Title>Değerli Çalışanımız,</Title>
            <Paragraph>
              Aşağıda yer alan seçeneklerden ödülünüzü seçebilirsiniz.
            </Paragraph>
          </Card.Content>
        </Card>
      )}
      {titleStatus == 1 && (
        <Button
          icon="gift"
          mode="contained"
          disabled={eliteStatus < 1 || eliteStatus === undefined}
          style={styles.button}
          onPress={() =>
            navigation.navigate('SendGift', {appHead: 'EliteCount'})
          }>
          Give an award (Elite Card) ({eliteStatus})
        </Button>
      )}
      {(titleStatus == 2 || titleStatus == undefined) && (
        <Button
          icon="gift"
          mode="contained"
          disabled={eliteStatus < 1 || eliteStatus === undefined}
          style={styles.button}
          onPress={() =>
            navigation.navigate('SelectGift', {appHead: 'EliteCount', appCardKey: EliteCountweekAgoRandom})
          }>
          Select a Gift (Elite Card) ({eliteStatus})
        </Button>
      )}
      {titleStatus == 1 && (
        <Button
          icon="gift"
          mode="contained"
          disabled={prestigeStatus < 1 || prestigeStatus === undefined}
          style={styles.button}
          onPress={() =>
            navigation.navigate('SendGift', {appHead: 'PrestigeCount'})
          }>
          Give an award (Prestige Card) ({prestigeStatus})
        </Button>
      )}
      {(titleStatus == 2 || titleStatus == undefined) && (
        <Button
          icon="gift"
          mode="contained"
          disabled={prestigeStatus < 1 || prestigeStatus === undefined}
          style={styles.button}
          onPress={() =>
            navigation.navigate('SelectGift', {appHead: 'PrestigeCount', appCardKey: PrestigeCountweekAgoRandom})
          }>
          Select a Gift (Prestige Card) ({prestigeStatus})
        </Button>
      )}
      {titleStatus == 1 && (
        <Button
          icon="gift"
          mode="contained"
          disabled={premiumStatus < 1 || premiumStatus === undefined}
          style={styles.button}
          onPress={() =>
            navigation.navigate('SendGift', {appHead: 'PremiumCount'})
          }>
          Give an award (Premium Card) ({premiumStatus})
        </Button>
      )}
      {(titleStatus == 2 || titleStatus == undefined) && (
        <Button
          icon="gift"
          mode="contained"
          disabled={premiumStatus < 1 || premiumStatus === undefined}
          style={styles.button}
          onPress={() =>
            navigation.navigate('SelectGift', {appHead: 'PremiumCount', appCardKey: PremiumCountweekAgoRandom})
          }>
          Select a Gift (Premium Card) ({premiumStatus})
        </Button>
      )}
      {titleStatus == 1 && (
        <Button
          icon="gift"
          mode="contained"
          disabled={starStatus < 1 || starStatus === undefined}
          style={styles.button}
          onPress={() =>
            navigation.navigate('SendGift', {appHead: 'StarCount'})
          }>
          Give an award (TST-Star Card) ({starStatus})
        </Button>
      )}
      {(titleStatus == 2 || titleStatus == undefined) && (
        <Button
          icon="gift"
          mode="contained"
          disabled={starStatus < 1 || starStatus === undefined}
          style={styles.button}
          onPress={() =>
            navigation.navigate('SelectGift', {appHead: 'StarCount', appCardKey: StarCountweekAgoRandom})
          }>
          Select a Gift (TST-Star Card) ({starStatus})
        </Button>
      )}
      {(titleStatus == 2 || titleStatus == undefined) && (
        <Button
          icon="gift"
          mode="contained"
          style={styles.button}
          onPress={() =>
            navigation.navigate('ShowOldRecord')
          }>
          Show old records
        </Button>
      )}
    </Background_Green>
  );
};

const styles = StyleSheet.create({
  cardStyle: {
    height: 180,
    backgroundColor: 'white',
    marginTop: 10,
    width: width - 10,
  },
  cardStyleEmp: {
    height: 110,
    backgroundColor: 'white',
    marginTop: 10,
    width: width - 10,
  },
  button: {
    margin: 10,
    width: width - 30,
    height: 50,
    alignSelf: 'center',
    justifyContent: 'center',
  },
});

export default memo(DashboardAward);
