/* eslint-disable eqeqeq */
import React, {memo} from 'react';
import {ActivityIndicator, StyleSheet} from 'react-native';
import 'firebase/auth';
import Background from '../components/Background';
import {theme} from '../core/theme';

const AuthLoadingScreen = ({navigation}) => {
  return (
    <Background>
      <ActivityIndicator
        style={styles.actIndicator}
        size="large"
        color={theme.colors.primary}
      />
    </Background>
  );
};

const styles = StyleSheet.create({
  actIndicator: {
    textAlign: 'center',
    flex: 1,
  },
});

export default memo(AuthLoadingScreen);
