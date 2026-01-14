import { View, Text, StyleSheet, ScrollView, Linking } from "react-native";
import { TextInput } from "react-native-paper";
import { useEffect, useState } from "react";
import {
  Button,
  Radio,
  RadioGroup,
  CheckBox,
  Icon,
} from "@ui-kitten/components";
import axios from "axios";
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from "react-native-vision-camera";
import { REACT_APP_SECRET_KEY } from "@env";
const Checklist = () => {
  const [permission, setPermission] = useState(false);
  const [questionList, setQuestionList] = useState([]);
  const [scan, setScan] = useState(false);
  const [scanResult, setScanResult] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [qrValue, setQrValue] = useState("");
  const [isActive, setIsActive] = useState(true);
  const device = useCameraDevice("back");
  const [checked, setChecked] = useState(false);

  const handleAnswerChange = (questionId, value) => {
    setFormValues((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };
  const [formValues, setFormValues] = useState({});
  const onSubmit = () => {
    console.warn(formValues, questionList[0].AreaID);
  };
  const codeScannner = useCodeScanner({
    codeTypes: [
      "qr",
      "ean-13",
      "ean-8",
      "code-128",
      "code-39",
      "code-93",
      "upc-e",
      "upc-a",
      "codabar",
      "data-matrix",
      "itf",
    ],
    onCodeScanned: (codes) => {
      setModalVisible(true);
      setQrValue(codes[0]?.value);

      getQuestionList();
      setIsActive(false);

      setScan(false);
      setScanResult(true);
    },
    requestCameraPermission: true,
  });

  const getQuestionList = async () => {
    await axios
      .get(
        "https://tstapp.poscoassan.com.tr:8443/WorkOrder/GetChecklistQuestion/10",
        {
          headers: {
            "auth-token": REACT_APP_SECRET_KEY,
          },
        }
      )
      .then((res) => {
        if (res.data) {
          setQuestionList(res.data);
        } else {
          alert("Veri Bulunamadı.");
          setQuestionList([]);
        }
      });
  };

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermission();

      if (cameraPermission === "granted") {
        setPermission(true);
        // Küçük delay ile başlat (bazı cihazlarda gerekli)
        setTimeout(() => setScan(true), 400);
      } else {
        Linking.openSettings();
      }
    })();
  }, []);

  if (!device || !permission) {
    return (
      <Text onPress={() => Linking.openSettings()}>
        Lütfen kameraya izin verin ve cihazın hazır olduğundan emin olun. İzin
        vermek için tıklayınız.
      </Text>
    );
  }

  return (
    <View style={styles.view}>
      <View style={{ flex: 1, width: "100%", height: "100%" }}>
        <Camera
          style={StyleSheet.absoluteFill}
          codeScanner={codeScannner}
          device={device}
          isActive={isActive}
        />
      </View>
      {modalVisible && (
        <ScrollView
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,

            backgroundColor: "white",
          }}
        >
          <Text style={styles.textCenter}>{questionList[0]?.AreaName} </Text>

          {questionList.map((item) => {
            const answers = Object.entries(item)
              .filter(
                ([key, value]) => key.includes("Answer") && value !== null
              )
              .map(([key, value]) => ({ key, value }));

            return (
              <View key={item.ID}>
                {(item.Type === 1 || item.Type === 2) && (
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "column",
                      marginHorizontal: 10,
                    }}
                  >
                    <Text style={{ textAlign: "justify", fontSize: 13 }}>
                      {item.Question}
                    </Text>
                    <RadioGroup
                      selectedIndex={
                        formValues[item.ID] !== undefined
                          ? answers.findIndex(
                              (ans) => ans.value === formValues[item.ID]
                            )
                          : null
                      }
                      onChange={(index) =>
                        handleAnswerChange(item.ID, answers[index].value)
                      }
                      style={styles.radio}
                    >
                      {answers.map((ans) => (
                        <Radio key={ans.key}>{ans.value}</Radio>
                      ))}
                    </RadioGroup>
                    <View
                      style={{
                        flex: 1,
                        marginBottom: 4,
                        flexDirection: "row",
                        alignItems: "flex-end",
                      }}
                    >
                      <Text style={{ marginRight: 10 }}> Not Gerekli mi?</Text>
                      <CheckBox
                        checked={checked}
                        onChange={(nextChecked) => setChecked(nextChecked)}
                        style={{ paddingVertical: 2 }}
                        accessoryLeft={(props) => (
                          <Icon
                            {...props}
                            name="checkmark-square-2"
                            style={{ width: 14, height: 14 }}
                          />
                        )}
                      ></CheckBox>
                    </View>

                    <View
                      style={{
                        borderBottomWidth: 0.5,
                        borderBottomColor: "#cacaca",
                        marginBottom: 5,
                      }}
                    />
                  </View>
                )}

                {(item.Type === 3 || item.Type === 4) && (
                  <TextInput
                    key={item.ID}
                    style={styles.input}
                    value={formValues[item.ID] || ""}
                    onChangeText={(text) => handleAnswerChange(item.ID, text)}
                    right={<TextInput.Affix text={item.Uom} />}
                    label={item.Question}
                    keyboardType={item.Type === 3 ? "numeric" : "default"}
                  />
                )}
              </View>
            );
          })}
          {questionList.length > 0 ? (
            <View
              style={{
                marginBottom: 20,
                marginHorizontal: 50,
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowOffset: { width: 0, height: 4 },
                shadowRadius: 6,
                elevation: 4,
              }}
            >
              <Button
                style={{
                  marginVertical: 10,
                  marginHorizontal: 50,
                  borderRadius: 10,
                  paddingVertical: 12,
                  borderWidth: 1.5,
                  borderColor: "#1e3d9aff",
                  backgroundColor: "#1e3d9aff",
                }}
                status="info"
                appearance="filled"
                onPress={onSubmit}
              >
                Checklisti Tamamla
              </Button>
            </View>
          ) : (
            <View>
              <Text style={styles.textCenter}>İlgili Alan Bulunamadı</Text>
              <Button
                style={{
                  marginBottom: 20,
                  marginHorizontal: 50,
                  borderRadius: 12,
                  paddingVertical: 12,
                }}
                status="primary"
                appearance="filled"
                onPress={() => {
                  setIsActive(true);
                  setModalVisible(false);
                }}
              >
                Tekrar Okut
              </Button>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: "white",
  },
  textCenter: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "white",
    marginVertical: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  radio: {
    flex: 1,
    flexDirection: "row",
    margin: 1,
    padding: 10,
  },
});
export default Checklist;
