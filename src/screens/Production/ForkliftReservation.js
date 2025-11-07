import {
  View,
  Text,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import { Button, TextInput } from "react-native-paper";
import { t } from "i18next";
import { useEffect, useState } from "react";
import axios from "axios";
import { REACT_APP_SECRET_KEY } from "@env";
import { Input } from "@ui-kitten/components";
import PickerModal from "react-native-picker-modal-view";

let width = Dimensions.get("window").width; //full widthr

const ForkliftReservation = () => {
  const [employeeID, setEmployeeID] = useState("");
  const [usageDescription, setUsageDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [selectedForklift, setSelectedForklift] = useState("");
  const [selectedLine, setSelectedLine] = useState({});
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const newDate = new Date(new Date(date).setMinutes(date.getMinutes() + 15));
  const [date2, setDate2] = useState(newDate);
  const [open2, setOpen2] = useState(false);

  const [lineList, setLineList] = useState([]);
  const theme = {
    colors: {
      placeholder: "black",
      text: "black",
      primary: "#4a8a94",
      underlineColor: "transparent",
      background: "#fff",
    },
  };
  const getLineList = async () => {
    try {
      await axios
        .get(`${url}Common/ListSubTeamData`, {
          params: {
            TeamID: "30,33,21,12,21,23",
            ForISG: 1,
          },
          headers: {
            "auth-token": REACT_APP_SECRET_KEY,
          },
        })
        .then((res) => {
          setLineList(
            res.data?.map(
              (item) =>
                [
                  {
                    value: item.ID,
                    Name: item.NameTr,
                  },
                ][0]
            )
          );
        })
        .catch((t) => console.warn("selammm" + url));
    } catch (e) {
      setLineList([]);
    }
  };

  const forkliftList = [
    { Id: 1, Name: "1", Value: 1 },
    { Id: 2, Name: "2", Value: 2 },
  ];

  const handleEmployeeID = async () => {
    Keyboard.dismiss();
    if (employeeID.length !== 6) {
      alert("Please enter a valid employee ID");
    } else {
      await axios
        .get(
          `${url}/UserAccount/ListUserMainDepartment?EmployeeID=` + employeeID,
          {
            headers: {
              "auth-token": REACT_APP_SECRET_KEY,
            },
          }
        )
        .then((res) => {
          if (res.data.length > 0) {
            setName(res.data[0].NameSurname);
          } else {
            alert("Lütfen geçerli bir çalışan numarası giriniz");
          }
        });
    }
  };
  const onSubmit = () => {
    if (date >= date2) {
      Alert.alert("Başlangıç tarihi bitiş tarihinden küçük olmalıdır");
    }
  };
  useEffect(() => {
    getLineList();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "white" }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <TextInput
            theme={theme}
            onBlur={handleEmployeeID}
            onFocus={() => setName("")}
            style={{ backgroundColor: "#fff" }}
            value={employeeID}
            onChangeText={(text) => setEmployeeID(text)}
            name="employeeID"
            label={t("employeeID")}
          />
          {name !== "" && employeeID.length === 6 && (
            <Text style={{ margin: 10, fontWeight: "bold" }}>{name}</Text>
          )}
          <View style={{ marginTop: 15 }}>
            <PickerModal
              style={{ width: "100%", color: "black" }}
              Autocomplete={false}
              items={forkliftList}
              sortingLanguage={"tr"}
              showToTopButton={true}
              selected={selectedForklift}
              showAlphabeticalIndex={true}
              autoGenerateAlphabeticalIndex={true}
              selectPlaceholderText={<Text>{t("requestForklift")}</Text>}
              searchPlaceholderText={t("requestForklift")}
              requireSelection={false}
              autoSort={true}
              onSelected={(item) => {
                setSelectedForklift(item);
              }}
            />
          </View>

          {/*    <Select

                        style={{marginTop:20}}

                        selectedIndex={selectedIndex}
                        onSelect={index => setSelectedIndex(index)}
                    >
                        <SelectItem title='1'  />
                        <SelectItem title='2' />

                    </Select>*/}
          <View style={{ marginTop: 15 }}>
            <PickerModal
              style={{ width: "100%", color: "black" }}
              Autocomplete={false}
              items={lineList}
              sortingLanguage={"tr"}
              showToTopButton={true}
              selected={selectedLine}
              showAlphabeticalIndex={true}
              autoGenerateAlphabeticalIndex={true}
              selectPlaceholderText={<Text>{t("reservationLine")}</Text>}
              searchPlaceholderText={t("reservationLine")}
              requireSelection={false}
              autoSort={true}
              onSelected={(item) => {
                setSelectedLine(item);
              }}
            />
          </View>

          <Input
            value={usageDescription}
            multiline={true}
            placeholder={t("requestReason")}
            textStyle={{ height: 150 }}
            onChangeText={(nextValue) => setUsageDescription(nextValue)}
            style={{
              backgroundColor: "#fff",
              marginVertical: 15,
              borderColor: "#757575",
              borderRadius: 10,
            }}
          />

          {/*   {date? <View  style={{marginVertical:10}}>
                        <Text onPress={()=>setOpen(true)}>Başlangıç Tarihi = {date.toLocaleDateString()}</Text>
                    </View>:<Button style={{color:"red"}} color={"black"}  onPress={() => setOpen(true)} >
                        Başlangıç Tarihi Seçiniz
                    </Button>
                    }


                    {date2?    <View>
                        <Text onPress={()=>setOpen2(true)}>Bitiş Tarihi = {date2.toLocaleDateString()}</Text>
                    </View>: <Button style={{color:"red"}} color={"black"}  onPress={() => setOpen2(true)} >
                        Bitiş Tarihi Seçiniz
                    </Button>}
*/}
          <View
            style={{
              flexDirection: "column",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 30,
            }}
          >
            <Button
              style={{ color: "red" }}
              color={"black"}
              onPress={() => setOpen(true)}
            >
              Başlangıç Tarihi
            </Button>
            <Text onPress={() => setOpen(true)}>
              {date.toLocaleString("tr-TR")}
            </Text>
            <Button
              style={{ color: "red" }}
              color={"black"}
              onPress={() => setOpen2(true)}
            >
              Bitiş Tarihi
            </Button>
            <Text onPress={() => setOpen2(true)}>
              {date2.toLocaleString("tr-TR")}
            </Text>
          </View>

          {/* <DatePicker
            modal
            mode={"datetime"}
            locale={"tr-TR"}
            minimumDate={new Date()}
            minuteInterval={15}
            is24hourSource={"device"}
            open={open}
            date={date}
            onConfirm={(date) => {
              setOpen(false);
              setDate(date);
            }}
            onCancel={() => {
              setOpen(false);
            }}
          /> */}
          {/* <DatePicker
            modal
            mode={"datetime"}
            locale={"tr-TR"}
            is24hourSource={"device"}
            minimumDate={date ? new Date(date) : new Date()}
            minuteInterval={15}
            open={open2}
            date={date2}
            onConfirm={(date) => {
              setOpen2(false);
              setDate2(date);
            }}
            onCancel={() => {
              setOpen2(false);
            }}
          /> */}

          <Button
            disabled={loading}
            loading={loading}
            mode="contained"
            onPress={onSubmit}
            style={styles.button}
          >
            {t("request")}
          </Button>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#181e34",
  },
  textIntput: {
    height: 300,
  },
  formContainer: {
    padding: 8,
    flex: 1,
  },
  button: {
    margin: 10,
    width: width - 30,
    height: 40,
    backgroundColor: "#57A7B3",
  },
});
export default ForkliftReservation;
