import { Animated, ImageBackground, StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";

const EntryPage = () => {
  const router = useRouter();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionData = await SecureStore.getItemAsync("sessionToken");
        // await SecureStore.deleteItemAsync("sessionToken"); // ! kalo error, lepas comment
        if (sessionData) {
          const { token, timestamp } = JSON.parse(sessionData);
          const oneDay = 24 * 60 * 60 * 1000; // ? 1 day
          const isExpired = Date.now() - timestamp > oneDay;

          if (isExpired) {
            await SecureStore.deleteItemAsync("sessionToken");
            setIsLoggedIn(false);
            alert("Session token expired. Please log in again");
          } else {
            setIsLoggedIn(!!token);
          }
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        alert("Error retrieving session token:", error);
        setIsLoggedIn(false);
      }
    };

    checkSession();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      if (isLoggedIn) {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }).start();

        setTimeout(() => {
          router.push("/home");
        }, 1000);
      } else {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }).start();

        setTimeout(() => {
          router.push("/login");
        }, 1000);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [fadeAnim, router, isLoggedIn]);

  return (
    <ImageBackground
      source={require("../assets/background/entry-background.png")}
      style={styles.background}
      resizeMode="stretch"
    >
      <SafeAreaView style={styles.container}>
        <Animated.Image
          source={require("../assets/logo/entry-logo.png")}
          style={[styles.logo, { opacity: fadeAnim }]}
          resizeMode="contain"
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

export default EntryPage;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    position: "absolute",
    width: "80%",
  },
});
