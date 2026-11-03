import React, { useCallback, useEffect, useRef, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {Datepicker,Layout} from "@ui-kitten/components"
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { DrawerActions } from "@react-navigation/native";
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from "react-native-vision-camera";
import { sendUserInfoName, sendUserInfoNameWithApi } from "../../api/auth-api";
import { REACT_APP_SECRET_KEY } from "@env";
import axios from "axios";
import { database } from "../../database/firebaseDB";

/* =========================================================
   API AYARLARI

   historyUrl:
     GET isteği: ?QRCode=...

   saveUrl:
     POST isteği: JSON body

   Kendi endpoint adreslerini buraya yaz.
   ========================================================= */

const API = {
  historyUrl: "https://tstapp.poscoassan.com.tr:8443/ISGSystems/GetEmergencyCabinetHistory",
  saveUrl: "https://tstapp.poscoassan.com.tr:8443/ISGSystems/AddEmergencyCabinetChecklist",
};

/* =========================================================
   KONTROL MADDELERİ

   true  = Uygun
   false = Uygun değil
   null  = Henüz seçilmedi
   ========================================================= */

const CHECKLIST_ITEMS = [
  {
    key: "Boots",
    title: "Çizme",
    type: "quantity",
    expected: 2,
  },
  {
    key: "Helmet",
    title: "Baret",
    type: "quantity",
    expected: 2,
  },
  {
    key: "HelmetLight",
    title: "Baret feneri",
    type: "boolean",
    question: "Fener çalışıyor mu?",
  },
  {
    key: "Jacket",
    title: "Mont",
    type: "quantity",
    expected: 2,
  },
  {
    key: "Trousers",
    title: "Pantolon",
    type: "quantity",
    expected: 2,
  },
  {
    key: "Gloves",
    title: "Eldiven",
    type: "quantity",
    expected: 2,
  },
  {
    key: "FireBlanket",
    title: "Yangın battaniyesi",
    type: "quantity",
    expected: 1,
  },
  {
    key: "Manometer",
    title: "Manometre",
    type: "boolean",
    question: "Fosfor çalışıyor mu?",
  },
  {
    key: "Mask",
    title: "Maske",
    type: "boolean",
    question: "Temizliği uygun mu?",
  },
  {
    key: "Backplate",
    title: "Sırtlık",
    type: "boolean",
    question: "Kayışlar ve bağlantılar uygun mu?",
  },
  {
    key: "DemandValve",
    title: "Akciğer otomatı",
    type: "boolean",
    question: "Otomatik açılıp kapanıyor mu?",
  },
];

const createEmptyChecks = () =>
  Object.fromEntries(
    CHECKLIST_ITEMS.map((item) => [
      item.key,
      item.type === "quantity" ? "" : null,
    ])
  );

const isCheckAnswered = (item, value) =>
  item.type === "quantity"
    ? /^\d+$/.test(String(value ?? "").trim())
    : typeof value === "boolean";

const normalizeBoolean = (value) => {
  if (value === true || value === 1 || value === "true" || value === "1") {
    return true;
  }

  if (value === false || value === 0 || value === "false" || value === "0") {
    return false;
  }

  return null;
};

const formatDate = (value) => {
  if (!value) return "-";

  const datePart = String(value).slice(0, 10);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
    return datePart;
  }

  const [year, month, day] = datePart.split("-");

  return `${day}.${month}.${year}`;
};

const isValidDate = (value) => {
  if (typeof value !== "string") return false;

  const text = value.trim();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return false;

  const date = new Date(`${text}T00:00:00.000Z`);

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === text
  );
};

