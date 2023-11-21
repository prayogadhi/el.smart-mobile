import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import {
  TextInput,
  Icon,
  Dialog,
  Portal,
  Button,
  Divider,
} from "react-native-paper";

const ApprovalButton = (props) => {
  const [note, setNote] = useState("");
  const [visible, setVisible] = React.useState(false);
  const navigation = useNavigation();

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const onApprove = () => {
    console.log(props.id);

    const url =
      process.env.EXPO_PUBLIC_API_URL + "/bussinees-trip/sekper-approved";
    axios
      .put(
        url,
        {
          id_form_pd_k32: props.id,
          pemeriksa_status: 2,
          catatanSekper: note,
          pemeriksa_Nama: props.name,
          pemeriksa_NIK: props.nik,
        },
        {
          headers: {
            token: props.token,
          },
        }
      )
      .then((response) => {
        const res = response.data;
        const { status, result } = res;
        console.log(result);
        if (status === "success") {
          navigation.navigate("Pemeriksaan Perjalanan Dinas", {
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

  return (
    <View className="flex-col bg-white px-6" style={{ minHeight: 170 }}>
      {/* START: Dialog Confirmation */}
      <Portal>
        <Dialog
          className="bg-white rounded-lg"
          visible={visible}
          onDismiss={hideDialog}
        >
          <Dialog.Title
            className="text-base"
            style={{ fontFamily: "NotoSansJP-SemiBold" }}
          >
            Apakah anda yakin?
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              mode="outlined"
              label="Catatan"
              multiline={true}
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={(note) => setNote(note)}
              value={note}
            />
          </Dialog.Content>
          <Divider />
          <Dialog.Actions
            className="py-4"
            style={{ backgroundColor: "#e9e9ea" }}
          >
            <View className="flex-row">
              <Button
                className="mr-3 rounded-md"
                textColor="#64748B"
                mode="text"
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={() => onApprove()}
                buttonColor="#212d42"
                className="rounded-md"
              >
                Approve
              </Button>
            </View>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      {/* END: Dialog Confirmation */}

      <Divider className="mb-2" />
      <View>
        <Button
          mode="contained"
          buttonColor="#0D9588"
          onPress={showDialog}
          className="m-2 rounded-md"
        >
          <Text className="text-lg">Approve</Text>
        </Button>
      </View>
      <View>
        <Button
          mode="contained"
          textColor="#B91C1C"
          buttonColor="rgba(185, 28, 28, 0.2)"
          onPress={() => console.log("Ok")}
          className="m-2 mt-1 rounded-md"
        >
          <Text className="text-lg">Reject</Text>
        </Button>
      </View>
      <View className="items-center mt-2">
        <Text
          className="text-xs text-gray-500"
          style={{ fontFamily: "NotoSansJP" }}
        >
          Apakah biaya perjalanan dinas sudah sesuai?
        </Text>
      </View>
    </View>
  );
};

export default ApprovalButton;
