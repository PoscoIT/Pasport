import { memo } from "react";
import { StyleSheet } from "react-native";
import { Button as PaperButton } from "react-native-paper";
import { theme } from "../core/theme";

const Button = ({ mode, style, children, ...props }) => (
  <PaperButton
    style={[
      styles.button,
      mode === "outlined" && { backgroundColor: theme.colors.surface },
      style,
    ]}
    labelStyle={[
      styles.text,
      mode === "contained" && { textColor: theme.colors.surface },
    ]}
    mode={mode}
    {...props}
  >
    {children}
  </PaperButton>
);

const styles = StyleSheet.create({
  button: {
    width: "100%",
    marginVertical: 3,
  },
  text: {
    fontWeight: "bold",
    fontSize: 15,
    lineHeight: 15,
  },
});

export default memo(Button);
