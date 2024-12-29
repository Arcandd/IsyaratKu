import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from "react-native";
import background from "../../assets/background/app-background.png";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useFocusEffect, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import RenderNotifications from "../../components/RenderNotifications";
import Loading from "../../components/Loading";

const NotificationsPage = () => {
  const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const fetchUserInfo = async () => {
    const url = `${baseUrl}/api/user/profile`;

    try {
      const response = await axios.get(url);
      const result = response.data;
      const { user } = result;

      if (!user) {
        throw new Error("Authorization expired or invalid");
      }

      setUser(user);
    } catch (error) {
      alert("Error fetching user info!");
      await SecureStore.deleteItemAsync("sessionToken");
      router.replace("/login");
    }
  };

  const fetchNotifications = async () => {
    const url = `${baseUrl}/api/notifications`;

    // * TODO tambahin error message kalo gk ada notif
    try {
      const response = await axios.get(url);
      const result = response.data;
      const { notifications } = result;
      setNotifications(notifications);
    } catch (error) {
      if (error.response) {
        const errors = error.response.data.error;
        console.log(errors);
      } else {
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // ? useEffect cmn dilakukin saat screen dirender pertama kali
  useEffect(() => {
    fetchUserInfo();
  }, []);

  // ? useFocusEffect dilakukin saat screen dirender
  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [])
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <ImageBackground
      source={background}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          {/* Header */}
          <Image
            source={require("../../assets/logo/entry-logo.png")}
            resizeMode="contain"
            style={{ width: "60%" }}
          />
          <Text style={styles.screenTitle}>Notifications</Text>
          <Text style={styles.notifHeader}>Here are your notifications!</Text>
        </View>

        <View style={styles.card}>
          <FlatList
            data={notifications}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <RenderNotifications item={item} />}
            contentContainerStyle={styles.scrollContainer}
          ></FlatList>
        </View>
      </SafeAreaView>

      {/* Add notification for admin */}
      {user.role === "admin" ? (
        <View style={styles.addButtonContainer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push("../add/notification")}
          >
            <Ionicons name="add" size={36} />
          </TouchableOpacity>
        </View>
      ) : (
        <></>
      )}
    </ImageBackground>
  );
};

export default NotificationsPage;

const styles = StyleSheet.create({
  background: {
    width: "100%", // ! Di background jangan dikasi flex: 1 kalo gamau konten didalemnya kescroll ke atas pas keyboard keluar
    height: Dimensions.get("window").height, // ! THIS IS IT, BIAR IMAGE NYA GAK BERUBAH PAKE INI OMGGGGGG
  },
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  header: {
    marginHorizontal: 20,
    marginTop: 8,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
    marginTop: -10,
    marginLeft: -1,
  },
  profileImage: {
    height: 52,
    width: 52,
    borderRadius: 40,
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  notifHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 48,
    marginBottom: 12,
    color: "rgba(0, 0, 0, 0.6)",
    textAlign: "left",
  },
  card: {
    backgroundColor: "white",
    paddingBottom: 200,
    overflow: "hidden",
    height: 728,
  },
  scrollContainer: {
    overflow: "hidden",
    marginHorizontal: 16,
  },
  notifContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginBottom: 16,
    paddingBottom: 12,
  },
  icon: {
    color: "#2BC1F8",
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
    padding: 8,
  },
  textContainer: {
    flex: 1,
    marginLeft: 8,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    fontSize: 14,
    color: "gray",
    marginTop: 4,
    fontWeight: "400",
  },
  timeContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  clockIcon: {
    color: "gray",
  },
  time: {
    fontSize: 10,
    color: "gray",
    marginLeft: 4,
  },
  addButtonContainer: {
    position: "absolute",
    bottom: 84,
    right: 20,
  },
  addButton: {
    backgroundColor: "white",
    borderRadius: "50%",
    padding: 8,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
});
