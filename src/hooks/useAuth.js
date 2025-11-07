import { useEffect, useState } from "react";

import { auth, database } from "../database/firebaseDB";
// Auth dinleyicisini alıyoruz
import { onAuthStateChanged } from "@react-native-firebase/auth";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [netInfo, setNetInfo] = useState("");
  const isLocalIP = netInfo?.startsWith("172");
  const [language, setLanguage] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({});
  const url = "https://tstapp.poscoassan.com.tr:8443";

  function handleAuthStateChanged(user) {
    setUser(user);
    if (loading) setLoading(false);
  }

  // Dil verilerini çekme (Değişiklik yok)
  const getLanguageData = async () => {
    // ... (Mevcut kodunuz doğru)
  };

  //Dialog bilgisini çekme (MODÜLER API'YE GÜNCELLENDİ)
  //   const getDialogInfo = async () => {
  //     try {
  //       // 1. Adım: Veritabanı örneği (database) ve yolu ('tstapp/dialog') kullanarak bir referans oluşturun.
  //       const dialogRef = ref(database, "tstapp/dialog");

  //       // 2. Adım: 'get' fonksiyonunu kullanarak veriyi çekin.
  //       const snapshot = await get(dialogRef);

  //       const data = snapshot.val();
  //       setDialogContent(data);
  //       setIsOpen(data?.IsOpen);
  //     } catch (error) {
  //       console.error("Dialog fetch error:", error);
  //     }
  //   };

  //   // Dialog verisini ilk mountta al
  //   useEffect(() => {
  //     getDialogInfo();
  //   }, []);

  // Network IP adresini takip et
  //   useEffect(() => {
  //     // ...
  //   }, []);

  // Auth state değişimlerini dinle (Bu kısım zaten doğruydu)
  //   useEffect(() => {
  //     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
  //       setUser(currentUser || null);
  //       setLoading(false);
  //     });
  //     return unsubscribe;
  //   }, []);

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, handleAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  return {
    user,
    loading,
    // setIsOpen,
    isOpen,
    dialogContent,
    language,
    isLocalIP,
  };
}
