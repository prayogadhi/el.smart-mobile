import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  Linking,
} from "react-native";
import React, { useState, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import { Appbar, TextInput } from "react-native-paper";
import background from "../assets/top_layout.png";
import { useForm, Controller } from "react-hook-form";

import axios from "axios";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { CredentialsContext } from "../context/CredentialContext";

const LoginScreen = ({ navigation }) => {
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const {
    setValue,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nik: "",
      password: "",
    },
  });
  const onSubmit = (data) => {
    const credentials = {
      username: data.nik,
      password: data.password,
    };
    const baseUrl = process.env.EXPO_PUBLIC_API_URL + "/login";
    axios
      .post(baseUrl, credentials)
      .then((response) => {
        const res = response.data;
        const { success, details } = res;
        if (success === true) {
          persistLogin(details);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const onChange = (arg) => {
    return {
      value: arg.nativeEvent.text,
    };
  };

  const persistLogin = (credentials, message, status) => {
    AsyncStorage.setItem("flowerCribCredentials", JSON.stringify(credentials))
      .then(() => {
        setStoredCredentials(credentials);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <View className="flex-1 flex-col justify-around">
      <StatusBar style="light" />
      <ImageBackground className="flex-1 justify-center" source={background}>
        <View className="flex-1">
          <Appbar.Header className="bg-transparent">
            <Appbar.BackAction
              color="white"
              size={45}
              onPress={() => navigation.goBack()}
            />
          </Appbar.Header>
          <View className="flex-1 flex-row items-end mb-5 ml-5"></View>
        </View>

        <View className="flex-1 rounded-t-3xl bg-white">
          <View
            style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
            className="flex-1 bg-white px-8 pt-8"
          >
            <View className="flex-row">
              <Text
                className="text-3xl"
                style={{ fontFamily: "NotoSansJP-Bold" }}
              >
                Getting Started
              </Text>
            </View>
            <Text
              className="font-semibold"
              style={{ fontFamily: "NotoSansJP" }}
            >
              Let's login for explorer continues
            </Text>
            <View className="form space-y-2">
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="NIK"
                    mode="outlined"
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    value={value}
                    className="mb-3"
                  />
                )}
                name="nik"
                rules={{ required: true }}
              />
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="Password"
                    mode="outlined"
                    secureTextEntry={!showPassword}
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    value={value}
                    right={
                      <TextInput.Icon
                        icon={showPassword ? "eye-off" : "eye"}
                        onPress={togglePassword}
                      />
                    }
                  />
                )}
                name="password"
                rules={{ required: true }}
              />
              <View className="flex items-end">
                <TouchableOpacity
                  onPress={() => Linking.openURL("https://wa.me/6285930187556")}
                >
                  <Text className="text-gray-700 mb-5">Forgot Password?</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                className="py-3 rounded-xl"
                style={{ backgroundColor: "#212d42" }}
                onPress={handleSubmit(onSubmit)}
              >
                <Text
                  className="text-xl text-center text-white"
                  style={{ fontFamily: "NotoSansJP-SemiBold" }}
                >
                  Login
                </Text>
              </TouchableOpacity>
            </View>
            <View className="flex-row justify-center mt-7">
              <Text
                className="font-semibold"
                style={{ fontFamily: "NotoSansJP" }}
              >
                Don't have an account yet?
              </Text>
              <TouchableOpacity
                onPress={() => Linking.openURL("https://wa.me/6285930187556")}
              >
                <Text
                  className="text-red-600"
                  style={{ fontFamily: "NotoSansJP-SemiBold" }}
                >
                  {" "}
                  Sign Up here
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;
