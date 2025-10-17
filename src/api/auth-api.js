import {Alert, Platform} from 'react-native';
import firebase from '../database/firebaseDB';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
import {
  ref,
  onValue,
  push,
  set,
  get,
  query,
  update,
  limitToLast,
  orderByChild,
  equalTo,
  getDatabase,
} from 'firebase/database';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import firebaseDB from '../database/firebaseDB';
import qs from "qs";
import {Timestamp} from "firebase/firestore"
import moment from "moment/moment";
import {REACT_APP_SECRET_KEY} from '@env';


const convertTimestamp  = (timestamp) => {

  //extract the seconds and nanos values from your Firestore timestamp object
  const { seconds, nanoseconds } = timestamp;
  //combine the seconds and nanos values into a single timestamp in milliseconds
  const milliseconds = seconds * 1000 + nanoseconds / 1e6;
  //use Moment.js to convert the timestamp to a date
  return moment(milliseconds).toDate();
}

const auth = getAuth();
const db = getDatabase();


export const showAlert = messagess => {
  Alert.alert(messagess);
};
//-----------------*******************-----------------*******************-----------------*******************
export const postData = function(url, payload, company) {
  if (company == 'TST') {
    return  axios.post(url, payload, config);
  }
};
//-----------------*******************-----------------*******************-----------------*******************
export const sendMailForGonulden = async function (receiver, subjectMessage) {
  let user = await auth.currentUser;
  if (user) {
    if (user != null) {
      var uemail = user.email;
    }
  }
  let jsonData = qs.stringify({
    from:'Healthy_Future@poscoassan.com',
    to:receiver,
    cc:uemail,
    body:subjectMessage + uemail,
    subject: 'Gonulden Application - Teşekkürler'
  })




  return await axios.post('https://tstapp.poscoassan.com.tr:8443/Common/SendMail', jsonData,{headers:{
    "auth-token":REACT_APP_SECRET_KEY
    }});
};
//-----------------*******************-----------------*******************-----------------*******************
export const sendMailForGonuldenLocalMail = async function (
  receiver,
  subjectMessage,
) {
  let user = await auth.currentUser;
  if (user) {
    if (user != null) {
      var uemail = user.email;
    }
  }
  let jsonData = qs.stringify({
    from:'Healthy_Future@poscoassan.com',
    to:receiver,
    cc:uemail,
    body:subjectMessage + uemail,
    subject: 'Gonulden Application - Teşekkürler'
  })





  return await axios.post('https://tstapp.poscoassan.com.tr:8443/Common/SendMail', jsonData,{headers:{
      "auth-token":REACT_APP_SECRET_KEY,
      "Content-Type": "application/x-www-form-urlencoded",

    }});
};
//-----------------*******************-----------------*******************-----------------*******************
export const sendMailForAward = async function (receiver, subjectMessage) {
  let user = await auth.currentUser;
  if (user) {
    if (user != null) {
      var uemail = user.email;
    }
  }
  let jsonData = qs.stringify({
    from:'Healthy_Future@poscoassan.com',
    to:receiver,
    cc:uemail,
    body:subjectMessage + uemail,
    subject: 'Ödül Sistemi - Ödül Gönderildi '
  })




  return await axios.post('https://tstapp.poscoassan.com.tr:8443/Common/SendMail', jsonData,{headers:{
      "auth-token":REACT_APP_SECRET_KEY,
      "Content-Type": "application/x-www-form-urlencoded",
    }});
};
//-----------------*******************-----------------*******************-----------------*******************
export const sendMailForAwardSelected = async function (
  receiver,
  subjectMessage,
) {
  let user = await auth.currentUser;
  if (user) {
    if (user != null) {
      var uemail = user.email;
    }
  }
  let jsonData = qs.stringify({
    from:'Healthy_Future@poscoassan.com',
    to:receiver,
    cc:uemail,
    body:subjectMessage + uemail,
    subject: 'Ödül Sistemi - Ödül Seçildi '
  })



  return await axios.post('https://tstapp.poscoassan.com.tr:8443/Common/SendMail', jsonData,{headers:{
      "auth-token":REACT_APP_SECRET_KEY,
      "Content-Type": "application/x-www-form-urlencoded",
    }});
};
//-----------------*******************-----------------*******************-----------------*******************
export const sendMailForAwardLocalMail = async function (
  receiver,
  subjectMessage,
) {
  let user = await auth.currentUser;
  if (user) {
    if (user != null) {
      var uemail = user.email;
    }
  }
  let jsonData = qs.stringify({
    from:'Healthy_Future@poscoassan.com',
    to:receiver,
    cc:uemail,
    body:subjectMessage + uemail,
    subject: 'Ödül Sistemi - Ödül Gönderildi '
  })



  return await axios.post('https://tstapp.poscoassan.com.tr:8443/Common/SendMail', jsonData,{headers:{
      "auth-token":REACT_APP_SECRET_KEY,
      "Content-Type": "application/x-www-form-urlencoded",
    }});
};
//-----------------*******************-----------------*******************-----------------*******************
export const sendMailForAwardLocalMailSelected = async function (
  receiver,
  subjectMessage,
) {
  let user = await auth.currentUser;
  if (user) {
    if (user != null) {
      var uemail = user.email;
    }
  }

  let jsonData = qs.stringify({
    from:'Healthy_Future@poscoassan.com',
    to:receiver,
    cc:uemail,
    body:subjectMessage + uemail,
    subject: 'Ödül Sistemi - Ödül Seçildi '
  })



  return await axios.post('https://tstapp.poscoassan.com.tr:8443/Common/SendMail', jsonData,{headers:{
      "auth-token":REACT_APP_SECRET_KEY,
      "Content-Type": "application/x-www-form-urlencoded",
    }});
};
//-----------------*******************-----------------*******************-----------------*******************
let config = {
  headers: {
    'Content-Type': 'application/json',
    Authorization:

      'key=AAAAinKXuCg:APA91bE14o_qlxzKDEvvx7jV9l0ghDcUjslsuXLkme9pDAcRU0ut2fa37qzdnK-BBnYtTdZq-ia_lpoLRFvahbFYW5UlV9nHjmJgs8n6Qm3LmYX2IaOW9bBoCdrSDYl6xo-mhiiHdIZc',
  },
};
//-----------------*******************-----------------*******************-----------------*******************
export const checkPermission = async () => {
  const enabled = await messaging().hasPermission();
  if (enabled) {
    await getFcmToken(response => {});
  } else {
    await requestPermission(() => {});
  }
};
//-----------------*******************-----------------*******************-----------------*******************
export const requestPermission = async callback => {
  let version;
  try {
    await messaging().requestPermission();
  } catch (error) {}
  callback({
    version: version,
  });
};
//-----------------*******************-----------------*******************-----------------*******************
export const getFcmToken = async callback => {
  const fcmToken = await messaging().getToken();
  if (fcmToken) {
    await messageListener();
    await updateUserToken(async response => {
      await getManagerToken();
    });
  } else {
    showAlert('No token received');
  }
  callback({
    version: fcmToken,
  });
};
//-----------------*******************-----------------*******************-----------------*******************
export const sendUserInfoName = async callback => {
  let uname = 'd';
  let empSicil = '2';
  let manager = 0;
  let line = 'a';
  let credit = '0';
  let uemail = '0';
  await sendUserInfo(async responsed => {
    await get(
      query(ref(db, '0'), orderByChild('MailAdd'), equalTo(responsed.uemail)),
    ).then(snapshot => {
      snapshot.forEach(function (childSnapshot) {
        uname = childSnapshot.val().AdSoyad;
        empSicil = childSnapshot.val().SicilNo;
        line = childSnapshot.val().Line;
        credit = childSnapshot.val().Credit;
        uemail = childSnapshot.val().MailAdd;
        // updateUserToken((responsek) => {
        // });
      });
    }).catch(err=>console.log(err));

    await callback({
      uname: uname,
      empSicil: empSicil,
      line: line,
      credit: credit,
      uemail: uemail,
    });
  });
};
//-----------------*******************-----------------*******************-----------------*******************
export const sendUserInfo = async callback => {
  let uemail;
  let userid;
  let user = auth.currentUser;
  if (user) {
    if (user != null) {
      uemail = user.email.toUpperCase();
      userid = user.uid;
      callback({
        uemail: uemail,
        userid: userid,
      });
    }
  }
};
//-----------------*******************-----------------*******************-----------------*******************
export const updateUserToken = async callback => {
  let userState = 'd';
  await sendUserInfo(response => {
    const q = query(
      ref(db, '0'),
      orderByChild('MailAdd'),
      equalTo(response.uemail),
    );
    get(q).then(snapshot => {
      snapshot.forEach(function (childSnapshot) {
        messaging()
          .getToken(firebase.options.messagingSenderId)
          .then(token => {
            db.ref('0/' + childSnapshot.key).update({
              Token: token,
              userid: response.userid,
            });
            userState = 'e';
          });
      });
    });
    callback({
      userState: userState,
    });
  }).catch(err=>console.log(err));
};
//-----------------*******************-----------------*******************-----------------*******************
export const getManager2Token = async ({approver2Token_}) => {
  await sendUserInfoName(async sendResponse => {
    let gonderTOken = '';

    if (approver2Token_ == undefined) {
      return {};
    } else {
      const s = query(
        ref(db, '0'),
        orderByChild('SicilNo'),
        equalTo(approver2Token_),
      );
      await get(s).then(async snapshot_ => {
        snapshot_.forEach(function (childSnapshot_) {
          gonderTOken = childSnapshot_.val().Token;
          let body = {
            to: gonderTOken,
            notification: {
              title: 'Checklist Alert!!',
              body: sendResponse.uname,
              mutable_content: true,
              sound: 'Tri-tone',
            },
            data: {
              key1: 'Checklist Alert!!',
              key2: sendResponse.uname,
            },
          };
          postData('https://fcm.googleapis.com/fcm/send', body, 'TST')
            .then(d => {})
            .catch(e => {});
        });
      });

      return {
        gelen2_Token: gonderTOken,
      };
    }
  }).catch(err=>console.log(err));
};
//-----------------*******************-----------------*******************-----------------*******************
export const problemVar = async callback => {
  let userState = 'd';
  let approver1Token_;
  let approver2Token_;
  let approver3Token_;
  let approver4Token_;
  let approver5Token_;
  let approver6Token_;
  let approver7Token_;
  await getManagerToken(response => {
    approver1Token_ = response.approver1Token;
    approver2Token_ = response.approver2Token;
    approver3Token_ = response.approver3Token;
    approver4Token_ = response.approver4Token;
    approver5Token_ = response.approver5Token;
    approver6Token_ = response.approver6Token;
    approver7Token_ = response.approver7Token;
  });

  await sendUserInfoName(async sendResponse => {
    let today = new Date(convertTimestamp(Timestamp.now()));
    let todayFull = new Date(convertTimestamp(Timestamp.now()));
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let hours = String(today.getHours()).padStart(2, '0');
    let min = String(today.getMinutes()).padStart(2, '0');
    let sec = String(today.getSeconds()).padStart(2, '0');
    let yyyy = today.getFullYear();

    today = mm + '-' + dd + '-' + yyyy;
    todayFull =
      hours + ':' + min + ':' + sec + '  ' + dd + '-' + mm + '-' + yyyy;
    await push(ref(db, 'checklists_negative/'), {
      insertedDateTime: todayFull,
      uname: sendResponse.uname,
      relatedDate: today,
      SicilNo: sendResponse.empSicil,
    });
  });

  if (approver1Token_) {
    getManager2Token({approver1Token_});
  }
  if (approver2Token_) {
    getManager2Token({approver2Token_});
  }
  if (approver3Token_) {
    getManager2Token({approver3Token_});
  }
  if (approver4Token_) {
    getManager2Token({approver4Token_});
  }
  if (approver5Token_) {
    getManager2Token({approver5Token_});
  }
  if (approver6Token_) {
    getManager2Token({approver6Token_});
  }
  if (approver7Token_) {
    getManager2Token({approver7Token_});
  }
  callback({
    userState: userState,
  });
};
//-----------------*******************-----------------*******************-----------------*******************
export const getManagerToken = async callback => {
  let approver1Token_ = '';
  let approver2Token_ = '';
  let approver3Token_ = '';
  let approver4Token_ = '';
  let approver5Token_ = '';
  let approver6Token_ = '';
  let approver7Token_ = '';

  await sendUserInfo(async response => {
    const s = query(
      ref(db, '0'),
      orderByChild('MailAdd'),
      equalTo(response.uemail),
    );
    await get(s).then(snapshot => {
      snapshot.forEach(function (childSnapshot) {
        approver1Token_ = childSnapshot.val().Approver_1;
        approver2Token_ = childSnapshot.val().Approver_2;
        approver3Token_ = childSnapshot.val().Approver_3;
        approver4Token_ = childSnapshot.val().Approver_4;
        approver5Token_ = childSnapshot.val().Approver_5;
        approver6Token_ = childSnapshot.val().Approver_6;
        approver7Token_ = childSnapshot.val().Approver_7;
      });
    });
  });
  callback({
    approver1Token: approver1Token_,
    approver2Token: approver2Token_,
    approver3Token: approver3Token_,
    approver4Token: approver4Token_,
    approver5Token: approver5Token_,
    approver6Token: approver6Token_,
    approver7Token: approver7Token_,
  });
};
//-----------------*******************-----------------*******************-----------------*******************
export const messageListener = async () => {
  this.notificationListener = firebase
    .notifications()
    .onNotification(notification => {
      const {title, body} = notification;
      Alert.alert(
        title,
        body,
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
    });

  this.notificationOpenedListener = firebase
    .notifications()
    .onNotificationOpened(notificationOpenPosco => {
      const {title, body} = notificationOpenPosco.notification;
      Alert.alert(
        title,
        body,
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
    });

  this.notificationOpenedAppListener = firebase
    .notifications()
    .onNotificationOpenedApp(notificationOpenApp => {
      const {title, body} = notificationOpenApp.notification;
      Alert.alert(
        title,
        body,
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
    });

  const notificationOpen = await firebase
    .notifications()
    .getInitialNotification();
  if (notificationOpen) {
    const {title, body} = notificationOpen.notification;
    Alert.alert(
      title,
      body,
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      {cancelable: false},
    );
  }

  this.messageListener = messaging().onMessage(message => {
    alert('Checklist alert received!', message);
  });
};
//-----------------*******************-----------------*******************-----------------*******************
export const getVersionNo = async callback => {
  let version = 0;
  sendUserInfoName(async response => {
    const s = query(ref(db, 'tstapp'), orderByChild('content'), equalTo(1));
    await get(s).then(snapshot => {
      snapshot.forEach(function (childSnap) {
        version = childSnap.val().version_information;
      });
      callback({
        version: version,
      });
    });
  });
};
//-----------------*******************-----------------*******************-----------------*******************
export const getRelatedDataForChecklistStatus = async callback => {
  let childData;
  let statusData;
  let qrCodeData;
  let today = new Date(convertTimestamp(Timestamp.now()));
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0');
  let yyyy = today.getFullYear();
  today = mm + '-' + dd + '-' + yyyy;
  let user = await auth.currentUser;
  if (user) {
    if (user != null) {
      var uemail = user.email;
    }
  }

  let itemsRef = await db.ref('checklists/');
  const s = query(
    ref(db, 'checklists/'),
    orderByChild('searchCondit'),
    equalTo(uemail + today),
  );
  await get(s).then(async snapshot => {
    snapshot.forEach(function (childSnapshot) {
      if (childData === '333') {
        childData = '333';
      } else {
        childData = childSnapshot.val().test;
      }
      statusData = childSnapshot.val().status;
    });
    if (childData === undefined) {
      childData = '343';
    }
    const s = query(
      ref(db, 'QrCodes/Servis/'),
      orderByChild('searchCondit'),
      equalTo(uemail + today),
    );
    await get(s).then(snapshot2 => {
      snapshot2.forEach(function (childSnapshot2) {
        qrCodeData = childSnapshot2.val().QrCodeNo;
      });
      if (qrCodeData === undefined) {
        qrCodeData = '343';
      }
      callback({
        childData: childData,
        statusData: statusData,
        qrCodeData: qrCodeData,
      });
    });
  });
};
//-----------------*******************-----------------*******************-----------------*******************
export const InsertNewQrCodeRecord = async ({QrCodeNo}) => {
  try {
    let user = await auth.currentUser;
    if (user) {
      if (user != null) {
        var uid = user.uid;
        var uemail = user.email;
      }
    }
    let today = new Date(convertTimestamp(Timestamp.now()));
    let todayFull = new Date(convertTimestamp(Timestamp.now()));
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let hours = String(today.getHours()).padStart(2, '0');
    let min = String(today.getMinutes()).padStart(2, '0');
    let sec = String(today.getSeconds()).padStart(2, '0');
    let yyyy = today.getFullYear();
    today = mm + '-' + dd + '-' + yyyy;
    todayFull =
      hours + ':' + min + ':' + sec + '  ' + dd + '-' + mm + '-' + yyyy;
    sendUserInfoName(sendResponse => {
      if (QrCodeNo.toString().match('Yemek')) {
        db.ref('QrCodes/Yemekhane').push({
          QrCodeNo: QrCodeNo,
          relatedDate: today,
          insertedDateTime: todayFull,
          uemail: uemail,
          uid: uid,
          searchCondit: uemail + today,
          uname: sendResponse.uname,
          SicilNo: sendResponse.empSicil,
          line: sendResponse.line,
        });
      } else {
        db.ref('QrCodes/Servis/').push({
          QrCodeNo: QrCodeNo,
          relatedDate: today,
          insertedDateTime: todayFull,
          uemail: uemail,
          uid: uid,
          searchCondit: uemail + today,
          uname: sendResponse.uname,
          SicilNo: sendResponse.empSicil,
          line: sendResponse.line,
        });
      }
    });
    return {};
  } catch (error) {
    return {
      error: error.code,
    };
  }
};
//-----------------*******************-----------------*******************-----------------*******************
export const updateUserCredit = async callback => {
  let credit;
  await sendUserInfo(async responsed => {
    const q = query(
      ref(db, '0'),
      orderByChild('MailAdd'),
      equalTo(responsed.uemail),
      limitToLast(1),
    );
    await get(q).then(snapshot => {
      snapshot.forEach(function (childSnap) {
        update(childSnap.ref,{
          Credit: childSnap.val().Credit - 5,
        })
        return true;
      });
      return true;
    });
  });
  return {
    credit: credit,
  };
};

export const updateUserAward = async creditPoint => {
  let credit;
  await sendUserInfo(async responsed => {
    const q = query(
      ref(db, 'TST_Award/UserCapacity/'),
      orderByChild('mail'),
      equalTo(responsed.uemail),
      limitToLast(1),
    );
    await get(q).then(snapshot => {
      snapshot.forEach(function (childSnap) {
        if ([creditPoint] == 'EliteCount') {
          childSnap.ref.update({
            [creditPoint]: childSnap.val().EliteCount - 1,
          });
        } else if ([creditPoint] == 'PremiumCount') {
          childSnap.ref.update({
            [creditPoint]: childSnap.val().PremiumCount - 1,
          });
        } else if ([creditPoint] == 'PrestigeCount') {
          childSnap.ref.update({
            [creditPoint]: childSnap.val().PrestigeCount - 1,
          });
        } else if ([creditPoint] == 'StarCount') {
          childSnap.ref.update({
            [creditPoint]: childSnap.val().StarCount - 1,
          });
        }
        return true;
      });
      return true;
    });
  });
  return {
    credit: credit,
  };
};
//-----------------*******************-----------------*******************-----------------*******************InsertNewAward
export const InsertNewRecordToFirebaseCredit = async ({
  creditPoint,
  deger,
  adSoyad,
  commente,
  sicilNo,
  lineValue,
  mailInfo,
}) => {
  try {
    var user = await auth.currentUser;
    if (user) {
      if (user != null) {
        var uid = user.uid;
        var uemail = user.email;
      }
    }
    let today = new Date(convertTimestamp(Timestamp.now()));
    let todayFull = new Date(convertTimestamp(Timestamp.now()));
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let hours = String(today.getHours()).padStart(2, '0');
    let min = String(today.getMinutes()).padStart(2, '0');
    let sec = String(today.getSeconds()).padStart(2, '0');
    let yyyy = today.getFullYear();
    today = mm + '-' + dd + '-' + yyyy;
    todayFull =
      hours + ':' + min + ':' + sec + '  ' + dd + '-' + mm + '-' + yyyy;
    await sendUserInfoName(async sendResponse => {
      await push(ref(db, 'Gonulden/CreditUsedLog/' + yyyy + '_' + mm + '/'), {
        fromCreditPoint: creditPoint,
        toDeger: deger,
        toAdSoyad: adSoyad,
        toCommente: commente,
        relatedDate: today,
        insertedDateTime: todayFull,
        fromMail: uemail,
        fromUid: uid,
        searchCondit: uemail + today,
        fromUname: sendResponse.uname,
        fromSicilNo: sendResponse.empSicil,
        fromLine: sendResponse.line,
        toSicilNo: sicilNo,
        toLine: lineValue,
        toMail: mailInfo,
      });
    });

    return {};
  } catch (error) {
    return {
      error: error.code,
    };
  }
};
//-----------------*******************-----------------*******************-----------------*******************InsertNewAward
export const InsertNewAward = async ({
  awardType,
  adSoyad,
  comment,
  sicilNo,
  mailInfo,
}) => {
  try {
    let user = await auth.currentUser;
    if (user) {
      if (user != null) {
        var uid = user.uid;
        var uemail = user.email;
      }
    }
    let weekAgoRandom = new Date();
    weekAgoRandom = Date.now();

    let today = new Date(convertTimestamp(Timestamp.now()));
    let todayFull = new Date(convertTimestamp(Timestamp.now()));
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let hours = String(today.getHours()).padStart(2, '0');
    let min = String(today.getMinutes()).padStart(2, '0');
    let sec = String(today.getSeconds()).padStart(2, '0');
    let yyyy = today.getFullYear();
    today = mm + '-' + dd + '-' + yyyy;
    todayFull =
      hours + ':' + min + ':' + sec + '  ' + dd + '-' + mm + '-' + yyyy;
    await sendUserInfoName(async sendResponse => {
      await push(ref(db, 'TST_Award/UserLog/' + yyyy + '_' + mm + '/'), {
        awardType: awardType,
        toAdSoyad: adSoyad,
        toCommente: comment,
        relatedDate: today,
        insertedDateTime: todayFull,
        fromMail: uemail,
        fromUid: uid,
        searchCondit: uemail + today,
        fromUname: sendResponse.uname,
        fromSicilNo: sendResponse.empSicil,
        fromLine: sendResponse.line,
        toSicilNo: sicilNo,
        toMail: mailInfo,
        active: 1,
        weekAgoRandom1: weekAgoRandom,
      });
      let currentString = '';
      let awardRandom = awardType + 'weekAgoRandom';
      await onValue(ref(db, 'TST_Award/UserCapacity/' + sicilNo), snapshot => {
        currentString = snapshot.val()[awardRandom];
        if (currentString == undefined || currentString == '') {
          currentString = weekAgoRandom.toString() + ',';
        } else {
          currentString = currentString + weekAgoRandom.toString() + ',';
        }
      });
      await update(ref(db, 'TST_Award/UserCapacity/' + sicilNo), {
        [awardType]: db.ServerValue.increment(1),
        mail: mailInfo,
        title: 2,
        active: 1,
        [awardRandom]: currentString,
      });
    });

    return {};
  } catch (error) {
    return {
      error: error.code,
    };
  }
};
//-----------------*******************-----------------*******************-----------------*******************InsertNewAward
export const InsertSelectedAward = async ({
  awardType,
  selectedId,
  brandtitle,
  brand,
  cardKey,
}) => {
  try {
    let user = await auth.currentUser;
    if (user) {
      if (user != null) {
        var uid = user.uid;
        var uemail = user.email;
      }
    }
    let today = new Date(convertTimestamp(Timestamp.now()));
    let todayFull = new Date(convertTimestamp(Timestamp.now()));
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let hours = String(today.getHours()).padStart(2, '0');
    let min = String(today.getMinutes()).padStart(2, '0');
    let sec = String(today.getSeconds()).padStart(2, '0');
    let yyyy = today.getFullYear();
    today = mm + '-' + dd + '-' + yyyy;
    todayFull =
      hours + ':' + min + ':' + sec + '  ' + dd + '-' + mm + '-' + yyyy;
    await sendUserInfoName(async sendResponse => {
      await push(ref(db, 'TST_Award/SelectedLogs/'), {
        awardType: awardType,
        relatedDate: today,
        insertedDateTime: todayFull,
        fromMail: uemail,
        fromUid: uid,
        searchCondit: uemail + today,
        fromUname: sendResponse.uname,
        fromSicilNo: sendResponse.empSicil,
        fromLine: sendResponse.line,
        id: selectedId,
        toMail: sendResponse.uemail,
        active: 1,
        brandtitle: brandtitle,
        brand: brand,
        cardKey: cardKey,
      });
      // params.appCardKey.toString().split(',')[0] kuldas
      let currentString = '';
      let awardRandom = awardType + 'weekAgoRandom';
      await onValue(
        ref(db, 'TST_Award/UserCapacity/' + sendResponse.empSicil),
        snapshot => {
          currentString = snapshot.val()[awardRandom];
          if (currentString != undefined) {
            currentString = currentString.toString().replace(cardKey + ',', '');
          }
        },
      );
      await update(ref(db, 'TST_Award/UserCapacity/' + sendResponse.empSicil), {
        [awardType]: db.ServerValue.increment(-1),
        mail: sendResponse.uemail,
        title: 2,
        active: 1,
        brandtitle: brandtitle,
        brand: brand,
        [awardRandom]: currentString,
      });
      sendMailForAwardSelected(
        sendResponse.uemail + ';ibrahim.ulus@poscoassan.com',
        '<b>Çalışan tarafında seçilen ödül bilgileri aşağıdadır.</b><br/>Ödül:  ' +
          brandtitle +
          ' - ' +
          brand +
          '<br/><b>Seçilen Ödül ID:</b> ' +
          selectedId +
          '<br/><b>Gönderen: </b> ',
      );
      sendMailForAwardLocalMailSelected(
        sendResponse.uemail + ';ibrahim.ulus@poscoassan.com',
        '<b>Çalışan tarafında seçilen ödül bilgileri aşağıdadır.</b><br/>Ödül:  ' +
          brandtitle +
          ' - ' +
          brand +
          '<br/><b>Seçilen Ödül ID:</b> ' +
          selectedId +
          '<br/><b>Gönderen: </b> ',
      );
    });

    return {};
  } catch (error) {
    return {
      error: error.code,
    };
  }
};
//-----------------*******************-----------------*******************-----------------*******************
export const InsertNewRecordToFirebase = async ({
  country1,
  country2,
  country3,
  country4,
  country5,
  country6,
  country7,
  country8,
  country9,
  country10,
  country11,
}) => {
  try {
    let user = await auth.currentUser;
    if (user) {
      if (user != null) {
        var uid = user.uid;
        var uemail = user.email;
      }
    }
    let status = 'ok';
    let today = new Date(convertTimestamp(Timestamp.now()));
    let todayFull = new Date(convertTimestamp(Timestamp.now()));
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let hours = String(today.getHours()).padStart(2, '0');
    let min = String(today.getMinutes()).padStart(2, '0');
    let sec = String(today.getSeconds()).padStart(2, '0');
    let yyyy = today.getFullYear();
    today = mm + '-' + dd + '-' + yyyy;
    todayFull =
      hours + ':' + min + ':' + sec + '  ' + dd + '-' + mm + '-' + yyyy;
    if (
      country1 === true ||
      country2 === true ||
      country3 === true ||
      country4 === true ||
      country5 === true ||
      country6 === true ||
      country7 === true ||
      country8 === true ||
      country11 === true
    ) {
      status = 'ng';
      problemVar(response => {
        sendUserInfoName(async sendResponse => {
          await push(ref(db, 'checklists/'), {
            quest1: country1,
            quest2: country2,
            quest3: country3,
            quest4: country4,
            quest5: country5,
            quest6: country6,
            quest7: country7,
            quest8: country8,
            quest9: country9,
            country10: country10,
            country11: country11,
            relatedDate: today,
            insertedDateTime: todayFull,
            status: status,
            contenttt: 'abcdef',
            test: '333',
            uemail: uemail,
            uid: uid,
            searchCondit: uemail + today,
            uname: sendResponse.uname,
            SicilNo: sendResponse.empSicil,
            line: sendResponse.line,
          });
        });
      });
      return {};
    } else {
      status = 'ok';
      sendUserInfoName(async sendResponse => {
        await push(ref(db, 'checklists/'), {
          quest1: country1,
          quest2: country2,
          quest3: country3,
          quest4: country4,
          quest5: country5,
          quest6: country6,
          quest7: country7,
          quest8: country8,
          quest9: country9,
          country10: country10,
          country11: country11,
          relatedDate: today,
          insertedDateTime: todayFull,
          status: status,
          contenttt: 'abcdef',
          test: '333',
          uemail: uemail,
          uid: uid,
          searchCondit: uemail + today,
          uname: sendResponse.uname,
          SicilNo: sendResponse.empSicil,
          line: sendResponse.line,
        });
      });
      return {};
    }
  } catch (error) {
    return {
      error: error.code,
    };
  }
};
//-----------------*******************-----------------*******************-----------------*******************
export const loginUser = async ({email, password}) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);

    checkPermission();
    return {};
  } catch (error) {
    switch (error.code) {
      case 'auth/invalid-email':
        return {
          error: 'E-mail format hatası.',
        };
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return {
          error: 'Hatalı kullanıcı adı veya şifre.',
        };
      case 'auth/too-many-requests':
        return {
          error: 'Çok fazla hatalı deneme!',
        };
      case "auth/invalid-credential":
        return{
          error: 'Mail ya da şifrenizi kontrol ediniz',
        }
      default:
        return {
          error: 'Bir hata ile karşılaşıldı',
        };
    }
  }
};
//-----------------*******************-----------------*******************-----------------*******************
export const sendEmailWithPassword = async email => {
  try {
    await auth.sendPasswordResetEmail(email);
    return {};
  } catch (error) {
    switch (error.code) {
      case 'auth/invalid-email':
        return {
          error: 'E-mail format hatası.',
        };
      case 'auth/user-not-found':
        return {
          error: 'Hatalı kullanıcı maili.',
        };
      case 'auth/too-many-requests':
        return {
          error: 'Çok fazla hatalı deneme!',
        };
      default:
        return {
          error: 'İnternet bağlantınızı kontrol ediniz.',
        };
    }
  }
};
//-----------------*******************-----------------*******************-----------------*******************
export const sendCredit = async () => {
  let credit = []

  await sendUserInfo(responsed => {
    const q = query(
      ref(db, '0'),
      orderByChild('MailAdd'),
      equalTo(responsed.uemail),
    );
    get(q).then(snapshot => {
      snapshot.forEach( async (childSnap)=> {
         credit.push({credit:childSnap.val().Credit})
      
      });
    });

  });
  return credit;

 
};
//-----------------*******************-----------------*******************-----------------*******************
export const getLineTrackAuth = async callback => {
  let LineTracking;
  await sendUserInfo(responsed => {
    const q = query(
      ref(db, '0/'),
      orderByChild('MailAdd'),
      equalTo(responsed.uemail),
    );

    get(q).then(async snapshot => {
      snapshot.forEach(function (childSnap) {
        LineTracking = childSnap.val().LineTracking;
      });

      callback({
        LineTracking: LineTracking,
      });
    });
  });
};
//-----------------*******************-----------------*******************-----------------*******************
export const getTitleStatus = async callback => {
  var eliteCredit;
  var prestigeCredit;
  var premiumCredit;
  var starCredit;
  var mailAdd;
  var title;
  var cardKey;
  var EliteCountweekAgoRandom;
  var PrestigeCountweekAgoRandom;
  var PremiumCountweekAgoRandom;
  var StarCountweekAgoRandom;
  await sendUserInfo(async response => {
    const q = query(
      ref(db, 'TST_Award/UserCapacity/'),
      orderByChild('mail'),
      equalTo(response.uemail),
    );
    await get(q).then(snapshot => {
      snapshot.forEach(function (childSnap) {
        eliteCredit = childSnap.val().EliteCount;
        prestigeCredit = childSnap.val().PrestigeCount;
        premiumCredit = childSnap.val().PremiumCount;
        starCredit = childSnap.val().StarCount;
        mailAdd = childSnap.val().mail;
        title = childSnap.val().title;
        cardKey = childSnap.key;
        EliteCountweekAgoRandom = childSnap.val().EliteCountweekAgoRandom;
        PrestigeCountweekAgoRandom = childSnap.val().PrestigeCountweekAgoRandom;
        PremiumCountweekAgoRandom = childSnap.val().PremiumCountweekAgoRandom;
        StarCountweekAgoRandom = childSnap.val().StarCountweekAgoRandom;
      });
      callback({
        eliteCredit: eliteCredit,
        prestigeCredit: prestigeCredit,
        premiumCredit: premiumCredit,
        starCredit: starCredit,
        mailAdd: mailAdd,
        title: title,
        cardKey: cardKey,
        EliteCountweekAgoRandom: EliteCountweekAgoRandom,
        PrestigeCountweekAgoRandom: PrestigeCountweekAgoRandom,
        PremiumCountweekAgoRandom: PremiumCountweekAgoRandom,
        StarCountweekAgoRandom: StarCountweekAgoRandom,
      });
    });
  });
};
//-----------------*******************-----------------*******************-----------------*******************
export const getTelNo = async ({companyCode}) => {
  var companyPhoneNo1;
  var companyPhoneNo2;
  var companyPhoneNo3;
  var companyPhoneNo4;

  var companyPhoneName1;
  var companyPhoneName2;
  var companyPhoneName3;
  var companyPhoneName4;

  db.ref('pasport/')
    .orderByChild('content')
    .equalTo(1)
    .on('value', snapshot => {
      snapshot.forEach(function (childSnap) {
        companyPhoneNo1 = childSnap.val().TelNo1;
        companyPhoneNo2 = childSnap.val().TelNo2;
        companyPhoneNo3 = childSnap.val().TelNo3;
        companyPhoneNo4 = childSnap.val().TelNo4;
        companyPhoneName1 = childSnap.val().Tel1Name;
        companyPhoneName2 = childSnap.val().Tel2Name;
        companyPhoneName3 = childSnap.val().Tel3Name;
        companyPhoneName4 = childSnap.val().Tel4Name;
      });
    });
  return {
    companyPhoneNo1: companyPhoneNo1,
    companyPhoneNo2: companyPhoneNo2,
    companyPhoneNo3: companyPhoneNo3,
    companyPhoneNo4: companyPhoneNo4,
    companyPhoneName1: companyPhoneName1,
    companyPhoneName2: companyPhoneName2,
    companyPhoneName3: companyPhoneName3,
    companyPhoneName4: companyPhoneName4,
  };
};

