import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageBackground,
  Text,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  Avatar,
  IconButton,
  MD3Colors,
} from "react-native-paper";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

import axios from "axios";
import background from "../assets/top_layout.png";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { CredentialsContext } from "../context/CredentialContext";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const HomeScreen = ({ navigation }) => {
  const getTime = new Date().getHours();

  const [expoPushToken, setExpoPushToken] = useState("");

  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const { access_token } = storedCredentials;

  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearLogin = () => {
    AsyncStorage.removeItem("flowerCribCredentials")
      .then(() => {
        setStoredCredentials("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchData = async () => {
    const url = process.env.EXPO_PUBLIC_API_URL + "/user";
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      const { details } = response.data;
      setUserInfo(details[0]);
      setIsLoading(false);
    } catch (error) {
      console.log("Error fetching user data:", error);
      if (error.response && error.response.status === 401) {
        clearLogin();
      } else {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
    console.log("Registering for push notifications...");
    registerForPushNotificationsAsync()
      .then((token) => {
        console.log("token: ", token);
        // setExpoPushToken(token);
      })
      .catch((err) => console.log(err));
  }, []);

  if (isLoading) {
    return (
      <View
        className="flex-1 justify-around"
        style={{ backgroundColor: "#f1f5f9" }}
      >
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  let hello;

  if (getTime >= 3 && getTime < 12) {
    hello = "Morning";
  } else if (getTime >= 12 && getTime < 18) {
    hello = "Afternoon";
  } else {
    hello = "Evening";
  }

  if (userInfo.nama_jabatan === "DIRKEU") {
    userInfo.nama_jabatan = "Direktur Keuangan & Sdm";
  } else if (userInfo.nama_jabatan === "DIRUT") {
    userInfo.nama_jabatan = "Direktur Utama";
  }

  const approvalMenu = () => {
    if (userInfo.hak_akses === "3" || userInfo.hak_akses === "2") {
      return (
        <TouchableOpacity
          className="flex-1"
          style={styles.card}
          onPress={() =>
            navigation.navigate("Persetujuan Perjalanan Dinas", {
              nik: userInfo.NIK,
              nama_lengkap: userInfo.nama_lengkap,
              token: access_token,
            })
          }
        >
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
      );
    }
  };

  const sekperApprovalMenu = () => {
    if (userInfo.unit_kerja === "UK07" && userInfo.jabatan === "15") {
      return (
        <View className="flex-row space-x-3 my-3">
          <TouchableOpacity
            className="flex-1"
            style={styles.card}
            onPress={() =>
              navigation.navigate("Pemeriksaan Perjalanan Dinas", {
                token: access_token,
                approvement: true,
                sekper_nik: userInfo.NIK,
                sekper_name: userInfo.nama_lengkap,
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

  // Notifications configuration
  console.log(Device.modelName);

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      // Learn more about projectId:
      // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: "422f9d37-ec75-4b62-b34e-90a926c33e2c",
        })
      ).data;
      console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    return token;
  }

  const sendNotification = async () => {
    console.log("Sending push notification...");

    // notification message
    const message = {
      to: expoPushToken,
      sound: "default",
      title: "My first push notification!",
      body: "This is my first push notification made with expo rn app",
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        host: "exp.host",
        accept: "application/json",
        "accept-encoding": "gzip, deflate",
        "content-type": "application/json",
      },
      body: JSON.stringify(message),
    });
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 flex-col justify-around">
        <StatusBar style="light" />
        <ImageBackground className="flex-1 justify-center" source={background}>
          <View className="basis-1/5 flex-1">
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
                    {hello}, {userInfo.nama_lengkap}
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
            className="basis-4/5 flex rounded-t-2xl"
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
                  onPress={() => sendNotification()}
                />
              </View>
              <View className="px-5 py-5 justify-center shadow bg-white rounded-md">
                <Text
                  className="leading-6 text-red-700"
                  style={{ fontFamily: "NotoSansJP-SemiBold" }}
                >
                  {userInfo.NIK}
                </Text>
                <Text
                  className="leading-6 text-base"
                  style={{ fontFamily: "NotoSansJP-SemiBold", marginTop: -4 }}
                >
                  {userInfo.nama_lengkap}
                </Text>
                <Text
                  className="leading-6"
                  style={{ fontFamily: "NotoSansJP-SemiBold" }}
                >
                  {userInfo.nama_unitKerja}
                </Text>
                <Text
                  className="leading-6 text-xs text-gray-600"
                  style={{ fontFamily: "NotoSansJP-Medium" }}
                >
                  {userInfo.nama_jabatan}
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
                      nik: userInfo.NIK,
                      nama_lengkap: userInfo.nama_lengkap,
                      token: access_token,
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

                {approvalMenu()}
              </View>
              {sekperApprovalMenu()}
            </ScrollView>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
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
