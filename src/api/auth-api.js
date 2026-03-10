import { Alert } from "react-native";
// RNFB modülleri eklendi
import { signInWithEmailAndPassword } from "@react-native-firebase/auth";
import { database, auth } from "../database/firebaseDB";
import firestore, { Timestamp } from "@react-native-firebase/firestore";
import messaging from "@react-native-firebase/messaging";
// Diğer importlar korundu
import axios from "axios";
import qs from "qs";
import moment from "moment/moment";
import { REACT_APP_SECRET_KEY } from "@env";
import {
  equalTo,
  get,
  orderByChild,
  query,
  ref,
} from "@react-native-firebase/database";

// -------------------------------------------------------------------

const convertTimestamp = (timestamp) => {
  const { seconds, nanoseconds } = timestamp;
  const milliseconds = seconds * 1000 + nanoseconds / 1e6;
  return moment(milliseconds).toDate();
};

// ❌ const auth = getAuth(); // RNFB'de bu şekilde başlatmaya gerek yok.
// ❌ const db = getDatabase(); // RNFB'de bu şekilde başlatmaya gerek yok.

export const showAlert = (messagess) => {
  Alert.alert(messagess);
};
//-----------------*******************-----------------*******************-----------------*******************

// config tanımı, kullanıldığı postData fonksiyonundan önceye taşındı.
let config = {
  headers: {
    "Content-Type": "application/json",
    Authorization:
      "key=AAAAinKXuCg:APA91bE14o_qlxzKDEvvx7jV9l0ghDcUjslsuXLkme9pDAcRU0ut2fa37qzdnK-BBnYtTdZq-ia_lpoLRFvahbFYW5UlV9nHjmJgs8n6Qm3LmYX2IaOW9bBoCdrSDYl6xo-mhiiHdIZc",
  },
};
//-----------------*******************-----------------*******************-----------------*******************
export const postData = function (url, payload, company) {
  if (company == "TST") {
    return axios.post(url, payload, config);
  }
};
//-----------------*******************-----------------*******************-----------------*******************

//
// Aşağıdaki tüm sendMail... fonksiyonlarında 'auth.currentUser' kullanımı,
// RNFB'ye uygun olarak 'auth().currentUser' şeklinde güncellendi.
//

