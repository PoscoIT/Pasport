import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import Background_Green from "./Background_Green";
import { useRoute } from "@react-navigation/native";

import Video from "react-native-video";

let width = Dimensions.get("window").width; //full width
let height = Dimensions.get("window").height; //full width

const VideoModal = () => {
  const route = useRoute();

  return (
    <Background_Green>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.photoContainer}>
          <View
            style={{
              justifyContent: "center",
              flex: 1,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 16,

                paddingVertical: 5,
                fontWeight: "800",
              }}
            >
              {route.params.title}
            </Text>
          </View>

          {route.params.data.split(",").map((item, index) => (
            <Video
              key={index}
              source={{ uri: item }}
              style={{
                width: width,
                marginVertical: 15,
                height: height / 3,
              }}
              controls={true}
              paused={true}
              resizeMode={"cover"}
              ref={(ref) => {
                this.player = ref;
              }}
            />
          ))}
        </View>
      </ScrollView>
    </Background_Green>
  );
};
{
  /*   <Provider>
      <Portal>
        <Modal
          visible={visibleModal}
          dis
          contentContainerStyle={containerStyle}>
          <Animated.View
            style={[
              styles.modal,
              {
                transform: [{translateY: height}],
              },
            ]}>
              <Video
            source={{
              uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
            }}
            style={{
              width: width,
              height: 300,
              margin: 10,
              alignSelf: 'center',
              alignContent: 'center',
            }}
            controls={true}
            paused={true}
            ref={ref => {
              this.player = ref;
            }}
          />

          </Animated.View>
        </Modal>
      </Portal>
    </Provider>
      */
}
const styles = StyleSheet.create({
  container: {
    padding: 25,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonOpen: {
    backgroundColor: "#ffb606",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  modelBox: {
    backgroundColor: "rgba(52, 52, 52, 0.8)",
  },
  button: {
    display: "flex",
    height: 60,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#2AC062",
    shadowColor: "#2AC062",
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 10,
      width: 0,
    },
    shadowRadius: 25,
  },
  closeButton: {
    display: "flex",
    height: 60,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF3974",
    shadowColor: "#2AC062",
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 10,
      width: 0,
    },
    shadowRadius: 25,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 22,
  },
  image: {
    marginTop: 150,
    marginBottom: 10,
    width: "100%",
    height: 350,
  },
  text: {
    fontSize: 24,
    marginBottom: 30,
    padding: 40,
  },
  closeText: {
    fontSize: 24,
    color: "#00479e",
    textAlign: "center",
  },
});

export default VideoModal;
