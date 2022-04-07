import React from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { useScrollHandler } from "react-native-redash";
import Animated, {
  divide,
  Extrapolate,
  interpolateNode,
  multiply,
  useAnimatedRef,
} from "react-native-reanimated";

import Slide, { SLIDE_HEIGHT } from "./Slide";
import Subslide from "./Subslide";
import Dot from "./Dot";
import { theme } from "../../components";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  underlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "flex-end",
    borderBottomRightRadius: theme.borderRadii.xl,
  },
  slider: {
    height: SLIDE_HEIGHT,
    borderBottomRightRadius: 75,
  },
  footer: {
    flex: 1,
  },
  footerContent: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: theme.borderRadii.xl,
  },
  pagination: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    height: theme.borderRadii.xl,
    justifyContent: "center",
    alignItems: "center",
  },
});

const slides = [
  {
    title: "Relaxed",
    subtitle: "Find Your Outfits",
    description:
      "Confused about your outfit? Don't worry! Find the best outfit here!",
    color: "#BFEAF5",
    picture: {
      src: require("../../../assets/images/2.png"),
      width: 2891,
      height: 3744,
    },
  },
  {
    title: "Playful",
    subtitle: "Hear it First, Wear it First",
    description:
      "Hating the clothes in your waredrobe? Explore hundreds of outfit ideas",
    color: "#BEECC4",
    picture: {
      src: require("../../../assets/images/1.png"),
      width: 2701,
      height: 3744,
    },
  },
  {
    title: "Excentric",
    subtitle: "Your Style, Your Way",
    description:
      "Create your individual & unques style and look amazing everyday",
    color: "#FFE4D9",
    picture: {
      src: require("../../../assets/images/3.png"),
      width: 2401,
      height: 3744,
    },
  },
  {
    title: "Funky",
    subtitle: "Look Good, Feel Good",
    description:
      "Discover the latest trends in fashion and explore your personality",
    color: "#FAC8D4",
    picture: {
      src: require("../../../assets/images/4.png"),
      width: 2900,
      height: 3744,
    },
  },
];

const Onboarding = () => {
  const scroll = useAnimatedRef();
  const { scrollHandler, x } = useScrollHandler();
  const backgroundColor = Animated.interpolateColors(x, {
    inputRange: slides.map((_, i) => i * width),
    outputColorRange: slides.map((slide) => slide.color),
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.slider, { backgroundColor }]}>
        {slides.map(({ picture }, index) => {
          const opacity = interpolateNode(x, {
            inputRange: [
              (index - 0.5) * width,
              index * width,
              (index + 0.5) * width,
            ],
            outputRange: [0, 1, 0],
            extrapolate: Extrapolate.CLAMP,
          });
          return (
            <Animated.View style={[styles.underlay, { opacity }]} key={index}>
              <Image
                source={picture.src}
                style={{
                  width: width - theme.borderRadii.xl,
                  height:
                    ((width - theme.borderRadii.xl) * picture.height) / picture.width,
                }}
              />
            </Animated.View>
          );
        })}
        <Animated.ScrollView
          ref={scroll}
          horizontal
          snapToInterval={width}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          bounces={false}
          {...scrollHandler}
        >
          {slides.map(({ title, picture }, index) => (
            <Slide key={index} right={index % 2} {...{ title, picture }} />
          ))}
        </Animated.ScrollView>
      </Animated.View>
      <View style={styles.footer}>
        <Animated.View
          style={{ ...StyleSheet.absoluteFillObject, backgroundColor }}
        >
          <View style={[styles.footerContent]}>
            <View style={styles.pagination}>
              {slides.map((_, index) => (
                <Dot
                  key={index}
                  currentIndex={divide(x, width)}
                  {...{ index, x }}
                />
              ))}
            </View>
            <Animated.View
              style={{
                flex: 1,
                flexDirection: "row",
                width: width * slides.length,
                transform: [{ translateX: multiply(x, -1) }],
              }}
            >
              {slides.map(({ subtitle, description }, index) => (
                <Subslide
                  key={index}
                  onPress={() => {
                    if (scroll.current) {
                      scroll.current.scrollTo({
                        x: width * (index + 1),
                        animated: true,
                      });
                    }
                  }}
                  last={index === slides.length - 1}
                  {...{ subtitle, description }}
                />
              ))}
            </Animated.View>
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

export default Onboarding;
