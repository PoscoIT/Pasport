import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import PickerModal from "react-native-picker-modal-view";
import { REACT_APP_SECRET_KEY } from "@env";
import axios from "axios";

import { Button } from "@ui-kitten/components";
import { Card } from "react-native-paper";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import moment from "moment";
import CareSystemChecklist from "./CareSystemChecklist";
import { Gesture, GestureDetector, ScrollView } from "react-native-gesture-handler";
import Reanimated, {
  Extrapolation,
  interpolate,
  useAnimatedProps,
  useSharedValue,
} from "react-native-reanimated";
import { Camera, useCameraDevice, useCodeScanner } from "react-native-vision-camera";

Reanimated.addWhitelistedNativeProps({ zoom: true });

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);
const CustomCard = ({ item }) => {
  return (
    <Card
      style={{
        marginVertical: 15,
        backgroundColor: "#f8f8f8ff",
        borderRadius: 20,
      }}
    >
      <Card.Content>
        <Text variant="titleLarge">
          <Text style={{ fontWeight: "bold" }}>Checklist Madde:</Text>
          {item.CheckItem}
        </Text>
        {/* <Text variant="bodyMedium"><Text style={{fontWeight:"bold"}}>Checklist:</Text>{item.EQUIPMENTQRCODEZONENAME}</Text> */}
        <Text variant="bodyMedium">
          <Text style={{ fontWeight: "bold" }}>Son Kontrol Tarihi:</Text>
          {moment(item?.LastCheckDate)?.format("DD.MM.YYYY")}
        </Text>
        <Text variant="bodyMedium">
          <Text style={{ fontWeight: "bold" }}>Period:</Text> {item.Period} Gün{" "}
          {item.IsValid ? (
            <FontAwesome name={"check"} size={20} color={"#105c1c"} />
          ) : (
            <FontAwesome name={"close"} size={20} color={"#a21414ff"} />
          )}{" "}
        </Text>
      </Card.Content>
    </Card>
  );
};
const CareSystemPeriodicControl = () => {
  const [mmsLines, setMMSLines] = useState([]);
  const [selectedMMSLine, setSelectedMMSLine] = useState([]);
  const [qrCodeZone, setQrCodeZone] = useState([]);
  const [checklistByLine, setChecklistByLine] = useState([]);
  const [selectedQrCodeZone, setSelectedQrCodeZone] = useState([]);
  const [isActive,setIsActive] = useState(true)
  const pickerRef = useRef(null);
    const device = useCameraDevice("back");
  const [showCamera, setShowCamera] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [qrValue,setQrValue] = useState("")

   const zoom = useSharedValue(device?.neutralZoom ?? 1);
  const zoomOffset = useSharedValue(0);

  const gesture = Gesture.Pinch()
    .onBegin(() => {
      zoomOffset.value = zoom.value;
    })
    .onUpdate((event) => {
      const z = zoomOffset.value * event.scale;
      zoom.value = interpolate(
        z,
        [1, 10],
        [device.minZoom, device.maxZoom],
        Extrapolation.CLAMP,
      );
    });

  const animatedProps = useAnimatedProps(() => ({
    zoom: zoom.value,
  }));

  const url = "https://tstapp.poscoassan.com.tr:8443";


  const codeScannner = useCodeScanner({
      codeTypes: ["qr", "ean-13"],
      onCodeScanned: (codes) => {
      setQrValue(codes[0]?.value)
      setModalVisible(true)
      },
      requestCameraPermission: true,
    });




  return (
    <View style={styles.view}>
      <View style={{ flex: 1, width: "100%", height: "100%" }}>
        <GestureDetector gesture={gesture}>
          <ReanimatedCamera
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={isActive}
            codeScanner={codeScannner}
            animatedProps={animatedProps}
          />
        </GestureDetector>
      </View>

      {modalVisible && (
        <ScrollView
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "white",
          }}
        >
         <CareSystemChecklist selectedQrCodeZone={qrValue} />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 18, marginBottom: 8 },
  selected: { fontSize: 16, marginBottom: 20, color: "blue" },
  itemContainer: {
    paddingVertical: 16, // Satır yüksekliği
    paddingHorizontal: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
  },
   view: {
    flex: 1,
    backgroundColor: "white",
  },
  itemText: {
    fontSize: 16,
    flexWrap: "wrap", // Uzun metinleri sar
  },
  button3: {
    width: "70%",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 25,
  },
});

export default CareSystemPeriodicControl;
