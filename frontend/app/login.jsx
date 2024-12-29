import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const LoginPage = () => {
  const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;
  const router = useRouter(); // Use router instead of navigation
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [loading, setLoading] = useState(false);

  // ? Backend stuff
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleLogIn = async (username, password) => {
    const url = `${baseUrl}/api/auth/login`;
    setLoading(true);

    try {
      const response = await axios.post(url, { username, password });
      const result = response.data;
      const { message, session, role } = result;

      const storeSession = async (token) => {
        try {
          const sessionData = {
            token,
            timestamp: Date.now(),
          };
          await SecureStore.setItemAsync(
            "sessionToken",
            JSON.stringify(sessionData)
          );
        } catch (error) {
          alert("Error storing session token:", error);
        }
      };

      storeSession(session.user);

      // ? Resetting errors
      setUsernameError("");
      setPasswordError("");

      router.push("/home");
    } catch (error) {
      // ? Resetting errors
      setUsernameError("");
      setPasswordError("");

      if (error.response) {
        const errors = error.response.data.errors;

        if (errors.includes("Incorrect username!")) setUsernameError(errors);
        else if (errors.includes("Incorrect password!"))
          setPasswordError(errors);
        else {
          // ? for each akan terus berjalan walaupun sudah di return, yang berhenti hanya iterasi tersebut. makanya pake for loop
          for (let i = 0; i < errors.length; i++) {
            const err = errors[i];
            if (err.includes("empty")) {
              // ? Resetting errors
              setUsernameError("");
              setPasswordError("");

              alert("Please fill in the credentials");

              break;
            } else if (err.includes("characters")) {
              err.includes("Username")
                ? setUsernameError(err)
                : setPasswordError(err);
            }
          }
        }
      } else {
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const text = "Welcome Back, We Missed You!";
    let index = 0;

    const interval = setInterval(() => {
      setDisplayedText((prev) => {
        if (index < text.length) {
          const nextText = prev + text[index];
          index++;
          return nextText;
        }
        clearInterval(interval);
        return prev;
      });
    }, 100);

    return () => {
      clearInterval(interval);
      setDisplayedText("");
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      setUsername("");
      setPassword("");
    }, [])
  );

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      <ImageBackground
        source={require("../assets/background/login-background.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{displayedText}</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Username Input */}
            <View style={{ marginBottom: 12 }}>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="person"
                  size={20}
                  color="#000000"
                  style={styles.icon}
                />

                <TextInput
                  placeholder="Username"
                  value={username}
                  onChangeText={setUsername}
                  style={styles.input}
                  placeholderTextColor="#545454"
                />
              </View>

              {usernameError ? (
                <Text style={styles.errorMessage}>{usernameError}</Text>
              ) : null}
            </View>

            {/* Password input */}
            <View style={{ marginBottom: 12 }}>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed"
                  size={20}
                  color="#000000"
                  style={styles.icon}
                />

                <TextInput
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  style={styles.input}
                  placeholderTextColor="#545454"
                  secureTextEntry={!isPasswordVisible}
                  autoCapitalize="none"
                />

                <TouchableOpacity
                  onPress={() => setPasswordVisible((prev) => !prev)}
                  style={styles.iconRight}
                >
                  <Ionicons
                    name={isPasswordVisible ? "eye-off" : "eye"}
                    size={20}
                    color="black"
                  />
                </TouchableOpacity>
              </View>

              {passwordError ? (
                <Text style={styles.errorMessage}>{passwordError}</Text>
              ) : null}
            </View>

            {/* Sign up link */}
            <View style={styles.signInSection}>
              <Text style={styles.signInText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/signup")}>
                <Text style={styles.link}>Sign Up here</Text>
              </TouchableOpacity>
            </View>

            {/* Log in button */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => handleLogIn(username, password)}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.loginText}>LOG IN</Text>
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </ScrollView>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 28,
  },
  background: {
    width: "100%", // ! Di background jangan dikasi flex: 1 kalo gamau konten didalemnya kescroll ke atas pas keyboard keluar
    height: Dimensions.get("window").height, // ! THIS IS IT, BIAR IMAGE NYA GAK BERUBAH PAKE INI OMGGGGGG
  },
  header: {
    width: "80%",
    top: 64,
    left: 28,
    position: "absolute",
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "white",
  },
  form: {
    justifyContent: "flex-end",
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 25,
    paddingHorizontal: 15,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "black",
  },
  icon: {
    marginRight: 10,
  },
  iconRight: {
    marginLeft: 10,
  },
  signInSection: {
    flexDirection: "row",
    alignSelf: "center",
    marginBottom: 12,
    marginTop: 24,
  },
  signInText: {
    color: "black",
    fontSize: 14,
  },
  link: {
    color: "#007bff",
    fontWeight: "bold",
  },
  loginButton: {
    backgroundColor: "#60C8EE",
    paddingVertical: 8,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 16,
    minHeight: 48,
  },
  loginText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  errorMessage: {
    color: "red",
    fontSize: 12,
    marginLeft: 20,
    marginTop: 4,
  },
});
