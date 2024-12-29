import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import defaultProfilePicture from "../../../assets/image/profile-default.png";
import { useFocusEffect, useRouter } from "expo-router";
import axios from "axios";
import AntDesign from "@expo/vector-icons/AntDesign";
import ProfileMenu from "../../../components/ProfileMenu";
import Loading from "../../../components/Loading";
import * as SecureStore from "expo-secure-store";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";

const ProfilePage = () => {
  const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);

  const fetchUserInfo = async () => {
    const url = `${baseUrl}/api/user/profile`;

    try {
      const response = await axios.get(url);
      const result = response.data;
      const { user } = result;
      setUser(user);
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

  const selectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;

        const formData = new FormData();
        formData.append("profileImage", {
          uri: imageUri,
          name: "profile.png",
          type: "image/png",
        });

        const url = `${baseUrl}/api/user/upload/profile-image`;

        const response = await axios.patch(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const { message, filePath } = response.data;
        setUser((prev) => ({ ...prev, profileImage: filePath }));
      }
    } catch (error) {
      if (error.response) {
        const errors = error.response.data.error;
        console.log(errors);
      } else {
        alert(error.message);
      }
    }
  };

  const handleLogOut = async () => {
    const url = `${baseUrl}/api/auth/logout`;

    try {
      const response = await axios.post(url);
      const result = response.data;
      const { message } = result;

      await SecureStore.deleteItemAsync("sessionToken");

      router.push("/login");
    } catch (error) {
      if (error.response) {
        const errors = error.response.data.errors;
        console.log(errors);
      } else {
        alert(error.message);
      }
    }
  };

  const handleDeleteAccount = async () => {
    const url = `${baseUrl}/api/user/deleteAccount`;

    try {
      const response = await axios.delete(url);
      const result = response.data;
      const { message } = result;
      console.log(message);

      await SecureStore.deleteItemAsync("sessionToken");
      console.log("Session token deleted");

      router.push("/login");
    } catch (error) {
      if (error.response) {
        const errors = error.response.data.errors;
        console.log(errors);
      } else {
        alert(error.message);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserInfo();
    }, [])
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <TouchableOpacity onPress={selectImage}>
          <Image
            source={
              user.profileImage !== ""
                ? { uri: user.profileImage }
                : defaultProfilePicture
            }
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <View style={styles.profileInfo}>
          <View style={styles.profileNameContainer}>
            <Text style={styles.profileName}>{user.username} </Text>
            <Text style={styles.profileRole}>
              ({user.role.charAt(0).toUpperCase() + user.role.slice(1)})
            </Text>
          </View>
          <Text style={styles.profileEmail}>{user.email}</Text>
        </View>
      </View>

      {/* Options Section */}
      <View style={styles.optionsSection}>
        <ProfileMenu
          icon={<Ionicons name="lock-closed-outline" size={24} />}
          text="Change Password"
          onPress={() => router.push("/profile/changePassword")}
        />
        <ProfileMenu
          icon={<Ionicons name="shield-outline" size={24} />}
          text="Privacy Policy"
          onPress={() => router.push("/profile/privacyPolicy")}
        />
        <ProfileMenu
          icon={<Ionicons name="document-text-outline" size={24} />}
          text="Terms & Conditions"
        />
        <ProfileMenu
          icon={<Ionicons name="help-circle-outline" size={24} />}
          text="Help and Support"
        />
        <ProfileMenu
          icon={<Ionicons name="chatbubbles-outline" size={24} />}
          text="Chat with Us"
        />
        <ProfileMenu
          icon={<Ionicons name="log-out-outline" size={24} />}
          text="Log Out"
          onPress={handleLogOut}
        />
        <ProfileMenu
          icon={<AntDesign name="deleteuser" size={24} color="red" />}
          text="Delete Account"
          onPress={() => setVisible(true)}
          Styles={{
            menuText: {
              color: "red",
            },
          }}
        />

        {/* Modal */}
        <Modal transparent={true} animationType="fade" visible={visible}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <Ionicons name="trash-bin" size={36} color={"red"} />

              <TouchableOpacity
                onPress={() => setVisible(false)}
                style={{ position: "absolute", top: 10, left: 10 }}
              >
                <Ionicons name="close-circle-outline" size={24} color="red" />
              </TouchableOpacity>

              <Text style={styles.modalTitle}>
                This will delete your account. Are you sure you want to do this?
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    setVisible(false);
                  }}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    setVisible(false);
                    handleDeleteAccount();
                  }}
                >
                  <Text style={styles.buttonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>

      {/* Footer Section */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, styles.footerSpacing]}>
          Version 1.0.0
        </Text>
        <Text style={[styles.footerText, styles.footerSpacing]}>
          ©2024 IsyaratKu, Inc.
        </Text>
        <Text style={styles.footerText}>All rights reserved</Text>
      </View>
    </View>
  );
};

export default ProfilePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 40,
  },
  profileInfo: {
    marginLeft: 15,
  },
  profileNameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  profileRole: {
    fontSize: 16,
    color: "#888",
  },
  profileEmail: {
    fontSize: 12,
    color: "#888",
  },
  optionsSection: {
    flex: 1,
    borderTopWidth: 0.5,
    borderTopColor: "#ddd",
    paddingTop: 20,
  },
  footer: {
    alignItems: "flex-start",
    marginTop: 20,
    marginBottom: 120,
  },
  footerText: {
    fontSize: 9,
    color: "#aaa",
    textAlign: "left",
  },
  footerSpacing: {
    marginBottom: 5,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 24,
    elevation: 5,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderRadius: 15,
    marginHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
  modalTitle: {
    marginTop: 20,
    marginBottom: 40,
    fontSize: 16,
    fontWeight: "semibold",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#FF8800",
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
