import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Platform,
  ScrollView,
} from "react-native";

import { useForm, Controller } from "react-hook-form";
import { WizardStore } from "../store";
import {
  Button,
  MD3Colors,
  ProgressBar,
  TextInput,
  Divider,
} from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";

import DateTimePicker from "@react-native-community/datetimepicker";

export default function Step2Screen({ navigation }) {
  const information = WizardStore.useState();

  // DateTimePicker
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [daysCount, setDaysCount] = useState(1);

  const handleStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(Platform.OS === "ios");
    setStartDate(currentDate);
    if (currentDate > endDate) {
      setEndDate(currentDate);
      calculateDays(currentDate, currentDate);
    } else {
      calculateDays(currentDate, endDate);
    }
  };

  const handleEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(Platform.OS === "ios");
    setEndDate(currentDate);
    calculateDays(startDate, currentDate);
  };

  const calculateDays = (start, end) => {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDaysCount(diffDays + 1);
  };

  const formatDate = (rawDate) => {
    let date = new Date(rawDate);

    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    return `${day}/${month}/${year} `;
  };

  const formatDateData = (rawDate) => {
    let date = new Date(rawDate);

    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    return `${year}-${month}-${day} `;
  };

  // keep back arrow from showing
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
    });
  }, [navigation]);

  const isFocused = useIsFocused();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ defaultValues: WizardStore.useState((s) => s) });

  useEffect(() => {
    calculateDays(startDate, endDate);
  }, [startDate, endDate]);

  useEffect(() => {
    calculateDays(startDate, endDate);
    isFocused &&
      WizardStore.update((s) => {
        s.progress = 33;
      });

    console.log("updated state...", WizardStore.getRawState().progress);
  }, [isFocused]);

  const onSubmit = () => {
    WizardStore.update((s) => {
      s.progress = 66;
      s.startDateData = formatDateData(startDate);
      s.endDateData = formatDateData(endDate);
      s.startDate = formatDate(startDate);
      s.endDate = formatDate(endDate);
      s.daysCount = daysCount;
    });
    navigation.navigate("Step 3");
  };

  return (
    <View style={styles.container}>
      <ProgressBar
        progress={WizardStore.useState().progress / 100}
        color={MD3Colors.primary60}
      />

      {/* <View> */}
      <View className="flex-1 px-6 py-8 pb-2">
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View style={styles.card}>
            <View style={styles.formEntry}>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    mode="outlined"
                    label="NIK"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={information.NIK}
                    disabled={true}
                  />
                )}
                name="NIK"
              />
              {errors.NIK && (
                <Text style={styles.errorText}>This is a required field.</Text>
              )}
            </View>

            <View style={styles.formEntry}>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    mode="outlined"
                    label="Full Name"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={information.fullName}
                    disabled={true}
                  />
                )}
                name="fullName"
              />
              {errors.fullName && (
                <Text style={styles.errorText}>This is a required field.</Text>
              )}
            </View>

            <View className="flex-row justify-between items-center">
              <View className="basis-2/3">
                {/* START: start date */}
                <View style={styles.formEntry}>
                  <Pressable onPress={() => setShowStartDatePicker(true)}>
                    <TextInput
                      value={formatDate(startDate)}
                      mode="outlined"
                      label="From"
                      placeholder="Select Date"
                      editable={false}
                      style={{ backgroundColor: "#fff" }}
                    />
                  </Pressable>
                </View>

                {showStartDatePicker && (
                  <DateTimePicker
                    testID="startDateTimePicker"
                    value={startDate}
                    mode="date"
                    display="default"
                    onChange={handleStartDateChange}
                    minimumDate={new Date()}
                  />
                )}
                {/* END: start date */}

                {/* START: end date */}
                <View style={styles.formEntry}>
                  <Pressable onPress={() => setShowEndDatePicker(true)}>
                    <TextInput
                      value={formatDate(endDate)}
                      mode="outlined"
                      label="To"
                      editable={false}
                      style={{ backgroundColor: "#fff" }}
                    />
                  </Pressable>
                </View>

                {showEndDatePicker && (
                  <DateTimePicker
                    testID="endDateTimePicker"
                    value={endDate}
                    mode="date"
                    display="default"
                    onChange={handleEndDateChange}
                    minimumDate={startDate}
                  />
                )}
                {/* END: end date */}
              </View>
              <View className="basis-1/3 p-5">
                <Text
                  className="text-xs self-center mb-2"
                  style={{ fontFamily: "NotoSansJP-Medium" }}
                >
                  TOTAL
                </Text>
                <Text
                  className="text-6xl self-center pt-2"
                  style={{ fontFamily: "NotoSansJP-SemiBold" }}
                >
                  {daysCount}
                </Text>
                <Text
                  className="text-base text-red-600 self-center -mt-4"
                  style={{ fontFamily: "NotoSansJP-SemiBold" }}
                >
                  days
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>

      <View className="flex-col px-6" style={{ minHeight: 140 }}>
        <Divider className="mb-2" />
        <View>
          <Button
            mode="contained"
            buttonColor="#2a4563"
            onPress={handleSubmit(onSubmit)}
            className="m-2 rounded-md"
          >
            <Text className="text-lg">Next</Text>
          </Button>
        </View>
        <View>
          <Button
            mode="contained"
            textColor="#2a4563"
            buttonColor="#c3d4e6"
            onPress={() => navigation.goBack()}
            className="m-2 mt-1 rounded-md"
          >
            <Text className="text-lg">Back</Text>
          </Button>
        </View>
      </View>
    </View>
    // </View>
  );
}

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
  errorText: {
    margin: 8,
    marginLeft: 16,
    marginBottom: -16,
    color: "red",
    fontSize: 12,
  },
  button: {
    margin: 8,
  },
  formEntry: {
    margin: 8,
  },
  container: {
    flex: 1,
    backgroundColor: "#f3f5f7",
  },
});
