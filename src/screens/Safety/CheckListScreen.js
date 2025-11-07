/* eslint-disable no-alert */
/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import { memo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { InsertNewRecordToFirebase } from "../../api/auth-api";
import Background_Green from "../../components/Background_Green";
import TextInput from "../../components/TextInput";
import Button from "../../components/Button";
import Toast from "../../components/Toast";
import { Card, Text } from "react-native-paper";
import { Toggle } from "@ui-kitten/components";

const CheckListScreen = ({ navigation }) => {
  const [toast, setToast] = useState({ value: "", type: "" });
  const [name, setName] = useState({ value: "", error: "" });
  const [name2, setName2] = useState({ value: "", error: "" });
  const [setError] = useState("");
  const [loading, setLoading] = useState(false);
  const Separator = () => <View style={styles.separator} />;
  const [country1, setCountry1] = useState(false);
  const [country2, setCountry2] = useState(false);
  const [country3, setCountry3] = useState(false);
  const [country4, setCountry4] = useState(false);
  const [country5, setCountry5] = useState(false);
  const [country6, setCountry6] = useState(false);
  const [country7, setCountry7] = useState(false);
  const [country8, setCountry8] = useState(false);
  const [country11, setCountry11] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [isEditable2, setIsEditable2] = useState(false);

  const _InsertNewRecordToFirebase = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    const response = await InsertNewRecordToFirebase({
      country1: country1,
      country2: country2,
      country3: country3,
      country4: country4,
      country5: country5,
      country6: country6,
      country7: country7,
      country8: country8,
      country9: name.value,
      country10: name2.value,
      country11: country11,
    });
    if (response.error) {
      setError(response.error);
    } else {
      alert("Kayıt başarılı.");
      navigation.navigate("Dashboard");
    }
    setLoading(false);
  };
  return (
    <Background_Green style={styles.backGround}>
      <Card style={styles.cardStyle}>
        <Card.Content>
          <Text variant="titleLarge">Değerli Çalışanımız,</Text>
          <Text variant="bodyMedium">Bugünkü sağlık durumunuzu belirtiniz</Text>
        </Card.Content>
      </Card>
      <View style={styles.container}>
        <View style={styles.ViewContainerLeft}>
          <Text variant="bodyMedium" style={styles.leftParag}>
            {"Öksürük var mı?"}{" "}
          </Text>
        </View>
        <View style={styles.ViewContainerRight}>
          <Toggle
            checked={country2}
            status={country2 && "danger"}
            onChange={(isChecked) => {
              setCountry2(isChecked);
            }}
          >
            {!country2 && "Yok"}
            {country2 && "Var"}
          </Toggle>
        </View>
      </View>
      <Separator />
      <View style={styles.container}>
        <View style={styles.ViewContainerLeft}>
          <Text variant="bodyMedium" style={styles.leftParag}>
            {"Boğaz ağrısı var mı?"}{" "}
          </Text>
        </View>
        <View style={styles.ViewContainerRight}>
          <Toggle
            checked={country3}
            status={country3 && "danger"}
            onChange={(isChecked) => {
              setCountry3(isChecked);
            }}
          >
            {!country3 && "Yok"}
            {country3 && "Var"}
          </Toggle>
        </View>
      </View>
      <Separator />
      <View style={styles.container}>
        <View style={styles.ViewContainerLeft}>
          <Text variant="bodyMedium" style={styles.leftParag}>
            {"Nefes almada güçlük var mı?"}{" "}
          </Text>
        </View>
        <View style={styles.ViewContainerRight}>
          <Toggle
            checked={country4}
            status={country4 && "danger"}
            onChange={(isChecked) => {
              setCountry4(isChecked);
            }}
          >
            {!country4 && "Yok"}
            {country4 && "Var"}
          </Toggle>
        </View>
      </View>
      <Separator />
      <View style={styles.container}>
        <View
          style={[
            styles.ViewContainerLeft,
            {
              height: 65,
            },
          ]}
        >
          <Text variant="bodyMedium" style={styles.leftParag}>
            {
              "Son bir haftada hastalığa yakalanmış ya da yakalanan kişi ile temas var mı?"
            }{" "}
          </Text>
        </View>
        <View style={styles.ViewContainerRight}>
          <Toggle
            checked={country5}
            status={country5 && "danger"}
            onChange={(isChecked) => {
              setCountry5(isChecked);
            }}
          >
            {!country5 && "Yok"}
            {country5 && "Var"}
          </Toggle>
        </View>
      </View>
      <Separator />
      <View style={styles.container}>
        <View style={styles.ViewContainerLeft}>
          <Text variant="bodyMedium" style={styles.leftParag}>
            {"Ailede semptom gösteren var mı? "}{" "}
          </Text>
        </View>
        <View style={styles.ViewContainerRight}>
          <Toggle
            checked={country6}
            status={country6 && "danger"}
            onChange={(isChecked) => {
              setCountry6(isChecked);
            }}
          >
            {!country6 && "Yok"}
            {country6 && "Var"}
          </Toggle>
        </View>
      </View>
      <Separator />
      <View style={styles.container}>
        <View style={styles.ViewContainerLeft}>
          <Text variant="bodyMedium" style={styles.leftParag}>
            {"Burun veya geniz akıntısı var mı?"}{" "}
          </Text>
        </View>
        <View style={styles.ViewContainerRight}>
          <Toggle
            checked={country11}
            status={country11 && "danger"}
            onChange={(isChecked) => {
              setCountry11(isChecked);
            }}
          >
            {!country11 && "Yok"}
            {country11 && "Var"}
          </Toggle>
        </View>
      </View>
      <Separator />
      <View style={styles.container}>
        <View
          style={[
            styles.ViewContainerLeft,
            {
              height: 65,
            },
          ]}
        >
          <Text variant="bodyMedium" style={styles.leftParag}>
            {"Yurtdışından gelen biri ile son 14 gün içinde görüştünüz mü?"}{" "}
          </Text>
        </View>
        <View style={styles.ViewContainerRight}>
          <Toggle
            checked={country7}
            status={country7 && "danger"}
            onChange={(isChecked) => {
              setCountry7(isChecked);
            }}
          >
            {!country7 && "Yok"}
            {country7 && "Var"}
          </Toggle>
        </View>
      </View>
      <Separator />
      <View style={styles.container}>
        <View style={styles.ViewContainerLeft}>
          <Text variant="bodyMedium" style={styles.leftParag}>
            {"Vücut Sıcaklığı ve ateş var mı?"}{" "}
          </Text>
        </View>
        <View style={styles.ViewContainerRight}>
          <Toggle
            checked={country1}
            status={country1 && "danger"}
            onChange={(isChecked) => {
              setCountry1(isChecked);
              if (isChecked) {
                setIsEditable(true);
              } else {
                setIsEditable(false);
              }
            }}
          >
            {!country1 && "Yok"}
            {country1 && "Var"}
          </Toggle>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.ViewContainerLeftBottom}>
          <Text variant="bodyMedium" style={styles.leftParag}>
            {"Varsa kaç derece?"}{" "}
          </Text>
        </View>
        <View style={styles.ViewContainerRightBottom}>
          <TextInput
            editable={isEditable}
            label={
              isEditable
                ? "Ateş Kaç Derece"
                : "Ateşiniz varsa değer girebilirsiniz!"
            }
            returnKeyType="next"
            style={styles.inputContainer}
            keyboardType="decimal-pad"
            multiline={true}
            numberOfLines={1}
            value={name2.value}
            onChangeText={(text) => setName2({ value: text, error: "" })}
            error={!!name2.error}
            errorText={name2.error}
          />
        </View>
      </View>
      <Separator />
      <View style={styles.container}>
        <View style={styles.ViewContainerLeft}>
          <Text variant="bodyMedium" style={styles.leftParag}>
            {"Diğer (Var işaretleme durumunda nedenini yazınız.)"}{" "}
          </Text>
        </View>
        <View style={styles.ViewContainerRight}>
          <Toggle
            checked={country8}
            status={country8 && "danger"}
            onChange={(isChecked) => {
              setCountry8(isChecked);
              if (isChecked) {
                setIsEditable2(true);
              } else {
                setIsEditable2(false);
              }
            }}
          >
            {!country8 && "Yok"}
            {country8 && "Var"}
          </Toggle>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.ViewContainerLeftBottom}>
          <Text variant="bodyMedium" style={styles.leftParag}>
            {"Diğer"}{" "}
          </Text>
        </View>
        <View style={styles.ViewContainerRightBottom}>
          <TextInput
            editable={isEditable2}
            label={
              isEditable2
                ? "Açıklamanız"
                : "Diğeri seçmeniz durumunda yazabilirsiniz."
            }
            returnKeyType="next"
            style={styles.inputContainer}
            multiline={true}
            numberOfLines={5}
            value={name.value}
            onChangeText={(text) => setName({ value: text, error: "" })}
            error={!!name.error}
            errorText={name.error}
          />
        </View>
      </View>
      <Separator />
      <View style={{ height: 200 }}>
        <Text />
        <Text />
        {!loading && (
          <Button
            mode="contained"
            style={styles.button}
            onPress={_InsertNewRecordToFirebase}
          >
            {" "}
            Sonucları Gönder
          </Button>
        )}
      </View>

      <Toast
        type={toast.type}
        message={toast.value}
        onDismiss={() => setToast({ value: "", type: "" })}
      />
    </Background_Green>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    fontSize: 12,
    width: "95%",
  },
  separator: {
    borderBottomColor: "#fff",
    borderWidth: 1,
    width: "100%",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  cardStyle: {
    height: 80,
    backgroundColor: "transparent",
    width: "100%",
  },
  ViewContainerLeft: {
    backgroundColor: "transparent",
    flex: 8,
    width: "100%",
    height: 50,
    justifyContent: "center",
  },
  ViewContainerRight: {
    backgroundColor: "transparent",
    flex: 4,
    width: "100%",
  },
  leftParag: {
    fontSize: 14,
    marginLeft: 20,
    justifyContent: "center",
  },
  ViewContainerLeftBottom: {
    backgroundColor: "transparent",
    flex: 5,
    height: 50,
    justifyContent: "center",
  },
  ViewContainerRightBottom: {
    backgroundColor: "transparent",
    flex: 8,
  },
});

export default memo(CheckListScreen);
