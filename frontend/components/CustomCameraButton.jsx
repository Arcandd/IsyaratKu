import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CustomCameraButton = ({ onPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.cameraButton}
        onPress={onPress}
        activeOpacity={1}
      >
        <Ionicons name="camera-outline" size={36} color="rgba(0, 0, 0, 0.7)" />
      </TouchableOpacity>
    </View>
  );
};

export default CustomCameraButton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#60C8EE",
    paddingBottom: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraButton: {
    height: 48,
    width: 81,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
    elevation: 0,
    shadowColor: "transparent",
    shadowRadius: 0,
    shadowOpacity: 0,
    shadowOffset: { width: 0, height: 0 },
  },
});
