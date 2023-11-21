import React, { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import RootStack from "./src/navigation/RootStack";

// import AppLoading from "expo-app-loading";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { CredentialsContext } from "./src/context/CredentialContext";

export default function App() {
  const [fontsLoaded] = useFonts({
    NotoSansJP: require("./src/assets/fonts/NotoSansJP-Regular.ttf"),
    "NotoSansJP-Medium": require("./src/assets/fonts/NotoSansJP-Medium.ttf"),
    "NotoSansJP-SemiBold": require("./src/assets/fonts/NotoSansJP-SemiBold.ttf"),
    "NotoSansJP-Bold": require("./src/assets/fonts/NotoSansJP-Bold.ttf"),
  });

  const [appReady, setAppReady] = useState(false);
  const [storedCredentials, setStoredCredentials] = useState("");

  const checkLoginCredentials = () => {
    AsyncStorage.getItem("flowerCribCredentials")
      .then((result) => {
        if (result !== null) {
          setStoredCredentials(JSON.parse(result));
        } else {
          setStoredCredentials(null);
        }
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    async function prepare() {
      try {
        checkLoginCredentials();
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.warn(e);
      } finally {
        setAppReady(true);
      }
    }
    prepare();
  }, []);

  if (!fontsLoaded) {
    return undefined;
  } else {
    SplashScreen.hideAsync();
  }

  // if (!appReady) {
  //   return (
  //     <AppLoading
  //       startAsync={checkLoginCredentials}
  //       onFinish={() => setAppReady(true)}
  //       onError={console.warn}
  //     />
  //   );
  // }

  return (
    <CredentialsContext.Provider
      value={{ storedCredentials, setStoredCredentials }}
    >
      <RootStack />
    </CredentialsContext.Provider>
  );
}