export const InsertNewRecordSafetyFirstApplication = async ({
  totalPoint,
  question1Id,
  question2Id,
  question3Id,
  type2Answer,
  quest1Answer,
  quest2Answer,
}) => {
  try {
    var user = await auth.currentUser;
    if (user) {
      if (user != null) {
        var uid = user.uid;
        var uemail = user.email;
      }
    }
    var today = new Date(convertTimestamp(Timestamp.now()));
    var todayFull = new Date(convertTimestamp(Timestamp.now()));
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var hours = String(today.getHours()).padStart(2, '0');
    var min = String(today.getMinutes()).padStart(2, '0');
    var sec = String(today.getSeconds()).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = mm + '-' + dd + '-' + yyyy;
    todayFull =
      hours + ':' + min + ':' + sec + '  ' + dd + '-' + mm + '-' + yyyy;
    await sendUserInfoName(async sendResponse => {

      if ((await sendResponse.line) == 'TNPC') {
        await push(ref(db, 'SafetyResultTNPC/' + yyyy + '_' + mm + '/'), {
          totalPoint: totalPoint,
          question1Id: question1Id,
          question2Id: question2Id,
          question3Id: question3Id,
          type2Answer: type2Answer,
          quest1Answer: quest1Answer,
          quest2Answer: quest2Answer,
          relatedDate: today,
          insertedDateTime: todayFull,
          fromMail: uemail,
          fromUid: uid,
          searchCondit: uemail + today,
          fromUname: sendResponse.uname,
          fromSicilNo: sendResponse.empSicil,
          fromLine: sendResponse.line,
        });

        await sendUserInfo(async responsed => {

          const q = query(
              ref(db, 'SafetyPivotTNPC/' + yyyy + '_' + mm + '/'),
              orderByChild('fromMail'),
              equalTo(responsed.uemail.toUpperCase()),
              limitToLast(1),
            )
          const snapshot = await get(q);
          if (snapshot.exists()) {
            const val = snapshot.val();
            if (val) {
              snapshot.forEach(function (childSnap) {

                update(
                  ref(
                    db,
                    'SafetyPivotTNPC/' +
                    yyyy +
                    '_' +
                    mm +
                    '/' +
                    childSnap.key,
                  ),
                  {
                    totalPoint: childSnap.val().totalPoint + totalPoint,
                    totalDay: childSnap.val().totalDay + 1,
                  });
                return true;
              });
              return true;
            }
            else{

            }
          }
          else{
            await push(
              ref(db, 'SafetyPivotTNPC/' + yyyy + '_' + mm + '/'),
              {
                totalPoint: totalPoint,
                relatedDate: today,
                insertedDateTime: todayFull,
                fromMail: uemail.toUpperCase(),
                fromUid: uid,
                searchCondit: uemail + today,
                fromUname: sendResponse.uname,
                fromSicilNo: sendResponse.empSicil,
                fromLine: sendResponse.line,
                totalDay: 1,
              },
            );
          }


        });
        await sendUserInfoName(async responsed => {
          const g = await query(
            ref(db, 'SafetyPivotTotalTNPC/'),
            orderByChild('SicilNo'),
            equalTo(responsed.empSicil),
            limitToLast(1),
          );
          const snapshot = await get(g)
          if (snapshot.exists()) {
            const val = snapshot.val();
            if (val) {

              snapshot.forEach(childes => {

                update(ref(db, 'SafetyPivotTotalTNPC/' + childes.val().SicilNo+ "/"), {
                  TotalPoint: childes.val().TotalPoint + totalPoint,

                });
            })
            }
            else{

            }
          }
          else{

            await update(
              ref(db, 'SafetyPivotTotalTNPC/'+ sendResponse.empSicil+ "/"),
              {
                MailAdd: uemail,
                searchCondit: uemail + today,
                AdSoyad: sendResponse.uname,
                SicilNo: sendResponse.empSicil,
                TCNo:sendResponse.empSicil,
                Line: sendResponse.line,
                TotalPoint:totalPoint

              }
            ).catch(err=>console.warn(err))

          }

        });
      } else {
        await push(ref(db, 'SafetyResult/' + yyyy + '_' + mm + '/'), {
          totalPoint: totalPoint,
          question1Id: question1Id,
          question2Id: question2Id,
          question3Id: question3Id,
          type2Answer: type2Answer,
          quest1Answer: quest1Answer,
          quest2Answer: quest2Answer,
          relatedDate: today,
          insertedDateTime: todayFull,
          fromMail: uemail,
          fromUid: uid,
          searchCondit: uemail + today,
          fromUname: sendResponse.uname,
          fromSicilNo: sendResponse.empSicil,
          fromLine: sendResponse.line,
        });

        await sendUserInfo(async responsed => {

          const q = query(
            ref(db, 'SafetyPivot/' + yyyy + '_' + mm + '/'),
            orderByChild('fromMail'),
            equalTo(responsed.uemail.toUpperCase()),
            limitToLast(1),
          )
          const snapshot = await get(q);
          if (snapshot.exists()) {
            const val = snapshot.val();
            if (val) {
              snapshot.forEach(function (childSnap) {

                update(
                  ref(
                    db,
                    'SafetyPivot/' +
                    yyyy +
                    '_' +
                    mm +
                    '/' +
                    childSnap.key,
                  ),
                  {
                    totalPoint: childSnap.val().totalPoint + totalPoint,
                    totalDay: childSnap.val().totalDay + 1,
                  });
                return true;
              });
              return true;
            }
            else{

            }
          }
          else{
            await push(
              ref(db, 'SafetyPivot/' + yyyy + '_' + mm + '/'),
              {
                totalPoint: totalPoint,
                relatedDate: today,
                insertedDateTime: todayFull,
                fromMail: uemail.toUpperCase(),
                fromUid: uid,
                searchCondit: uemail + today,
                fromUname: sendResponse.uname,
                fromSicilNo: sendResponse.empSicil,
                fromLine: sendResponse.line,
                totalDay: 1,
              },
            );
          }


        });
        await sendUserInfoName(async responsed => {
          const g = await query(
            ref(db, 'SafetyPivotTotal/'),
            orderByChild('SicilNo'),
            equalTo(responsed.empSicil),
            limitToLast(1),
          );
          const snapshot = await get(g)
          if (snapshot.exists()) {
            const val = snapshot.val();
            if (val) {

              snapshot.forEach(childes => {

                update(ref(db, 'SafetyPivotTotal/' + childes.val().SicilNo+ "/"), {
                  TotalPoint: childes.val().TotalPoint + totalPoint,
                  NoCardPoints:childes.val().NoCardPoints + totalPoint
                });
              })
            }
            else{

            }
          }
          else{

            await update(
              ref(db, 'SafetyPivotTotal'+ sendResponse.empSicil+ "/"),
              {
                MailAdd: uemail,
                searchCondit: uemail + today,
                AdSoyad: sendResponse.uname,
                SicilNo: sendResponse.empSicil,
                TCNo:sendResponse.empSicil,
                Line: sendResponse.line,
                TotalPoint:totalPoint,
                NoCardPoints: totalPoint

              }
            ).catch(err=>console.warn(err))

          }

        });
       /* await push(ref(db, 'SafetyResult/' + yyyy + '_' + mm), {
          totalPoint: totalPoint,
          question1Id: question1Id,
          question2Id: question2Id,
          question3Id: question3Id,
          type2Answer: type2Answer,
          quest1Answer: quest1Answer,
          quest2Answer: quest2Answer,
          relatedDate: today,
          insertedDateTime: todayFull,
          fromMail: uemail,
          fromUid: uid,
          searchCondit: uemail + today,
          fromUname: sendResponse.uname,
          fromSicilNo: sendResponse.empSicil,
          fromLine: sendResponse.line,
        });
        await sendUserInfo(async responsed => {

          const q = query(
            ref(db, 'SafetyPivot/' + yyyy + '_' + mm),
            orderByChild('fromMail'),
            equalTo(responsed.uemail.toUpperCase()),
            limitToLast(1),
          );
          await get(q).then(async snapshot => {

            if (Object.keys(snapshot.val()).length) {

              snapshot.forEach(function (childSnap) {

                update(
                  ref(
                    db,
                    'SafetyPivot/' +
                    yyyy +
                    '_' +
                    mm +
                    '/' +
                    childSnap.key,
                  ),
                  {
                    totalPoint: childSnap.val().totalPoint + totalPoint,
                    totalDay: childSnap.val().totalDay + 1,
                  });
                return true;
              });
              return true;
            } else {
              await push(ref(db, 'SafetyPivot/' + yyyy + '_' + mm), {
                totalPoint: totalPoint,
                relatedDate: today,
                insertedDateTime: todayFull,
                fromMail: uemail.toUpperCase(),
                fromUid: uid,
                searchCondit: uemail + today,
                fromUname: sendResponse.uname,
                fromSicilNo: sendResponse.empSicil,
                fromLine: sendResponse.line,
                totalDay: 1,
              });
            }
          });
        });
        await sendUserInfoName(responsed => {
          const q = query(
            ref(db, 'SafetyPivotTotal'),
            orderByChild('SicilNo'),
            equalTo(responsed.empSicil),
            limitToLast(1),
          );
          get(q).then(snapshot => {
            snapshot.forEach(childes => {
              update(ref(db, 'SafetyPivotTotal/' + childes.val().SicilNo), {
                TotalPoint: childes.val().TotalPoint + totalPoint,
              });
              return true;
            });
            return true;
          });
        });*/
      }
    });

    return {};
  } catch (error) {
    return {
      error: error.code,
    };
  }
};

