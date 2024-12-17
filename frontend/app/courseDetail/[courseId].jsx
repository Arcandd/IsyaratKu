import {
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Loading from "../../components/Loading";
import AntDesign from "@expo/vector-icons/AntDesign";
import axios from "axios";
import defaultImage from "../../assets/image/course-default.png";
import { Ionicons } from "@expo/vector-icons";

const CourseDetail = () => {
  const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;
  const router = useRouter();
  const { courseId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);

  const fetchLessons = async () => {
    const url = `${baseUrl}/api/courses/${courseId}/lessons`;

    try {
      const response = await axios.get(url);
      const result = response.data;
      const { message, course, lessons } = result;
      setLessons(lessons);
      setCourse(course);
    } catch (error) {
      if (error.response) {
        const errors = error.response.data.error;
        alert(errors);
      } else {
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // useFocusEffect(
  //   useCallback(() => {
  //     fetchCourse();
  //   }, [])
  // );

  useEffect(() => {
    fetchLessons();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
      <ImageBackground
        source={require("../../assets/background/app-background-3.png")}
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

          <Text style={styles.title}>{course.title}</Text>

          <View style={styles.lessonsContainer}>
            <Text style={styles.lessonsTitle}>Lessons:</Text>

            {lessons.map((lesson) => (
              <TouchableOpacity
                key={lesson._id}
                style={styles.lessonCard}
                onPress={() =>
                  router.push(`courseDetail/${course._id}/lesson/${lesson._id}`)
                }
              >
                <View style={styles.lessonCardContent}>
                  <Text style={styles.lessonTitle}>{lesson.title}</Text>
                </View>
                <Ionicons
                  name="chevron-forward-circle-outline"
                  size={24}
                  color="#00aaff"
                />
              </TouchableOpacity>
            ))}
          </View>
        </SafeAreaView>
      </ImageBackground>
    </ScrollView>
  );
};

export default CourseDetail;

const styles = StyleSheet.create({
  background: {
    width: "100%", // ! Di background jangan dikasi flex: 1 kalo gamau konten didalemnya kescroll ke atas pas keyboard keluar
    height: Dimensions.get("window").height, // ! THIS IS IT, BIAR IMAGE NYA GAK BERUBAH PAKE INI OMGGGGGG
  },
  container: {
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    color: "white",
    marginTop: 56,
  },
  lessonsContainer: {
    marginTop: 80,
  },
  lessonsTitle: {
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 8,
  },
  lessonCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 24,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
    borderColor: "#45CDFF",
    borderWidth: 1,
  },
  lessonCardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  courseImagePlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 5,
    resizeMode: "cover",
    marginRight: 12,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  arrowText: {
    fontSize: 20,
    color: "#00aaff",
  },
});
