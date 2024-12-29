import {
  ActivityIndicator,
  Dimensions,
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

const AddNotification = () => {
  const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("Global");
  const [target, setTarget] = useState(null);
  const [loading, setLoading] = useState(false);

  // ? Form errors
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const [targetError, setTargetError] = useState("");

  const handleCreateNotification = async (title, content, target) => {
    const url = `${baseUrl}/api/notifications/createNotification`;
    setLoading(true);

    try {
      const response = await axios.post(url, {
        title: title,
        content: content,
        targetUser: target,
      });
      const result = response.data;
      const { message } = result;
      console.log(message);

      setTitleError("");
      setContentError("");
      setTargetError("");

      router.push("/home");
    } catch (error) {
      setTitleError("");
      setContentError("");
      setTargetError("");

      if (error.response) {
        const errors = error.response.data.errors;
        console.log(errors);

        for (let i = 0; i < errors.length; i++) {
          const err = errors[i];

          if (err.includes("Notification title can not be empty"))
            setTitleError(err);
          else if (err.includes("Notification content can not be empty"))
            setContentError(err);
          else if (err.includes("Notification target ID must be 24 characters"))
            setTargetError(err);
          else if (err.includes("User not found!")) setTargetError(err);
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
              <Text style={styles.title}>Create Notification</Text>

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
                  <Text style={styles.errors}>{titleError}</Text>
                ) : (
                  <></>
                )}

                {/* Description form */}
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Content..."
                    value={content}
                    onChangeText={setContent}
                    style={styles.input}
                    placeholderTextColor="lightgray"
                  />
                </View>

                {contentError ? (
                  <Text style={styles.errors}>{contentError}</Text>
                ) : (
                  <></>
                )}

                {/* Type form */}
                <View style={styles.typeForm}>
                  {/* Free type */}
                  <TouchableOpacity
                    style={[
                      styles.globalButton,
                      {
                        backgroundColor:
                          type === "Global" ? "#2BC1F8" : "white",
                      },
                    ]}
                    onPress={() => setType("Global")}
                  >
                    <Text
                      style={[
                        styles.globalText,
                        {
                          color: type === "Global" ? "white" : "black",
                        },
                      ]}
                    >
                      Global
                    </Text>
                  </TouchableOpacity>

                  {/* Paid type */}
                  <View style={styles.targetContainer}>
                    <TouchableOpacity
                      style={[
                        styles.targetButton,
                        {
                          backgroundColor:
                            type === "Targeted" ? "#2BC1F8" : "white",
                        },
                      ]}
                      onPress={() => setType("Targeted")}
                    >
                      <Text
                        style={[
                          styles.targetText,
                          {
                            color: type === "Targeted" ? "white" : "black",
                          },
                        ]}
                      >
                        Targeted
                      </Text>
                    </TouchableOpacity>

                    {/* Course price form */}
                    {type === "Targeted" ? (
                      <TextInput
                        placeholder="Target user ID..."
                        value={target}
                        onChangeText={setTarget}
                        style={styles.targetForm}
                        placeholderTextColor="lightgray"
                      />
                    ) : (
                      <></>
                    )}
                  </View>
                </View>

                {targetError ? (
                  <Text
                    style={[styles.errors, { marginTop: 8, marginLeft: 82 }]}
                    numberOfLines={2}
                  >
                    {targetError}
                  </Text>
                ) : (
                  <></>
                )}
              </View>
            </View>

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                if (type === "Global") setTarget(null);

                handleCreateNotification(title, content, target);
              }}
            >
              {loading ? (
                <ActivityIndicator color={"white"} size={"small"} />
              ) : (
                <Text style={styles.addText}>CREATE</Text>
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </ScrollView>
  );
};

export default AddNotification;

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
  globalButton: {
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
  globalText: {
    fontSize: 16,
    fontWeight: "semibold",
  },
  targetContainer: {
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
  targetButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    justifyContent: "center",
    alignItems: "center",
    height: 42,
  },
  targetText: {
    fontSize: 16,
    fontWeight: "semibold",
  },
  targetForm: {
    fontSize: 16,
    color: "gray",
    borderLeftWidth: 0.5,
    borderLeftColor: "lightgray",
    paddingHorizontal: 12,
    width: 184,
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
