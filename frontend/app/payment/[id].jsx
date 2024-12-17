import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import axios from "axios";

const PaymentPage = () => {
  const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { id } = useLocalSearchParams();
  const methods = ["OVO", "GoPay", "DANA", "Paypal", "Credit Card"];
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");

  const handlePayment = async (courseId, amount, method) => {
    const url = `${baseUrl}/api/payments/createPayment`;

    setLoading(true);

    try {
      const response = await axios.post(url, { courseId, amount, method });
      const result = response.data;
      const { message, payment } = result;

      alert(message);

      router.back();
    } catch (error) {
      if (error.response) {
        const errors = error.response.data.errors;
        alert(errors);
      } else {
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Back button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <AntDesign name="arrowleft" size={32} color="gray" />
      </TouchableOpacity>

      {/* Payment amount */}
      <TextInput
        style={{
          backgroundColor: "lightgray",
          marginHorizontal: 20,
          marginTop: 64,
          paddingHorizontal: 12,
        }}
        placeholder="Insert amount"
        value={amount}
        onChangeText={(text) => setAmount(text)}
      />

      {/* Payment methods */}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          paddingHorizontal: 20,
          marginTop: 20,
        }}
      >
        {methods.map((item) => (
          <TouchableOpacity
            key={item}
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 4,
              paddingHorizontal: 16,
              paddingVertical: 8,
              marginHorizontal: 4,
              marginBottom: 8,
            }}
            onPress={() => setMethod(item)}
          >
            <Text style={{ color: "white", fontWeight: "500" }}>
              {item.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text>
        {amount},{method}
      </Text>

      {/* Pay button */}
      <TouchableOpacity
        style={{
          backgroundColor: "blue",
          marginHorizontal: 20,
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 4,
          marginTop: 60,
          height: 40,
        }}
        onPress={() => handlePayment(id, Number(amount), method)}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text style={{ color: "white", fontWeight: "600", fontSize: 24 }}>
            PAY
          </Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default PaymentPage;

const styles = StyleSheet.create({
  background: {
    width: "100%", // ! Di background jangan dikasi flex: 1 kalo gamau konten didalemnya kescroll ke atas pas keyboard keluar
    height: Dimensions.get("window").height, // ! THIS IS IT, BIAR IMAGE NYA GAK BERUBAH PAKE INI OMGGGGGG
  },
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 10,
  },
});
