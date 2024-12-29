import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";

export default function PrivacyPolicyPage() {
  const router = useRouter();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      bounces={false}
      contentContainerStyle={{ paddingBottom: 300, backgroundColor: "white" }}
    >
      <ImageBackground
        source={require("../../../assets/background/app-background-3.png")} // Replace with your local image path
        style={styles.background}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.container}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <AntDesign name="arrowleft" size={32} color="white" />
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 32,
              fontWeight: "bold",
              color: "white",
              marginTop: 64,
            }}
          >
            Privacy Policy
          </Text>
          <Text style={styles.mainContent}>
            BACALAH KEBIJAKAN PRIVASI INI DENGAN HATI-HATI, CERMAT DAN TELITI
            agar anda dapat MENGERTI dan memahami kebijakan yang KAMI terapkan
            DALAM MENGATUR INFORMASI PRIBADI ANDA SEBELUM ANDA MENGGUNAKAN
            LAYANAN dari aplikasi mobile YANG DIKELOLA ISYARATKU
          </Text>
          <Text style={styles.bodyContent}>
            Kebijakan Privasi ini berisi penjelasan atas perlindungan dan
            penggunaan data dan/atau informasi yang mengidentifikasi atau dapat
            digunakan untuk mengidentifikasi pengguna (“Data Pribadi”) aplikasi
            mobile yang dikelola oleh ISYARATKU.
          </Text>
          <Text style={styles.bodyContent}>
            Kebijakan Privasi ini berlaku untuk setiap informasi yang
            dikumpulkan dan digunakan oleh ISYARATKU ketika anda sebagai
            pengguna (“Pengguna”) mengakses aplikasi mobile yang menaati
            kebijakan Privasi ini kepada Pengguna.
          </Text>
          <Text style={styles.subSectionTitle}>Data Pribadi Pengguna</Text>
          <Text style={styles.bodyContent}>
            Untuk dapat mengakses layanan aplikasi mobile BINUS, Pengguna perlu
            melakukan registrasi dan melengkapi Data Pribadi berupa nama, alamat
            email, serta informasi lain yang dibutuhkan ISYARATKU sebagaimana
            diperlukan untuk memberikan layanan sesuai tujuan dan fungsi
            aplikasi mobile ISYARATKU yang Pengguna gunakan. ISYARATKU juga
            dapat meminta data tambahan yang bersifat opsional tetapi harus
            diisi untuk memungkinkan ISYARATKU memberikan layanan tambahan
            kepada Pengguna.
          </Text>
          <Text style={styles.bodyContent}>
            Pengguna dengan ini menyatakan bahwa setiap informasi yang diberikan
            oleh Pengguna kepada ISYARATKU adalah informasi yang akurat, benar,
            dan terbaru sebagaimana diminta oleh aplikasi ini.
          </Text>
        </SafeAreaView>
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  background: {
    width: "100%", // ! Di background jangan dikasi flex: 1 kalo gamau konten didalemnya kescroll ke atas pas keyboard keluar
    height: Dimensions.get("window").height, // ! THIS IS IT, BIAR IMAGE NYA GAK BERUBAH PAKE INI OMGGGGGG
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 10,
  },
  mainContent: {
    marginTop: 88,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 20,
  },
  bodyContent: {
    fontSize: 14,
    color: "#333",
    lineHeight: 22,
    marginBottom: 15,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
});
