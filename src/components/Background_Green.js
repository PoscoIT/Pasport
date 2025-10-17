import React, {memo} from 'react';
import {
  ImageBackground,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
} from 'react-native';
let height = Dimensions.get('window').height; //full width

const Background = ({children}) => (
    <ScrollView style={{flex:1,height:height}}>
    <ImageBackground resizeMode="repeat" style={styles.background}>

        <KeyboardAvoidingView style={styles.container} behavior="padding">
          {children}
        </KeyboardAvoidingView>

    </ImageBackground>
    </ScrollView>
);

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#e3f2fd',
  },
  container: {
    width: '100%',
    alignItems: 'center',
  },
});

export default memo(Background);