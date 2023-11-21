import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import { CredentialsContext } from "../context/CredentialContext";
import { TokenContext } from "../context/TokenContext";

import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import DetailScreen from "../screens/business-trip/DetailScreen";
// Business Trip Submission
import Step1Screen from "../screens/business-trip/submission-form/Step1Screen";
import Step2Screen from "../screens/business-trip/submission-form/Step2Screen";
import Step3Screen from "../screens/business-trip/submission-form/Step3Screen";
import ConfirmationScreen from "../screens/business-trip/submission-form/ConfirmationScreen";
// Business Trip Status
import BusinessTripPendingStatus from "../screens/business-trip/status/PendingScreen";
import BusinessTripApprovedStatus from "../screens/business-trip/status/ApprovedScreen";
import BusinessTripRejectedStatus from "../screens/business-trip/status/RejectedScreen";

import ReviewScreen from "../screens/business-trip/ReviewScreen";

import { Provider as PaperProvider } from "react-native-paper";

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

function Status({ route }) {
  return (
    <TokenContext.Provider value={route.params}>
      <Tab.Navigator
        screenOptions={{
          tabBarIndicatorStyle: {
            backgroundColor: "#1f2d42",
          },
        }}
      >
        <Tab.Screen name="Pending" component={BusinessTripPendingStatus} />
        <Tab.Screen name="Approved" component={BusinessTripApprovedStatus} />
        <Tab.Screen name="Rejected" component={BusinessTripRejectedStatus} />
      </Tab.Navigator>
    </TokenContext.Provider>
  );
}

const RootStack = () => {
  return (
    <CredentialsContext.Consumer>
      {({ storedCredentials }) => (
        <NavigationContainer>
          <PaperProvider>
            <Stack.Navigator
              screenOptions={{ headerShown: false }}
              initialRouteName="Welcome"
            >
              {storedCredentials ? (
                <>
                  <Stack.Screen name="Home" component={HomeScreen} />
                  <Stack.Screen
                    name="Rincian Perjalanan Dinas"
                    component={DetailScreen}
                  />
                  <Stack.Screen
                    name="Pemeriksaan Perjalanan Dinas"
                    options={{
                      headerShown: true,
                      headerStyle: {
                        backgroundColor: "#1f2d42",
                      },
                      headerTintColor: "#fff",
                    }}
                    component={ReviewScreen}
                  />

                  {/* START: Business Trip Submission */}
                  <Stack.Screen
                    name="Step 1"
                    options={{
                      headerShown: true,
                      headerStyle: {
                        backgroundColor: "#1f2d42",
                      },
                      headerTintColor: "#fff",
                      headerTitleAlign: "center",
                    }}
                    component={Step1Screen}
                  />
                  <Stack.Screen
                    name="Step2"
                    options={{
                      headerShown: true,
                      headerStyle: {
                        backgroundColor: "#1f2d42",
                      },
                      headerTintColor: "#fff",
                      headerTitleAlign: "center",
                    }}
                    component={Step2Screen}
                  />
                  <Stack.Screen
                    name="Step3"
                    options={{
                      headerShown: true,
                      headerStyle: {
                        backgroundColor: "#1f2d42",
                      },
                      headerTintColor: "#fff",
                      headerTitleAlign: "center",
                    }}
                    component={Step3Screen}
                  />
                  <Stack.Screen
                    name="Confirmation"
                    options={{
                      headerShown: true,
                      headerStyle: {
                        backgroundColor: "#1f2d42",
                      },
                      headerTintColor: "#fff",
                      headerTitleAlign: "center",
                    }}
                    component={ConfirmationScreen}
                  />
                  {/* END: Business Trip Submission */}
                  <Stack.Screen
                    name="Status Perjalanan Dinas"
                    options={{
                      headerShown: true,
                      headerStyle: {
                        backgroundColor: "#1f2d42",
                      },
                      headerTintColor: "#fff",
                      headerTitleAlign: "center",
                    }}
                    component={Status}
                  />
                </>
              ) : (
                <>
                  <Stack.Screen name="Welcome" component={WelcomeScreen} />
                  <Stack.Screen name="Login" component={LoginScreen} />
                </>
              )}
            </Stack.Navigator>
          </PaperProvider>
        </NavigationContainer>
      )}
    </CredentialsContext.Consumer>
  );
};

export default RootStack;
