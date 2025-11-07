// import { useEffect, useState } from 'react';
// import { LogBox, StyleSheet, Platform } from 'react-native';
// import { useAuth } from '../hooks/useAuth';
// import { BottomNavigation, BottomNavigationTab, Icon } from '@ui-kitten/components';
// import { t } from 'i18next';
// import MaterialCommunityIcon from 'react-native-paper/src/components/MaterialCommunityIcon';
// import auth from '@react-native-firebase/auth';

// const BottomMainStack = ({ state, navigation }) => {
//     LogBox.ignoreLogs([
//         'Non-serializable values were found in the navigation state',
//     ]);

//     const [email, setEmail] = useState('');
//     const isEmailPoscoAssan = email.includes('@poscoassan.com');
//     const { OS } = Platform;
//     const { user } = useAuth();

//     useEffect(() => {
//         const unsubscribe = auth().onAuthStateChanged(user => {
//             if (user) setEmail(user.email);
//         });
//         return () => unsubscribe();
//     }, []);

//     const tabs = [
//         { id: 1, isPoscoAssan: true, isPoscoTNPC: true, title: 'Safety 1st', iconName: <Icon name="shield-outline" /> },
//         { id: 2, isPoscoAssan: true, isPoscoTNPC: false, title: 'IT SR', iconName: <Icon name="monitor-outline" /> },
//         { id: 3, isPoscoAssan: true, isPoscoTNPC: false, title: 'My M.', iconName: <MaterialCommunityIcon size={24} color="gray" name="tools" /> },
//         { id: 4, isPoscoAssan: true, isPoscoTNPC: false, title: t('hr'), iconName: <Icon name="people-outline" /> },
//         { id: 5, isPoscoAssan: true, isPoscoTNPC: false, title: 'Line T.', iconName: <Icon name="activity-outline" /> },
//     ];

//     return (
//         <BottomNavigation
//             selectedIndex={state.index}
//             style={styles.TopNavigation}
//             onSelect={index => navigation.navigate(state.routeNames[index])}
//         >
//             {isEmailPoscoAssan
//                 ? tabs.map((item, index) => (
//                     <BottomNavigationTab
//                         key={index}
//                         icon={item.iconName}
//                         title={item.title}
//                     />
//                 ))
//                 : tabs
//                     .filter(item => item.isPoscoTNPC)
//                     .map((item, index) => (
//                         <BottomNavigationTab
//                             key={index}
//                             icon={item.iconName}
//                             title={item.title}
//                         />
//                     ))}
//         </BottomNavigation>
//     );
// };

// const styles = StyleSheet.create({
//     TopNavigation: {
//         backgroundColor: '#FDFAF6',
//         bottom: 0,
//         zIndex: 1,
//         position: 'absolute',
//     },
//     preloader: {
//         left: 0,
//         right: 0,
//         top: 0,
//         bottom: 0,
//         position: 'absolute',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
// });

// export default BottomMainStack;
