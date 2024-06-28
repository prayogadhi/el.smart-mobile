import { View, RefreshControl, FlatList, TouchableOpacity } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { ActivityIndicator } from "react-native-paper";

import axios from "axios";
import BusinessTripCard from "../../components/BusinessTripCard";
import EmptyData from "../../components/EmptyData";

import { capitalizeWords } from "./../helpers";

const ITEMS_PER_PAGE = 5;

const ApprovalScreen = ({ navigation, route }) => {
  const { token, nik } = route.params;
  const sekper_status = false;
  const approvement = true;

  const [BusinessTrip, setBusinessTrip] = useState([]);
  const [displayedTrips, setDisplayedTrips] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchData();
      console.log("Refreshed!");
    });
    return unsubscribe;
  }, [navigation]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData().then(() => {
      setRefreshing(false);
    });
  }, []);

  const fetchData = async () => {
    const url =
      process.env.EXPO_PUBLIC_API_URL + "/business-trip/manager-approval-status";
    axios
      .get(url, {
        params: {
          nik: nik,
          status: 1,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setBusinessTrip(response.data.details);
        setDisplayedTrips(response.data.details.slice(0, ITEMS_PER_PAGE));
        setCurrentIndex(ITEMS_PER_PAGE);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const loadMoreData = () => {
    if (currentIndex < BusinessTrip.length) {
      const nextIndex = currentIndex + ITEMS_PER_PAGE;
      setDisplayedTrips((prevTrips) => [
        ...prevTrips,
        ...BusinessTrip.slice(currentIndex, nextIndex),
      ]);
      setCurrentIndex(nextIndex);
    }
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

  const Item = ({
    kode_kegiatan,
    nomor,
    status,
    nama_kegiatan,
    tanggal_pengajuan,
    lokasi,
    data,
    token,
    isLastItem,
  }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Rincian Perjalanan Dinas", {
          data: data,
          token: token,
          approvement: approvement,
          sekper_status: sekper_status,
        })
      }
    >
      <BusinessTripCard
        kode_kegiatan={kode_kegiatan}
        nomor={nomor}
        status={status.toUpperCase()}
        nama_kegiatan={nama_kegiatan}
        tanggal_pengajuan={tanggal_pengajuan}
        lokasi={capitalizeWords(lokasi.substring(0, 25))}
        color="#D97706"
        soft_color="rgba(217, 119, 6, 0.2)"
        style={isLastItem ? 20 : 0}
      />
    </TouchableOpacity>
  );

  const renderItem = ({ item, index }) => {
    const isLastItem = index === displayedTrips.length - 1;
    return (
      <Item
        kode_kegiatan={item.kode_kegiatan}
        nomor={item.nomor}
        status={item.status}
        nama_kegiatan={item.nama_kegiatan}
        tanggal_pengajuan={item.tanggal_pengajuan}
        lokasi={item.lokasi}
        data={item}
        token={token}
        isLastItem={isLastItem}
      />
    );
  };

  return (
    <View
      className="flex-1 flex-col justify-around"
      style={{ backgroundColor: "#f1f5f9" }}
    >
      {displayedTrips.length > 0 ? (
        <FlatList
          data={displayedTrips}
          renderItem={renderItem}
          keyExtractor={(item) => item.id_form_pd_k32}
          contentContainerStyle={{ flexGrow: 1 }}
          style={{ alignSelf: "stretch" }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoading ? <ActivityIndicator size="large" /> : null
          }
        />
      ) : (
        <EmptyData />
      )}
    </View>
  );
};

export default ApprovalScreen;
