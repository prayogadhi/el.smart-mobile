import { View, Text, ImageBackground, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";

import { Appbar, Icon, ActivityIndicator } from "react-native-paper";
import background from "../../assets/top_layout.png";
import ApprovalButton from "../../components/ApprovalButton";
import { capitalizeWords } from "../helpers"

const DetailScreen = ({ route, navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const {
    id_form_pd_k32,
    kode_kegiatan,
    nomor,
    status,
    nama_kegiatan,
    keperluan,
    tanggal_pengajuan,
    lokasi,
    kendaraan,
    mengajukan_Nama,
    penyetuju_Nama_1,
    penyetuju_Nama_2,
    mengajukan_status,
    perhitungan_status_sekper,
    pemeriksa_status,
    penyetuju_status_1,
    penyetuju_status_2,
    role_status,
    status_PD,
    jenisPD,
  } = route.params.data;

  const [TripType, setTripType] = useState(jenisPD);

  const [Detail, setDetail] = useState([]);

  if (TripType === "DN") {
    setTripType("Dalam Negeri");
  } else if (TripType === "LN") {
    setTripType("Luar Negeri");
  }

  const expensesTrip = (cost) => {
    if (cost !== "0") {
      return (
        <View>
          <Text
            className="text-xs self-end mr-2"
            style={{ fontFamily: "NotoSansJP" }}
          >
            Jumlah
          </Text>
          <Text
            className="text-3xl self-end"
            style={{ fontFamily: "NotoSansJP-SemiBold" }}
          >
            {cost}
          </Text>
        </View>
      );
    }
  };

  const anotherApprover = (penyetuju_Nama_2) => {
    if (penyetuju_Nama_2 !== null) {
      return (
        <View className="flex-row items-center mt-1">
          {statusIcon(penyetuju_status_2)}
          <Text className="ml-3">
            <View className="flex-col">
              <Text
                className="text-sm"
                style={{ fontFamily: "NotoSansJP-SemiBold" }}
              >
                {penyetuju_Nama_2}
              </Text>
              <Text className="text-xs" style={{ fontFamily: "NotoSansJP" }}>
                sebagai penyetuju
              </Text>
            </View>
          </Text>
        </View>
      );
    }
  };

  // Approval
  const approvement = route.params.approvement;
  const sekper_nik = route.params.sekper_nik;
  const sekper_nama = route.params.sekper_name;

  const approvalButton = (approvement) => {
    if (approvement === true) {
      const sekper_status = route.params.sekper_status;
      return (
        <ApprovalButton
          id={id_form_pd_k32}
          nik={sekper_nik}
          name={sekper_nama}
          token={token}
          sekper_status={sekper_status}
          role_status={role_status}
          second_approval={penyetuju_Nama_2}
        ></ApprovalButton>
      );
    }
  };

  const statusIcon = (statusValue) => {
    if (statusValue === 0) {
      return <Icon source="timeline-text-outline" color="#c0c2c7" size={25} />;
    } else if (statusValue === 1) {
      return <Icon source="timeline-clock-outline" color="#d97700" size={25} />;
    } else if (statusValue === 2) {
      return <Icon source="timeline-check-outline" color="#0D9488" size={25} />;
    } else if (statusValue === 3) {
      return (
        <Icon source="timeline-remove-outline" color="#B91C1C" size={25} />
      );
    }
  };
  // Capitalize the First Letter of Each Word
  // const capitalizeWords = (str) => {
  //   return str
  //     .toLowerCase()
  //     .split(" ")
  //     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  //     .join(" ");
  // };

  // Detail data
  const token = route.params.token;

  const fetchData = async () => {
    const url = process.env.EXPO_PUBLIC_API_URL + "/business-trip/detail";
    axios
      .get(url, {
        params: {
          id_form_pd_k32: id_form_pd_k32,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setDetail(response.data);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <View
        className="flex-1 justify-around"
        // style={{ backgroundColor: "#f1f5f9" }}
      >
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 flex-col justify-around">
      <ImageBackground className="flex-1 justify-center" source={background}>
        <View className="basis-1/4">
          <Appbar.Header className="bg-transparent">
            <Appbar.BackAction
              color="white"
              onPress={() => navigation.goBack()}
            />
            <Appbar.Content color="white" title="Rincian Perjalanan Dinas" />
          </Appbar.Header>
          <View className="flex-1 flex-col items-start justify-end mb-5 ml-5 space-y-1">
            {nomor ? (
              <Text
                className="leading-6 text-2xl text-white"
                style={{ fontFamily: "NotoSansJP-SemiBold" }}
              >
                {nomor}
              </Text>
            ) : (
              <Text
                className="leading-6 text-2xl text-white"
                style={{ fontFamily: "NotoSansJP-SemiBold" }}
              >
                # &nbsp; -
              </Text>
            )}
            <View className="flex-row items-center">
              <Icon
                source="clipboard-text-clock-outline"
                color="#fff"
                size={16}
              />
              <Text
                className="ml-2 leading-6 text-sm text-white"
                style={{ fontFamily: "NotoSansJP-Medium" }}
              >
                {tanggal_pengajuan}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Icon source="map-marker-outline" color="#fff" size={16} />
              <Text
                className="ml-2 leading-6 text-sm text-white"
                style={{ fontFamily: "NotoSansJP-Medium" }}
              >
                {lokasi}
              </Text>
            </View>
          </View>
        </View>

        <View className="basis-3/4 rounded-t-3xl">
          <View className="flex-1 bg-white px-6 py-8 pb-2">
            <ScrollView
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
            >
              <View className="flex-col">
                <Text
                  className="text-lg"
                  style={{ fontFamily: "NotoSansJP-Bold" }}
                >
                  #{kode_kegiatan}
                </Text>
                <Text
                  className="text-xs leading-5 mb-1"
                  style={{ fontFamily: "NotoSansJP" }}
                >
                  {nama_kegiatan}
                </Text>
                <View className="flex-row">
                  <Text
                    className="text-sm"
                    style={{ fontFamily: "NotoSansJP-Medium" }}
                  >
                    Perjalanan {TripType}
                  </Text>
                  <Text
                    className="text-sm"
                    style={{ fontFamily: "NotoSansJP-Medium" }}
                  >
                    &nbsp;untuk {capitalizeWords(keperluan)}
                  </Text>
                </View>
                <Text
                  className="text-sm"
                  style={{ fontFamily: "NotoSansJP-Medium" }}
                >
                  menggunakan Kendaraan {capitalizeWords(kendaraan)}
                </Text>
                <Text
                  className="text-lg mt-4"
                  style={{ fontFamily: "NotoSansJP-Bold" }}
                >
                  Status Persetujuan
                </Text>
                {/* START: Status Persetujuan */}
                <View className="flex-row items-center mt-2">
                  {statusIcon(mengajukan_status)}
                  <Text className="ml-3">
                    <View className="flex-col">
                      <Text
                        className="text-sm"
                        style={{ fontFamily: "NotoSansJP-SemiBold" }}
                      >
                        {mengajukan_Nama}
                      </Text>
                      <Text
                        className="text-xs"
                        style={{ fontFamily: "NotoSansJP" }}
                      >
                        sebagai pengaju
                      </Text>
                    </View>
                  </Text>
                </View>
                <View className="flex-row items-center mt-1">
                  {statusIcon(penyetuju_status_1)}
                  <Text className="ml-3">
                    <View className="flex-col">
                      <Text
                        className="text-sm"
                        style={{ fontFamily: "NotoSansJP-SemiBold" }}
                      >
                        {penyetuju_Nama_1}
                      </Text>
                      <Text
                        className="text-xs"
                        style={{ fontFamily: "NotoSansJP" }}
                      >
                        sebagai penyetuju
                      </Text>
                    </View>
                  </Text>
                </View>
                {anotherApprover(penyetuju_Nama_2)}
                {/* END: Status Persetujuan */}
                <Text
                  className="text-lg mt-4"
                  style={{ fontFamily: "NotoSansJP-Bold" }}
                >
                  Pelaksana
                </Text>
                {/* START: Daftar Pelaksana */}
                {Detail.details && Detail.details.length > 0 && (
                  <View className="mt-2">
                    {Detail.details.map((data) => {
                      return (
                        <View key={data.id_form_pd_k32_detail} className="mb-5">
                          <View className="flex-row justify-between items-center">
                            <View>
                              <Text
                                className="text-sm"
                                style={{ fontFamily: "NotoSansJP-SemiBold" }}
                              >
                                {data.nama_lengkap.trimStart()}
                              </Text>
                              <Text
                                className="text-xs"
                                style={{ fontFamily: "NotoSansJP" }}
                              >
                                {data.NIK}
                              </Text>
                              <Text
                                className="text-red-700 text-xs"
                                style={{ fontFamily: "NotoSansJP-SemiBold" }}
                              >
                                {data.unitKerja}
                              </Text>
                              <Text
                                className="text-sm"
                                style={{ fontFamily: "NotoSansJP-SemiBold" }}
                              >
                                {data.jabatan}
                              </Text>
                            </View>
                            {expensesTrip(data.lp_jumlah)}
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
                                className="leading-4"
                                style={{ fontFamily: "NotoSansJP-SemiBold" }}
                              >
                                Start
                              </Text>
                              <Text
                                className="leading-5"
                                style={{ fontFamily: "NotoSansJP" }}
                              >
                                {data.jangka_waktu_awal}
                              </Text>
                            </View>
                            <View className="items-center">
                              <Text
                                className="leading-4"
                                style={{ fontFamily: "NotoSansJP-SemiBold" }}
                              >
                                End
                              </Text>
                              <Text
                                className="leading-5"
                                style={{ fontFamily: "NotoSansJP" }}
                              >
                                {data.jangka_waktu_akhir}
                              </Text>
                            </View>
                            <View className="items-center">
                              <Text
                                className="leading-4"
                                style={{ fontFamily: "NotoSansJP-SemiBold" }}
                              >
                                Total
                              </Text>
                              <Text
                                className="leading-5"
                                style={{ fontFamily: "NotoSansJP" }}
                              >
                                {data.total_hari}
                              </Text>
                            </View>
                          </View>
                          {/* END: Duration */}
                        </View>
                      );
                    })}
                  </View>
                )}
                {/* END: Daftar Pelaksana */}
              </View>
            </ScrollView>
          </View>
          {/* START: Confirmation Bar */}
          {approvalButton(approvement)}
          {/* END: Confirmation Bar */}
        </View>
      </ImageBackground>
    </View>
  );
};

export default DetailScreen;