const formatDateForApi = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const requestJson = async (url, options = {}) => {
  const response = await fetch(url, options);
  const responseText = await response.text();

  let body = null;

  if (responseText) {
    try {
      body = JSON.parse(responseText);
    } catch {
      throw new Error("Sunucudan geçerli bir JSON yanıtı alınamadı");
    }
  }

  if (!response.ok || body?.success === false) {
    throw new Error(
      body?.message || `İşlem başarısız. HTTP ${response.status}`
    );
  }

  return body;
};
const parseDateForPicker = (value) => {
  if (value == null || value === "") return undefined;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? undefined : value;
  }

  if (typeof value !== "string") return undefined;

  const text = value.trim().slice(0, 10);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return undefined;

  const [year, month, day] = text.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return undefined;
  }

  return date;
};


/* =========================================================
   EKRAN
   ========================================================= */

export default function EmergencyCabinetScreen({ navigation, route }) {
  const device = useCameraDevice("back");
  const isFocused = useIsFocused();
  const [employeeID, setEmployeeID] = useState("");
  const [permission, setPermission] = useState(false);
  const [permissionLoading, setPermissionLoading] = useState(true);
const [activeTab, setActiveTab] = useState("checklist");
  const [modalVisible, setModalVisible] = useState(false);
  const [qrValue, setQrValue] = useState("");
  const [location, setLocation] = useState("");
  const [pageAuthorization, setPageAuthorization] = useState(false);
    const [users, setUsers] = useState("");
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const [cabinetFound, setCabinetFound] = useState(false);

  const [checks, setChecks] = useState(createEmptyChecks);
  const [cylinderPressure, setCylinderPressure] = useState("");
  const [hydrostaticTestDate, setHydrostaticTestDate] = useState(  new Date());
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const scanLocked = useRef(false);
  const submitLocked = useRef(false);
  const requestVersion = useRef(0);

  

  useFocusEffect(
    useCallback(() => {
      let active = true;
   navigation.dispatch(DrawerActions.closeDrawer());
      const checkCameraPermission = async () => {
        setPermissionLoading(true);

        try {
          let status = Camera.getCameraPermissionStatus();

          if (status === "not-determined") {
            status = await Camera.requestCameraPermission();
          }

          if (active) {
            setPermission(status === "granted");
          }
        } catch {
          if (active) {
            setPermission(false);
          }
        } finally {
          if (active) {
            setPermissionLoading(false);
          }
        }
      };

      checkCameraPermission();

      return () => {
        active = false;
      };
    }, [])
  );
  
  

  const resetForm = () => {
    setChecks(createEmptyChecks());
    setCylinderPressure("");
    setHydrostaticTestDate("");
    setDescription("");
  };

  const closeModal = () => {
    if (submitLocked.current) return;

    // Önceki isteğin geç dönen yanıtını yok say.
    requestVersion.current += 1;

    setModalVisible(false);
    setHistory([]);
    setHistoryError("");
    setHistoryLoading(false);
    setCabinetFound(false);
    setQrValue("");
    setLocation("");

    resetForm();

    // Yeni tarama kullanıcı "Tekrar Tara" düğmesine basınca başlar.
  };

  const getChecklistHistory = async (qrCode) => {
    const currentRequest = ++requestVersion.current;

    setHistoryLoading(true);
    setHistoryError("");
    setCabinetFound(false);
    setHistory([]);

    try {
      if (!API.historyUrl) {
        throw new Error("API.historyUrl adresini tanımlayınız");
      }

      const separator = API.historyUrl.includes("?") ? "&" : "?";

      const result = await requestJson(
        `${API.historyUrl}${separator}QRCode=${encodeURIComponent(qrCode)}`,
        {headers: { "auth-token": REACT_APP_SECRET_KEY }}
      );

      if (currentRequest !== requestVersion.current) return;

     

      const records = Array.isArray(result)
        ? result
        : result?.records;

   

      // if (!Array.isArray(records)) {
      //   throw new Error("API yanıtında records dizisi bulunamadı");
      // }

 const found = Array.isArray(result)
  ? records.length > 0
  : normalizeBoolean(result?.found) === true;

setHydrostaticTestDate(
  parseDateForPicker(records?records[0]?.HydrostaticTestDate:new Date())
);

setHistory(records);
setCabinetFound(found);

setLocation(
  Array.isArray(result)
    ? records[0]?.Location || ""
    : result?.Location || ""
);
    } catch (error) {
      if (currentRequest === requestVersion.current) {
        setHistoryError(error?.message || "Kontrol bilgileri alınamadı");
      }
    } finally {
      if (currentRequest === requestVersion.current) {
        setHistoryLoading(false);
      }
    }
  };

  

   const getDialogInfo = async () => {
    console.log("dasdas")
      const s =  database.ref("tstapp/authorization/fireEquipmentControl");
  
      // Değiştirildi: get(s) yerine s.once('value')
      await s.once("value").then((snapshot) => {
        console.log(snapshot)
        // Olası state gecikme hatasını düzeltmek için local değişken kullanıldı
        const usersList = snapshot.val().users;
        setUsers(usersList);
        console.log(users)
        setPageAuthorization(usersList.includes(employeeID));
      });
    };
  

  const codeScanner = useCodeScanner({
    codeTypes: ["qr"],
    onCodeScanned: (codes) => {
    
      if (!isFocused || scanLocked.current || modalVisible) return;

      const value = codes.find((code) => code.value)?.value?.trim();

      if (!value) return;

      scanLocked.current = true;

      resetForm();
      setQrValue(value);
      setModalVisible(true);

      getChecklistHistory(value);
    },
  });

  const updateCheck = (key, value) => {
    setChecks((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

    const getUser = async () => {
    await sendUserInfoName((sendResponse) => {
      setEmployeeID(sendResponse.empSicil);
    });
  };

  const addChecklist = async () => {
    if (submitLocked.current) return;
    try{
const missing = CHECKLIST_ITEMS.find(
  (item) => !isCheckAnswered(item, checks[item.key])
);
    const user = await sendUserInfoNameWithApi()
    console.log(user)
    setEmployeeID(user?.EmployeeID)

if (missing) {
  Alert.alert(
    "Eksik kontrol",
    missing.type === "quantity"
      ? `${missing.title} için mevcut adedi giriniz`
      : `${missing.title} için Evet / Hayır seçiniz`
  );
  return;
}

 const pressureText = String(cylinderPressure ?? "")
  .trim()
  .replace(",", ".");

const pressure = Number(pressureText);



    if (
      !pressureText ||
      !Number.isFinite(pressure) ||
      pressure < 0
    ) {
      Alert.alert("Geçersiz değer", "Geçerli bir tüp basıncı giriniz");
      return;
    }


const descriptionText = String(description ?? "").trim();
const testDate = formatDateForApi(hydrostaticTestDate);

    if (!isValidDate(testDate)) {
  Alert.alert(
    "Geçersiz tarih",
    "Geçerli bir hidrostatik test tarihi seçiniz"
  );
  return;
}



    const items = [
      ...CHECKLIST_ITEMS.map((item) => ({
        CheckKey: item.key,
        CheckName: item.title,
        IsSuitable: checks[item.key],
      })),
      {
        CheckKey: "CylinderPressure",
        CheckName: "Oksijen tüpü basıncı 240 bar üzerinde mi?",
        IsSuitable: pressure > 240,
      },
    ];

  const hasProblem =
  pressure <= 240 ||
  CHECKLIST_ITEMS.some((item) =>
    item.type === "quantity"
      ? Number(checks[item.key]) < item.expected
      : checks[item.key] === false
  );

if (hasProblem && !description.trim()) {
  Alert.alert(
    "Açıklama gerekli",
    "Eksik ekipman veya olumsuz kontrol için açıklama giriniz"
  );
  return;
}


    if (
      employeeID === undefined ||
      employeeID === null ||
      String(employeeID).trim() === ""
    ) {
      Alert.alert("Eksik bilgi", "Kontrolü yapan kullanıcı bilgisi bulunamadı");
      return;
    }

    if (!API.saveUrl) {
      Alert.alert("API ayarı", "API.saveUrl adresini tanımlayınız");
      return;
    }

  const payload = {
  QRCode: qrValue,
  ControllerID: Number(employeeID),

  Description: description.trim(),

  Items: [
    ...CHECKLIST_ITEMS.map((item) => ({
      Question: item.title,
      Answer:
        item.type === "quantity"
          ? String(Number(checks[item.key]))
          : checks[item.key] === true
            ? "Evet"
            : "Hayır",
    })),
    {
      Question: "Oksijen tüpü basıncı (bar)",
      Answer: String(pressure),
    },
    {
      Question: "Hidrostatik test tarihi",
      Answer: testDate,
    },
  ],
};

    submitLocked.current = true;
    setSubmitting(true);

  

    try {
       const formBody = Object.keys(payload)
      .map(
        (key) =>
          encodeURIComponent(key) + "=" + encodeURIComponent(payload[key])
      )
      .join("&");
       await axios
      .post(API.saveUrl, payload, {
        headers: {
          "auth-token": REACT_APP_SECRET_KEY,
        },
      })
      .then((res) => {
     
        if(res?.data?.success===true){
  
      closeModal();

      Alert.alert("Başarılı", "Acil durum dolabı kontrolü kaydedildi");
        }
        else{
       
           Alert.alert(
        "Kayıt başarısız",
         "Kayıt sırasında bir hata oluştu"
      );
        }
      }).catch((error)=>{
        console.log(error)
          Alert.alert(
        "Kayıt başarısız",
      "Kayıt sırasında bir hata oluştu"
      );
      })
      .finally(()=>{
       submitLocked.current = false;
      setSubmitting(false);
      })
       
    } 
    
    catch (error) {
      
      Alert.alert(
        "Kayıt başarısız",
        "Kayıt sırasında bir hata oluştu"
      );
    }
     finally {
      submitLocked.current = false;
      setSubmitting(false);
    }
    }
    catch(err){
     Alert.alert("Kayıt başarısız", "Kayıt sırasında bir hata oluştu");
    }

   
  };

  const renderHistoryItem = (item, index) => {
    const items = Array.isArray(item.Items) ? item.Items : [];

    return (
      <View
        key={String(item.ID ?? index)}
        style={styles.historyCard}
      >
        <Text style={styles.sectionTitle}>Kontrol kaydı</Text>

        {items.map((check) => {
          const suitable = normalizeBoolean(check.IsSuitable);

          return (
            <View key={check.CheckKey} style={styles.historyRow}>
              <Text style={styles.historyLabel}>{check.CheckName}</Text>

           <Text
  style={[
    styles.historyStatus,
    suitable === true
      ? styles.greenText
      : suitable === false
        ? styles.redText
        : styles.mutedText,
  ]}
>
  {check.Type === "quantity"
    ? check.Quantity != null
      ? `${check.Quantity} adet / Beklenen ${check.ExpectedQuantity}`
      : "Adet belirtilmedi"
    : suitable === true
      ? "✓ Evet"
      : suitable === false
        ? "✕ Hayır"
        : "Belirtilmedi"}
</Text>
            </View>
          );
        })}

        {!items.length && (
          <Text style={styles.helperText}>
            Kontrol detayları bulunamadı.
          </Text>
        )}

        <View style={styles.historyDetails}>
          <Text style={styles.detailText}>
            Tüp basıncı: {item.CylinderPressure ?? "-"} bar
          </Text>

          <Text style={styles.detailText}>
            Hidrostatik test tarihi: {formatDate(item.HydrostaticTestDate)}
          </Text>

          <Text style={styles.detailText}>
            Kontrol eden: {item.CreatedEmployee || "-"}
          </Text>

          <Text style={styles.detailText}>
            Lokasyon: {item.Location || location || "-"}
          </Text>

          <Text style={styles.detailText}>
            Kontrol tarihi: {formatDate(item.Created_at)}
          </Text>

          {!!item.Description && (
            <Text style={styles.detailText}>
              Açıklama: {item.Description}
            </Text>
          )}
        </View>
      </View>
    );
  };
  useEffect(() => {
  setActiveTab("checklist");
}, [modalVisible, qrValue]);

 useEffect(() => {
    getDialogInfo();
  }, []);

   useEffect(() => {
    getUser();
  }, []);

  const checklistPopup = () => {
  const answeredCount = CHECKLIST_ITEMS.filter((item) =>
  isCheckAnswered(item, checks[item.key])
).length;

    const pressureText = cylinderPressure.trim().replace(",", ".");
    const pressure = Number(pressureText);

    const hasPressure =
      pressureText !== "" &&
      Number.isFinite(pressure) &&
      pressure >= 0;

    return (
      <View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Ekipman kontrolleri</Text>

          <Text style={styles.progressText}>
            {answeredCount}/{CHECKLIST_ITEMS.length}
          </Text>
        </View>

        <Text style={styles.helperText}>
          Her madde için uygunluk durumunu seçiniz.
        </Text>

      {CHECKLIST_ITEMS
  // Fener için ayrı kart oluşturma; Baret kartının içinde göster.
  .filter((item) => item.key !== "HelmetLight")
  .map((item, index) => {
    const renderYesNo = (key) => (
      <View style={styles.choiceRow}>
        {[
          { value: true, label: "Evet" },
          { value: false, label: "Hayır" },
        ].map((option) => {
          const selected = checks[key] === option.value;

          return (
            <Pressable
              key={String(option.value)}
              disabled={submitting}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              onPress={() => updateCheck(key, option.value)}
              style={[
                styles.choiceButton,
                selected &&
                  (option.value
                    ? styles.suitableSelected
                    : styles.unsuitableSelected),
              ]}
            >
              <Text
                style={[
                  styles.choiceText,
                  selected && styles.selectedChoiceText,
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    );

    return (
      <View key={item.key} style={styles.checkCard}>
        <Text style={styles.checkTitle}>
          {index + 1}. {item.title}
        </Text>

        {item.type === "quantity" ? (
          <>
            <Text style={styles.checkQuestion}>
              Beklenen miktar: {item.expected} adet
            </Text>

            <TextInput
              style={styles.formInput}
              value={checks[item.key]}
              onChangeText={(text) => {
                if (/^\d*$/.test(text)) {
                  updateCheck(item.key, text);
                }
              }}
              keyboardType="number-pad"
              editable={!submitting}
              placeholder="Mevcut adet"
              placeholderTextColor="#94A3B8"
              maxLength={6}
            />

            {item.key === "Helmet" && (
              <View style={styles.helmetLightSection}>
                <Text style={styles.checkQuestion}>
                  Fener çalışıyor mu?
                </Text>

                {renderYesNo("HelmetLight")}
              </View>
            )}
          </>
        ) : (
          <>
            <Text style={styles.checkQuestion}>
              {item.question}
            </Text>

            {renderYesNo(item.key)}
          </>
        )}
      </View>
    );
  })}

        <View style={styles.checkCard}>
          <Text style={styles.checkTitle}>Oksijen tüpü</Text>

          <Text style={styles.fieldLabel}>Tüp basıncı (bar)</Text>

          <TextInput
            style={styles.formInput}
            value={cylinderPressure}
            onChangeText={setCylinderPressure}
            editable={!submitting}
            keyboardType="decimal-pad"
            placeholder="Örn. 250"
            placeholderTextColor="#94A3B8"
          />

          {hasPressure && (
            <Text
              style={[
                styles.pressureStatus,
                pressure > 240 ? styles.greenText : styles.redText,
              ]}
            >
              {pressure > 240
                ? "Uygun — 240 bar üzerinde"
                : "Uygun değil — 240 bar veya altında"}
            </Text>
          )}

          <Text style={styles.fieldLabel}>Hidrostatik test tarihi</Text>
           <Layout style={{ flex: 1, padding: 16 }}>
      <Datepicker
        label="Tarih Seçiniz"
        
        caption="Gün-Ay-Yıl"
        date={hydrostaticTestDate}
        onSelect={setHydrostaticTestDate}
      />
    </Layout>

          {/* <TextInput
            style={styles.formInput}
            value={hydrostaticTestDate}
            onChangeText={setHydrostaticTestDate}
            editable={!submitting}
            placeholder="YYYY-AA-GG"
            placeholderTextColor="#94A3B8"
            maxLength={10}
            autoCorrect={false}
            autoCapitalize="none"
          /> */}
        </View>

        <Text style={styles.fieldLabel}>Açıklama</Text>

        <TextInput
          style={[styles.formInput, styles.descriptionInput]}
          value={description}
          onChangeText={setDescription}
          editable={!submitting}
          multiline
          textAlignVertical="top"
          placeholder="Eksik veya arızalı ekipmanları belirtiniz"
          placeholderTextColor="#94A3B8"
        />

        <Pressable
          disabled={submitting}
          onPress={addChecklist}
          style={[
            styles.primaryButton,
            submitting && styles.disabledButton,
          ]}
        >
          {submitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryButtonText}>Kontrolü Kaydet</Text>
          )}
        </Pressable>
      </View>
    );
  };

const renderModalContent = () => {
  if (historyLoading) {
    return (
      <View style={styles.stateContainer}>
        <ActivityIndicator size="large" color="#0B337C" />
        <Text style={styles.stateText}>
          Dolap bilgileri getiriliyor...
        </Text>
      </View>
    );
  }

  if (historyError) {
    return (
      <View style={styles.stateContainer}>
        <Text style={[styles.stateText, styles.redText]}>
          {historyError}
        </Text>

        <Pressable
          style={styles.primaryButton}
          onPress={() => getChecklistHistory(qrValue)}
        >
          <Text style={styles.primaryButtonText}>Tekrar Dene</Text>
        </Pressable>
      </View>
    );
  }

  if (!cabinetFound) {
    return (
      <View style={styles.stateContainer}>
        <Text style={styles.stateText}>
          Bu QR koduna ait acil durum dolabı bulunamadı.
        </Text>
      </View>
    );
  }

  if (activeTab === "history" && history?.length > 0) {
    return (
      <View>
        <Text style={styles.sectionTitle}>Geçmiş Kontroller</Text>

        <Text style={styles.helperText}>
          Bu dolaba ait {history?.length} kontrol kaydı bulunmaktadır.
        </Text>

        {history.map(renderHistoryItem)}
      </View>
    );
  }

  return checklistPopup();
};

  if (permissionLoading) {
    return (
      <View style={styles.fullPageState}>
        <ActivityIndicator size="large" color="#0B337C" />
        <Text style={styles.stateText}>Kamera hazırlanıyor...</Text>
      </View>
    );
  }

  if (!permission) {
    return (
      <View style={styles.fullPageState}>
        <Text style={styles.sectionTitle}>Kamera izni gerekli</Text>

        <Text style={styles.stateText}>
          QR kodunu okutmak için uygulamanın kamera iznini açınız.
        </Text>

        <Pressable
          style={styles.primaryButton}
          onPress={() =>
            Linking.openSettings().catch(() =>
              Alert.alert("Hata", "Uygulama ayarları açılamadı.")
            )
          }
        >
          <Text style={styles.primaryButtonText}>Ayarları Aç</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.secondaryButtonText}>Geri Dön</Text>
        </Pressable>
      </View>
    );
  }

  if(!pageAuthorization){
    return(
      <View style={styles.fullPageState}>
        <Text style={styles.stateText}>Sayfaya Erişim Yetkiniz Yoktur</Text>

        <Pressable
          style={styles.primaryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.primaryButtonText}>Geri Dön</Text>
        </Pressable>
      </View>
    )
  }
  if (!device) {
    return (
      <View style={styles.fullPageState}>
        <Text style={styles.stateText}>Arka kamera bulunamadı.</Text>

        <Pressable
          style={styles.primaryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.primaryButtonText}>Geri Dön</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isFocused && permission && !modalVisible}
        codeScanner={codeScanner}
      />

      <View style={styles.cameraHeader}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>‹ Geri</Text>
        </Pressable>

        <Text style={styles.cameraTitle}>Acil Durum Dolabı</Text>

        <Text style={styles.cameraSubtitle}>
          Dolap üzerindeki QR kodunu okutunuz
        </Text>
      </View>

    

      {!modalVisible && scanLocked.current && (
        <View style={styles.scanAgainContainer}>
          <Pressable
            style={styles.primaryButton}
            onPress={() => {
              scanLocked.current = false;
              setQrValue("");
            }}
          >
            <Text style={styles.primaryButtonText}>Tekrar Tara</Text>
          </Pressable>
        </View>
      )}

      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={()=>{}}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeading}>
                <Text style={styles.modalTitle}>Acil Durum Dolabı</Text>
                <Text style={styles.modalSubtitle}>Ekipman kontrol formu</Text>
              </View>

              <Pressable
                onPress={closeModal}
                disabled={submitting}
                accessibilityLabel="Kapat"
                accessibilityRole="button"
                hitSlop={12}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </Pressable>
            </View>

            <View style={styles.qrBadge}>
              <Text style={styles.qrText}>QR: {qrValue}</Text>

            
            </View>

         {!historyLoading &&
  !historyError &&
  cabinetFound &&
  history?.length > 0 && (
    <View style={styles.modalTabs}>
      <Pressable
        disabled={submitting}
        accessibilityRole="tab"
        accessibilityState={{
          selected: activeTab === "checklist",
          disabled: submitting,
        }}
        onPress={() => setActiveTab("checklist")}
        style={[
          styles.modalTab,
          activeTab === "checklist" && styles.modalTabActive,
        ]}
      >
        <Text
          style={[
            styles.modalTabText,
            activeTab === "checklist" && styles.modalTabTextActive,
          ]}
        >
          Checklist
        </Text>
      </Pressable>

      <Pressable
        disabled={submitting}
        accessibilityRole="tab"
        accessibilityState={{
          selected: activeTab === "history",
          disabled: submitting,
        }}
        onPress={() => setActiveTab("history")}
        style={[
          styles.modalTab,
          activeTab === "history" && styles.modalTabActive,
        ]}
      >
        <Text
          style={[
            styles.modalTabText,
            activeTab === "history" && styles.modalTabTextActive,
          ]}
        >
          Geçmiş ({history?.length})
        </Text>
      </Pressable>
    </View>
  )}

<ScrollView
  key={activeTab}
  style={styles.modalScroll}
  contentContainerStyle={styles.modalScrollContent}
  keyboardShouldPersistTaps="handled"
  keyboardDismissMode="on-drag"
  showsVerticalScrollIndicator={false}
>
  {renderModalContent()}
</ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

/* =========================================================
   STİLLER
   ========================================================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  fullPageState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#F8FAFC",
  },
  cameraHeader: {
    paddingTop: Platform.OS === "ios" ? 64 : 40,
    paddingHorizontal: 20,
    paddingBottom: 24,
    backgroundColor: "rgba(11, 51, 124, 0.9)",
  },
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingRight: 20,
    marginBottom: 12,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  cameraTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
  },
  cameraSubtitle: {
    color: "#DBEAFE",
    fontSize: 14,
    marginTop: 8,
  },
  scannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  scannerFrame: {
    width: "70%",
    maxWidth: 300,
    aspectRatio: 1,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    borderRadius: 24,
    backgroundColor: "transparent",
  },
  scanAgainContainer: {
    position: "absolute",
    bottom: 48,
    left: 24,
    right: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.7)",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 40,
  },
  modalContainer: {
    maxHeight: "100%",
    flexShrink: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 22,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#0B337C",
  },
  modalHeading: {
    flex: 1,
  },
  modalTitle: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "700",
  },
  modalSubtitle: {
    color: "#CBD5E1",
    marginTop: 5,
    fontSize: 13,
  },
  closeButton: {
    padding: 8,
    marginLeft: 10,
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 24,
  },
  qrBadge: {
    backgroundColor: "#E8EEF9",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  qrText: {
    color: "#0B337C",
    fontWeight: "700",
    fontSize: 14,
  },
  locationText: {
    color: "#475569",
    fontSize: 13,
    marginTop: 5,
  },
  modalScroll: {
    flexShrink: 1,
  },
  modalScrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  sectionTitle: {
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    flexShrink: 1,
  },
  progressText: {
    color: "#0B337C",
    fontSize: 14,
    fontWeight: "700",
  },
  helperText: {
    color: "#64748B",
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 16,
  },
  checkCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  checkTitle: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "700",
  },
  checkQuestion: {
    color: "#64748B",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 6,
    marginBottom: 14,
  },
  choiceRow: {
    flexDirection: "row",
    gap: 10,
  },
  choiceButton: {
    flex: 1,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    backgroundColor: "#F8FAFC",
  },
  suitableSelected: {
    backgroundColor: "#15803D",
    borderColor: "#15803D",
  },
  unsuitableSelected: {
    backgroundColor: "#DC2626",
    borderColor: "#DC2626",
  },
  choiceText: {
    color: "#475569",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  selectedChoiceText: {
    color: "#FFFFFF",
  },
  fieldLabel: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 14,
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#0F172A",
    fontSize: 15,
  },
  descriptionInput: {
    minHeight: 110,
  },
  pressureStatus: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "600",
  },
  primaryButton: {
    backgroundColor: "#0B337C",
    borderRadius: 12,
    minHeight: 50,
    paddingVertical: 15,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    padding: 16,
    marginTop: 10,
  },
  secondaryButtonText: {
    color: "#0B337C",
    fontSize: 15,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.5,
  },
  historyCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    paddingVertical: 12,
    gap: 12,
  },
  historyLabel: {
    flex: 1,
    color: "#334155",
    fontSize: 14,
  },
  historyStatus: {
    flexShrink: 1,
    fontSize: 13,
    fontWeight: "700",
  },
  historyDetails: {
    paddingTop: 14,
  },
  detailText: {
    color: "#475569",
    fontSize: 13,
    lineHeight: 22,
    marginBottom: 4,
  },
  stateContainer: {
    paddingVertical: 32,
    alignItems: "center",
  },
  stateText: {
    color: "#64748B",
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    marginTop: 12,
  },
  infoBox: {
    padding: 14,
    backgroundColor: "#DCFCE7",
    borderRadius: 12,
    marginBottom: 16,
  },
  infoText: {
    color: "#166534",
    fontSize: 14,
    lineHeight: 21,
  },
  greenText: {
    color: "#15803D",
  },
  redText: {
    color: "#DC2626",
  },
  mutedText: {
    color: "#64748B",
  },
  modalTabs: {
  flexDirection: "row",
  backgroundColor: "#E2E8F0",
  marginHorizontal: 16,
  marginTop: 14,
  marginBottom: 4,
  padding: 4,
  borderRadius: 12,
  gap: 6,
},
modalTab: {
  flex: 1,
  minHeight: 44,
  paddingVertical: 12,
  paddingHorizontal: 8,
  borderRadius: 9,
  alignItems: "center",
  justifyContent: "center",
},
modalTabActive: {
  backgroundColor: "#0B337C",
},
modalTabText: {
  color: "#475569",
  fontSize: 14,
  fontWeight: "600",
  textAlign: "center",
},
modalTabTextActive: {
  color: "#FFFFFF",
},
});