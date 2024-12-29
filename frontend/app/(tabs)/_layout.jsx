import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Tabs, useFocusEffect, useSegments } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import CustomCameraButton from "../../components/CustomCameraButton";

const TabsLayout = () => {
  const segments = useSegments();
  const [shouldHideTabBar, setShouldHideTabBar] = useState(false);

  const pagesToHideTabBar = ["changePassword", "privacyPolicy"];

  useEffect(() => {
    // Update tab bar visibility whenever the route changes
    const currentPage = segments[segments.length - 1];
    setShouldHideTabBar(pagesToHideTabBar.includes(currentPage));
  }, [segments]);

  return (
    <Tabs
      screenOptions={{
        // tabBarStyle: styles.tabBar,
        tabBarStyle: {
          ...styles.tabBar,
          display: shouldHideTabBar ? "none" : "flex",
        },
        tabBarShowLabel: false,
        tabBarIconStyle: styles.tabBarContainer,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <View style={styles.iconContainer}>
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={size}
                color="white"
              />
            </View>
          ),
          tabBarLabel: "Home",
          animation: "shift",
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <View style={styles.containerLeft}>
              <Ionicons
                name={focused ? "book" : "book-outline"}
                size={size}
                color="white"
              />
            </View>
          ),
          tabBarLabel: "Courses",
          animation: "shift",
        }}
      />
      <Tabs.Screen
        name="translation"
        options={{
          headerShown: false,
          tabBarLabel: "Translation",
          tabBarButton: (props) => <CustomCameraButton {...props} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <View style={styles.containerRight}>
              <Ionicons
                name={focused ? "notifications" : "notifications-outline"}
                size={size}
                color="white"
              />
            </View>
          ),
          tabBarLabel: "Notifications",
          animation: "shift",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <View style={styles.iconContainer} activeOpacity={1}>
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={size}
                color="white"
              />
            </View>
          ),
          tabBarLabel: "Profile",
          animation: "shift",
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "white",
    position: "absolute",
    height: 60,
    elevation: 0,
    shadowColor: "transparent",
    shadowRadius: 0,
    shadowOpacity: 0,
    shadowOffset: { width: 0, height: 0 },
    overflow: "hidden",
  },

  tabBarContainer: {
    flex: 1,
  },
  iconContainer: {
    backgroundColor: "#60C8EE",
    width: 80,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  containerRight: {
    borderTopLeftRadius: 24,
    backgroundColor: "#60C8EE",
    width: 80,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  containerLeft: {
    borderTopRightRadius: 24,
    backgroundColor: "#60C8EE",
    width: 80,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
});
