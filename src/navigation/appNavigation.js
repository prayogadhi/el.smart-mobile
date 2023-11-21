import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {
  ProgressBar,
  MD3Colors,
  Provider as PaperProvider,
} from "react-native-paper";

import HomeScreen from "../screens/HomeScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";

// Business Trip Submission
import Step1Screen from "../screens/business-trip/submission-form/Step1Screen";
import Step2Screen from "../screens/business-trip/submission-form/Step2Screen";
import Step3Screen from "../screens/business-trip/submission-form/Step3Screen";
import ConfirmationScreen from "../screens/business-trip/submission-form/ConfirmationScreen";
// Business Trip Status
import BusinessTripPendingStatus from "../screens/business-trip/status/PendingScreen";
import BusinessTripApprovedStatus from "../screens/business-trip/status/ApprovedScreen";
import BusinessTripRejectedStatus from "../screens/business-trip/status/RejectedScreen";
import { AuthProvider } from "../context/AuthContext";
// Business Trip Approval
const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

function StackNavigator() {
  return (
    <PaperProvider>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen
          name="Home"
          options={{ headerShown: false }}
          component={HomeScreen}
        />
        <Stack.Screen
          name="Welcome"
          options={{ headerShown: false }}
          component={WelcomeScreen}
        />
        <Stack.Screen
          name="Login"
          options={{ headerShown: false }}
          component={LoginScreen}
        />

        {/* START: Business Trip Submission */}
        <Stack.Screen
          name="Step 1"
          options={{
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
            headerStyle: {
              backgroundColor: "#1f2d42",
            },
            headerTintColor: "#fff",
            headerTitleAlign: "center",
          }}
          component={ConfirmationScreen}
        />
        {/* END: Business Trip Submission */}

        {/* START: Business Trip Status */}
        <Stack.Screen
          name="Status Perjalanan Dinas"
          options={{
            headerStyle: {
              backgroundColor: "#1f2d42",
            },
            headerTintColor: "#fff",
            headerTitleAlign: "center",
          }}
          component={Status}
        />
        {/* END: Business Trip Status */}
      </Stack.Navigator>
    </PaperProvider>
  );
}

function Status() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        indicatorStyle: {
          backgroundColor: "#1f2d42",
        },
      }}
    >
      <Tab.Screen name="Pending" component={BusinessTripPendingStatus} />
      <Tab.Screen name="Approved" component={BusinessTripApprovedStatus} />
      <Tab.Screen name="Rejected" component={BusinessTripRejectedStatus} />
    </Tab.Navigator>
  );
}

export default function AppNavigation() {
  return (
    <AuthProvider>
      <NavigationContainer>
        {/* <AuthStack /> */}
        <StackNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
