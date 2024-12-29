import {
  ActivityIndicator,
  Button,
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import Loading from "../../../../components/Loading";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent } from "expo";

const LessonPage = () => {
  const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;
  const router = useRouter();
  const { courseId, lessonId } = useLocalSearchParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [videoSource, setVideoSource] = useState("");
  const [user, setUser] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ? Video stuff
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = false;
    player.play();
  });
  // ! Kalo mau ngecek status, pake ini. (Mending jangan diapus sih ini comment e, soale expo-video tu library baru)
  const { status } = useEvent(player, "statusChange", {
    status: player.status,
  });

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

  const fetchLesson = async () => {
    const url = `${baseUrl}/api/courses/${courseId}/lesson/${lessonId}`;

    try {
      const response = await axios.get(url);
      const result = response.data;
      const { lesson } = result;
      setLesson(lesson);
      setCourse(lesson.courseId);
      setVideoSource(lesson.material);
    } catch (error) {
      if (error.response) {
        const errors = error.response.data.error;
        alert(errors);
      } else {
        alert(error.message);
      }
    }
  };

  const handleDeleteLesson = async () => {
    const url = `${baseUrl}/api/courses/deleteLesson/${lesson._id}`;
    setDeleteLoading(true);

    try {
      const response = await axios.delete(url);
      const result = response.data;
      const { message } = result;

      router.back();
    } catch (error) {
      if (error.response) {
        const errors = error.response.data.error;
        alert(errors);
      } else {
        alert(error.message);
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchUserInfo();
        await fetchLesson();
      } catch (error) {
        alert(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <ImageBackground
      source={require("../../../../assets/background/app-background-3.png")}
      resizeMode="cover"
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <AntDesign name="arrowleft" size={32} color="white" />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.courseTitle}>{course.title}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.session}>Session</Text>
          <Text style={styles.lessonTitle}>{lesson.title}</Text>

          <Text style={styles.deliveryModeTitle}>Delivery Mode</Text>
          <Text style={styles.deliveryMode}>YouTube Video</Text>

          {/* Video */}
          <View style={styles.videoContainer}>
            {status === "loading" ? (
              <ActivityIndicator
                size="large"
                color="white"
                style={styles.loadingIndicator}
              />
            ) : (
              <VideoView
                style={styles.video}
                player={player}
                allowsFullscreen
                contentFit="contain"
              />
            )}
          </View>

          {/* Delete lesson */}
          {user.role === "admin" ? (
            <TouchableOpacity
              style={{
                backgroundColor: "red",
                marginTop: 20,
                paddingVertical: 12,
                borderRadius: 8,
              }}
              onPress={() => handleDeleteLesson()}
            >
              {deleteLoading ? (
                <ActivityIndicator color={"white"} size={"small"} />
              ) : (
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                    fontSize: 16,
                  }}
                >
                  Delete Lesson
                </Text>
              )}
            </TouchableOpacity>
          ) : (
            <></>
          )}
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default LessonPage;

const styles = StyleSheet.create({
  background: {
    width: "100%", // ! Di background jangan dikasi flex: 1 kalo gamau konten didalemnya kescroll ke atas pas keyboard keluar
    height: Dimensions.get("window").height, // ! THIS IS IT, BIAR IMAGE NYA GAK BERUBAH PAKE INI OMGGGGGG
  },
  container: {
    padding: 20,
    flex: 1,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 10,
  },
  titleContainer: {
    marginLeft: 0,
  },
  courseTitle: {
    fontWeight: "bold",
    fontSize: 24,
    color: "white",
    marginTop: 56,
  },
  card: {
    backgroundColor: "#F1F1F1",
    marginTop: 92,
    flex: 1,
    borderRadius: 15,
    padding: 20,
    overflow: "hidden",
  },
  session: {
    fontSize: 14,
    color: "gray",
    fontWeight: "400",
    marginBottom: 4,
  },
  lessonTitle: {
    fontWeight: "500",
    fontSize: 18,
    color: "black",
  },
  deliveryModeTitle: {
    marginTop: 20,
    color: "gray",
    fontWeight: "400",
    fontSize: 14,
    marginBottom: 4,
  },
  deliveryMode: {
    fontWeight: "500",
    fontSize: 18,
    color: "black",
    borderBottomWidth: 0.5,
    borderColor: "gray",
    marginBottom: 40,
    paddingBottom: 12,
  },
  videoContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
    width: "100%",
    height: 275,
  },
  video: {
    width: "100%",
    height: 275,
  },
});