export const sendMailForGonulden = async function (receiver, subjectMessage) {
  let user = auth.currentUser; // 👈 Değişti
  if (user) {
    if (user != null) {
      var uemail = user.email;
    }
  }
  let jsonData = qs.stringify({
    from: "Healthy_Future@poscoassan.com",
    to: receiver,
    cc: uemail,
    body: subjectMessage + uemail,
    subject: "Gonulden Application - Teşekkürler",
  });

  return await axios.post(
    "https://tstapp.poscoassan.com.tr:8443/Common/SendMail",
    jsonData,
    {
      headers: {
        "auth-token": REACT_APP_SECRET_KEY,
      },
    },
  );
};
//-----------------*******************-----------------*******************-----------------*******************
export const sendMailForGonuldenLocalMail = async function (
  receiver,
  subjectMessage,
) {
  let user = auth.currentUser; // 👈 Değişti
  if (user) {
    if (user != null) {
      var uemail = user.email;
    }
  }
  let jsonData = qs.stringify({
    from: "Healthy_Future@poscoassan.com",
    to: receiver,
    cc: uemail,
    body: subjectMessage + uemail,
    subject: "Gonulden Application - Teşekkürler",
  });

  return await axios.post(
    "https://tstapp.poscoassan.com.tr:8443/Common/SendMail",
    jsonData,
    {
      headers: {
        "auth-token": REACT_APP_SECRET_KEY,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );
};
//-----------------*******************-----------------*******************-----------------*******************
export const sendMailForAward = async function (receiver, subjectMessage) {
  let user = auth.currentUser; // 👈 Değişti
  if (user) {
    if (user != null) {
      var uemail = user.email;
    }
  }
  let jsonData = qs.stringify({
    from: "Healthy_Future@poscoassan.com",
    to: receiver,
    cc: uemail,
    body: subjectMessage + uemail,
    subject: "Ödül Sistemi - Ödül Gönderildi ",
  });

  return await axios.post(
    "https://tstapp.poscoassan.com.tr:8443/Common/SendMail",
    jsonData,
    {
      headers: {
        "auth-token": REACT_APP_SECRET_KEY,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );
};
//-----------------*******************-----------------*******************-----------------*******************
export const sendMailForAwardSelected = async function (
  receiver,
  subjectMessage,
) {
  let user = auth.currentUser; // 👈 Değişti
  if (user) {
    if (user != null) {
      var uemail = user.email;
    }
  }
  let jsonData = qs.stringify({
    from: "Healthy_Future@poscoassan.com",
    to: receiver,
    cc: uemail,
    body: subjectMessage + uemail,
    subject: "Ödül Sistemi - Ödül Seçildi ",
  });

  return await axios.post(
    "https://tstapp.poscoassan.com.tr:8443/Common/SendMail",
    jsonData,
    {
      headers: {
        "auth-token": REACT_APP_SECRET_KEY,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );
};
//-----------------*******************-----------------*******************-----------------*******************
export const sendMailForAwardLocalMail = async function (
  receiver,
  subjectMessage,
) {
  let user = auth.currentUser; // 👈 Değişti
  if (user) {
    if (user != null) {
      var uemail = user.email;
    }
  }
  let jsonData = qs.stringify({
    from: "Healthy_Future@poscoassan.com",
    to: receiver,
    cc: uemail,
    body: subjectMessage + uemail,
    subject: "Ödül Sistemi - Ödül Gönderildi ",
  });

  return await axios.post(
    "https://tstapp.poscoassan.com.tr:8443/Common/SendMail",
    jsonData,
    {
      headers: {
        "auth-token": REACT_APP_SECRET_KEY,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );
};
//-----------------*******************-----------------*******************-----------------*******************
export const sendMailForAwardLocalMailSelected = async function (
  receiver,
  subjectMessage,
) {
  let user = auth.currentUser; // 👈 Değişti
  if (user) {
    if (user != null) {
      var uemail = user.email;
    }
  }

  let jsonData = qs.stringify({
    from: "Healthy_Future@poscoassan.com",
    to: receiver,
    cc: uemail,
    body: subjectMessage + uemail,
    subject: "Ödül Sistemi - Ödül Seçildi ",
  });

  return await axios.post(
    "https://tstapp.poscoassan.com.tr:8443/Common/SendMail",
    jsonData,
    {
      headers: {
        "auth-token": REACT_APP_SECRET_KEY,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );
};

//-----------------*******************-----------------*******************-----------------*******************
export const checkPermission = async () => {
  const enabled = await messaging().hasPermission();
  if (enabled) {
    await getFcmToken((response) => {});
  } else {
    await requestPermission(() => {});
  }
};
//-----------------*******************-----------------*******************-----------------*******************
// BU FONKSİYON ZATEN RNFB UYUMLU (Değişiklik Gerekmiyor)
export const requestPermission = async (callback) => {
  let version;
  try {
    await messaging().requestPermission();
  } catch (error) {}
  callback({
    version: version,
  });
};
//-----------------*******************-----------------*******************-----------------*******************
// BU FONKSİYON ZATEN RNFB UYUMLU (Değişiklik Gerekmiyor)
export const getFcmToken = async (callback) => {
  const fcmToken = await messaging().getToken();
  if (fcmToken) {
    await messageListener(); // messageListener'ın da güncel RNFB kullanması gerekir
    await updateUserToken(async (response) => {
      await getManagerToken(); // getManagerToken'ın da RNFB kullanması gerekir
    });
  } else {
    showAlert("No token received");
  }
  callback({
    version: fcmToken,
  });
};
//-----------------*******************-----------------*******************-----------------*******************
// ✅ RNFB'YE ÇEVRİLDİ
export const sendUserInfoName = async (callback) => {
  let uname = "d";
  let empSicil = "2";
  let manager = 0;
  let line = "a";
  let credit = "0";
  let uemail = "0";

  // 'sendUserInfo' artık modüler versiyonu çağıracak
  await sendUserInfo(async (responsed) => {
    try {
      // Sadece 'uemail' varsa sorgulama yap
      if (responsed.uemail) {
        // HATA: database().ref(...) (eski v8 API)
        // DOĞRUSU: Modüler fonksiyonları kullan:

        // 1. Veritabanı referansını oluştur
        const dbRef = ref(database, "0");

        const dbQuery = query(
          dbRef,
          orderByChild("MailAdd"),
          equalTo(responsed.uemail),
        );

        const snapshot = await get(dbQuery);

        if (snapshot.exists()) {
          snapshot.forEach(function (childSnapshot) {
            const val = childSnapshot.val();

            uname = val.AdSoyad;
            empSicil = val.SicilNo;
            line = val.Line;
            credit = val.Credit;
            uemail = val.MailAdd;
            //   disabled = val?.Disabled;
          });
        }
      }
    } catch (err) {
      console.error("sendUserInfoName Hatası:", err);
    }

    await callback({
      uname: uname,
      empSicil: empSicil,
      line: line,
      //  Disabled: disabled,
      credit: credit,
      uemail: uemail,
    });
  });
};
//-----------------*******************-----------------*******************-----------------*******************
// ✅ RNFB'YE ÇEVRİLDİ
export const sendUserInfo = async (callback) => {
  let uemail = null;
  let userid = null;

  let user = auth.currentUser;

  if (user) {
    if (user != null) {
      uemail = user.email.toUpperCase();
      userid = user.uid;
    }
  }

  callback({
    uemail: uemail,
    userid: userid,
  });
};
//-----------------*******************-----------------*******************-----------------*******************
// ✅ RNFB'YE ÇEVRİLDİ (ve Asenkron Hata Düzeltildi)
export const updateUserToken = async (callback) => {
  let userState = "d";

  await sendUserInfo(async (response) => {
    try {
      // Web v9 (query, ref, get) yerine RNFB .ref() .once() kullanıldı
      const snapshot = await database
        .ref("0")
        .orderByChild("MailAdd")
        .equalTo(response.uemail)
        .once("value");

      if (snapshot.exists()) {
        // Token'ı döngüden önce, bir kez al
        const token = await messaging().getToken();

        // Tüm güncellemeler için bir promise dizisi oluştur
        const updatePromises = [];

        snapshot.forEach(function (childSnapshot) {
          // Güncellemeyi RNFB .ref.update() ile yap
          updatePromises.push(
            childSnapshot.ref.update({
              Token: token,
              userid: response.userid,
            }),
          );
        });

        // Tüm güncellemelerin bitmesini bekle
        await Promise.all(updatePromises);
        userState = "e";
      }
    } catch (err) {
      console.error("updateUserToken hatası:", err);
    }

    callback({
      userState: userState,
    });
  });
};
//-----------------*******************-----------------*******************-----------------*******************
// ✅ RNFB'YE ÇEVRİLDİ
export const getManager2Token = async ({ approver2Token_ }) => {
  await sendUserInfoName(async (sendResponse) => {
    let gonderTOken = "";

    if (approver2Token_ == undefined) {
      return {};
    } else {
      try {
        // Web v9 (query, ref, get) yerine RNFB .ref() .once() kullanıldı
        const snapshot_ = await database
          .ref("0")
          .orderByChild("SicilNo")
          .equalTo(approver2Token_)
          .once("value");

        if (snapshot_.exists()) {
          snapshot_.forEach(function (childSnapshot_) {
            gonderTOken = childSnapshot_.val().Token;
            let body = {
              to: gonderTOken,
              notification: {
                title: "Checklist Alert!!",
                body: sendResponse.uname,
                mutable_content: true,
                sound: "Tri-tone",
              },
              data: {
                key1: "Checklist Alert!!",
                key2: sendResponse.uname,
              },
            };
            // postData (FCM gönderme) fonksiyonu aynı kalır
            postData("https://fcm.googleapis.com/fcm/send", body, "TST")
              .then((d) => {})
              .catch((e) => {});
          });
        }

        // Bu return, sendUserInfoName'in callback'ine aittir.
        return {
          gelen2_Token: gonderTOken,
        };
      } catch (err) {
        console.log(err);
      }
    }
  }).catch((err) => console.log(err));
};
//-----------------*******************-----------------*******************-----------------*******************
export const problemVar = async (callback) => {
  let userState = "d";
  let approver1Token_;
  let approver2Token_;
  let approver3Token_;
  let approver4Token_;
  let approver5Token_;
  let approver6Token_;
  let approver7Token_;

  // 1. Token'ları al (Bu fonksiyonun da RNFB'ye çevrildiğini varsayıyoruz)
  await getManagerToken((response) => {
    approver1Token_ = response.approver1Token;
    approver2Token_ = response.approver2Token;
    approver3Token_ = response.approver3Token;
    approver4Token_ = response.approver4Token;
    approver5Token_ = response.approver5Token;
    approver6Token_ = response.approver6Token;
    approver7Token_ = response.approver7Token;
  });

  // 2. Kullanıcı bilgisi al ve DB'ye yaz
  await sendUserInfoName(async (sendResponse) => {
    // ✅ DEĞİŞTİ: Timestamp.now() -> firestore.Timestamp.now()
    let today = new Date(convertTimestamp(firestore.Timestamp.now()));
    let todayFull = new Date(convertTimestamp(firestore.Timestamp.now()));

    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0");
    let hours = String(today.getHours()).padStart(2, "0");
    let min = String(today.getMinutes()).padStart(2, "0");
    let sec = String(today.getSeconds()).padStart(2, "0");
    let yyyy = today.getFullYear();

    today = mm + "-" + dd + "-" + yyyy;
    todayFull =
      hours + ":" + min + ":" + sec + "  " + dd + "-" + mm + "-" + yyyy;

    // ✅ DEĞİŞTİ: push(ref(db, ...)) -> database().ref(...).push()
    await database.ref("checklists_negative/").push({
      insertedDateTime: todayFull,
      uname: sendResponse.uname,
      relatedDate: today,
      SicilNo: sendResponse.empSicil,
    });
  });

  // 3. Bildirimleri gönder (Bu kısım aynı kaldı)
  if (approver1Token_) {
    getManager2Token({ approver1Token_ });
  }
  if (approver2Token_) {
    getManager2Token({ approver2Token_ });
  }
  if (approver3Token_) {
    getManagerToken({ approver3Token_ });
  }
  if (approver4Token_) {
    getManagerToken({ approver4Token_ });
  }
  if (approver5Token_) {
    getManagerToken({ approver5Token_ });
  }
  if (approver6Token_) {
    getManagerToken({ approver6Token_ });
  }
  if (approver7Token_) {
    getManagerToken({ approver7Token_ });
  }

  // 4. Callback'i çağır
  callback({
    userState: userState,
  });
};
//-----------------*******************-----------------*******************-----------------*******************
export const getManagerToken = async (callback) => {
  let approver1Token_ = "";
  let approver2Token_ = "";
  let approver3Token_ = "";
  let approver4Token_ = "";
  let approver5Token_ = "";
  let approver6Token_ = "";
  let approver7Token_ = "";

  await sendUserInfo(async (response) => {
    // ✅ DEĞİŞTİ: Firebase v9 sorgusu RNFB sorgusuna çevrildi
    // v9: const s = query(ref(db, '0'), orderByChild('MailAdd'), equalTo(response.uemail));
    // v9: await get(s).then(snapshot => ...);

    try {
      const snapshot = await database
        .ref("0")
        .orderByChild("MailAdd")
        .equalTo(response.uemail)
        .once("value"); // .once('value') ile veriyi tek seferlik oku

      if (snapshot.exists()) {
        snapshot.forEach(function (childSnapshot) {
          const data = childSnapshot.val();
          approver1Token_ = data.Approver_1;
          approver2Token_ = data.Approver_2;
          approver3Token_ = data.Approver_3;
          approver4Token_ = data.Approver_4;
          approver5Token_ = data.Approver_5;
          approver6Token_ = data.Approver_6;
          approver7Token_ = data.Approver_7;
          return true; // forEach'i durdur (ilk eşleşme yeterliyse)
        });
      }
    } catch (error) {
      console.error("getManagerToken hatası:", error);
    }
  });

  // Callback'i çağır
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
  // 1. Uygulama ÖN PLANDA iken gelen mesajları yakala
  messaging().onMessage(async (remoteMessage) => {
    const { title, body } = remoteMessage.notification;
    Alert.alert(
      title,
      body,
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: false },
    );
  });

  // 2. Bildirime TIKLAYARAK uygulamanın açılmasını yakala (Arka plan)
  // (Orijinal koddaki .onNotificationOpened() ve .onNotificationOpenedApp() yerine geçer)
  messaging().onNotificationOpenedApp((remoteMessage) => {
    const { title, body } = remoteMessage.notification;
    Alert.alert(
      title,
      body,
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: false },
    );
  });

  // 3. Uygulama KAPALI iken bildirime tıklanmışsa, ilk açılışta yakala
  // (Orijinal koddaki .getInitialNotification() yerine geçer)
  const initialNotification = await messaging().getInitialNotification();

  if (initialNotification) {
    console.log(
      "Bildirimle uygulama açıldı (kapalı durum):",
      initialNotification,
    );
    const { title, body } = initialNotification.notification;
    Alert.alert(
      title,
      body,
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: false },
    );
  }
};
//-----------------*******************-----------------*******************-----------------*******************
export const getVersionNo = async (callback) => {
  let version = 0;

  // sendUserInfoName'in asenkron bir callback'i yönettiğini varsayıyoruz
  await sendUserInfoName(async (response) => {
    try {
      // v9 (query, ref, get) yerine RNFB (ref, orderByChild, equalTo, once) kullanıldı
      const s = database.ref("tstapp").orderByChild("content").equalTo(1);

      // .once('value') ile veriyi tek seferlik ve Promise tabanlı oku
      const snapshot = await s.once("value");

      if (snapshot.exists()) {
        snapshot.forEach(function (childSnap) {
          version = childSnap.val().version_information;
          return true; // İlk eşleşmeyi bulduktan sonra döngüden çık
        });
      }
    } catch (error) {
      console.log("getVersionNo hatası:", error);
    }

    // Tüm işlemler bittikten sonra callback'i çağır
    callback({
      version: version,
    });
  });
};

//-----------------*******************-----------------*******************-----------------*******************

//-----------------*******************-----------------*******************-----------------*******************
export const updateUserCredit = async (callback) => {
  let credit; // Orijinal koddaki bu değişken atanmıyor, mantık korundu.

  await sendUserInfo(async (responsed) => {
    try {
      // v9 (query, ref, get) yerine RNFB (ref, orderByChild, equalTo, limitToLast, once) kullanıldı
      const q = database
        .ref("0")
        .orderByChild("MailAdd")
        .equalTo(responsed.uemail)
        .limitToLast(1);

      const snapshot = await q.once("value");

      if (snapshot.exists()) {
        snapshot.forEach(function (childSnap) {
          // 💡 GÜVENLİK İYİLEŞTİRMESİ (ATOMİK GÜNCELLEME):
          // Orijinal kod: Credit: childSnap.val().Credit - 5 (Yarış koşuluna açık)
          // Güvenli kod: database.ServerValue.increment(-5)

          // v9 (update(childSnap.ref, ...)) yerine RNFB (childSnap.ref.update(...)) kullanıldı
          childSnap.ref.update({
            Credit: database.ServerValue.increment(-5),
          });

          // Not: Orijinal kodda 'credit' değişkenine yeni değer atanmıyor.
          // Eğer atamak isteseydiniz, bir transaction (işlem) kullanmanız gerekirdi.

          return true; // Döngüden çık
        });
      }
    } catch (error) {
      console.error("updateUserCredit hatası:", error);
    }
  });

  // Orijinal kod, tanımsız (undefined) olan 'credit' değişkenini döndürüyor.
  // Bu mantık korundu.
  return {
    credit: credit,
  };
};

export const updateUserAward = async (creditPoint) => {
  let credit; // Orijinal koddaki bu değişken atanmıyor, mantık korundu.

  await sendUserInfo(async (responsed) => {
    try {
      // v9 sorgusu RNFB'ye çevrildi
      const q = database
        .ref("TST_Award/UserCapacity/")
        .orderByChild("mail")
        .equalTo(responsed.uemail)
        .limitToLast(1);

      const snapshot = await q.once("value");

      if (snapshot.exists()) {
        snapshot.forEach(function (childSnap) {
          // 💡 ÖNEMLİ DÜZELTME VE İYİLEŞTİRME:
          // 1. JS Hatası Düzeltildi: Orijinal koddaki `[creditPoint] == 'EliteCount'`
          //    ifadesi bir diziyi string ile karşılaştırır ve her zaman 'false' döndürür.
          // 2. Refaktör: Tüm if/else blokları gereksizdi.
          //    Amaç, 'creditPoint' değişkenini dinamik anahtar olarak kullanmaktı.
          // 3. Güvenlik: Okuma-yazma işlemi, 'increment' (atomik) ile değiştirildi.

          const fieldName = creditPoint; // örn: "EliteCount"

          if (fieldName) {
            childSnap.ref.update({
              [fieldName]: database.ServerValue.increment(-1),
            });
          }

          return true; // Döngüden çık
        });
      }
    } catch (error) {
      console.error("updateUserAward hatası:", error);
    }
  });

  // Orijinal kod, tanımsız (undefined) olan 'credit' değişkenini döndürüyor.
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
    // Changed: Use auth() to get the instance
    var user = auth().currentUser;
    var uid = null;
    var uemail = null;

    if (user) {
      uid = user.uid;
      uemail = user.email;
    }

    // Changed: Replaced Timestamp.now() and convertTimestamp with new Date()
    // This achieves the same goal of getting the current client-side time.
    let today = new Date();
    let todayFull = new Date();

    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0");
    let hours = String(today.getHours()).padStart(2, "0");
    let min = String(today.getMinutes()).padStart(2, "0");
    let sec = String(today.getSeconds()).padStart(2, "0");
    let yyyy = today.getFullYear();
    today = mm + "-" + dd + "-" + yyyy;
    todayFull =
      hours + ":" + min + ":" + sec + "  " + dd + "-" + mm + "-" + yyyy;

    // This function is assumed to exist in your project
    await sendUserInfoName(async (sendResponse) => {
      // Changed: Use database().ref() and .push()
      await database.ref(`Gonulden/CreditUsedLog/${yyyy}_${mm}/`).push({
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
    // Changed: Use auth() to get the instance
    let user = auth.currentUser;
    var uid = null;
    var uemail = null;

    if (user) {
      uid = user.uid;
      uemail = user.email;
    }

    // The first line `let weekAgoRandom = new Date();` was redundant
    let weekAgoRandom = Date.now();

    // Changed: Replaced Timestamp.now() and convertTimestamp with new Date()
    let today = new Date();
    let todayFull = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0");
    let hours = String(today.getHours()).padStart(2, "0");
    let min = String(today.getMinutes()).padStart(2, "0");
    let sec = String(today.getSeconds()).padStart(2, "0");
    let yyyy = today.getFullYear();
    today = mm + "-" + dd + "-" + yyyy;
    todayFull =
      hours + ":" + min + ":" + sec + "  " + dd + "-" + mm + "-" + yyyy;

    // This function is assumed to exist in your project
    await sendUserInfoName(async (sendResponse) => {
      // Changed: Use database().ref() and .push()
      await database.ref(`TST_Award/UserLog/${yyyy}_${mm}/`).push({
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

      let currentString = "";
      let awardRandom = awardType + "weekAgoRandom";

      // Changed: Replaced `onValue` with `once('value')` for a one-time read.
      // `onValue` sets up a listener, which is not what was intended here.
      const snapshot = await database
        .ref(`TST_Award/UserCapacity/${sicilNo}`)
        .once("value");

      const snapVal = snapshot.val();

      // Check if snapshot value and the specific awardRandom key exist
      if (snapVal && snapVal[awardRandom]) {
        currentString = snapVal[awardRandom] + weekAgoRandom.toString() + ",";
      } else {
        currentString = weekAgoRandom.toString() + ",";
      }

      // Changed: Use database().ref() and .update()
      // Changed: Use database.ServerValue.increment
      await database.ref(`TST_Award/UserCapacity/${sicilNo}`).update({
        [awardType]: database.ServerValue.increment(1),
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
    // Changed: Use auth() to get the instance
    let user = auth.currentUser;
    var uid = null;
    var uemail = null;

    if (user) {
      uid = user.uid;
      uemail = user.email;
    }

    // Changed: Replaced Timestamp.now() and convertTimestamp with new Date()
    let today = new Date();
    let todayFull = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0");
    let hours = String(today.getHours()).padStart(2, "0");
    let min = String(today.getMinutes()).padStart(2, "0");
    let sec = String(today.getSeconds()).padStart(2, "0");
    let yyyy = today.getFullYear();
    today = mm + "-" + dd + "-" + yyyy;
    todayFull =
      hours + ":" + min + ":" + sec + "  " + dd + "-" + mm + "-" + yyyy;

    await sendUserInfoName(async (sendResponse) => {
      // Changed: Use database().ref() and .push()
      await database.ref("TST_Award/SelectedLogs/").push({
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

      // Changed: Replaced `onValue` with `once('value')` for a one-time read.
      const snapshot = await database
        .ref(`TST_Award/UserCapacity/${sendResponse.empSicil}`)
        .once("value");

      let currentString = "";
      const snapVal = snapshot.val();
      let awardRandom = awardType + "weekAgoRandom";

      if (snapVal && snapVal[awardRandom] != undefined) {
        currentString = snapVal[awardRandom]
          .toString()
          .replace(cardKey + ",", "");
      }

      // Changed: Use database().ref() and .update()
      // Changed: Use database.ServerValue.increment
      await database
        .ref(`TST_Award/UserCapacity/${sendResponse.empSicil}`)
        .update({
          [awardType]: database.ServerValue.increment(-1),
          mail: sendResponse.uemail,
          title: 2,
          active: 1,
          brandtitle: brandtitle,
          brand: brand,
          [awardRandom]: currentString,
        });

      // These helper function calls are assumed to be correct
      sendMailForAwardSelected(
        sendResponse.uemail + ";ibrahim.ulus@poscoassan.com",
        "<b>Çalışan tarafında seçilen ödül bilgileri aşağıdadır.</b><br/>Ödül:  " +
          brandtitle +
          " - " +
          brand +
          "<br/><b>Seçilen Ödül ID:</b> " +
          selectedId +
          "<br/><b>Gönderen: </b> ",
      );
      sendMailForAwardLocalMailSelected(
        sendResponse.uemail + ";ibrahim.ulus@poscoassan.com",
        "<b>Çalışan tarafında seçilen ödül bilgileri aşağıdadır.</b><br/>Ödül:  " +
          brandtitle +
          " - " +
          brand +
          "<br/><b>Seçilen Ödül ID:</b> " +
          selectedId +
          "<br/><b>Gönderen: </b> ",
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
    // Changed: Use auth() to get the instance
    let user = auth.currentUser;
    var uid = null;
    var uemail = null;

    if (user) {
      uid = user.uid;
      uemail = user.email;
    }

    let status = "ok";
    // Changed: Replaced Timestamp.now() and convertTimestamp with new Date()
    let today = new Date();
    let todayFull = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0");
    let hours = String(today.getHours()).padStart(2, "0");
    let min = String(today.getMinutes()).padStart(2, "0");
    let sec = String(today.getSeconds()).padStart(2, "0");
    let yyyy = today.getFullYear();
    today = mm + "-" + dd + "-" + yyyy;
    todayFull =
      hours + ":" + min + ":" + sec + "  " + dd + "-" + mm + "-" + yyyy;

    const dataToPush = {
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
      contenttt: "abcdef",
      test: "333",
      uemail: uemail,
      uid: uid,
      searchCondit: uemail + today,
    };

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
      status = "ng";
      dataToPush.status = status; // Update status in payload

      problemVar((response) => {
        sendUserInfoName(async (sendResponse) => {
          // Changed: Use database().ref() and .push()
          await database.ref("checklists/").push({
            ...dataToPush,
            uname: sendResponse.uname,
            SicilNo: sendResponse.empSicil,
            line: sendResponse.line,
          });
        });
      });
      return {};
    } else {
      status = "ok";
      // dataToPush.status is already 'ok'
      sendUserInfoName(async (sendResponse) => {
        // Changed: Use database().ref() and .push()
        await database.ref("checklists/").push({
          ...dataToPush,
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
export const loginUser = async ({ email, password }) => {
  try {
    // 3. Fonksiyonu modüler stilde kullanın: method(auth, ...)
    await signInWithEmailAndPassword(auth, email, password);

    // checkPermission(); // Bu fonksiyonun da çalıştığından emin olun
    return {};
  } catch (error) {
    // Hata kodlarınız modüler API ile uyumludur, burası doğru.
    switch (error.code) {
      case "auth/invalid-email":
        return {
          error: "E-mail format hatası.",
        };
      case "auth/user-not-found":
      case "auth/wrong-password":
        return {
          error: "Hatalı kullanıcı adı veya şifre.",
        };
      case "auth/user-disabled":
        return {
          error: "Kullanıcı Pasif Durumdadır.",
        };

      case "auth/too-many-requests":
        return {
          error: "Çok fazla hatalı deneme!",
        };
      case "auth/invalid-credential":
        // Bu hata kodu (invalid-credential) genellikle daha yeni sürümlerde
        // 'user-not-found' ve 'wrong-password' yerine kullanılır.
        return {
          error: "Mail ya da şifrenizi kontrol ediniz",
        };
      default:
        console.error("Login Error: ", error); // Geliştirme için hatayı loglayın
        return {
          error: "Bir hata ile karşılaşıldı",
        };
    }
  }
};

//-----------------*******************-----------------*******************-----------------*******************
export const sendCredit = async () => {
  let credit = [];

  // Note: The original function would have returned `[]` before
  // the database call finished. This version assumes `sendUserInfo`'s
  // callback is async and waits for the database call.
  await sendUserInfo(async (responsed) => {
    // Changed: Chained query methods and use database()
    const q = database
      .ref("0")
      .orderByChild("MailAdd")
      .equalTo(responsed.uemail);

    // Changed: Use await with .once('value') instead of .get().then()
    const snapshot = await q.once("value");

    snapshot.forEach((childSnap) => {
      credit.push({ credit: childSnap.val().Credit });
    });
  });

  // This now returns the credit *after* the await sendUserInfo is complete
  return credit;
};

//-----------------*******************-----------------*******************-----------------*******************
export const getLineTrackAuth = async (callback) => {
  let LineTracking;
  await sendUserInfo((responsed) => {
    // Changed: Chained query methods and use database()
    const q = database
      .ref("0/")
      .orderByChild("MailAdd")
      .equalTo(responsed.uemail);

    // Changed: Use .once('value') instead of .get()
    q.once("value").then(async (snapshot) => {
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
export const getTitleStatus = async (callback) => {
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

  await sendUserInfo(async (response) => {
    // Changed: Chained query methods and use database()
    const q = database
      .ref("TST_Award/UserCapacity/")
      .orderByChild("mail")
      .equalTo(response.uemail);

    // Changed: Use await with .once('value') for cleaner async code
    const snapshot = await q.once("value");

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
};
//-----------------*******************-----------------*******************-----------------*******************

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
    // Changed: Use auth() instance
    var user = auth.currentUser;
    var uid = null;
    var uemail = null;

    if (user) {
      uid = user.uid;
      uemail = user.email;
    }

    // Changed: Replaced Timestamp.now() and convertTimestamp with new Date()
    var today = new Date();
    var todayFull = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var hours = String(today.getHours()).padStart(2, "0");
    var min = String(today.getMinutes()).padStart(2, "0");
    var sec = String(today.getSeconds()).padStart(2, "0");
    var yyyy = today.getFullYear();
    today = mm + "-" + dd + "-" + yyyy;
    todayFull =
      hours + ":" + min + ":" + sec + "  " + dd + "-" + mm + "-" + yyyy;

    await sendUserInfoName(async (sendResponse) => {
      // --- ELSE Block ---
      // Changed: Use database().ref().push()
      database.ref(`SafetyResult/${yyyy}_${mm}/`).push({
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

      await sendUserInfo(async (responsed) => {
        // Changed: Chained query and ref
        const q = database
          .ref(`SafetyPivot/${yyyy}_${mm}/`)
          .orderByChild("fromMail")
          .equalTo(responsed.uemail.toUpperCase())
          .limitToLast(1);

        // Changed: Use await q.once('value')
        const snapshot = await q.once("value");
        if (snapshot.exists()) {
          const val = snapshot.val();
          if (val) {
            snapshot.forEach(function (childSnap) {
              // Changed: Use database().ref().update()
              database
                .ref(`SafetyPivot/${yyyy}_${mm}/${childSnap.key}`)
                .update({
                  totalPoint: childSnap.val().totalPoint + totalPoint,
                  totalDay: childSnap.val().totalDay + 1,
                });
              return true;
            });
            return true;
          }
        } else {
          // Changed: Use database().ref().push()
          database.ref(`SafetyPivot/${yyyy}_${mm}/`).push({
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

      await sendUserInfoName(async (responsed) => {
        // Changed: Chained query and ref
        const g = database
          .ref("SafetyPivotTotal/")
          .orderByChild("SicilNo")
          .equalTo(responsed.empSicil)
          .limitToLast(1);

        // Changed: Use await g.once('value')
        const snapshot = await g.once("value");
        if (snapshot.exists()) {
          const val = snapshot.val();
          if (val) {
            snapshot.forEach((childes) => {
              // Changed: Use database().ref().update()
              database
                .ref(`SafetyPivotTotal/${childes.val().SicilNo}/`)
                .update({
                  TotalPoint: childes.val().TotalPoint + totalPoint,
                  NoCardPoints: childes.val().NoCardPoints + totalPoint,
                });
            });
          }
        } else {
          // Changed: Use database().ref().update()
          database
            .ref(`SafetyPivotTotal/${sendResponse.empSicil}/`)
            .update({
              MailAdd: uemail,
              searchCondit: uemail + today,
              AdSoyad: sendResponse.uname,
              SicilNo: sendResponse.empSicil,
              TCNo: sendResponse.empSicil,
              Line: sendResponse.line,
              TotalPoint: totalPoint,
              NoCardPoints: totalPoint,
            })
            .catch((err) => console.warn(err));
        }
      });
    });

    return {};
  } catch (error) {
    return {
      error: error.code,
    };
  }
};
export const getServerDateHttp = async () => {
  try {
    const res = await axios.get(
      "https://tstapp.poscoassan.com.tr:8443/Mobile/getTime",
      {
        headers: {
          "Content-type": "application/json",
          "auth-token": REACT_APP_SECRET_KEY,
        },
        timeout: 2500,
      },
    );
    return res?.data?.time ? moment(res.data.time) : m.toDate();
  } catch (error) {
    let today = new Date(Date.now());
    let mm = String(today.getMonth() + 1).padStart(2, "0");
    let yyyy = today.getFullYear();
    let dd = String(today.getDate()).padStart(2, "0");
    today = mm + "-" + dd + "-" + yyyy;

    return today;
  }
};

export const getListeStatus = async (callback) => {
  var isseqId = 100;
  var isTotalPoint = 0;
  var checked = false;

  // Changed: Replaced Timestamp.now() and convertTimestamp with new Date()
  let today = new Date(Date.now());
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  var dd = String(today.getDate()).padStart(2, "0");
  today = mm + "-" + dd + "-" + yyyy;

  const m = await getServerDateHttp();

  // const todayDefault = m ? m : today;
  const todayDefault = today;

  const [mmDefault, ddDefault, yyyyDefault] = todayDefault
    ? todayDefault.split("-")
    : today.split("-");
  let lister = [];

  await sendUserInfoName(async (sendResponse) => {
    // --- ELSE Path ---

    const safetyResultRef = database.ref(
      `SafetyResult/${yyyyDefault}_${mmDefault}`,
    );

    const safetyResultSnapshot = await safetyResultRef.once("value");

    safetyResultSnapshot.forEach((childes) => {
      if (
        sendResponse.uname === childes.val().fromUname &&
        todayDefault === childes.val().relatedDate
      ) {
        checked = true;
      }
    });

    // Changed: De-nested and used `await .once('value')`
    const safetyPivotRef = database.ref(
      `SafetyPivot/${yyyyDefault}_${mmDefault}/`,
    );
    const safetyPivotSnapshot = await safetyPivotRef.once("value");

    if (lister.length > 0) {
      lister = [];
    }
    safetyPivotSnapshot.forEach((childed) => {
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
        (obj) => obj.val().fromMail === sendResponse.uemail,
      );
      if (isseqId < 0) {
        isTotalPoint = 0;
      } else {
        isTotalPoint =
          lister[
            lister.findIndex(
              (obj) => obj.val().fromMail === sendResponse.uemail,
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
};

export const InsertNewRecordSafetyFirstApplication2 = async (callback) => {
  try {
    // Changed: Use auth() instance

    var user = auth.currentUser;
    var uid = null;
    var uemail = null;

    if (user) {
      uid = user.uid;
      uemail = user.email;
    }

    // Changed: Replaced Timestamp.now() and convertTimestamp with new Date()
    var today = new Date();
    var todayFull = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var hours = String(today.getHours()).padStart(2, "0");
    var min = String(today.getMinutes()).padStart(2, "0");
    var sec = String(today.getSeconds()).padStart(2, "0");
    var yyyy = today.getFullYear();
    today = mm + "-" + dd + "-" + yyyy;
    todayFull =
      hours + ":" + min + ":" + sec + "  " + dd + "-" + mm + "-" + yyyy;

    await sendUserInfoName(async (sendResponse) => {
      if (sendResponse.line == "TNPC") {
        // Changed: Use database().ref().push()
        database.ref(`SafetyResultTNPC/${yyyy}_${mm}/`).push({
          relatedDate: today,
          insertedDateTime: todayFull,
          fromMail: uemail,
          fromUid: uid,
          searchCondit: uemail + today,
          fromUname: sendResponse.uname,
          fromSicilNo: sendResponse.empSicil,
          fromLine: sendResponse.line,
        });

        await sendUserInfo(async (responsed) => {
          // Changed: Chained query and ref
          const q = database
            .ref(`SafetyPivotTNPC/${yyyy}_${mm}`)
            .orderByChild("fromMail")
            .equalTo(responsed.uemail.toUpperCase())
            .limitToLast(1);

          // Changed: Use await .once('value') instead of .get().then()
          const snapshot = await q.once("value");

          // Changed: .exists() is safer than .numChildren() > 0
          if (snapshot.exists()) {
            snapshot.forEach(function (childSnap) {
              // childSnap.ref is compatible and works
              childSnap.ref.update({
                totalPoint: childSnap.val().totalPoint + 0,
                totalDay: childSnap.val().totalDay,
              });
              return true;
            });
            return true;
          } else {
            // Changed: Use database().ref().push()
            database.ref(`SafetyPivotTNPC/${yyyy}_${mm}/`).push({
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
      } else {
        // --- ELSE Block ---
        // Changed: Use database().ref().push()
        database.ref(`SafetyResult/${yyyy}_${mm}/`).push({
          relatedDate: today,
          insertedDateTime: todayFull,
          fromMail: uemail,
          fromUid: uid,
          searchCondit: uemail + today,
          fromUname: sendResponse.uname,
          fromSicilNo: sendResponse.empSicil,
          fromLine: sendResponse.line,
        });

        await sendUserInfo(async (responsed) => {
          // Changed: Chained query and ref
          const q = database
            .ref(`SafetyPivot/${yyyy}_${mm}`)
            .orderByChild("fromMail")
            .equalTo(responsed.uemail.toUpperCase())
            .limitToLast(1);

          // Changed: Use await .once('value')
          const snapshot = await q.once("value");

          // Changed: .exists() is safer
          if (snapshot.exists()) {
            snapshot.forEach(function (childSnap) {
              childSnap.ref.update({
                totalPoint: childSnap.val().totalPoint + 0,
                totalDay: childSnap.val().totalDay,
              });
              return true;
            });
            return true;
          } else {
            // Changed: Use database().ref().push()
            database.ref(`SafetyPivot/${yyyy}_${mm}/`).push({
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
    // Changed: Use auth() instance
    var user = auth.currentUser;
    var uid = null;
    var uemail = null;

    if (user) {
      uid = user.uid;
      uemail = user.email;
    }

    // Changed: Replaced Timestamp.now() and convertTimestamp with new Date()
    var today = new Date();
    var todayFull = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var hours = String(today.getHours()).padStart(2, "0");
    var min = String(today.getMinutes()).padStart(2, "0");
    var sec = String(today.getSeconds()).padStart(2, "0");
    var yyyy = today.getFullYear();
    today = mm + "-" + dd + "-" + yyyy;
    todayFull =
      hours + ":" + min + ":" + sec + "  " + dd + "-" + mm + "-" + yyyy;

    sendUserInfoName(async (sendResponse) => {
      const renderName = "SafetyRuleResult/TST/";

      // Changed: Use database().ref().update()
      await database
        .ref(
          `${renderName}${yyyy}_${mm}_${dd}/${sendResponse.empSicil}/${appHead}/`,
        )
        .update({
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
        });
    });
    return {};
  } catch (error) {
    return {
      error: error.code,
    };
  }
};

export const getTotalPoint2 = async (callback) => {
  sendUserInfoName((sendResponse) => {
    // Determine the correct path based on the line
    const refPath =
      sendResponse.line == "TNPC"
        ? "SafetyPivotTotalTNPC/"
        : "SafetyPivotTotal/";

    // Changed: Use database().ref().on('value', ...) to set up a listener
    database.ref(refPath).once("value", (snapshot) => {
      let isTotalPoint = 0; // Reset on each update

      snapshot.forEach((childes) => {
        if (sendResponse.empSicil === childes.val().SicilNo) {
          isTotalPoint = childes.val().TotalPoint;
        }
      });

      callback({
        isTotalPoint: isTotalPoint,
      });
    });
  });
};

//-----------------*******************-----------------*******************-----------------*******************
