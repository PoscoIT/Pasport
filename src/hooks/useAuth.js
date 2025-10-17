import React, {useEffect, useState} from 'react';
import {getAuth, onAuthStateChanged, browserSessionPersistence, User} from 'firebase/auth';
import axios from "axios";
import NetInfo from "@react-native-community/netinfo";
import {REACT_APP_SECRET_KEY} from '@env';
import {get, getDatabase, query, ref} from "firebase/database";
import {setPersistence} from "@react-native-firebase/auth";



export function useAuth() {
    const auth = getAuth();
    const [user, setUser] = useState(User);
    const [loading,setLoading] = useState(true)
    const [netInfo, setNetInfo] = useState('');
    const isLocalIP = netInfo?.startsWith('172');
    const [language,setLanguage] = useState([])
    const url = 'https://tstapp.poscoassan.com.tr:8443';
    const [isOpen,setIsOpen] = useState(false)
    const [dialogContent,setDialogContent] = useState({})
    const db = getDatabase();


    const getLanguageData = async ()=>{
        await  axios
            .get(`${url}/Common/ListISGControlsData`,{
                headers: {
                    'Content-type': 'application/json',
                    'auth-token': REACT_APP_SECRET_KEY,
                },
            })
            .then((res) => {
                setLanguage(res.data)
            })
            .catch((error) => {
                return error
            })
    }
    const getDialogInfo = async () => {
        const s = query(ref(db, 'tstapp/dialog'));
        await get(s).then(snapshot => {
            setDialogContent(snapshot.val())
            setIsOpen(snapshot.val()?.IsOpen)
        })
    }
    useEffect(()=>{
        getDialogInfo()
    },[])



    useEffect(() => {
        // Subscribe to network state updates
        const unsubscribe = NetInfo.addEventListener(state => {
            setNetInfo(state.details.ipAddress);
        });

        return () => {
            // Unsubscribe to network state updates
            unsubscribe();
        };
    }, []);


    useEffect(() => {
        const unsubscribeFromAuthStateChanged = onAuthStateChanged(auth, user => {
            if (user) {
                setUser(user);
                setLoading(false)
            } else {
                setUser(undefined);
                setLoading(false)
            }
        });

        return unsubscribeFromAuthStateChanged;
    }, [User]);



    return {
        user,
        loading,
        setIsOpen,
        isOpen,
        dialogContent

    };
}