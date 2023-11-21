import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageBackground,
  Text,
  StyleSheet,
} from "react-native";
import React, { useContext } from "react";
import { StatusBar } from "expo-status-bar";
import { Avatar } from "react-native-paper";
import { IconButton, MD3Colors } from "react-native-paper";
import background from "../assets/top_layout.png";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { CredentialsContext } from "../context/CredentialContext";

const HomeScreen = ({ navigation }) => {
  const getTime = new Date().getHours();

  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const {
    NIK,
    nama_lengkap,
    unitKerja,
    jabatan,
    token,
    id_unitKerja,
    id_jabatan,
  } = storedCredentials;

  let hello;

  if (getTime >= 3 && getTime < 12) {
    hello = "Morning";
  } else if (getTime >= 12 && getTime < 18) {
    hello = "Afternoon";
  } else {
    hello = "Evening";
  }

  const sekperApprovalMenu = () => {
    if (id_unitKerja === "UK07" && id_jabatan === "15") {
      return (
        <View className="flex-row space-x-3 my-3">
          <TouchableOpacity
            className="flex-1"
            style={styles.card}
            onPress={() =>
              navigation.navigate("Pemeriksaan Perjalanan Dinas", {
                token: token,
                approvement: true,
                sekper_nik: NIK,
                sekper_name: nama_lengkap,
              })
            }
          >
            <View className="py-5 items-center">
              <Image
                source={require("../assets/icons/perjalanan-dinas-pemeriksaan_icon.png")}
                style={{ width: 50, height: 50 }}
              />
              <Text
                className="leading-6 text-xs mt-3"
                style={{ fontFamily: "NotoSansJP-Medium" }}
              >
                Pemeriksaan
              </Text>
            </View>
          </TouchableOpacity>
          <View
            className="flex-1"
            style={(styles.card, { backgroundColor: "#f3f5f7" })}
          ></View>
          <View
            className="flex-1"
            style={(styles.card, { backgroundColor: "#f3f5f7" })}
          ></View>
        </View>
      );
    }
  };

  const clearLogin = () => {
    AsyncStorage.removeItem("flowerCribCredentials")
      .then(() => {
        setStoredCredentials("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <View className="flex-1 flex-col justify-around">
      <StatusBar style="light" />
      <ImageBackground className="flex-1 justify-center" source={background}>
        <View className="basis-1/5">
          <View className="mx-7 flex-1 flex-row justify-between items-end mb-10">
            <View className="flex-row">
              <Avatar.Image
                size={50}
                source={require("../assets/avatar.jpg")}
              />
              <View className="flex-col ml-3">
                <Text
                  className="text-white leading-5"
                  style={{ fontFamily: "NotoSansJP" }}
                >
                  {hello}, {nama_lengkap}
                </Text>
                <Text
                  className="text-white text-xl"
                  style={{ fontFamily: "NotoSansJP-Medium" }}
                >
                  Welcome Back!
                </Text>
              </View>
            </View>

            <IconButton
              icon="logout-variant"
              iconColor={MD3Colors.neutral100}
              size={25}
              onPress={clearLogin}
            />
          </View>
        </View>
        <View
          className="basis-4/5 rounded-t-2xl"
          style={{ backgroundColor: "#f3f5f7" }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            // contentContainerStyle={{ paddingBottom: 50 }}
            className="pt-14 mx-7"
          >
            {/* Profile */}
            <View className="flex-row justify-between items-center mb-2">
              <Text
                className="text-base"
                style={{ fontFamily: "NotoSansJP-SemiBold" }}
              >
                Profile
              </Text>
              <IconButton
                icon="note-edit-outline"
                iconColor={MD3Colors.neutral0}
                size={18}
                mode="contained"
                onPress={() => console.log("Pressed")}
              />
            </View>
            <View className="px-5 py-5 justify-center shadow bg-white rounded-md">
              <Text
                className="leading-6 text-base"
                style={{ fontFamily: "NotoSansJP-SemiBold" }}
              >
                {nama_lengkap}
              </Text>
              <Text
                className="leading-6"
                style={{ fontFamily: "NotoSansJP-SemiBold" }}
              >
                {NIK}
              </Text>
              <Text
                className="leading-6 text-red-700"
                style={{ fontFamily: "NotoSansJP-SemiBold" }}
              >
                {unitKerja}
              </Text>
              <Text
                className="leading-6"
                style={{ fontFamily: "NotoSansJP-SemiBold" }}
              >
                {jabatan}
              </Text>
            </View>
            {/* Perjalanan Dinas */}
            <View className="flex-row justify-between items-center mt-5">
              <Text
                className="text-base mb-4"
                style={{ fontFamily: "NotoSansJP-SemiBold" }}
              >
                Perjalanan Dinas
              </Text>
            </View>
            <View className="flex-row space-x-3">
              <TouchableOpacity
                className="flex-1"
                style={styles.card}
                onPress={() => navigation.navigate("Step 1")}
              >
                <View className="py-5 items-center">
                  <Image
                    source={require("../assets/icons/perjalanan-dinas-pengajuan_icon.png")}
                    style={{ width: 50, height: 50 }}
                  />
                  <Text
                    className="leading-6 text-xs mt-3"
                    style={{ fontFamily: "NotoSansJP-Medium" }}
                  >
                    Pengajuan
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1"
                style={styles.card}
                onPress={() =>
                  navigation.navigate("Status Perjalanan Dinas", {
                    nik: NIK,
                    nama_lengkap: nama_lengkap,
                    token: token,
                  })
                }
              >
                <View className="py-5 items-center">
                  <Image
                    source={require("../assets/icons/perjalanan-dinas-status_icon.png")}
                    style={{ width: 50, height: 50 }}
                  />
                  <Text
                    className="leading-6 text-xs mt-3"
                    style={{ fontFamily: "NotoSansJP-Medium" }}
                  >
                    Status
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1" style={styles.card}>
                <View className="py-5 items-center">
                  <Image
                    source={require("../assets/icons/perjalanan-dinas-persetujuan_icon.png")}
                    style={{ width: 50, height: 50 }}
                  />
                  <Text
                    className="leading-6 text-xs mt-3"
                    style={{ fontFamily: "NotoSansJP-Medium" }}
                  >
                    Persetujuan
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            {sekperApprovalMenu()}
          </ScrollView>
        </View>
      </ImageBackground>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  card: {
    borderRadius: 6,
    elevation: 10,
    backgroundColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowColor: "#dfdfdf",
    shadowOpacity: 1,
    shadowRadius: 2,
  },
});
