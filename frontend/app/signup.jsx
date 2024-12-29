import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

export default function SignUpPage() {
  const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;
  const router = useRouter();
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [loading, setLoading] = useState(false);

  // ? Backend stuff
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const handleSignUp = async (username, email, password, confirmPassword) => {
    const url = `${baseUrl}/api/auth/signup`;

    setLoading(true);

    try {
      const response = await axios.post(url, {
        username,
        email,
        password,
        confirmPassword,
      });
      const result = response.data;
      const { message, session } = result;

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
      setEmailError("");
      setPasswordError("");
      setConfirmPasswordError("");

      router.push("/home");
    } catch (error) {
      // ? Resetting errors
      setUsernameError("");
      setEmailError("");
      setPasswordError("");
      setConfirmPasswordError("");

      if (error.response) {
        const errors = error.response.data.errors;

        // ? for each akan terus berjalan walaupun sudah di return, yang berhenti hanya iterasi tersebut. makanya pake for loop
        for (let i = 0; i < errors.length; i++) {
          const err = errors[i];
          if (err.includes("empty")) {
            // ? Resetting errors
            setUsernameError("");
            setEmailError("");
            setPasswordError("");
            setConfirmPasswordError("");

            alert("Please fill in the credentials");

            break;
          } else if (err.includes("characters")) {
            err.includes("Username")
              ? setUsernameError(err)
              : setPasswordError(err);
          } else if (err.includes("gmail")) {
            setEmailError(err);
          } else if (err.includes("Passwords do not match!")) {
            setConfirmPasswordError(err);
          } else if (err.includes("User already exist!")) {
            setUsernameError(err);
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
    const text = "Start Your Journey at IsyaratKu!";
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
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }, [])
  );

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      <ImageBackground
        source={require("../assets/background/signup-background.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.container}>
          {/* Header */}
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
                  color="black"
                  style={styles.icon}
                />
                <TextInput
                  placeholder="Username"
                  style={styles.input}
                  placeholderTextColor="#545454"
                  value={username}
                  onChangeText={setUsername}
                />
              </View>
              {usernameError ? (
                <Text style={styles.errorMessage}>{usernameError}</Text>
              ) : null}
            </View>

            {/* Email Input */}
            <View style={{ marginBottom: 12 }}>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail"
                  size={20}
                  color="black"
                  style={styles.icon}
                />
                <TextInput
                  placeholder="Email"
                  style={styles.input}
                  placeholderTextColor="#545454"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                />
              </View>
              {emailError ? (
                <Text style={styles.errorMessage}>{emailError}</Text>
              ) : null}
            </View>

            {/* Password Input */}
            <View style={{ marginBottom: 12 }}>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed"
                  size={20}
                  color="black"
                  style={styles.icon}
                />
                <TextInput
                  placeholder="Password"
                  style={styles.input}
                  placeholderTextColor="#545454"
                  secureTextEntry={!isPasswordVisible}
                  value={password}
                  onChangeText={setPassword}
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

            {/* Confirm Password Input */}
            <View style={{ marginBottom: 12 }}>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed"
                  size={20}
                  color="black"
                  style={styles.icon}
                />
                <TextInput
                  placeholder="Confirm password"
                  style={styles.input}
                  placeholderTextColor="#545454"
                  secureTextEntry={!isConfirmPasswordVisible}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setConfirmPasswordVisible((prev) => !prev)}
                  style={styles.iconRight}
                >
                  <Ionicons
                    name={isConfirmPasswordVisible ? "eye-off" : "eye"}
                    size={20}
                    color="black"
                  />
                </TouchableOpacity>
              </View>
              {confirmPasswordError ? (
                <Text style={styles.errorMessage}>{confirmPasswordError}</Text>
              ) : null}
            </View>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.replace("/login")}>
                <Text style={styles.link}>Log In here</Text>
              </TouchableOpacity>
            </View>

            {/* Log in button */}
            <TouchableOpacity
              style={styles.signUpButton}
              onPress={() =>
                handleSignUp(username, email, password, confirmPassword)
              }
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.signUpText}>SIGN UP</Text>
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 28,
  },
  background: {
    width: "100%",
    height: Dimensions.get("window").height,
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
  loginContainer: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 24,
    marginBottom: 12,
  },
  loginText: {
    color: "black",
    fontSize: 14,
  },
  link: {
    color: "#007bff",
    fontWeight: "bold",
  },
  signUpButton: {
    backgroundColor: "#60C8EE",
    paddingVertical: 8,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 16,
    minHeight: 48,
  },
  signUpText: {
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
