import React, {memo, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {TextInput as Inputs} from 'react-native-paper';
import {theme} from '../core/theme';

const TextInput = ({errorText,eyeIcon, ...props}) => {
  const { secureTextEntry, ...props2 } = props;
  const [secureTextEntry2, setSecureTextEntry2] = useState(secureTextEntry);

  return(<View style={styles.container}>
    <Inputs
        style={styles.input}
        selectionColor={theme.colors.primary}
        activeOutlineColor={theme.colors.primary}
        secureTextEntry={secureTextEntry2&& secureTextEntry2}
        underlineColor="transparent"
        mode="outlined"
        right={eyeIcon && <Inputs.Icon icon="eye" onPress={() => {
          setSecureTextEntry2(!secureTextEntry2);
        }}
        />}
        {...props2}
    />
    {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
  </View>)
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius:5,
    marginVertical: 12,
  },
  primary:{
    color:"rgba(67, 129, 230, 1)"
  },

  input: {

    fontSize: 12,
    height: 45,
  },
  error: {
    fontSize: 14,
    color: "rgba(241, 58, 89, 1)",
    paddingHorizontal: 4,
    paddingTop: 4,
  },
});

export default memo(TextInput);
