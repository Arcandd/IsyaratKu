import axios from "axios";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";

const ChangePasswordScreen = () => {
  const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ? Errors
  const [passwordError, setPasswordError] = useState(null);
  const [newPasswordError, setNewPasswordError] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);

  const handleChangePassword = async (
    oldPassword,
    newPassword,
    confirmPassword
  ) => {
    const url = `${baseUrl}/api/user/changePassword`;
    setLoading(true);

    try {
      // ? Resetting error
      setPasswordError(null);
      setNewPasswordError(null);
      setConfirmPasswordError(null);

      if (newPassword !== confirmPassword) {
        setConfirmPasswordError("Incorrect password");
        return;
      }

      const response = await axios.patch(url, { oldPassword, newPassword });
      const result = response.data;
      const { message } = result;

      router.back();
    } catch (error) {
      setPasswordError(null);
      setNewPasswordError(null);
      setConfirmPasswordError(null);

      if (error.response) {
        const errors = error.response.data.errors;

        for (let i = 0; i < errors.length; i++) {
          const err = errors[i];

          if (err.includes("Old password can not be empty"))
            setPasswordError(err);
          else if (err.includes("New password can not be empty"))
            setNewPasswordError(err);
          else if (
            err.includes("Old password must be atleast 8-20 characters") &&
            currentPassword.length > 0
          )
            setPasswordError(err);
          else if (
            err.includes("New password must be atleast 8-20 characters") &&
            currentPassword.length > 0
          )
            setNewPasswordError(err);
          else if (err.includes("Invalid credentials")) setPasswordError(err);
        }
      } else {
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      <ImageBackground
        source={require("../../../assets/background/app-background-3.png")}
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
            Change Password
          </Text>
          <Text style={styles.title}>Change your password</Text>

          {/* Current Password Field */}
          <TextInput
            style={styles.input}
            placeholder="Current password..."
            placeholderTextColor="#999"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry={true}
            autoCapitalize="none"
          />
          {passwordError ? (
            <Text style={styles.errors}>{passwordError}!</Text>
          ) : (
            <></>
          )}

          {/* New Password Field */}
          <TextInput
            style={styles.input}
            placeholder="New password..."
            placeholderTextColor="#999"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={true}
            autoCapitalize="none"
          />
          {newPasswordError ? (
            <Text style={styles.errors}>{newPasswordError}!</Text>
          ) : (
            <></>
          )}

          {/* Confirm New Password Field */}
          <TextInput
            style={styles.input}
            placeholder="Confirm password..."
            placeholderTextColor="#999"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={true}
            autoCapitalize="none"
          />
          {confirmPasswordError ? (
            <Text style={styles.errors}>{confirmPasswordError}!</Text>
          ) : (
            <></>
          )}

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.back()}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={() =>
                handleChangePassword(
                  currentPassword,
                  newPassword,
                  confirmPassword
                )
              }
            >
              {loading ? (
                <ActivityIndicator color={"white"} size={"small"} />
              ) : (
                <Text style={styles.submitText}>Confirm</Text>
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </ScrollView>
  );
};

export default ChangePasswordScreen;

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
  title: {
    marginTop: 88,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  userId: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#E5E5E5",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    fontSize: 14,
    color: "#333",
  },
  forgotPassword: {
    fontSize: 14,
    color: "#007BFF",
    marginBottom: 15,
    textAlign: "right",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "#D3D3D3",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  cancelText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#4CAFF5",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  submitText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
  },
  errors: {
    color: "red",
    marginBottom: 16,
    marginTop: -12,
  },
});
