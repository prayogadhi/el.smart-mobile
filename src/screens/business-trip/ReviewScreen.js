import { View, ScrollView, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { ActivityIndicator } from "react-native-paper";

import axios from "axios";
import BusinessTripCard from "../../components/BusinessTripCard";
import EmptyData from "../../components/EmptyData";

const ReviewScreen = ({ navigation, route }) => {
  const token = route.params.token;
  const approvement = route.params.approvement;
  const sekper_nik = route.params.sekper_nik;
  const sekper_name = route.params.sekper_name;

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchData();
      console.log("Refreshed!");
    });
    return unsubscribe;
  }, [navigation]);

  const [BusinessTrip, setBusinessTrip] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    const url = process.env.EXPO_PUBLIC_API_URL + "/bussinees-trip/sekper-get";
    axios
      // const response = await axios
      .get(url, {
        params: {
          pemeriksa_status: 1,
        },
        headers: {
          token: token,
        },
      })
      .then((response) => {
        setBusinessTrip(response.data);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Capitalize the First Letter of Each Word
  const capitalizeWords = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

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

  return (
    <View
      className="flex-1 flex-col justify-around"
      style={{ backgroundColor: "#f1f5f9" }}
    >
      {BusinessTrip.result && BusinessTrip.result.length > 0 && (
        <ScrollView>
          <View className="mt-5">
            {BusinessTrip.result.map((data) => {
              return (
                <View key={data.id_form_pd_k32}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("Rincian Perjalanan Dinas", {
                        data: data,
                        token: token,
                        approvement: approvement,
                        sekper_nik: sekper_nik,
                        sekper_name: sekper_name,
                      })
                    }
                  >
                    <BusinessTripCard
                      kode_kegiatan={data.pengaju_nama_lengkap}
                      nomor={data.nomor}
                      status={data.status.toUpperCase()}
                      nama_kegiatan={data.nama_kegiatan}
                      tanggal_pengajuan={data.tanggal_pengajuan}
                      lokasi={capitalizeWords(data.lokasi.substring(0, 25))}
                      color="rgba(217, 119, 6, 1)"
                      soft_color="rgba(217, 119, 6, 0.2)"
                    />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}
      {!BusinessTrip.result ||
        (BusinessTrip.result.length === 0 && <EmptyData />)}
    </View>
  );
};

export default ReviewScreen;
