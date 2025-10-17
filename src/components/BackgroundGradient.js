/* eslint-disable react-native/no-inline-styles */
import React, {memo} from 'react';
import {StyleSheet, KeyboardAvoidingView, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

const BackgroundGradient = ({children}) => (
  <SafeAreaView style={styles.background}>

      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <LinearGradient
          start={{x: 0.0, y: 0.0}}
          end={{x: 1.0, y: 1.0}}
          locations={[0, 0.5, 1]}
          useAngle={true}
          angle={180}
          colors={['#FDFAF6', 'rgba(122,183,209,0.44)', '#FDFAF6']}
          style={styles.linearGradient}>
          {children}
        </LinearGradient>
      </KeyboardAvoidingView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#FDFAF6',
    flex: 1,
  },
  container: {
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
  },
});

export default memo(BackgroundGradient);
