import {
  Dimensions,
  FlatList,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Modal,
  Button,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import appBackground from "../../assets/background/app-background.png";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useFocusEffect, useRouter } from "expo-router";
import Loading from "../../components/Loading";
import RenderCourses from "../../components/RenderCourses";

const CoursesPage = () => {
  const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [visible, setVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [user, setUser] = useState(null);

  const fetchUserInfo = async () => {
    const url = `${baseUrl}/api/user/profile`;

    try {
      const response = await axios.get(url);
      const result = response.data;
      const { user } = result;

      if (!user) {
        throw new Error("Authorization expired or invalid");
      }

      setUser(user);
    } catch (error) {
      alert("Error fetching user info!");
      await SecureStore.deleteItemAsync("sessionToken");
      router.replace("/login");
    }
  };

  const fetchCourses = async () => {
    const url = `${baseUrl}/api/courses`;

    try {
      const response = await axios.get(url);
      const result = response.data;
      const { courses } = result;
      setCourses(courses);

      const categories = [
        ...new Set(courses.map((course) => course.type).filter(Boolean)),
      ];
      setCategories(categories);
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

  const handleEnrollCourse = async (courseId) => {
    const url = `${baseUrl}/api/user/course/enroll`;

    try {
      const response = await axios.post(url, { courseId });
      const result = response.data;
      const { message } = result;

      alert(message);
    } catch (error) {
      if (error.response) {
        const errors = error.response.data.error;

        if (errors.includes("You haven't bought this course yet")) {
          setVisible(true);
        } else {
          alert(errors);
        }
      } else {
        alert(error.message);
      }
    }
  };

  const searchCourses = async (value) => {
    const url = `${baseUrl}/api/courses/search?value=${value}`;

    setSearchLoading(true);
    setSearchError(null);

    try {
      const response = await axios.get(url);
      const result = response.data;
      const { courses } = result;
      setCourses(courses);
    } catch (error) {
      if (error.response) {
        const errors = error.response.data.error;
        if (errors.includes("There is no course containing")) {
          setSearchError(errors);
        } else {
          alert(errors);
        }
      } else {
        alert(error.message);
      }
    } finally {
      setSearchLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserInfo();
      fetchCourses();
      setSearchValue("");
      setSearchError(null);
      setSearchLoading(false);
    }, [])
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <ImageBackground
      source={appBackground}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          {/* Title */}
          <Image
            source={require("../../assets/logo/entry-logo.png")}
            resizeMode="contain"
            style={{ width: "60%" }}
          />
          <Text style={styles.screenTitle}>Courses</Text>

          {/* Search Bar */}
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchPlaceholder}
              placeholder="Search..."
              value={searchValue}
              onChangeText={(value) => setSearchValue(value)}
            />
            <TouchableOpacity onPress={() => searchCourses(searchValue)}>
              <Ionicons name="search-outline" size={24} color="gray" />
            </TouchableOpacity>
          </View>

          {/* Category */}
          <ScrollView
            contentContainerStyle={styles.categoryContainer}
            showsHorizontalScrollIndicator={false}
          >
            {categories.map((category) => (
              <TouchableOpacity key={category} style={styles.categoryCard}>
                <Text style={styles.categoryTitle}>
                  {category.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Courses */}
        <View style={styles.courseSection}>
          {searchLoading ? (
            <ActivityIndicator size="large" color="blue" />
          ) : searchError ? (
            <Text style={styles.errorMessage}>
              There is no course containing '{searchValue}'!
            </Text>
          ) : (
            <FlatList
              data={courses}
              keyExtractor={(item) => item._id}
              showsVerticalScrollIndicator={false}
              horizontal={false}
              contentContainerStyle={styles.courseListContainer}
              renderItem={({ item }) => (
                <View>
                  <RenderCourses
                    item={item}
                    onPress={() => handleEnrollCourse(item._id)}
                    onPressAdmin={() =>
                      router.push(`/courseDetail/${item._id}`)
                    }
                    user={user}
                  />

                  {/* Modal */}
                  <Modal
                    transparent={true}
                    animationType="fade"
                    visible={visible}
                  >
                    <View style={styles.modalBackground}>
                      <View style={styles.modalContent}>
                        <TouchableOpacity
                          onPress={() => setVisible(false)}
                          style={{ position: "absolute", top: 10, left: 10 }}
                        >
                          <Ionicons
                            name="close-circle-outline"
                            size={24}
                            color="red"
                          />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>
                          You haven't bought this course yet!
                        </Text>
                        <TouchableOpacity
                          style={styles.buyButton}
                          onPress={() => {
                            setVisible(false);
                            router.push(`../payment/${item._id}`);
                          }}
                        >
                          <Text style={styles.buyText}>BUY</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Modal>
                </View>
              )}
            />
          )}
        </View>
      </SafeAreaView>

      {/* Add course for admin */}
      {user.role === "admin" ? (
        <View style={styles.addButtonContainer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push("../add/course")}
          >
            <Ionicons name="add" size={36} />
          </TouchableOpacity>
        </View>
      ) : (
        <></>
      )}
    </ImageBackground>
  );
};

export default CoursesPage;

const styles = StyleSheet.create({
  background: {
    width: "100%", // ! Di background jangan dikasi flex: 1 kalo gamau konten didalemnya kescroll ke atas pas keyboard keluar
    height: Dimensions.get("window").height, // ! THIS IS IT, BIAR IMAGE NYA GAK BERUBAH PAKE INI OMGGGGGG
  },
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
    marginTop: -10,
    marginLeft: -1,
  },
  header: {
    marginBottom: 20,
    marginTop: 8,
    marginHorizontal: 20,
  },
  searchBar: {
    flexDirection: "row",
    backgroundColor: "white",
    alignItems: "center",
    paddingHorizontal: 16,
    borderRadius: 25,
    marginTop: 60,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 8,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 16,
  },
  categoryContainer: {
    flexDirection: "row",
    marginRight: 6,
    marginTop: 12,
    overflow: "hidden",
  },
  categoryCard: {
    marginHorizontal: 6,
    padding: 8,
    backgroundColor: "#00A9E6",
    width: 72,
    alignItems: "center",
    borderRadius: 5,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 12,
  },
  categoryTitle: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  courseSection: {
    flex: 1,
  },
  courseListContainer: {
    overflow: "hidden",
    paddingBottom: 128,
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
    borderRadius: 4,
  },
  modalTitle: {
    marginTop: 20,
    marginBottom: 20,
    fontSize: 16,
    fontWeight: "semibold",
  },
  buyButton: {
    backgroundColor: "#FF8800",
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  buyText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  errorMessage: {
    fontWeight: "semibold",
    fontSize: 16,
    textAlign: "center",
    color: "darkblue",
    // marginTop: 140,
  },
  addButtonContainer: {
    position: "absolute",
    bottom: 84,
    right: 20,
  },
  addButton: {
    backgroundColor: "white",
    borderRadius: "50%",
    padding: 8,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
});
