import { useEffect, useRef } from "react";
import { View, Text, Animated, Easing } from "react-native";
import LottieView from "lottie-react-native";

const FadeInView = (props) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View // Special animatable View
      style={{
        ...props.style,
        opacity: fadeAnim, // Bind opacity to animated value
      }}
    >
      {props.children}
    </Animated.View>
  );
};
const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);
const Splash = ({ navigation }) => {
  const animation = useRef(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animation.current, {
      toValue: 1,
      duration: 2500,
      delay: 2500,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    setTimeout(() => {
      navigation.replace("Index");
    }, 3500);
  }, []);

  return (
    <View
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        flex: 1,
        backgroundColor: "#ffffff",
      }}
    >
      <AnimatedLottieView
        source={require("../assets/splash.json")}
        autoPlay
        loop
        speed={0.5}
        style={{
          flex: 3,
          backgroundColor: "#fff",
        }}
        progress={animation.current}
      />
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FadeInView
          style={{
            width: "100%",
            height: 50,
          }}
        >
          <Text
            style={{
              fontSize: 28,
              textAlign: "center",
              margin: 10,
              color: "#2A58CC",
            }}
          >
            POSCOASSAN TST
          </Text>
        </FadeInView>
      </View>
    </View>
  );
};

export default Splash;
