import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Platform,
  KeyboardAvoidingView,
  RefreshControl,
  Alert,
  SafeAreaView,
  Modal,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import CustomPicker from "@/components/CustomPicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import fonts from "@/constants/fonts";
import { LinearGradient } from "expo-linear-gradient";
import Loading from "@/components/Loading";
import { Button } from "@rneui/themed";

const Request = () => {
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(moment()); // Changed to moment object
  const [showMonthPicker, setShowMonthPicker] = useState(false); // State for showing month picker
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUser, setCurrentUser] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [showMyRequests, setShowMyRequests] = useState(true); // Track selected button

  const userEmail = useSelector((state) => state.auth.user?.email); // Get email from Redux
  const userLogin = useSelector((state) => state.auth.user);
  const userId = userLogin._id;

  const generateLastSixMonths = () => {
    const now = moment();
    const months = [];
    for (let i = 0; i < 6; i++) {
      months.push(now.clone().subtract(i, "months"));
    }
    return months;
  };

  const lastSixMonths = generateLastSixMonths();
  const monthStrings = lastSixMonths.map((month) => month.format("MMMM YYYY")); // Array of formatted strings

  useEffect(() => {
    // Set your department list here
    setDepartments([
      "Accountant",
      "Admin",
      "Amazon",
      "Cleaner",
      "Designer",
      "Developer",
      "Etsy",
      "FBA1",
      "Fashion",
      "Fulfillment",
      "HR",
      "Logistics",
      "Manager",
      "Media1",
      "Media2",
      "Media3",
      "PKD1",
      "PKD2",
      "PKD3",
      "PKD4",
      "PKD5",
      "PKD6",
      "PKD7",
      "PKD8",
      "PKD9",
      "PKD10",
      "PKD11",
      "PKD12",
      "PKD13",
      "PKD14",
      "PKD15",
      "Printsel",
      "Resource",
      "Technical",
      "Varlders",
    ]);

    if (userEmail && userId) {
      // Only fetch if userEmail exists
      fetchLeaveRequests();
    }
  }, [userEmail, userId]); // Add userEmail to the dependency array
  const fetchLeaveRequests = async () => {
    setLoading(true); // Set loading to true before fetching
    setRefreshing(true);
    try {
      const token = await AsyncStorage.getItem("token"); // Get token from AsyncStorage

      if (!token) {
        console.error("Token not found in AsyncStorage, but continuing anyway");
        setLoading(false); // Set loading to false if token not found
        setRefreshing(false);
        return;
      }
      const response = await axios.get(
        `https://erpapi.folinas.com/api/v1/checkInRequests?page=1&limit=2000`,
        {
          // New route

          headers: {
            Authorization: `Bearer ${token}`, // Add Bearer prefix
          },
        }
      );

      if (response.status === 200) {
        setLeaveRequests(response.data.data);
        const filteredRequests = response.data.data.filter(
          (req) => req.userId === userId
        );
        setCurrentUser(filteredRequests);
      } else {
        console.error("Error fetching leave requests", response.data);
        Alert.alert(
          "Error",
          "Could not fetch leave requests. Please try again later."
        );
      }
    } catch (error) {
      //error handling
      console.error("Error fetching leave requests", error);
      Alert.alert("Error", error.message); //network error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  const onRefresh = () => {
    fetchLeaveRequests();
  };

  const getStatusCount = (status) => {
    const startOfMonth = selectedMonth.clone().startOf("month");
    const endOfMonth = selectedMonth.clone().endOf("month");

    if (status === "All") {
      return currentUser.filter((req) => {
        const requestDate = moment(req.requestDate);
        return requestDate.isBetween(startOfMonth, endOfMonth, null, "[]"); // [] includes start and end date
      }).length;
    } else {
      return currentUser.filter((req) => {
        const requestDate = moment(req.requestDate);
        return (
          req.status === status &&
          requestDate.isBetween(startOfMonth, endOfMonth, null, "[]")
        );
      }).length;
    }
  };
  const renderLeaveRequest = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedRequest(item);
        }}
      >
        <View className="bg-white rounded-[20px] p-[15px]  shadow-md mt-[10px]  h-[114px] ">
          {/* Container styles */}
          <View className="flex-row justify-between items-center mb-2">
            {/* Header styles */}
            <Text
              className=" text-[14px] text-[#333434]"
              style={{
                fontFamily: fonts["BeVietNam-Medium"],
              }}
            >
              {/* Title styles */}
              Loại: <Text>{item.type}</Text>
            </Text>
            <View
              className={`px-2 py-1 rounded-full text-white 
                        ${
                          item.status === "Completed"
                            ? "bg-green-50"
                            : item.status === "Ignored"
                            ? "bg-red-50"
                            : item.status === "Pending"
                            ? "bg-yellow-50"
                            : item.status === "Approved"
                            ? "bg-blue-50"
                            : item.status === "Rejected"
                            ? "bg-gray-50"
                            : item.status === "Canceled"
                            ? "bg-orange-50"
                            : ""
                        }`} // Dynamic status badge styles
            >
              <Text
                className={`${
                  item.status === "Completed"
                    ? "text-green-400"
                    : item.status === "Ignored"
                    ? "text-red-400"
                    : item.status === "Pending"
                    ? "text-yellow-400"
                    : item.status === "Approved"
                    ? "text-blue-400"
                    : item.status === "Rejected"
                    ? "text-gray-400"
                    : item.status === "Canceled"
                    ? "text-orange-400"
                    : ""
                }`}
                style={{
                  fontFamily: fonts["BeVietNamPro-SemiBold"],
                  fontSize: 12,
                }}
              >
                {item.status}
              </Text>
            </View>
          </View>
          {/* Table */}
          <View className="mt-[10px]">
            <View className="flex-row justify-between  ">
              {/* Header row styles */}
              <Text
                className=" text-[#9098B1] w-1/4 text-center"
                style={{
                  fontFamily: fonts["BeVietNamPro-Regular"],
                  fontSize: 12,
                }}
              >
                TG tạo
              </Text>
              <Text
                className=" text-[#9098B1] w-1/4 text-center"
                style={{
                  fontFamily: fonts["BeVietNamPro-Regular"],
                  fontSize: 12,
                }}
              >
                Ngày
              </Text>
              <Text
                className=" text-[#9098B1] w-1/4 text-center"
                style={{
                  fontFamily: fonts["BeVietNamPro-Regular"],
                  fontSize: 12,
                }}
              >
                Thời gian
              </Text>
              <Text
                className=" text-[#9098B1] w-1/4 text-center"
                style={{
                  fontFamily: fonts["BeVietNamPro-Regular"],
                  fontSize: 12,
                }}
              >
                Lý do
              </Text>
            </View>

            <View className="flex-row justify-between py-2">
              {/* Data row styles */}
              <View className="w-1/4 items-center">
                <Text
                  className="text-gray-800 text-center"
                  style={{
                    fontFamily: fonts["BeVietNamPro-Regular"],
                    fontSize: 10,
                  }}
                >
                  {moment(item.createdAt).format("DD/MM/YY")}
                </Text>
                <Text
                  className="text-gray-800  text-center"
                  style={{
                    fontFamily: fonts["BeVietNamPro-Regular"],
                    fontSize: 10,
                  }}
                >
                  {moment(item.createdAt).format("HH:mm")}
                </Text>
              </View>
              <Text
                className="text-gray-800 w-1/4 text-center"
                style={{
                  fontFamily: fonts["BeVietNamPro-Regular"],
                  fontSize: 10,
                }}
              >
                {moment(item.requestDate).format("DD/MM/YYYY")}
              </Text>
              <Text
                className="text-gray-800 w-1/4 text-center"
                style={{
                  fontFamily: fonts["BeVietNamPro-Regular"],
                  fontSize: 10,
                }}
              >
                {item.requestTime}
              </Text>
              <Text
                className="text-gray-800 w-1/4 text-center"
                style={{
                  fontFamily: fonts["BeVietNamPro-Regular"],
                  fontSize: 10,
                }}
              >
                {item.reason}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Loading />
      </View>
    );
  }

  // Filter requests based on the selected month
  const filteredLeaveRequests = currentUser.filter((req) => {
    const startOfMonth = selectedMonth.clone().startOf("month");
    const endOfMonth = selectedMonth.clone().endOf("month");
    const requestDate = moment(req.requestDate);
    return (
      requestDate.isBetween(startOfMonth, endOfMonth, null, "[]") &&
      (selectedStatus === "All" || req.status === selectedStatus)
    );
  });

  const displayedRequests = showMyRequests
    ? filteredLeaveRequests
    : leaveRequests.filter((request) => request.status === "Pending");

  const RequestDetailModal = ({ visible, request, onClose }) => {
    if (!visible) {
      return null;
    }

    if (!request) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Loading />
        </View>
      );
    }

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.headerContainer}>
              <TouchableOpacity
                onPress={onClose}
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
                <Text style={styles.value}>{userLogin.fullName}</Text>
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-[#F5F5F5]"
      keyboardVerticalOffset={100} // Adjust as needed
    >
      <SafeAreaView>
        <LinearGradient
          colors={["#033495", "#0654B2", "#005AB4", "#38B6FF"]}
          locations={[0, 0.16, 0.32, 1]} // Vị trí tương ứng với phần trăm
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }} // Hoặc điều chỉnh theo hướng gradient mong muốn
          className="w-full h-[109px] justify-between flex-row items-center"
        >
          <TouchableOpacity
            className=" ml-[15px] w-[30px] h-[30px]  border-none rounded-[6px] justify-center items-center"
            onPress={() => router.back()}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
            }}
          >
            <Ionicons name="chevron-back" size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <Text
            className="justify-center items-center text-[#FFFFFF] mr-[170px]"
            style={{
              fontFamily: fonts["BeVietNamPro-SemiBold"],
              fontSize: 16,
            }}
          >
            Xin Phép
          </Text>
        </LinearGradient>
      </SafeAreaView>
      {/*  */}
      <View className="flex-1 bg-[#F5F5F5] p-4">
        <View className="flex-row flex-wrap justify-between mb-4 bg-[#FFFFFF] rounded-lg">
          {[
            "All",
            "Pending",
            "Approved",
            "Rejected",
            "Canceled",
            "Ignored",
          ].map((status) => (
            <TouchableOpacity
              key={status}
              onPress={() => setSelectedStatus(status)}
              className={`w-[112px] h-[32px] rounded-lg   mr-1 items-center justify-center  ${
                selectedStatus === status ? "bg-[#F1F5F9]" : "bg-[#FFFFFF]"
              }`}
            >
              <Text className={` text-black`}>
                {status} ({getStatusCount(status)})
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="pr-[12px]">
          <View className="flex-row mb-4">
            <View className="flex-1">
              {/* <CustomPicker
                items={departments}
                selectedValue={selectedDepartment}
                onValueChange={setSelectedDepartment}
                placeholder="Department"
              />
              <MaterialIcons
                name="keyboard-arrow-down"
                size={8}
                color="#94A3B8"
              /> */}
              <View className="bg-white border border-[#CBD5E1] rounded-[6px] h-[40px] w-[130px]">
                <Text className="top-[10px] ml-[25px]">
                  {userLogin.role.name}
                </Text>
              </View>
            </View>
            <View className="flex-1 w-[219px] h-[40px]">
              <CustomPicker
                items={monthStrings}
                selectedValue={selectedMonth.format("MMMM YYYY")}
                onValueChange={(monthString) => {
                  const selectedMonthObject = lastSixMonths.find(
                    (month) => month.format("MMMM YYYY") === monthString
                  );
                  setSelectedMonth(selectedMonthObject || moment());
                }}
                placeholder="Select Month"
                className="mb-2"
              />
            </View>
          </View>
        </View>

        <View className=" w-[360px] h-[38px] justify-center pl-2">
          <Text
            className=" text-[14px] mb-2"
            style={{
              fontFamily: fonts["BeVietNamPro-SemiBold"],
              color: "#331A1A",
            }}
          >
            Danh sách Xin phép
          </Text>
        </View>
        {/* <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginBottom: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setShowMyRequests(true);
            }}
            style={[
              styles.filterButton,
              showMyRequests && styles.filterButtonActive,
            ]}
          >
            <Text
              style={[
                styles.filterButtonText,
                showMyRequests && styles.filterButtonTextActive,
              ]}
            >
              Của tôi
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setShowMyRequests(false);
            }}
            style={[
              styles.filterButton,
              !showMyRequests && styles.filterButtonActive,
            ]}
          >
            <Text
              style={[
                styles.filterButtonText,
                !showMyRequests && styles.filterButtonTextActive,
              ]}
            >
              Cần duyệt
            </Text>
          </TouchableOpacity>
        </View> */}
        <FlatList
          data={displayedRequests}
          renderItem={renderLeaveRequest}
          keyExtractor={(item) => item._id}
          style={{
            marginTop: 20,
            marginBottom: 100,
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />

        <RequestDetailModal
          visible={selectedRequest !== null}
          request={selectedRequest}
          user={userLogin}
          onClose={() => setSelectedRequest(null)}
        />
      </View>
      <TouchableOpacity
        className="bg-[#0B6CA7] rounded-[6px] absolute bottom-4 right-4 flex-row items-center justify-center w-[109px] h-[40px]"
        onPress={() => {
          router.push("/request/createRequest");
        }}
      >
        <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" />
        <Text
          className="ml-2 text-[#FFFFFF]"
          style={{
            fontFamily: fonts["Inter-Medium"],
            fontSize: 14,
          }}
        >
          Tạo mới
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
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
  pickerContainer: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 6,
    height: 40,
    justifyContent: "center",
  },
  pickerText: {
    fontFamily: fonts["BeVietNamPro-Regular"],
    fontSize: 14,
    paddingHorizontal: 10,
    color: "#333434",
  },
  filterButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    backgroundColor: "white",
  },
  filterButtonActive: {
    backgroundColor: "#F1F5F9",
  },
  filterButtonText: {
    color: "#333434",
    fontFamily: fonts["BeVietNamPro-Regular"],
    fontSize: 14,
  },
  filterButtonTextActive: {
    fontFamily: fonts["BeVietNamPro-Regular"],
    fontSize: 14,
  },
});

export default Request;
