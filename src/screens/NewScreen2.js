/* eslint-disable prettier/prettier */
import React from 'react';
import {StyleSheet, View,Linking} from 'react-native';
import {
  Avatar,
  Icon,
  MenuItem,
  OverflowMenu,
  Text,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';

import {sendUserInfoName} from "../api/auth-api";

const MenuIcon = (props) => <Icon {...props} name="more-vertical" />;

const InfoIcon = (props) => <Icon {...props} name="info" />;

const LogoutIcon = (props) => <Icon {...props} name="log-out" />;


export const TopNavigationImageTitleShowcase2 = (navigation) => {
  const [menuVisible, setMenuVisible] = React.useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const onItemSelect = (index) => {
    if (index.row === 0)
    {Linking.openURL('https://poscoassan.com.tr/download.html').catch(err => console.error('Error', err));}
  };

  const renderMenuAction = () => (
    <TopNavigationAction icon={MenuIcon} onPress={toggleMenu} />
  );

  const renderOverflowMenuAction = () => (
    <React.Fragment>
      <OverflowMenu
        anchor={renderMenuAction}
        visible={menuVisible}
        placement="bottom end"
        backdropStyle={styles.backdrop}
        onSelect={onItemSelect}
        onBackdropPress={toggleMenu}>
        <MenuItem accessoryLeft={InfoIcon} title="Update App" />

      </OverflowMenu>
    </React.Fragment>
  );

  const renderTitle = (props) => {
        return(
    <View style={styles.titleContainer}>
      <View style={{position:"absolute",left:-50}}>
        <Avatar style={styles.logo} source={require('../assets/logo.png')} />
      </View>

      {/*<Text {...props}>TST Safety App</Text>*/}
    </View>
  )};

  return (
    <TopNavigation
      title={renderTitle}
      style={styles.TopNavigation}
      accessoryRight={renderOverflowMenuAction}
    />
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:'#00000',
  },
  logo: {

    width: '100%',

    aspectRatio: 5,

  },
  TopNavigation:{
    backgroundColor:'#FFF',
  },
  overflowMenuStyle:{

  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
