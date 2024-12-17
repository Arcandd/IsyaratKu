import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const CourseLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="[courseId]" options={{ headerShown: false }} />
      <Stack.Screen name="[courseId]/lesson/[lessonId]" options={{ headerShown: false }} />
    </Stack>
  );
};

export default CourseLayout;
