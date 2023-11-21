import { View, Text, Image } from "react-native";
import React from "react";

const EmptyData = () => {
  return (
    <View className="h-screen justify-center items-center">
      <Image
        source={require("../assets/icons/folder-empty_icon.png")}
        style={{ width: 100, height: 100 }}
      />
      <Text style={{ fontFamily: "NotoSansJP", color: "#64748B" }}>
        No data available
      </Text>
    </View>
  );
};

export default EmptyData;
