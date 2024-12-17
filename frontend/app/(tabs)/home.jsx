import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import appBackground from "../../assets/background/app-background.png";
import defaultProfilePicture from "../../assets/image/profile-default.png";
import { Ionicons } from "@expo/vector-icons";
import Loading from "../../components/Loading";
import { Redirect, useFocusEffect, useRouter } from "expo-router";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import defaultImage from "../../assets/image/course-default.png";

const screenWidth = Dimensions.get("window").width;

const HomePage = () => {
  const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;
  const router = useRouter();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [displayedText, setDisplayedText] = useState("");
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [coursesError, setCoursesError] = useState("");

  const checkSession = async () => {
    const token = await SecureStore.getItemAsync("sessionToken");
    if (!token) {
      router.replace("/login");
    }
  };

  const fetchUserInfo = async () => {
    const url = `${baseUrl}/api/user/profile`;

    try {
      const response = await axios.get(url);
      const result = response.data;
      const { user } = result;

      if (!user) {
        throw new Error("Authorization expired or invalid");
      }

      setUserInfo(user);
    } catch (error) {
      alert("Error fetching user info!");
      await SecureStore.deleteItemAsync("sessionToken");
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrolledCourses = async () => {
    const url = `${baseUrl}/api/user/courses`;

    try {
      const response = await axios.get(url);
      const result = response.data;
      const { enrolledCourses } = result;
      setEnrolledCourses(enrolledCourses);
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.error;

        if (errorMessage.includes("You have not enrolled in any course yet!")) {
          setCoursesError(errorMessage);
        } else {
          alert(errorMessage);
        }
      } else {
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const text = "Welcome back,";
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
      checkSession();
      fetchUserInfo();
      fetchEnrolledCourses();
    }, [])
  );

  if (loading) {
    return <Loading />;
  }

  if (!userInfo) {
    return null;
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
      <ImageBackground
        source={appBackground}
        style={styles.background}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.container}>
          {/* Course header Section */}
          <View style={styles.header}>
            <Image
              source={defaultProfilePicture}
              style={styles.profileImage}
              resizeMode="cover"
            />
            <View style={styles.headerTextContainer}>
              <Text style={styles.welcomeText}>{displayedText}</Text>
              <Text style={styles.username}>{userInfo.username}!</Text>
            </View>
          </View>

          <View style={styles.broadcastCard}>
            <ScrollView
              horizontal={true}
              pagingEnabled={true}
              showsHorizontalScrollIndicator={false}
            >
              <Image
                source={require("../../assets/poster/1.png")}
                style={styles.broadcastImage}
                resizeMode="cover"
              />
              <Image
                source={require("../../assets/poster/2.png")}
                style={styles.broadcastImage}
                resizeMode="cover"
              />
            </ScrollView>
          </View>

          {/* My Courses Section */}
          <View style={styles.coursesHeader}>
            <Text style={styles.coursesTitle}>My Courses</Text>
          </View>

          {/* Courses List */}
          <View style={styles.courseListContainer}>
            <ScrollView
              contentContainerStyle={styles.coursesList}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
            >
              {coursesError ? (
                <Text style={styles.courseError}>{coursesError}</Text>
              ) : (
                enrolledCourses.map((course) => (
                  <TouchableOpacity
                    key={course._id}
                    style={styles.courseCard}
                    onPress={() => router.push(`/courseDetail/${course._id}`)}
                  >
                    <View style={styles.courseCardContent}>
                      <Image
                        source={defaultImage}
                        style={styles.courseImagePlaceholder}
                      />
                      <Text style={styles.courseTitle}>{course.title}</Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={24}
                      color="#00aaff"
                    />
                  </TouchableOpacity>
                ))
              )}

              {enrolledCourses.length > 3 ? (
                <TouchableOpacity>
                  <Text style={styles.viewMore}>-- View more --</Text>
                </TouchableOpacity>
              ) : (
                <></>
              )}
            </ScrollView>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </ScrollView>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  background: {
    width: "100%", // ! Di background jangan dikasi flex: 1 kalo gamau konten didalemnya kescroll ke atas pas keyboard keluar
    height: Dimensions.get("window").height, // ! THIS IS IT, BIAR IMAGE NYA GAK BERUBAH PAKE INI OMGGGGGG
  },
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    top: 12,
    marginHorizontal: 20,
    marginTop: 4,
  },
  profileImage: {
    height: 64,
    width: 64,
    borderRadius: 40,
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: "white",
    fontWeight: "semibold",
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  broadcastCard: {
    marginTop: 72,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    backgroundColor: "gray",
    marginHorizontal: 20,
    elevation: 6,
    shadowColor: "black",
    shadowOpacity: 0.4,
    shadowRadius: 0.4,
    shadowOffset: { width: 0, height: 6 },
  },
  broadcastImage: {
    width: screenWidth - 40,
    height: 176,
  },
  coursesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
    marginHorizontal: 20,
  },
  coursesTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  viewMore: {
    fontSize: 14,
    color: "#007BFF",
    textAlign: "center",
  },
  courseListContainer: {
    maxHeight: 316,
    overflow: "hidden",
    // borderColor: "lightgray",
    // borderBottomWidth: 0.5,
  },
  coursesList: {
    marginTop: 8,
    marginHorizontal: 20,
  },
  courseError: {
    color: "gray",
    textAlign: "center",
    fontWeight: "semibold",
    marginTop: "40%",
  },
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
    borderColor: "#45CDFF",
    borderWidth: 1,
  },
  courseCardContent: {
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
  courseTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  arrowText: {
    fontSize: 20,
    color: "#00aaff",
  },
});