export const getListeStatus = async (callback) => {
  var isseqId = 100;
  var isTotalPoint = 0;
  var checked = false;
  var today = new Date(convertTimestamp(Timestamp.now()));
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();
  var dd = String(today.getDate()).padStart(2, '0');
  today = mm + '-' + dd + '-' + yyyy;
  let lister = [];
  await sendUserInfoName(async sendResponse => {

    if (sendResponse.line == 'TNPC') {
      await onValue(
        ref(db, 'SafetyResultTNPC/' + yyyy + '_' + mm),
        async snapshot => {
          snapshot.forEach(childes => {
            if (
              sendResponse.uname === childes.val().fromUname &&
              today === childes.val().relatedDate
            ) {
              checked = true;
            }
          });
          await onValue(
            ref(db, 'SafetyPivotTNPC/' + yyyy + '_' + mm),
            snapshot => {
              if (lister.length > 0) {
                lister = [];
              }
              snapshot.forEach(childed => {
                lister.push(childed);
              });
              if (lister.length > 0) {
                lister.sort(function (a, b) {
                  if (a.val().totalPoint > b.val().totalPoint) {
                    return -1;
                  } else {
                    return 1;
                  }
                });

                isseqId = lister.findIndex(
                  obj => obj.val().fromMail === sendResponse.uemail,
                );
                if (isseqId < 0) {
                  isTotalPoint = 0;
                } else {
                  isTotalPoint =
                    lister[
                      lister.findIndex(
                        obj => obj.val().fromMail === sendResponse.uemail,
                      )
                    ].val().totalPoint;
                }
              }
              callback( {
                isseqId: isseqId,
                isTotalPoint: isTotalPoint,
                checked: checked,
                liste: lister,
              });
            },
          );
        },
      );
    } else {
      onValue(ref(db, 'SafetyResult/' + yyyy + '_' + mm), async snapshot => {
        snapshot.forEach(childes => {
          if (
            sendResponse.uname === childes.val().fromUname &&
            today === childes.val().relatedDate
          ) {
            checked = true;
          }
        });
        onValue(ref(db, 'SafetyPivot/' + yyyy + '_' + mm + '/'), snapshot => {
          if (lister.length > 0) {
            lister = [];
          }
          snapshot.forEach(childed => {
            lister.push(childed);
          });
          if (lister.length > 0) {
            lister.sort(function (a, b) {
              if (a.val().totalPoint > b.val().totalPoint) {
                return -1;
              } else {
                return 1;
              }
            });

            isseqId = lister.findIndex(
              obj => obj.val().fromMail === sendResponse.uemail,
            );
            if (isseqId < 0) {
              isTotalPoint = 0;
            } else {
              isTotalPoint =
                lister[
                  lister.findIndex(
                    obj => obj.val().fromMail === sendResponse.uemail,
                  )
                ].val().totalPoint;
            }
          }
          callback({
            isseqId: isseqId,
            isTotalPoint: isTotalPoint,
            checked: checked,
            liste: lister,
          });
        });
      });
    }
  });
};

