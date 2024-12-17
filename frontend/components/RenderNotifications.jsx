import {
  Button,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

const RenderNotifications = ({ item }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const toggleDialog = (item) => {
    setSelectedItem(item);
  };

  return (
    <View>
      <TouchableOpacity
        key={item._id}
        style={styles.notifContainer}
        onPress={() => toggleDialog(item)}
      >
        <Ionicons name="notifications" size={20} style={styles.icon} />

        <View style={styles.textContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{item.title}</Text>

            <View style={styles.timeContainer}>
              <Ionicons name="time" style={styles.clockIcon} size={12} />

              <Text style={styles.time}>{item.timeElapsed}</Text>
            </View>
          </View>

          <Text style={styles.content} numberOfLines={1} ellipsizeMode="tail">
            {item.content}
          </Text>
        </View>
      </TouchableOpacity>

      {selectedItem?._id === item._id && (
        <Modal
          visible={!!selectedItem} // ? !! Digunakan untuk mengembalikan nilai boolean ketika terdapat selectedItem
          transparent={true}
          animationType="fade"
          onRequestClose={() => toggleDialog(null)}
        >
          <View style={styles.overlay}>
            <View style={styles.dialog}>
              <ScrollView contentContainerStyle={styles.scrollView}>
                <View>
                  <Text style={styles.dialogTitle}>{selectedItem.title}</Text>
                  <Text style={styles.dialogMessage}>
                    {selectedItem.content}
                  </Text>
                </View>

                <Button title="Close" onPress={() => toggleDialog(null)} />
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default RenderNotifications;

const styles = StyleSheet.create({
  notifContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginBottom: 16,
    paddingBottom: 12,
  },
  icon: {
    color: "#2BC1F8",
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
    padding: 8,
  },
  textContainer: {
    flex: 1,
    marginLeft: 8,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    fontSize: 14,
    color: "gray",
    marginTop: 4,
    fontWeight: "400",
    width: "80%",
  },
  timeContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  clockIcon: {
    color: "gray",
  },
  time: {
    fontSize: 10,
    color: "gray",
    marginLeft: 4,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dialog: {
    width: "86%",
    height: "80%",
    backgroundColor: "white",
    padding: 16,
    elevation: 5,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderRadius: 4,
  },
  scrollView: {
    flex: 1,
    justifyContent: "space-between",
  },
  dialogTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderColor: "black",
    paddingBottom: 8,
  },
  dialogMessage: {
    fontSize: 16,
    marginBottom: 20,
    fontWeight: "400",
    color: "#363636",
  },
});
