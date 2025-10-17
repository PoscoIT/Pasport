/* eslint-disable react-native/no-inline-styles */
import React, {memo} from 'react';
import {StyleSheet, KeyboardAvoidingView, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

const Background = ({children}) => (
  <SafeAreaView style={styles.background}>
    <ScrollView style={{flex: 1}}>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        {children}
      </KeyboardAvoidingView>
    </ScrollView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  background: {
    backgroundColor: 'white',
    flex: 1,

  },
  container: {
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
  },
});

export default memo(Background);
