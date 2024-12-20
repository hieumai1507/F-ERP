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
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import axios from "axios";
import moment from "moment"; // Import moment.js for date/time formatting
import { useSelector } from "react-redux"; // Import useSelector
import CustomPicker from "@/components/CustomPicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SERVER_URI } from "../../utils/uri";
import fonts from "@/constants/fonts";
import { LinearGradient } from "expo-linear-gradient";
import Loading from "@/components/Loading";
import { jwtDecode } from "jwt-decode";

const Request = () => {
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUser, setCurrentUser] = useState([]);

  const userEmail = useSelector((state) => state.auth.user?.email); // Get email from Redux
  const userLogin = useSelector((state) => state.auth.user);
  const userId = userLogin._id;

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
        `https://erpapi.folinas.com/api/v1/checkInRequests?page=1&limit=10000`,
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
    if (status === "All") {
      return currentUser.filter((req) => {
        // Count ALL within date range
        const requestDate = new Date(req.requestDate);
        return requestDate >= fromDate && requestDate <= toDate;
      }).length;
    } else {
      return currentUser.filter((req) => {
        // Count specific status within date range
        const requestDate = new Date(req.requestDate);
        return (
          req.status === status &&
          requestDate >= fromDate &&
          requestDate <= toDate
        );
      }).length;
    }
  };

  const renderLeaveRequest = ({ item }) => {
    const formattedDate = moment(item.date).format("DD/MM/YYYY"); // Format date
    const formattedTime = moment(item.time).format("HH:mm"); // Format time
    return (
      <View className="bg-white rounded-[20px] p-[15px]  shadow-md mt-[10px]">
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
          <View className="flex-row justify-between  py-2">
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
            <Text
              className="text-gray-800 w-1/4 text-center"
              style={{
                fontFamily: fonts["BeVietNamPro-Regular"],
                fontSize: 10,
              }}
            >
              {moment(item.createdAt).fromNow()}
            </Text>
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
              {moment(item.createdAt).format("HH:mm:ss")}
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
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Loading />
      </View>
    );
  }

  const filteredLeaveRequests = currentUser.filter((req) => {
    const requestDate = new Date(req.requestDate);
    return (
      requestDate >= fromDate &&
      requestDate <= toDate &&
      (selectedStatus === "All" || req.status === selectedStatus)
    );
  });

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

      <View className="flex-1 bg-[#F5F5F5] p-4">
        <View className="flex-row flex-wrap justify-between mb-4">
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
              className={`w-[112px] h-[32px] rounded-lg border border-gray-300 mr-1 items-center justify-center  ${
                selectedStatus === status ? "bg-[#F1F5F9]" : "bg-[#FFFFFF]"
              }`}
            >
              <Text className={` text-black`}>
                {status} ({getStatusCount(status)})
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="pr-[40px] w-[360px] h-[40px] mb-[18px] mt-[18px] justify-center">
          <View className="flex-row justify-between mb-4">
            <View className="flex-1 mr-2 ">
              <CustomPicker
                items={departments}
                selectedValue={selectedDepartment}
                onValueChange={setSelectedDepartment}
                placeholder="Department"
              />
              <MaterialIcons
                name="keyboard-arrow-down"
                size={8}
                color="#94A3B8"
              />
            </View>
            <View className="flex-1 flex-row items-center justify-between pb-[12px]  ">
              <View>
                <TouchableOpacity
                  onPress={() => setShowFromPicker(true)}
                  className="bg-white border h-[40px] justify-center border-[#CBD5E1] rounded-[6px] px-2 py-1"
                >
                  <Text>{fromDate.toLocaleDateString()}</Text>
                </TouchableOpacity>
                {showFromPicker && (
                  <DateTimePicker
                    value={fromDate}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowFromPicker(false);
                      if (selectedDate) setFromDate(selectedDate);
                    }}
                  />
                )}
              </View>
              <Text className="mx-2">-</Text>
              <View>
                <TouchableOpacity
                  onPress={() => setShowToPicker(true)}
                  className="bg-white h-[40px] justify-center border border-[#CBD5E1] rounded-[6px] px-2 py-1"
                >
                  <Text>{toDate.toLocaleDateString()}</Text>
                </TouchableOpacity>
                {showToPicker && (
                  <DateTimePicker
                    value={toDate}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowToPicker(false);
                      if (selectedDate) setToDate(selectedDate);
                    }}
                  />
                )}
              </View>
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
        <FlatList
          data={filteredLeaveRequests}
          renderItem={renderLeaveRequest}
          keyExtractor={(item) => item._id} // Use _id from database as key
          style={{
            marginBottom: 100,
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
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

export default Request;
