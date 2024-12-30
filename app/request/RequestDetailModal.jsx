import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import { router } from "expo-router";
import fonts from "@/constants/fonts";
import { useSelector } from "react-redux";
import Loading from "@/components/Loading";

const RequestDetailModal = ({ route }) => {
  const [request, setRequest] = useState(null);
  const [modalVisible, setModalVisible] = useState(true); // Initially visible
  const [user, setUser] = useState(null);
  useEffect(() => {
    // Check if route.params is defined and contains the request data
    if (route && route.params && route.params.request && route.params.user) {
      setRequest(route.params.request);
      setUser(route.params.user);
      console.log(user);
    } else {
      console.error("Request data is missing or undefined");
      // Optionally, you could handle the error here, e.g., show an error message
    }
  }, [route]);

  if (!request) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Loading />
      </View>
    );
  }

  const closeModal = () => {
    setModalVisible(false);
    router.back();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              onPress={closeModal}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                borderRadius: 50,
                padding: 8,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.modalHeaderText}>Request Details</Text>
          </View>

          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 10,
              paddingVertical: 20,
            }}
          >
            <View style={styles.detailRow}>
              <Text style={styles.label}>Request ID:</Text>
              <Text style={styles.value}>{request._id}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>User:</Text>
              <Text style={styles.value}>{user.fullName}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Loại:</Text>
              <Text style={styles.value}>{request.type}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Request Date:</Text>
              <Text style={styles.value}>
                {moment(request.requestDate).format("DD/MM/YYYY")}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Request Time:</Text>
              <Text style={styles.value}>
                {moment(request.createdAt).format("HH:mm:ss")}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Lý do:</Text>
              <Text style={styles.value}>{request.reason}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Trạng thái:</Text>
              <Text style={styles.value}>{request.status}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Absent Type:</Text>
              <Text style={styles.value}>{request.absentType}</Text>
            </View>

            {/* Additional details as needed */}
          </ScrollView>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              width: "100%",
              paddingVertical: 10,
            }}
          >
            <TouchableOpacity style={[styles.button, styles.buttonApprove]}>
              <Text style={styles.textStyle}>Phê duyệt</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.buttonReject]}>
              <Text style={styles.textStyle}>Từ chối</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "90%",
    maxHeight: "80%",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  modalHeaderText: {
    fontFamily: fonts["BeVietNamPro-SemiBold"],
    fontSize: 20,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  label: {
    fontFamily: fonts["BeVietNamPro-Regular"],
    fontSize: 14,
    width: 100,
    color: "#737373",
  },
  value: {
    fontFamily: fonts["BeVietNamPro-Regular"],
    fontSize: 14,
    flex: 1, // Allow value to wrap if needed
  },
  button: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    alignItems: "center",
  },
  buttonApprove: {
    backgroundColor: "#2196F3",
  },
  buttonReject: {
    backgroundColor: "#f44336",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default RequestDetailModal;
