import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import Svg, { Path, Line } from "react-native-svg";

const Loading = () => {
  const tailAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(tailAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(tailAnimation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [tailAnimation]);

  const tailRotation = tailAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["60deg", "0deg", "-20deg"],
  });

  return (
    <View style={styles.loader}>
      <View style={styles.wrapper}>
        <View style={styles.catContainer}>
          {/* Cat Body */}
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 733 673"
            style={styles.catBody}
          >
            <Path
              fill="#a765fe"
              d="M111.002 139.5C270.502 -24.5001 471.503 2.4997 621.002 139.5C770.501 276.5 768.504 627.5 621.002 649.5C473.5 671.5 246 687.5 111.002 649.5C-23.9964 611.5 -48.4982 303.5 111.002 139.5Z"
            />
            <Path fill="#f43c7d" d="M184 9L270.603 159H97.3975L184 9Z" />
            <Path fill="#f43c7d" d="M541 0L627.603 150H454.397L541 0Z" />
          </Svg>

          {/* Tail */}
          <Animated.View
            style={[
              styles.tail,
              {
                transform: [{ rotateZ: tailRotation }],
              },
            ]}
          >
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 158 564"
              style={styles.tailSvg}
            >
              <Path
                fill="#9098b1"
                d="M5.97602 76.066C-11.1099 41.6747 12.9018 0 51.3036 0V0C71.5336 0 89.8636 12.2558 97.2565 31.0866C173.697 225.792 180.478 345.852 97.0691 536.666C89.7636 553.378 73.0672 564 54.8273 564V564C16.9427 564 -5.4224 521.149 13.0712 488.085C90.2225 350.15 87.9612 241.089 5.97602 76.066Z"
              />
            </Svg>
          </Animated.View>

          {/* ZZZ Text */}
          <View style={styles.text}>
            <Text style={styles.bigZzz}>Z</Text>
            <Text style={styles.zzz}>Z</Text>
          </View>
        </View>

        {/* Wall */}
        <View style={styles.wallContainer}>
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 500 126"
            style={styles.wall}
          >
            <Line
              strokeWidth="6"
              stroke="#dacfeb"
              x1="50"
              y1="3"
              x2="450"
              y2="3"
            />
            <Line
              strokeWidth="6"
              stroke="#dacfeb"
              x1="100"
              y1="85"
              x2="400"
              y2="85"
            />
            <Line
              strokeWidth="6"
              stroke="#dacfeb"
              x1="125"
              y1="122"
              x2="375"
              y2="122"
            />
            <Line
              strokeWidth="6"
              stroke="#dacfeb"
              x1="0"
              y1="43"
              x2="500"
              y2="43"
            />
          </Svg>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  wrapper: {
    alignItems: "center",
  },
  catContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  catBody: {
    width: 80,
    height: 80,
  },
  tail: {
    position: "absolute",
    width: 17,
    top: "50%",
  },
  tailSvg: {
    width: "100%",
    height: "100%",
  },
  text: {
    position: "absolute",
    marginTop: -100,
    marginLeft: 120,
  },
  bigZzz: {
    fontSize: 25,
    fontWeight: "700",
    color: "#dacfeb",
    marginLeft: 10,
  },
  zzz: {
    fontSize: 15,
    fontWeight: "700",
    color: "#dacfeb",
  },
  wallContainer: {
    marginTop: 20,
  },
  wall: {
    width: 300,
    height: 126,
  },
});

export default Loading;