export const InsertNewRecordSafetyFirstApplication2 = async (callback) => {
  try {
    var user = await auth.currentUser;
    if (user) {
      if (user != null) {
        var uid = user.uid;
        var uemail = user.email;
      }
    }
    var today = new Date(convertTimestamp(Timestamp.now()));
    var todayFull = new Date(convertTimestamp(Timestamp.now()));
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var hours = String(today.getHours()).padStart(2, '0');
    var min = String(today.getMinutes()).padStart(2, '0');
    var sec = String(today.getSeconds()).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = mm + '-' + dd + '-' + yyyy;
    todayFull =
      hours + ':' + min + ':' + sec + '  ' + dd + '-' + mm + '-' + yyyy;
    await sendUserInfoName(async sendResponse => {
      if (sendResponse.line == 'TNPC') {
        await push(ref(db, 'SafetyResultTNPC/' + yyyy + '_' + mm + '/'), {
          relatedDate: today,
          insertedDateTime: todayFull,
          fromMail: uemail,
          fromUid: uid,
          searchCondit: uemail + today,
          fromUname: sendResponse.uname,
          fromSicilNo: sendResponse.empSicil,
          fromLine: sendResponse.line,
        });

        await sendUserInfo(async responsed => {
          const q = query(
            ref(db, 'SafetyPivotTNPC/' + yyyy + '_' + mm),
            orderByChild('fromMail'),
            equalTo(responsed.uemail.toUpperCase()),
            limitToLast(1),
          );

          get(q).then(async snapshot => {
            if (snapshot.numChildren() > 0) {
              snapshot.forEach(function (childSnap) {
                childSnap.ref.update({
                  totalPoint: childSnap.val().totalPoint + 0,
                  totalDay: childSnap.val().totalDay,
                });
                return true;
              });
              return true;
            } else {
              await push(ref(db, 'SafetyPivotTNPC/' + yyyy + '_' + mm + '/'), {
                totalPoint: 0,
                relatedDate: today,
                insertedDateTime: todayFull,
                fromMail: uemail.toUpperCase(),
                fromUid: uid,
                searchCondit: uemail + today,
                fromUname: sendResponse.uname,
                fromSicilNo: sendResponse.empSicil,
                fromLine: sendResponse.line,
                totalDay: 1,
              });
            }
          });
        });
      } else {
        await push(ref(db, 'SafetyResult/' + yyyy + '_' + mm + '/'), {
          relatedDate: today,
          insertedDateTime: todayFull,
          fromMail: uemail,
          fromUid: uid,
          searchCondit: uemail + today,
          fromUname: sendResponse.uname,
          fromSicilNo: sendResponse.empSicil,
          fromLine: sendResponse.line,
        });

        await sendUserInfo(responsed => {
          const q = query(
            ref(db, 'SafetyPivot/' + yyyy + '_' + mm),
            orderByChild('fromMail'),
            equalTo(responsed.uemail.toUpperCase()),
            limitToLast(1),
          );
          get(q).then(async snapshot => {
            if (snapshot.numChildren() > 0) {
              snapshot.forEach(function (childSnap) {
                childSnap.ref.update({
                  totalPoint: childSnap.val().totalPoint + 0,
                  totalDay: childSnap.val().totalDay,
                });
                return true;
              });
              return true;
            } else {
              await push(ref(db, 'SafetyPivot/' + yyyy + '_' + mm + '/'), {
                totalPoint: 0,
                relatedDate: today,
                insertedDateTime: todayFull,
                fromMail: uemail.toUpperCase(),
                fromUid: uid,
                searchCondit: uemail + today,
                fromUname: sendResponse.uname,
                fromSicilNo: sendResponse.empSicil,
                fromLine: sendResponse.line,
                totalDay: 1,
              });
            }
          });
        });
      }
    });

    return {};
  } catch (error) {
    return {
      error: error.code,
    };
  }
};

