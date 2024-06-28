import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";

const SuccessScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("Home");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-white ">
      <View className="flex-row mt-28">
        <Image
          source={require("../../../assets/approved.gif")}
          style={{ flex: 1, aspectRatio: 2.0, resizeMode: "contain" }}
        />
      </View>
      <View className="space-y-4">
        <Text
          className="text-3xl text-center"
          style={{ fontFamily: "NotoSansJP-Bold" }}
        >
          Great!
        </Text>
        <Text
          className="w-64 text-center text-gray-600"
          style={{ fontFamily: "NotoSansJP" }}
        >
          Your business trip request has been successfully submitted.
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          className="py-3 mx-7 rounded-xl"
          style={{ backgroundColor: "#212d42" }}
        >
          <Text
            className="text-xl text-center text-white"
            style={{ fontFamily: "NotoSansJP-SemiBold" }}
          >
            Done
          </Text>
        </TouchableOpacity>
        <View className="flex-row justify-center">
          <Text
            className="text-xs text-gray-600"
            style={{ fontFamily: "NotoSansJP" }}
          >
            Apply more?
          </Text>
          <TouchableOpacity>
            <Text
              onPress={() =>
                navigation.navigate("Step 1", {
                  token: access_token,
                  nik: userInfo.NIK,
                  name: userInfo.nama_lengkap,
                  unitKerja: userInfo.unit_kerja,
                  nama_unitKerja: userInfo.nama_unitKerja,
                  nama_jabatan: userInfo.nama_jabatan,
                  accesssRights: userInfo.hak_akses,
                })
              }
              className="text-xs text-red-600"
              style={{ fontFamily: "NotoSansJP-SemiBold" }}
            >
              {" "}
              Click here
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SuccessScreen;
