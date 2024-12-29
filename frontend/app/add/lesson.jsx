import {
  ActivityIndicator,
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Loading from "../../components/Loading";
import AntDesign from "@expo/vector-icons/AntDesign";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router/build/hooks";

const AddLesson = () => {
  const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [video, setVideo] = useState(null);
  const { id } = useLocalSearchParams();

  // ? Form errors
  const [titleError, setTitleError] = useState("");

  const selectVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      const video = result.assets[0];

      setVideo(video);
    }
  };

  const handleAddLesson = async (title) => {
    const url = `${baseUrl}/api/courses/addLesson`;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("courseId", id);
      formData.append("title", title);

      if (video) {
        const videoUri = video.uri;
        const videoExtension = videoUri.split(".").pop();
        const videoName = `video.${videoExtension}`;

        formData.append("material", {
          uri: videoUri,
          type: `image/${videoExtension}`,
          name: videoName,
        });
      }

      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const result = response.data;
      const { message } = result;

      // ? Resetting error
      setTitleError("");

      router.back();
    } catch (error) {
      setTitleError("");

      if (error.response) {
        const errors = error.response.data.errors;

        for (let i = 0; i < errors.length; i++) {
          const err = errors[i];

          if (err.includes("The title of the lesson can not be empty"))
            setTitleError(err);
          else if (err.includes("Lesson already exist")) setTitleError(err);
          else alert(err);
        }
      } else {
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

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

          <View style={styles.contentContainer}>
            <View style={styles.content}>
              <Text style={styles.title}>Add Lesson</Text>

              <View style={styles.form}>
                {/* Title form */}
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Title..."
                    value={title}
                    onChangeText={setTitle}
                    style={styles.input}
                    placeholderTextColor="lightgray"
                  />
                </View>

                {titleError ? (
                  <Text style={styles.errors}>{titleError}!</Text>
                ) : (
                  <></>
                )}

                {/* Video upload */}
                <TouchableOpacity
                  style={{
                    height: "50%",
                    width: "100%",
                    marginTop: 16,
                    borderWidth: 2,
                    borderStyle: "dashed",
                    borderRadius: 20,
                    borderColor: "#2BC1F8",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={selectVideo}
                >
                  {video ? (
                    <Image
                      source={video}
                      style={{ width: 300, height: 200 }}
                      resizeMode="contain"
                    />
                  ) : (
                    <Ionicons
                      name="videocam-outline"
                      size={42}
                      color={"#2BC1F8"}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => handleAddLesson(title)}
            >
              {loading ? (
                <ActivityIndicator color={"white"} size={"small"} />
              ) : (
                <Text style={styles.addText}>ADD</Text>
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </ScrollView>
  );
};

export default AddLesson;

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
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  content: {
    marginTop: 48,
    flex: 1,
  },
  title: {
    fontSize: 32,
    color: "white",
    fontWeight: "bold",
  },
  form: {
    flex: 1,
    marginTop: 100,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 15,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "black",
  },
  typeForm: {
    flexDirection: "row",
    alignItems: "center",
  },
  freeButton: {
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    height: 42,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  freeText: {
    fontSize: 16,
    fontWeight: "semibold",
  },
  paidContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    height: 42,
  },
  paidButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    justifyContent: "center",
    alignItems: "center",
    height: 42,
  },
  paidText: {
    fontSize: 16,
    fontWeight: "semibold",
  },
  priceForm: {
    fontSize: 16,
    color: "gray",
    borderLeftWidth: 0.5,
    borderLeftColor: "lightgray",
    paddingHorizontal: 12,
    width: 230,
    height: 42,
  },
  addButton: {
    backgroundColor: "#FFA722",
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    minHeight: 42,
  },
  addText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
  errors: {
    color: "red",
    marginBottom: 16,
    marginTop: -12,
  },
});
