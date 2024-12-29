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
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";

const AddCourse = () => {
  const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Free");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState(null);

  // ? Form errors
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [priceError, setPriceError] = useState("");

  const selectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      const image = result.assets[0];

      setImage(image);
    }
  };

  const handleAddCourse = async (title, description, type, price, image) => {
    const url = `${baseUrl}/api/courses/addCourse`;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("type", type);
      formData.append("price", price);

      if (image) {
        const imageUri = image.uri;
        const imageExtension = imageUri.split(".").pop();
        const imageName = `image.${imageExtension}`;

        formData.append("image", {
          uri: imageUri,
          type: `image/${imageExtension}`,
          name: imageName,
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
      setDescriptionError("");
      setPriceError("");

      router.push("/home");
    } catch (error) {
      setTitleError("");
      setDescriptionError("");
      setPriceError("");

      if (error.response) {
        const errors = error.response.data.errors;

        for (let i = 0; i < errors.length; i++) {
          const err = errors[i];

          if (err.includes("Course title can not be empty")) setTitleError(err);
          else if (err.includes("Course description can not be empty"))
            setDescriptionError(err);
          else if (err.includes("Course price cannot be empty!"))
            setPriceError(err);
          else if (err.includes("Course already exist!")) setTitleError(err);
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
              <Text style={styles.title}>Add Course</Text>

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
                    placeholder="Description..."
                    value={description}
                    onChangeText={setDescription}
                    style={styles.input}
                    placeholderTextColor="lightgray"
                  />
                </View>

                {descriptionError ? (
                  <Text style={styles.errors}>{descriptionError}</Text>
                ) : (
                  <></>
                )}

                {/* Type form */}
                <View style={styles.typeForm}>
                  {/* Free type */}
                  <TouchableOpacity
                    style={[
                      styles.freeButton,
                      {
                        backgroundColor: type === "Free" ? "#2BC1F8" : "white",
                      },
                    ]}
                    onPress={() => setType("Free")}
                  >
                    <Text
                      style={[
                        styles.freeText,
                        {
                          color: type === "Free" ? "white" : "black",
                        },
                      ]}
                    >
                      Free
                    </Text>
                  </TouchableOpacity>

                  {/* Paid type */}
                  <View style={styles.paidContainer}>
                    <TouchableOpacity
                      style={[
                        styles.paidButton,
                        {
                          backgroundColor:
                            type === "Paid" ? "#2BC1F8" : "white",
                        },
                      ]}
                      onPress={() => setType("Paid")}
                    >
                      <Text
                        style={[
                          styles.paidText,
                          {
                            color: type === "Paid" ? "white" : "black",
                          },
                        ]}
                      >
                        Paid
                      </Text>
                    </TouchableOpacity>

                    {/* Course price form */}
                    {type === "Paid" ? (
                      <TextInput
                        placeholder="Amount..."
                        value={price}
                        onChangeText={setPrice}
                        style={styles.priceForm}
                        placeholderTextColor="lightgray"
                      />
                    ) : (
                      <></>
                    )}
                  </View>
                </View>

                {priceError ? (
                  <Text
                    style={[styles.errors, { marginTop: 8, marginLeft: 68 }]}
                  >
                    {priceError}
                  </Text>
                ) : (
                  <></>
                )}

                {/* Image upload */}
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
                  onPress={selectImage}
                >
                  {image ? (
                    <Image source={image} style={{ width: 200, height: 200 }} />
                  ) : (
                    <Ionicons
                      name="albums-outline"
                      size={42}
                      color={"#2BC1F8"}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                if (type === "Free") setPrice(0);
                if (type === "Paid" && price === "") setPrice(0);

                handleAddCourse(title, description, type, price, image);
              }}
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

export default AddCourse;

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
