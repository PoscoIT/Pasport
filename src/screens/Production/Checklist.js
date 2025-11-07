import { View, Text, StyleSheet, ScrollView } from "react-native";
import { TextInput } from "react-native-paper";
import { useEffect, useState } from "react";
import { Button, Radio, RadioGroup } from "@ui-kitten/components";
import axios from "axios";
const Checklist = () => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [questionList, setQuestionList] = useState([]);

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

  const getQuestionList = async () => {
    await axios
      .get(
        "https://tstapp.poscoassan.com.tr:8443/WorkOrder/GetChecklistQuestion/10"
      )
      .then((res) => {
        if (res.data) {
          setQuestionList(res.data);
        } else {
          alert("Veri Bulunamadı.");
          setQuestionList([]);
        }
      })
      .catch((err) => alert("Bir hata Oluştu"));
  };

  useEffect(() => {
    getQuestionList();
  }, []);

  return (
    <ScrollView style={styles.view}>
      <Text style={styles.textCenter}>{questionList[0]?.AreaName} </Text>

      {questionList.map((item) => {
        const answers = Object.entries(item)
          .filter(([key, value]) => key.includes("Answer") && value !== null)
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
                keyboardType={item.Type === 4 ? "numeric" : "default"}
              />
            )}
          </View>
        );
      })}
      {questionList.length > 0 ? (
        <Button
          style={{ marginBottom: 20, marginHorizontal: 50 }}
          onPress={onSubmit}
        >
          Checklisti Tamamla
        </Button>
      ) : (
        <View>
          <Text style={styles.textCenter}>İlgili Alan Bulunamadı</Text>
          <Button style={{ marginBottom: 20, marginHorizontal: 50 }}>
            Tekrar Okut
          </Button>
        </View>
      )}
    </ScrollView>
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
    marginBottom: 10,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "white",
    margin: 6,
    fontSize: 13,
    borderWidth: 1,
    borderRadius: 5,
    padding: 2,
  },
  radio: {
    flex: 1,
    flexDirection: "row",
    margin: 1,
    padding: 10,
  },
});
export default Checklist;
