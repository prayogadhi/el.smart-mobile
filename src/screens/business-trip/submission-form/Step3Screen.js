import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import axios from "axios";

import { useForm, Controller } from "react-hook-form";
import { WizardStore } from "../store";
import {
  Button,
  TextInput,
  MD3Colors,
  ProgressBar,
  Divider,
} from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import {
  AutocompleteDropdownContextProvider,
  AutocompleteDropdown,
} from "react-native-autocomplete-dropdown";

export default function Step3Screen({ navigation }) {
  const information = WizardStore.useState();

  const [applicant, setApplicant] = useState(" ");
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [applicantList, setApplicantList] = useState(null);

  const [approver, setApprover] = useState(" ");
  const [selectedApprover, setSelectedApprover] = useState(null);
  const [approverList, setApproverList] = useState(null);

  const fetchData = async () => {
    const url = process.env.EXPO_PUBLIC_API_URL + "/business-trip/approver";
    axios
      .get(url, {
        params: {
          nik: information.NIK,
          accesssRights: information.accesssRights,
          unitKerja: information.unitKerja,
        },
        headers: {
          Authorization: `Bearer ${information.token}`,
        },
      })
      .then((response) => {
        const items = response.data.details;

        if (information.accesssRights === "3") {
          const suggApplicant = items.atasanLangsung.map((item) => ({
            id: item.NIK,
            title: item.NIK + " - " + item.nama_lengkap,
          }));
          setApplicantList(suggApplicant);
          const suggApprover = items.dataKadep.map((item) => ({
            id: item.NIK,
            title: item.NIK + " - " + item.nama_lengkap,
          }));
          setApproverList(suggApprover);
        } else {
          const suggestions = items.management.map((item) => ({
            id: item.NIK,
            title: item.NIK + " - " + item.nama_lengkap,
          }));
          setApplicantList(suggestions);
          setApproverList(suggestions);
        }
      });
  };

  // keep back arrow from showing
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
    });
  }, [navigation]);

  const isFocused = useIsFocused();

  useEffect(() => {
    fetchData();
    if (applicant === "") {
      setApplicant(" ");
    }
    if (approver === "") {
      setApprover(" ");
    }
    isFocused &&
      WizardStore.update((s) => {
        s.progress = 66;
      });

    console.log("updated state...", WizardStore.getRawState().progress);
  }, [isFocused]);

  const {
    handleSubmit,
    getValues,
    setValue,
    control,
    trigger,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: WizardStore.useState((s) => s),
  });

  const onSubmit = (data) => {
    WizardStore.update((s) => {
      s.progress = 100;
      s.applicant = data.applicant.id;
      s.approver = data.approver.id;
    });
    navigation.navigate("Confirmation");
  };

  return (
    <AutocompleteDropdownContextProvider>
      <View style={styles.container}>
        <ProgressBar
          style={styles.progressBar}
          progress={WizardStore.useState().progress / 100}
          color={MD3Colors.primary60}
        />
        <View className="flex-1 px-6 py-8 pb-2">
          <View style={styles.card}>
            <View style={styles.formEntry}>
              <Controller
                control={control}
                name="applicant"
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <>
                    <TextInput
                      label="Applicant"
                      mode="outlined"
                      value={applicant}
                      onFocus={() => {
                        if (applicant === " ") setApplicant("");
                      }}
                      onBlur={() => {
                        if (applicant === "") setApplicant(" ");
                      }}
                      onChangeText={(text) => {
                        setApplicant(text);
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
                              setSelectedApplicant(null);
                              onChange(null);
                              setApplicant(" ");
                            } else if (item) {
                              setSelectedApplicant(item);
                              onChange(item);
                              setApplicant(item);
                            } else {
                              console.error("Invalid item selected:", item);
                            }
                          }}
                          suggestionsListContainerStyle={{
                            position: "absolute",
                            top: -75,
                            zIndex: 1000,
                            elevation: 1500,
                          }}
                          dataSet={applicantList}
                          textInputProps={{
                            placeholder: "Search activity",
                            autoCorrect: false,
                            autoCapitalize: "none",
                          }}
                        />
                      )}
                    />
                    {errors.applicant && (
                      <Text style={styles.errorText}>
                        This is a required field.
                      </Text>
                    )}
                  </>
                )}
              />
            </View>

            <View style={styles.formEntry}>
              <Controller
                control={control}
                name="approver"
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <>
                    <TextInput
                      label="Approver"
                      mode="outlined"
                      value={approver}
                      onFocus={() => {
                        if (approver === " ") setApprover("");
                      }}
                      onBlur={() => {
                        if (approver === "") setApprover(" ");
                      }}
                      onChangeText={(text) => {
                        setApprover(text);
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
                              setSelectedApprover(null);
                              onChange(null);
                              setApprover(" ");
                            } else if (item) {
                              setSelectedApprover(item);
                              onChange(item);
                              setApprover(item);
                            } else {
                              console.error("Invalid item selected:", item);
                            }
                          }}
                          suggestionsListContainerStyle={{
                            top: -75,
                          }}
                          dataSet={approverList}
                          textInputProps={{
                            placeholder: "Search activity",
                            autoCorrect: false,
                            autoCapitalize: "none",
                          }}
                        />
                      )}
                    />
                    {errors.approver && (
                      <Text style={styles.errorText}>
                        This is a required field.
                      </Text>
                    )}
                  </>
                )}
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
              buttonColor="#c9d8e8"
              onPress={() => navigation.goBack()}
              className="m-2 mt-1 rounded-md"
            >
              <Text className="text-lg">Back</Text>
            </Button>
          </View>
        </View>
      </View>
    </AutocompleteDropdownContextProvider>
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
  button: {
    margin: 8,
  },
  errorText: {
    margin: 8,
    marginLeft: 16,
    marginBottom: 0,
    color: "red",
    fontSize: 12,
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
