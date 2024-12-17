import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import defaultProfilePicture from "../../assets/image/profile-default.png";
import { useFocusEffect, useRouter } from "expo-router";
import axios from "axios";
import AntDesign from "@expo/vector-icons/AntDesign";
import ProfileMenu from "../../components/ProfileMenu";
import Loading from "../../components/Loading";
import * as SecureStore from "expo-secure-store";

const ProfilePage = () => {
  const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const handleLogOut = async () => {
    const url = `${baseUrl}/api/auth/logout`;

    try {
      const response = await axios.post(url);
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

  const handleDeleteAccount = async () => {
    const url = `${baseUrl}/api/user/deleteAccount`;

    try {
      const response = await axios.delete(url);
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
        <Image source={defaultProfilePicture} style={styles.profileImage} />
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
          onPress={() => navigation.navigate("changepswd")}
        />
        <ProfileMenu
          icon={<Ionicons name="shield-outline" size={24} />}
          text="Privacy Policy"
          onPress={() => navigation.navigate("policy")}
        />
        <ProfileMenu
          icon={<Ionicons name="document-text-outline" size={24} />}
          text="Terms & Conditions"
          onPress={() => navigation.navigate("tandc")}
        />
        <ProfileMenu
          icon={<Ionicons name="help-circle-outline" size={24} />}
          text="Help and Support"
          onPress={() => console.log("Help and Support Pressed")}
        />
        <ProfileMenu
          icon={<Ionicons name="chatbubbles-outline" size={24} />}
          text="Chat with Us"
          onPress={() => console.log("Chat with Us Pressed")}
        />
        <ProfileMenu
          icon={<Ionicons name="log-out-outline" size={24} />}
          text="Log Out"
          onPress={handleLogOut}
        />
        <ProfileMenu
          icon={<AntDesign name="deleteuser" size={24} color="red" />}
          text="Delete Account"
          onPress={handleDeleteAccount}
          Styles={{
            menuText: {
              color: "red",
            },
          }}
        />
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
});
