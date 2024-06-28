import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import axios from "axios";

import { useForm, Controller } from "react-hook-form";
import { WizardStore } from "../store";
import {
  AutocompleteDropdownContextProvider,
  AutocompleteDropdown,
} from "react-native-autocomplete-dropdown";

import {
  Button,
  MD3Colors,
  ProgressBar,
  TextInput,
  SegmentedButtons,
  Divider,
} from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";

export default function Step1Screen({ navigation, route }) {
  const {
    token,
    nik,
    name,
    unitKerja,
    nama_unitKerja,
    nama_jabatan,
    accesssRights,
  } = route.params;

  const [keperluanValue, setKeperluanValue] = useState(" ");
  const [kegiatanValue, setKegiatanValue] = useState(" ");
  const [projectList, setProjectList] = useState(null);

  // project list
  const fetchData = async () => {
    const url =
      process.env.EXPO_PUBLIC_API_URL + "/business-trip/active-project";
    axios
      // const response = await axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const items = response.data.details;
        const suggestions = items.map((item) => ({
          id: item.id_kegiatan,
          title: item.project_code + " - " + item.project_name,
        }));
        setProjectList(suggestions);
        // setIsLoading(false);
      });
  };

  // keep back arrow from showing
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
    });
  }, [navigation]);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ defaultValues: WizardStore.useState((s) => s) });
  const isFocused = useIsFocused();

  useEffect(() => {
    if (keperluanValue === "") {
      setKeperluanValue(" ");
    }
    if (kegiatanValue === "") {
      setKegiatanValue(" ");
    }
    fetchData();
    isFocused &&
      WizardStore.update((s) => {
        s.progress = 0;
      });
  }, [isFocused]);

  const onSubmit = (data) => {
    WizardStore.update((s) => {
      s.progress = 33;
      s.NIK = nik;
      s.fullName = name;
      s.unitKerja = unitKerja;
      s.nama_unitKerja = nama_unitKerja;
      s.nama_jabatan = nama_jabatan;
      s.accesssRights = accesssRights;
      s.activityId = data.activity.id;
      s.activity = data.activity.title;
      s.travelType = data.travelType;
      s.location = data.location;
      s.keperluan = data.keperluan;
      s.token = token;
    });
    navigation.navigate("Step 2");
  };

  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <AutocompleteDropdownContextProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.container}>
              <ProgressBar
                style={styles.progressBar}
                progress={WizardStore.getRawState().progress}
                color={MD3Colors.primary60}
              />

              <View className="flex-1 px-6 py-8 pb-2">
                <View style={styles.card}>
                  {/* <View style={{ paddingHorizontal: 16 }}> */}
                  <View style={styles.formEntry}>
                    <Controller
                      control={control}
                      name="activity"
                      rules={{ required: true }}
                      render={({ field: { onChange, value } }) => (
                        <>
                          <TextInput
                            label="Kegiatan"
                            mode="outlined"
                            value={kegiatanValue}
                            onFocus={() => {
                              if (kegiatanValue === " ") setKegiatanValue("");
                            }}
                            onBlur={() => {
                              if (kegiatanValue === "") setKegiatanValue(" ");
                            }}
                            onChangeText={(text) => {
                              setKegiatanValue(text);
                              onChange(text);
                            }}
                            render={() => (
                              <AutocompleteDropdown
                                clearOnFocus={false}
                                closeOnBlur={true}
                                closeOnSubmit={false}
                                inputContainerStyle={{
                                  backgroundColor: "#fff",
                                  marginLeft: 2,
                                  marginRight: 2,
                                }}
                                onSelectItem={(item) => {
                                  if (item === null) {
                                    setSelectedItem(null);
                                    onChange(null);
                                    setKegiatanValue(" ");
                                  } else if (item) {
                                    setSelectedItem(item);
                                    onChange(item);
                                    setKegiatanValue(item);
                                  } else {
                                    console.error(
                                      "Invalid item selected:",
                                      item
                                    );
                                  }
                                }}
                                suggestionsListContainerStyle={{
                                  top: -75,
                                }}
                                dataSet={projectList}
                                textInputProps={{
                                  placeholder: "Search activity",
                                  autoCorrect: false,
                                  autoCapitalize: "none",
                                }}
                              />
                            )}
                          />
                          {errors.activity && (
                            <Text style={styles.errorText}>
                              This is a required field.
                            </Text>
                          )}
                        </>
                      )}
                    />
                  </View>

                  <View style={styles.formEntry}>
                    <Text
                      className="text-center"
                      style={{ fontSize: 12, paddingBottom: 12 }}
                    >
                      Jenis Perjalanan Dinas
                    </Text>
                    <Controller
                      control={control}
                      name="travelType"
                      rules={{ required: true }}
                      render={({ field: { onChange, value } }) => (
                        <>
                          <SegmentedButtons
                            value={value}
                            onValueChange={onChange}
                            buttons={[
                              { value: "DN", label: "Domestik" },
                              { value: "LN", label: "Internasional" },
                            ]}
                          />
                          {errors.travelType && (
                            <Text style={styles.errorText}>
                              This is a required field.
                            </Text>
                          )}
                        </>
                      )}
                    />
                  </View>

                  <View style={[styles.formEntry]}>
                    <Controller
                      control={control}
                      rules={{
                        required: true,
                      }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          mode="outlined"
                          label="Lokasi"
                          style={{ backgroundColor: "#fff" }}
                          placeholder="Enter destination"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                        />
                      )}
                      name="location"
                    />
                    {errors.location && (
                      <Text style={styles.errorText}>
                        This is a required field.
                      </Text>
                    )}
                  </View>

                  <View style={[styles.formEntry]}>
                    <Controller
                      control={control}
                      name="keperluan"
                      rules={{ required: true }}
                      render={({ field: { onChange, value } }) => (
                        <>
                          <TextInput
                            label="Keperluan"
                            mode="outlined"
                            style={{ backgroundColor: "#fff" }}
                            value={keperluanValue}
                            onFocus={() => {
                              if (keperluanValue === " ") setKeperluanValue("");
                            }}
                            onBlur={() => {
                              if (keperluanValue === "") setKeperluanValue(" ");
                            }}
                            render={() => (
                              <Picker
                                style={{ height: 5, marginTop: -3 }}
                                selectedValue={value}
                                onValueChange={(itemValue) => {
                                  onChange(itemValue);
                                  setKeperluanValue(itemValue);
                                }}
                              >
                                <Picker.Item
                                  value=""
                                  enabled={false}
                                  style={{ color: "#dddfe6" }}
                                  label="Select an option"
                                />
                                <Picker.Item
                                  label="Kordinasi Pekerjaan"
                                  value="Kordinasi Pekerjaan"
                                />
                                <Picker.Item
                                  label="Kordinasi Proyek"
                                  value="Kordinasi Proyek"
                                />
                                <Picker.Item
                                  label="Rapat Kordinasi"
                                  value="Rapat Kordinasi"
                                />
                              </Picker>
                            )}
                          />
                          {errors.keperluan && (
                            <Text style={styles.errorText}>
                              This is a required field.
                            </Text>
                          )}
                        </>
                      )}
                    />
                  </View>

                  <View style={[styles.formEntry]}>
                    <Controller
                      control={control}
                      rules={{
                        required: true,
                      }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          mode="outlined"
                          label="Catatan Pengaju"
                          style={{ backgroundColor: "#fff" }}
                          placeholder="Tulis catatan jika ada"
                          multiline={true}
                          numberOfLines={3}
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                        />
                      )}
                      name="note"
                    />
                  </View>
                </View>
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
                    <Text className="text-lg">Cancel</Text>
                  </Button>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AutocompleteDropdownContextProvider>
  );
}
const styles = StyleSheet.create({
  card: {
    borderTopWidth: 4,
    borderRadius: 6,
    borderTopColor: "#2a4563",
    elevation: 5,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
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
    marginTop: 16,
  },
  formEntry: {
    margin: 8,
    marginTop: 16,
    marginBottom: 16,
  },
  container: {
    flex: 1,
    backgroundColor: "#f3f5f7",
  },
  progressBar: {
    marginBottom: 16,
    paddingHorizontal: 0,
  },
});