export const InsertSafetyRuleCheck = async ({
  ch0,
  ch1,
  ch2,
  ch3,
  ch4,
  ch5,
  ch6,
  ch7,
  ch8,
  ch9,
  appHead,
  appDate,
  endDate,
}) => {
  try {
    var user = await auth.currentUser;
    if (user) {
      if (user != null) {
        var uid = user.uid;
        var uemail = user.email;
      }
    }
    var today = new Date(convertTimestamp(Timestamp.now()));
    var todayFull = new Date(convertTimestamp(Timestamp.now()));
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var hours = String(today.getHours()).padStart(2, '0');
    var min = String(today.getMinutes()).padStart(2, '0');
    var sec = String(today.getSeconds()).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = mm + '-' + dd + '-' + yyyy;
    todayFull =
      hours + ':' + min + ':' + sec + '  ' + dd + '-' + mm + '-' + yyyy;

    sendUserInfoName(async sendResponse => {
      const line = sendResponse.line;
      const renderName =
        line === 'TNPC' ? 'SafetyRuleResult/TNPC/' : 'SafetyRuleResult/TST/';
      await update(
        ref(
          db,
          renderName +
            yyyy +
            '_' +
            mm +
            '_' +
            dd +
            '/' +
            sendResponse.empSicil +
            '/' +
            appHead +
            '/',
        ),
        {
          ch0: ch0,
          ch1: ch1,
          ch2: ch2,
          ch3: ch3,
          ch4: ch4,
          ch5: ch5,
          ch6: ch6,
          ch7: ch7,
          ch8: ch8,
          ch9: ch9,
          appHead: appHead,
          appDate: appDate,
          endDate: endDate,
          relatedDate: today,
          insertedDateTime: todayFull,
          uemail: uemail,
          uid: uid,
          searchCondit: uemail + today,
          uname: sendResponse.uname,
          SicilNo: sendResponse.empSicil,
          line: sendResponse.line,
        },
      );
    });
    return {};
  } catch (error) {
    return {
      error: error.code,
    };
  }
};

export const getTotalPoint2 = async callback => {
  var isTotalPoint = 0;
  sendUserInfoName(sendResponse => {
    if (sendResponse.line == 'TNPC') {
      onValue(ref(db, 'SafetyPivotTotalTNPC/'), snapshot => {
        snapshot.forEach(childes => {
          if (sendResponse.empSicil === childes.val().SicilNo) {
            isTotalPoint = childes.val().TotalPoint;
          }
        });
        callback({
          isTotalPoint: isTotalPoint,
        });
      });
    } else {
      onValue(ref(db, 'SafetyPivotTotal/'), snapshot => {
        snapshot.forEach(childes => {
          if (sendResponse.empSicil === childes.val().SicilNo) {
            isTotalPoint = childes.val().TotalPoint;
          }
        });
        callback({
          isTotalPoint: isTotalPoint,
        });
      });
    }
  });
};
export const getDialogInfo = async callback => {
  let dialog

    const s = query(ref(db, 'tstapp/dialog'));
    await get(s).then(snapshot => {
        dialog = snapshot.val();

      callback({
        dialog:dialog,

      });
    });
};
//-----------------*******************-----------------*******************-----------------*******************
