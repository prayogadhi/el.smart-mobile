import { StyleSheet, Text, View } from "react-native";
import * as React from "react";
import { Icon } from "react-native-paper";

const BusinessTripCard = (props) => {
  return (
    <View
      className="mx-5 mt-5 p-3 justify-between"
      style={[
        styles.card,
        { borderLeftColor: props.color, marginBottom: props.style },
      ]}
    >
      {props.nomor ? (
        <Text
          className="leading-6 text-lg"
          style={{ fontFamily: "NotoSansJP-Medium" }}
        >
          {props.nomor}
        </Text>
      ) : (
        <Text
          className="leading-6 text-lg"
          style={{ fontFamily: "NotoSansJP-Medium" }}
        >
          {props.kode_kegiatan}
        </Text>
      )}
      <Text
        className="leading-6 mb-3"
        style={{ fontFamily: "NotoSansJP-Medium" }}
      >
        {props.nama_kegiatan}
      </Text>
      <View className="flex-row justify-between mb-3">
        <View className="flex-row items-center">
          <Icon
            source="clipboard-text-clock-outline"
            color="#64748B"
            size={15}
          />
          <Text
            className="ml-1 leading-6 text-xs"
            style={{ fontFamily: "NotoSansJP", color: "#64748B" }}
          >
            {props.tanggal_pengajuan}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Icon source="map-marker-outline" color="#64748B" size={15} />
          <Text
            className="ml-1 leading-6 text-xs"
            style={{ fontFamily: "NotoSansJP", color: "#64748B" }}
          >
            {props.lokasi}
          </Text>
        </View>
      </View>
      <View
        className="flex p-1 rounded-md"
        style={{ backgroundColor: props.soft_color }}
      >
        <Text
          className="leading-6 text-xs text-center"
          style={{ fontFamily: "NotoSansJP-SemiBold", color: props.color }}
        >
          {props.status}
        </Text>
      </View>
    </View>
  );
};

export default BusinessTripCard;

const styles = StyleSheet.create({
  card: {
    borderLeftWidth: 4,
    borderRadius: 6,
    backgroundColor: "#fff",
  },
});
