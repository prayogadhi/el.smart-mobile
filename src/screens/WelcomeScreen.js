import { View, Text, Image, TouchableOpacity, Linking } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const WelcomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View className="flex-1 flex justify-around">
      <View className="flex-row justify-center"></View>
      <Text
        className="text-5xl text-center"
        style={{ fontFamily: "NotoSansJP-Bold" }}
      >
        Welcome to el
        <Text
          className="text-red-700 text-5xl text-center"
          style={{ fontFamily: "NotoSansJP-SemiBold" }}
        >
          .
        </Text>
        smart
      </Text>
      <View className="flex-row justify-center">
        <Image
          className="mx-4"
          source={require("../assets/welcome.png")}
          style={{ flex: 1, aspectRatio: 1.5, resizeMode: "contain" }}
        />
      </View>
      <View className="space-y-4">
        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          className="py-3 mx-7 rounded-xl"
          style={{ backgroundColor: "#212d42" }}
        >
          <Text
            className="text-xl text-center text-white"
            style={{ fontFamily: "NotoSansJP-SemiBold" }}
          >
            Sign in
          </Text>
        </TouchableOpacity>
        <View className="flex-row justify-center">
          <Text className="font-semibold" style={{ fontFamily: "NotoSansJP" }}>
            Don't have an account yet?
          </Text>
          <TouchableOpacity>
            <Text
              className="text-red-600"
              style={{ fontFamily: "NotoSansJP-SemiBold" }}
              onPress={() => Linking.openURL("https://wa.me/6285930187556")}
            >
              {" "}
              Sign Up here
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default WelcomeScreen;
