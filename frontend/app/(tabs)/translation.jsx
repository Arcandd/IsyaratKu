import {
  Button,
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { use, useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import appBackground from "../../assets/background/app-background.png";
import Loading from "../../components/Loading";
import {
  CameraView,
  useCameraPermissions,
  CameraCapturedPicture,
} from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

const TranslationPage = () => {
  const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;
  const [type, setType] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [gestureName, setGestureName] = useState([]);
  const [loading, setLoading] = useState(false);

  let cameraRef = useRef(null);

  if (!permission) {
    return <Loading />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setType((current) => (current === "back" ? "front" : "back"));
  };

  const takePicture = async () => {
    const url = `${baseUrl}/api/model`;

    if (cameraRef.current) {
      setLoading(true);

      try {
        const photo = await cameraRef.current.takePictureAsync({
          base64: true,
          quality: 1,
        });

        const { base64 } = photo;

        const response = await axios.post(url, {
          image: base64,
        });

        const result = response.data.result.gesture_name;
        setGestureName((prev) => [...prev, result]);
      } catch (error) {
        console.log(
          "Error while taking picture or sending to the backend:",
          error.response || error
        );

        alert("An error occured while processing the image");
      } finally {
        setLoading(false);
      }
    }
  };

  const deleteGesture = () => {
    setGestureName((prev) => prev.slice(0, -1));
  };

  const clearGesture = () => {
    setGestureName([]);
  };

  return (
    <ImageBackground
      source={appBackground}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <CameraView
          style={styles.camera}
          facing={type}
          ref={(ref) => (cameraRef.current = ref)}
        >
          <View style={styles.cameraButtonContainer}>
            <TouchableOpacity onPress={toggleCameraFacing}>
              <Ionicons name="camera-reverse-outline" color="white" size={36} />
            </TouchableOpacity>
          </View>
        </CameraView>

        <View style={{ margin: 12 }}>
          <View style={styles.outputBox}>
            <ScrollView>
              <Text>Recognized Gesture:</Text>
              <Text>
                {gestureName.length === 0
                  ? "No gesture recognized!"
                  : gestureName}
              </Text>
            </ScrollView>

            <View
              style={{ justifyContent: "space-between", marginVertical: 16 }}
            >
              <TouchableOpacity onPress={deleteGesture}>
                <Ionicons name="backspace" size={28} />
              </TouchableOpacity>

              <TouchableOpacity onPress={clearGesture}>
                <Ionicons name="trash" size={28} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.takeButton} onPress={takePicture}>
            <Text style={styles.takeButtonText}>
              {loading ? "Processing..." : "Take picture"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default TranslationPage;

const styles = StyleSheet.create({
  background: {
    width: "100%", // ! Di background jangan dikasi flex: 1 kalo gamau konten didalemnya kescroll ke atas pas keyboard keluar
    height: Dimensions.get("window").height, // ! THIS IS IT, BIAR IMAGE NYA GAK BERUBAH PAKE INI OMGGGGGG
  },
  permissionContainer: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  container: {
    flex: 1,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    width: "100%",
    height: "60%",
  },
  cameraButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  outputBox: {
    borderRadius: 5,
    backgroundColor: "#F1F1F1",
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: "100%",
    minHeight: "20%",
    flexDirection: "row",
  },
  takeButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFA722",
    borderRadius: 5,
    width: "35%",
    padding: 8,
    marginTop: 24,
    alignSelf: "center",
  },
  takeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  capturedImage: {
    width: "100%",
    height: 150,
    borderRadius: 5,
  },
});
