import { View, Text } from "react-native";
import React from "react";
import { Slot, Stack } from "expo-router";

const RootLayout = () => {
  return (
    <Stack
      screenOptions={{
        statusBarHidden: false,
        // statusBarTranslucent: true,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="courseDetail" options={{ headerShown: false }} />
      <Stack.Screen name="payment/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="add/course" options={{ headerShown: false }} />
      <Stack.Screen name="add/notification" options={{ headerShown: false }} />
      <Stack.Screen name="add/lesson" options={{ headerShown: false }} />
    </Stack>
  );
};

export default RootLayout;
