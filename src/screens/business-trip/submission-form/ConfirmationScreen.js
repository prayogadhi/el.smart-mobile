import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { WizardStore } from "../store";
import {
  Button,
  MD3Colors,
  ProgressBar,
  Divider,
} from "react-native-paper";
import axios from "axios";

export default function ConfirmationScreen({ navigation }) {
  // keep back arrow from showing
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
    });
  }, [navigation]);

  const information = WizardStore.useState();

  const onSubmit = () => {
    const url = process.env.EXPO_PUBLIC_API_URL + "/business-trip";
    axios
      .post(
        url,
        {
          NIK: information.NIK,
          fullName: information.fullName,
          unitKerja: information.unitKerja,
          activityId: information.activityId,
          lokasi: information.location,
          keperluan: information.keperluan,
          Note: " ",
          startDate: information.startDateData,
          endDate: information.endDateData,
          daysCount: information.daysCount,
          jenisPD: information.travelType,
          applicantNIK: information.applicant,
          approverNIK: information.approver,
        },
        {
          headers: {
            Authorization: `Bearer ${information.token}`,
          },
        }
      )
      .then((response) => {
        const res = response.data;
        const { status, result } = res;
        console.log(result);
        clearAndReset();
        if (status === "success") {
          navigation.navigate("Persetujuan Perjalanan Dinas", {
            nik: props.nik,
            approvement: true,
            nama_lengkap: props.name,
            token: props.token,
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const clearAndReset = () => {
    WizardStore.replace({
      activity: "",
      activityId: "",
      travelType: "",
      location: "",
      keperluan: "",
      NIK: "",
      fullName: "",
      unitKerja: "",
      accesssRights: "",
      nama_unitKerja: "",
      nama_jabatan: "",
      startDate: "",
      endDate: "",
      startDateData: "",
      endDateData: "",
      daysCount: "",
      applicant: "",
      approver: "",
      progress: 0,
    });
    navigation.navigate("Success");
  };

  return (
    <View style={styles.container}>
      <ProgressBar
        style={styles.progressBar}
        progress={WizardStore.useState().progress / 100}
        color={MD3Colors.primary60}
      />
      <View className="flex-1 px-6 py-8 pb-2">
        <View style={styles.card}>
          <View className="p-3">
            <View className="flex-col justify-between">
              <View className="mb-2">
                <Text
                  className="text-base"
                  style={{ fontFamily: "NotoSansJP" }}
                >
                  Perjalanan dinas diajukan untuk keperluan{" "}
                  <Text style={{ fontFamily: "NotoSansJP-SemiBold" }}>
                    {information.keperluan}{" "}
                  </Text>
                  di{" "}
                  <Text style={{ fontFamily: "NotoSansJP-SemiBold" }}>
                    {information.location}{" "}
                  </Text>
                  atas kegiatan{" "}
                  <Text
                    className="text-red-700"
                    style={{ fontFamily: "NotoSansJP-Medium" }}
                  >
                    {information.activity}
                  </Text>
                </Text>
              </View>
              <View className="mb-2">
                <Text
                  className="text-xs text-gray-700 text-right"
                  style={{ fontFamily: "NotoSansJP" }}
                >
                  oleh {information.fullName}
                </Text>
              </View>
              <View>
                <View className="items-center">
                  <Text
                    className="text-base mb-2"
                    style={{ fontFamily: "NotoSansJP-SemiBold" }}
                  >
                    Pelaksana
                  </Text>
                </View>
                {/* Pelaksana */}
                <Text
                  className="text-sm"
                  style={{ fontFamily: "NotoSansJP-Medium" }}
                >
                  <Text
                    className="text-sm text-red-700"
                    style={{ fontFamily: "NotoSansJP-Medium" }}
                  >
                    ({information.NIK}){" "}
                  </Text>
                  {information.fullName.trimStart()}
                </Text>
                <Text
                  className="text-sm"
                  style={{ fontFamily: "NotoSansJP-Medium" }}
                >
                  {information.nama_unitKerja}
                </Text>
                <Text
                  className="text-xs text-gray-600"
                  style={{ fontFamily: "NotoSansJP-SemiBold" }}
                >
                  {information.nama_jabatan}
                </Text>
              </View>
            </View>

            <View
              className="my-3 mx-4"
              style={{
                borderBottomColor: "#E2E8F0",
                borderBottomWidth: 0.8,
              }}
            />

            {/* START: Duration */}
            <View className="flex-row justify-around">
              <View className="items-center">
                <Text
                  className="leading-4 text-gray-600"
                  style={{ fontFamily: "NotoSansJP-Medium" }}
                >
                  Start
                </Text>
                <Text
                  className="leading-5"
                  style={{ fontFamily: "NotoSansJP-SemiBold" }}
                >
                  {information.startDate}
                </Text>
              </View>
              <View className="items-center">
                <Text
                  className="leading-4 text-gray-600"
                  style={{ fontFamily: "NotoSansJP-Medium" }}
                >
                  End
                </Text>
                <Text
                  className="leading-5"
                  style={{ fontFamily: "NotoSansJP-SemiBold" }}
                >
                  {information.endDate}
                </Text>
              </View>
              <View className="items-center">
                <Text
                  className="leading-4 text-gray-600"
                  style={{ fontFamily: "NotoSansJP-Medium" }}
                >
                  Total
                </Text>
                <Text
                  className="leading-5"
                  style={{ fontFamily: "NotoSansJP-SemiBold" }}
                >
                  {information.daysCount} day
                </Text>
              </View>
            </View>
            {/* END: Duration */}
          </View>
        </View>
      </View>

      <View className="flex-col px-6" style={{ minHeight: 140 }}>
        <Divider className="mb-2" />
        <View>
          <Button
            mode="contained"
            buttonColor="#2a4563"
            onPress={onSubmit}
            className="m-2 rounded-md"
          >
            <Text className="text-lg">Submit</Text>
          </Button>
        </View>
        <View>
          <Button
            mode="contained"
            textColor="#2a4563"
            buttonColor="#c9d8e8"
            onPress={() => navigation.navigate("Step 3")}
            className="m-2 mt-1 rounded-md"
          >
            <Text className="text-lg">Back</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}

export const SummaryEntry = ({ name, label }) => {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ marginBottom: 8, fontWeight: "700" }}>{label}</Text>
      <Text style={{ marginBottom: 8 }}>{name}</Text>
      <Divider />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderTopWidth: 4,
    borderRadius: 6,
    borderTopColor: "#2a4563",
    // elevation: 10,
    backgroundColor: "#fff",
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.2,
    // shadowRadius: 4,
    padding: 5,
    paddingVertical: 15,
    marginBottom: 15,
  },
  button: {
    margin: 8,
  },
  formEntry: {
    margin: 8,
  },
  container: {
    flex: 1,
  },
  progressBar: {
    marginBottom: 16,
  },
});
