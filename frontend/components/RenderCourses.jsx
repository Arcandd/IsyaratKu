import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import imageUrl from "../assets/image/course-default.png";
import { useRouter } from "expo-router";

const RenderCourses = ({ item, onPress }) => {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <View style={styles.courseCard}>
      <View style={styles.courseInfoContainer}>
        <Image source={imageUrl} style={styles.courseImage} />
        <View style={{ width: "60%" }}>
          <Text
            style={styles.courseTitle}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.title}
          </Text>
          <Text style={styles.coursePrice}>
            {item.price === 0 ? "Free" : `Rp.${item.price},00`}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.enrollButton}
        onPress={onPress}
        key={item._id}
      >
        <Text style={styles.enrollText}>ENROLL</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RenderCourses;

const styles = StyleSheet.create({
  courseCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
    marginHorizontal: 20,
    borderColor: "#45CDFF",
    borderWidth: 1,
  },
  courseInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  courseImage: {
    width: 64,
    height: 64,
    borderRadius: 5,
    resizeMode: "cover",
    marginRight: 12,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    borderBottomWidth: 0.5,
    borderColor: "gray",
    paddingBottom: 4,
  },
  coursePrice: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "semibold",
    color: "gray",
  },
  enrollButton: {
    backgroundColor: "#FF8800",
    padding: 8,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  enrollText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
});
