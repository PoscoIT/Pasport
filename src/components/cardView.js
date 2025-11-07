import { memo } from "react";
import { StyleSheet } from "react-native";
import { Card, Button, Text } from "react-native-paper";
import { Dimensions } from "react-native";

var width = Dimensions.get("window").width; //full width

const CardView = ({ title, brand, ...props }) => (
  <Card style={styles.cardType}>
    <Card.Content>
      <Text variant="titleLarge">{title}</Text>
      <Text variant="bodyMedium">{brand}</Text>
    </Card.Content>
    <Card.Cover style={styles.coverStyle} {...props} />
    <Card.Actions>
      <Button style={styles.buttonStyle} {...props}>
        <Text style={styles.textStyle}>Hediye Seç</Text>
      </Button>
    </Card.Actions>
  </Card>
);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 12,
  },
  cardType: {
    width: width - 20,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: "lightblue",
    color: "red",
  },
  textStyle: {
    color: "black",
  },
  coverStyle: {
    width: "100%",
    height: undefined,
    aspectRatio: 1,
    textAlign: "center",
    alignContent: "center",
    alignSelf: "center",
  },
});

export default memo(CardView);
