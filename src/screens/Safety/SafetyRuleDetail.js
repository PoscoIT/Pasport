import React, {memo, useEffect, useMemo, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  FlatList,
  ActivityIndicator, TouchableOpacity,
} from 'react-native';
import 'firebase/auth';
import Background_Green from '../../components/BackgroundGradient';
import {Dimensions, Platform} from 'react-native';
import {Card, Paragraph, Avatar, List} from 'react-native-paper';
import {Toggle} from '@ui-kitten/components';
import Button from '../../components/Button';
import {InsertSafetyRuleCheck, sendUserInfoName} from '../../api/auth-api';
import {getAuth} from 'firebase/auth';
import {
  getDatabase,
  limitToFirst,
  limitToLast,
  onValue,
  orderByChild,
  query,
  ref,
  update,
} from 'firebase/database';
import firebaseDB from '../../database/firebaseDB';
import VideoModal from '../../components/VideoModal';
import {t} from "i18next";

const Separator = () => <View style={styles.separator} />;

let width = Dimensions.get('window').width; //full width
let height = Dimensions.get('window').height; //full width

const SafetyRuleDetail = ({route: {params}, navigation}) => {
  const db = getDatabase(firebaseDB);
  const auth = getAuth();
  let user = auth.currentUser;
  const isUserPoscoAssanUser = user.email.includes('@poscoassan.com');

  const [poscoAssanAccidentDate, setPoscoAssanAccidentDate] =
    useState('2020-11-13');
  const [poscoTnpcAccidentDate, setPoscoTnpcAccidentDate] =
    useState('2022-09-05');

  let d1 = new Date(
    isUserPoscoAssanUser ? poscoAssanAccidentDate : poscoTnpcAccidentDate,
  );
  let t1 = d1.getTime();
  let d2 = new Date();
  let t2 = d2.getTime();
  let lastInDate = parseInt((t2 - t1) / (24 * 3600 * 1000));
  let today = new Date();

  let date =
    ('0' + today.getDate()).slice(-2) +
    '.' +
    ('0' + (today.getMonth() + 1)).slice(-2) +
    '.' +
    today.getFullYear();
  const [listeMulti, setListeMulti] = useState([]);
  const [listeMulti2, setListeMulti2] = useState([]);
  const [ListeSemihMulti, setListeSemihMulti] = useState([]);
  const [loading, setLoading] = useState(false);
  const [firebaseData, setFirebaseDataData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [initial, setInitial] = useState(0);
  const [finalInitial, setFinalInitial] = useState(2);
  const [firstInitial, setFirstInitial] = useState(0);
  const [limit, setLimit] = useState(1);
  let liMulti = [];
  const imageSize = Dimensions.get('window').width / 2 - 15;

  if (user) {
    if (user != null) {
      var uid = user.uid;
      var uid = user.uid;
      var uemail = user.email;
    }
  }
  let todayFull = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0');
  let hours = String(today.getHours()).padStart(2, '0');
  let min = String(today.getMinutes()).padStart(2, '0');
  let sec = String(today.getSeconds()).padStart(2, '0');
  let yyyy = today.getFullYear();
  today = mm + '-' + dd + '-' + yyyy;
  todayFull = hours + ':' + min + ':' + sec + '  ' + dd + '-' + mm + '-' + yyyy;

  const getAccidentDate = async () => {
    onValue(ref(db, 'tstapp/'), snapshot => {
      const {version} = snapshot.val();
      setPoscoAssanAccidentDate(version.AccidentDate);
      setPoscoTnpcAccidentDate(version.AccidentDate_Tnpc);
    });
  };

  sendUserInfoName(async sendResponse => {
    const dbSafetyDb = isUserPoscoAssanUser ? 'SafetyDB/' : 'SafetyDBTnpc/';
    await update(
      ref(
        db,
        dbSafetyDb +
          yyyy +
          '_' +
          mm +
          '_' +
          dd +
          '/' +
          sendResponse.empSicil +
          '/' +
          params.appHead,
      ),
      {
        relatedDate: today,
        insertedDateTime: todayFull,
        fromMail: uemail,
        fromUid: uid,
        searchCondit: uemail + today,
        fromUname: sendResponse.uname,
        fromSicilNo: sendResponse.empSicil,
        fromLine: sendResponse.line,
        page: 'SafetyDashBoard',
        appHead: params.appHead,
      },
    );
  });

  sendUserInfoName(async sendResponse => {
    const dbSafetyDb2 = isUserPoscoAssanUser ? 'SafetyDB2/' : 'SafetyDB2Tnpc/';
    await update(
      ref(
        db,
        dbSafetyDb2 +
          yyyy +
          '_' +
          mm +
          '_' +
          dd +
          '/' +
          params.appHead +
          '/' +
          sendResponse.empSicil,
      ),
      {
        relatedDate: today,
        insertedDateTime: todayFull,
        fromMail: uemail,
        fromUid: uid,
        searchCondit: uemail + today,
        fromUname: sendResponse.uname,
        fromSicilNo: sendResponse.empSicil,
        fromLine: sendResponse.line,
        page: 'SafetyDashBoard',
        appHead: params.appHead,
      },
    );
  });

  const imageStyle = {
    width: imageSize,
    height: height / 10,
    padding: 4,
    margin: 4,
    flexDirection: 'row',
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    backgroundColor: 'rgba(179,211,215,0.49)',
    flex: 1,
  };

  const insertSafetyRule = async () => {
    if (loading) {
      return;
    }
    setLoading(true);

    if (listeMulti.Content0 !== undefined && listeMulti.Content0 !== '') {
      if (ListeSemihMulti != null) {
        if (listeMulti.Content0 != '') {
          if (ListeSemihMulti.ch0 != undefined) {
            if (ListeSemihMulti.ch0 != true) {
              alert('1. Checklisti doldurmanız gerekiyor!');
              setLoading(false);
              return;
            }
          } else {
            alert('1. Checklisti doldurmanız gerekiyor!');
            setLoading(false);
            return;
          }
        }
        if (listeMulti.Content1 != '') {
          if (ListeSemihMulti.ch1 != undefined) {
            if (ListeSemihMulti.ch1 != true) {
              alert('2. Checklisti doldurmanız gerekiyor!');
              setLoading(false);
              return;
            }
          } else {
            alert('2. Checklisti doldurmanız gerekiyor!');
            setLoading(false);
            return;
          }
        }
        if (listeMulti.Content2 != '') {
          if (ListeSemihMulti.ch2 != undefined) {
            if (ListeSemihMulti.ch2 != true) {
              alert('3. Checklisti doldurmanız gerekiyor!');
              setLoading(false);
              return;
            }
          } else {
            alert('3. Checklisti doldurmanız gerekiyor!');
            setLoading(false);
            return;
          }
        }
        if (listeMulti.Content3 != '') {
          if (ListeSemihMulti.ch3 != undefined) {
            if (ListeSemihMulti.ch3 != true) {
              alert('4. Checklisti doldurmanız gerekiyor!');
              setLoading(false);
              return;
            }
          } else {
            alert('4. Checklisti doldurmanız gerekiyor!');
            setLoading(false);
            return;
          }
        }
        if (listeMulti.Content4 != '') {
          if (ListeSemihMulti.ch4 != undefined) {
            if (ListeSemihMulti.ch4 != true) {
              alert('5. Checklisti doldurmanız gerekiyor!');
              setLoading(false);
              return;
            }
          } else {
            alert('5. Checklisti doldurmanız gerekiyor!');
            setLoading(false);
            return;
          }
        }
        if (listeMulti.Content5 != '') {
          if (ListeSemihMulti.ch5 != undefined) {
            if (ListeSemihMulti.ch5 != true) {
              alert('6. Checklisti doldurmanız gerekiyor!');
              setLoading(false);
              return;
            }
          } else {
            alert('6. Checklisti doldurmanız gerekiyor!');
            setLoading(false);
            return;
          }
        }
        if (listeMulti.Content6 != '') {
          if (ListeSemihMulti.ch6 != undefined) {
            if (ListeSemihMulti.ch6 != true) {
              alert('7. Checklisti doldurmanız gerekiyor!');
              setLoading(false);
              return;
            }
          } else {
            alert('7. Checklisti doldurmanız gerekiyor!');
            setLoading(false);
            return;
          }
        }
        if (listeMulti.Content7 != '') {
          if (ListeSemihMulti.ch7 != undefined) {
            if (ListeSemihMulti.ch7 != true) {
              alert('8. Checklisti doldurmanız gerekiyor!');
              setLoading(false);
              return;
            }
          } else {
            alert('8. Checklisti doldurmanız gerekiyor!');
            setLoading(false);
            return;
          }
        }
        if (listeMulti.Content8 != '') {
          if (ListeSemihMulti.ch8 != undefined) {
            if (ListeSemihMulti.ch8 != true) {
              alert('9. Checklisti doldurmanız gerekiyor!');
              setLoading(false);
              return;
            }
          } else {
            alert('9. Checklisti doldurmanız gerekiyor!');
            setLoading(false);
            return;
          }
        }
        if (listeMulti.Content9 != '') {
          if (ListeSemihMulti.ch9 != undefined) {
            if (ListeSemihMulti.ch9 != true) {
              alert('10. Checklisti doldurmanız gerekiyor!');
              setLoading(false);
              return;
            }
          } else {
            alert('10. Checklisti doldurmanız gerekiyor!');
            setLoading(false);
            return;
          }
        }
      } else {
        alert('Checklisti doldurmanız gerekiyor!');
        setLoading(false);
        return;
      }
    }

    const response = await InsertSafetyRuleCheck({
      ch0:
        listeMulti.Content0 !== undefined && listeMulti.Content0 !== ''
          ? ListeSemihMulti != undefined
            ? ListeSemihMulti.ch0 != undefined
              ? ListeSemihMulti.ch0
              : false
            : false
          : 'Not Found',
      ch1:
        listeMulti.Content1 !== undefined && listeMulti.Content1 !== ''
          ? ListeSemihMulti != undefined
            ? ListeSemihMulti.ch1 != undefined
              ? ListeSemihMulti.ch1
              : false
            : false
          : 'Not Found',
      ch2:
        listeMulti.Content2 !== undefined && listeMulti.Content2 !== ''
          ? ListeSemihMulti != undefined
            ? ListeSemihMulti.ch2 != undefined
              ? ListeSemihMulti.ch2
              : false
            : false
          : 'Not Found',
      ch3:
        listeMulti.Content3 !== undefined && listeMulti.Content3 !== ''
          ? ListeSemihMulti != undefined
            ? ListeSemihMulti.ch3 != undefined
              ? ListeSemihMulti.ch3
              : false
            : false
          : 'Not Found',
      ch4:
        listeMulti.Content4 !== undefined && listeMulti.Content4 !== ''
          ? ListeSemihMulti != undefined
            ? ListeSemihMulti.ch4 != undefined
              ? ListeSemihMulti.ch4
              : false
            : false
          : 'Not Found',
      ch5:
        listeMulti.Content5 !== undefined && listeMulti.Content5 !== ''
          ? ListeSemihMulti != undefined
            ? ListeSemihMulti.ch5 != undefined
              ? ListeSemihMulti.ch5
              : false
            : false
          : 'Not Found',
      ch6:
        listeMulti.Content6 !== undefined && listeMulti.Content6 !== ''
          ? ListeSemihMulti != undefined
            ? ListeSemihMulti.ch6 != undefined
              ? ListeSemihMulti.ch6
              : false
            : false
          : 'Not Found',
      ch7:
        listeMulti.Content7 !== undefined && listeMulti.Content7 !== ''
          ? ListeSemihMulti != undefined
            ? ListeSemihMulti.ch7 != undefined
              ? ListeSemihMulti.ch7
              : false
            : false
          : 'Not Found',
      ch8:
        listeMulti.Content8 !== undefined && listeMulti.Content8 !== ''
          ? ListeSemihMulti != undefined
            ? ListeSemihMulti.ch8 != undefined
              ? ListeSemihMulti.ch8
              : false
            : false
          : 'Not Found',
      ch9:
        listeMulti.Content9 !== undefined && listeMulti.Content9 !== ''
          ? ListeSemihMulti != undefined
            ? ListeSemihMulti.ch9 != undefined
              ? ListeSemihMulti.ch9
              : false
            : false
          : 'Not Found',
      appHead: params.appHead,
      appDate: params.appDate,
      endDate: today,
    });
    if (response.error) {
      setError(response.error);
    } else {
      alert('Kayıt başarılı.');
    }
    setLoading(false);
    navigation.navigate('SafetyRules');
  };

  const getQuestions = async () => {
    var today = new Date();
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var dd = String(today.getDate()).padStart(2, '0');
    var yyyy = today.getFullYear();
    if (loading) {
      return;
    }
    setLoading(true);
    const dbNameSafetyRules = isUserPoscoAssanUser
      ? 'SafetyRules/'
      : 'SafetyRulesTNPC/';
    const dbSafetyRuleResult = isUserPoscoAssanUser
      ? 'SafetyRuleResult/TST/'
      : 'SafetyRuleResult/TNPC/';
    await onValue(
      query(ref(db, dbNameSafetyRules + params.appHead)),
      snapshot => {
        snapshot = snapshot.val();
        setListeMulti(snapshot);
        let objectValue = Object.entries(snapshot);
        setFirebaseDataData(objectValue);

        objectValue
          .filter(([key, value]) => key.includes('Content'))
          .slice(firstInitial, finalInitial)
          .map((item, index) => {
            const {insertDate, summary, summaryColor, titleColor, uriList} =
              item[1];
            let uriList2 = uriList?.split(',');

            uriList2?.map((item, index2) => {
              liMulti.push({
                insertDate: insertDate,
                summary: summary,
                summaryColor: summaryColor,
                titleColor: titleColor,
                source: {
                  uri: item,
                },
              });
            });
          });
        setListeMulti2(liMulti);

        sendUserInfoName(async sendResponse => {
          await onValue(
            ref(
              db,
              dbSafetyRuleResult +
                yyyy +
                '_' +
                mm +
                '_' +
                dd +
                '/' +
                sendResponse.empSicil +
                '/' +
                params.appHead +
                '/',
            ),
            snapshote => {
              snapshote = snapshote.val();
              setListeSemihMulti(snapshote);
              setLoading(false);
              return loading;
            },
          );
        });
      },
    );
  };

  useEffect(() => {
    getQuestions().then(async () => {
      setLoading(false);
    });
    return () => {};
  }, [finalInitial, firstInitial]);

  useEffect(() => {
    getAccidentDate();
  }, []);

  return (

    <Background_Green>
      <ScrollView nestedScrollEnabled={true}>


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
                      fontWeight: '600',
                      fontSize: width / 22,
                      padding: 5,
                    }}>
                    {t("general.passingTime")}:
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
            <Text style={styles.mehmetFatih}>{listeMulti.Name}</Text>
            <Separator />

            {params.appHead == 9 && (
                <View>
                  {firebaseData
                      .filter(([key, value]) => key.includes('Content'))
                      .filter(item => item[1] !== '')
                      .map((item, index) =>
                          firebaseData
                              .filter(([keys, value]) => keys.includes('Title' + index))
                              .filter(items => items[1] !== '')
                              .map((items, indexs) => (
                                  <List.Item
                                      key={indexs}
                                      style={[styles.card, styles.elevation]}
                                      title={listeMulti.Name}
                                      description={items[1]}
                                      onPress={() => {
                                        navigation.navigate('SafetyVideo',{data:item[1],title:items[1],itemId:items})
                                      }}

                                  />
                              )),
                      )}
                </View>
            )}


            {params.appHead == 8 && (
                <View>

                  <ScrollView showsVerticalScrollIndicator={false}>
                    {firebaseData
                        .filter(([key, value]) => key.includes('Content')).sort((a,b)=>Date.parse(b[1].insertDate)-Date.parse(a[1].insertDate))
                        .map((item, index) => {
                          return(<View key={index} style={styles.photoContainer}>
                            {item
                                .filter(item => item.uriList)

                                .map((cat, indexed) => {
                                  return(
                                    <List.Item
                                        key={indexed}
                                        style={[styles.card, styles.elevation]}
                                        title={cat.summary}
                                        description={new Date(cat?.insertDate)?.toLocaleDateString("tr")}
                                        onPress={() => {
                                          navigation.navigate('SafetyImage', {data: cat, itemId: index})
                                        }}

                                    />

                                )})}
                          </View>)
                        })}
                  </ScrollView>
                </View>)}



                {/* <ScrollView showsVerticalScrollIndicator={false}>
                  {firebaseData
                    .filter(([key, value]) => key.includes('Content'))

                    .map((item, index) => (
                      <View key={index} style={styles.photoContainer}>
                        <Text>{item.source?.uri}</Text>
                        {item
                          .filter(item2 => item2.source?.uri)
                          .sort((a, b) => {
                            if (a.insertDate < b.insertDate) { return -1; }
                            if (a.insertDate > b.insertDate) { return 1; }
                            return 0;
                          })
                          .map((cat, indexed) => (
                            <List.Item
                              key={indexed}
                              style={[styles.card, styles.elevation]}
                              title={cat.summary}
                              description={new Date(
                                cat?.insertDate,
                              )?.toLocaleDateString('tr')}
                              onPress={() => {
                                setVisible(true);
                                setInitial(index);
                              }}
                              left={props => (
                                <List.Icon {...props} icon="image" />
                              )}
                            />
                          ))}
                      </View>
                    ))}
                </ScrollView>*/}




            {params.appHead != 9 && params.appHead != 8 && (


                <View>

                  {firebaseData
                    .filter(([key, value]) => key.includes('Content'))
                    .filter(item => item[1] !== '')
                    .map((item, index) => (
                      <View style={styles.containerCheck} key={index}>
                        <View style={styles.ViewContainerLeft}>
                          <Text style={styles.mehmetFatih2}>⬤ {item[1]} </Text>
                        </View>
                        <View style={styles.ViewContainerRight}>
                          <Toggle
                            checked={
                              ListeSemihMulti == null
                                ? false
                                : ListeSemihMulti[`ch${index}`]
                            }
                            status={
                              (
                                ListeSemihMulti == null
                                  ? false
                                  : ListeSemihMulti[`ch${index}`]
                              )
                                ? 'success'
                                : 'danger'
                            }
                            onChange={isChecked => {
                              setListeSemihMulti({
                                ...ListeSemihMulti,
                                [`ch${index}`]: isChecked,
                              });
                            }}
                          />
                        </View>
                      </View>
                    ))}

                </View>



            )}


          </View>
          <Separator />
          {params.appHead != 9 && params.appHead != 8 && (
              <View style={{height: 120}}>
                <Paragraph />
                <Paragraph />
                {!loading && (
                    <Button mode="contained"  onPress={insertSafetyRule}>
                      {' '}
                      Sonucları Kaydet
                    </Button>
                )}
              </View>
          )}

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
    minHeight: Platform.OS === 'ios' ? height - 210 : height + 100,
    marginBottom: 40,
  },
  containerInside: {
    backgroundColor: 'transparent',
    width: width,
    alignItems: 'center',
    flex: 1,
  },
  cardStyle: {
    height: 130,
    width: width,
  },
  button: {
    borderRadius: 15,
    padding: 5,
    marginBottom: 10,
    shadowColor: '#303838',
    shadowOffset: {width: 0, height: 5},
    shadowRadius: 5,
    shadowOpacity: 0.85,
    height: 110,

    width: 110,
    elevation: 5,
  },
  containerInside2: {
    flex: 1,
    width: width,
  },
  card: {
    backgroundColor: 'rgba(216,228,232,0.85)',
    borderRadius: 2,
    paddingHorizontal: 25,
    width: '100%',
    paddingVertical: 10,
    borderBottomWidth:0.2

  },
  elevation: {
    elevation: 15,
    borderWidth: 0.1,
    shadowColor: 'transparent',
  },
  mehmetFatih: {
    flexWrap: 'wrap',
    textAlign: 'center',
    color: '#333',
    fontWeight: 'bold',
    fontSize: width / 20,
    padding: 10,
  },
  mehmetFatih2: {
    flexWrap: 'wrap',
    textAlign: 'left',
    color: '#333',
    fontWeight: 'bold',
    fontSize: width / 28,
    padding: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
  },
  mehmetFatih3: {
    flexWrap: 'wrap',
    textAlign: 'center',
    color: '#333',
    fontWeight: 'bold',
    fontSize: width / 20,
    padding: 10,
    width: width,
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
  containerCheck: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerCheck3: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  ViewContainerLeft: {
    flex: 18,
    width: '100%',
  },
  ViewContainerRight: {
    flex: 3,
    width: '100%',
    alignItems: 'center',
  },
  separator: {
    borderBottomColor: '#fff',
    borderWidth: 1,
    width: '100%',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  photoContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  h1: {
    padding: 40,
    textAlign: 'center',
    fontSize: 24,
  },
});

export default memo(SafetyRuleDetail);
