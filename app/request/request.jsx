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
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import CustomPicker from "@/components/CustomPicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import fonts from "@/constants/fonts";
import { LinearGradient } from "expo-linear-gradient";
import Loading from "@/components/Loading";

const Request = () => {
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(moment());
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUser, setCurrentUser] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showMyRequests, setShowMyRequests] = useState(true);

  const userEmail = useSelector((state) => state.auth.user?.email);
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
  const monthStrings = lastSixMonths.map((month) => month.format("MMMM YYYY"));

  useEffect(() => {
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
      fetchLeaveRequests();
    }
  }, [userEmail, userId]);

  const fetchLeaveRequests = async () => {
    setLoading(true);
    setRefreshing(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("Token not found in AsyncStorage");
        setLoading(false);
        setRefreshing(false);
        return;
      }
      const response = await axios.get(
        `https://erpapi.folinas.com/api/v1/checkInRequests?page=1&limit=2000`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
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
      console.error("Error fetching leave requests", error);
      Alert.alert("Error", error.message);
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
        return requestDate.isBetween(startOfMonth, endOfMonth, null, "[]");
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
        <View className="bg-white rounded-[20px] p-4 shadow-md mt-2 h-[114px]">
          <View className="flex-row justify-between items-center mb-2">
            <Text
              className="text-sm text-[#333434]"
              style={{ fontFamily: fonts["BeVietNam-Medium"] }}
            >
              Loại: <Text>{item?.type}</Text>
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
                        }`}
            >
              <Text
                className={`text-xs  
                  ${
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
                style={{ fontFamily: fonts["BeVietNamPro-SemiBold"] }}
              >
                {item?.status}
              </Text>
            </View>
          </View>

          <View className="mt-2">
            <View className="flex-row justify-between">
              <Text
                className="text-[#9098B1] w-1/4 text-center text-[10px]"
                style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
              >
                TG tạo
              </Text>
              <Text
                className="text-[#9098B1] w-1/4 text-center text-[10px]"
                style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
              >
                Ngày
              </Text>
              {item?.requestTime ? (
                <Text
                  className="text-[#9098B1] w-1/4 text-center text-[10px]"
                  style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
                >
                  Thời gian
                </Text>
              ) : null}
              {item?.absentType ? (
                <Text
                  className="text-[#9098B1] w-1/4 text-center text-[10px]"
                  style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
                >
                  Loại nghỉ
                </Text>
              ) : null}
              {item?.goingOutMinutes ? (
                <Text
                  className="text-[#9098B1] w-1/4 text-center text-[10px]"
                  style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
                >
                  Thời gian vắng mặt
                </Text>
              ) : null}
              <Text
                className="text-[#9098B1] w-1/4 text-center text-[10px]"
                style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
              >
                Lý do
              </Text>
            </View>

            <View className="flex-row justify-between py-2">
              <View className="w-1/4 items-center">
                <Text
                  className="text-gray-800 text-center text-[10px]"
                  style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
                >
                  {moment(item.createdAt).format("DD/MM/YY")}
                </Text>
                <Text
                  className="text-gray-800 text-center text-[10px]"
                  style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
                >
                  {moment(item?.createdAt).format("HH:mm")}
                </Text>
              </View>
              <Text
                className="text-gray-800 w-1/4 text-center text-[10px]"
                style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
              >
                {moment(item?.requestDate).format("DD/MM/YYYY")}
              </Text>
              {item?.requestTime ? (
                <Text
                  className="text-gray-800 w-1/4 text-center text-[10px]"
                  style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
                >
                  {item?.requestTime}
                </Text>
              ) : null}
              {item?.absentType ? (
                <Text
                  className="text-gray-800 w-1/4 text-center text-[10px]"
                  style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
                >
                  {item?.absentType}
                </Text>
              ) : null}
              {item?.goingOutMinutes ? (
                <Text
                  className="text-gray-800 w-1/4 text-center text-[10px]"
                  style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
                >
                  {item?.goingOutMinutes}
                </Text>
              ) : null}
              <Text
                className="text-gray-800 w-1/4 text-center text-[10px]"
                style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
              >
                {item?.reason}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Loading />
      </View>
    );
  }

  const filteredLeaveRequests = currentUser.filter((req) => {
    const startOfMonth = selectedMonth.clone().startOf("month");
    const endOfMonth = selectedMonth.clone().endOf("month");
    const requestDate = moment(req?.requestDate);
    return (
      requestDate.isBetween(startOfMonth, endOfMonth, null, "[]") &&
      (selectedStatus === "All" || req.status === selectedStatus)
    );
  });

  const displayedRequests = showMyRequests
    ? filteredLeaveRequests
    : leaveRequests.filter((request) => request?.status === "Pending");

  const RequestDetailModal = ({ visible, request, onClose }) => {
    if (!visible) return null;
    if (!request) {
      return (
        <View className="flex-1 justify-center items-center">
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
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="m-5 bg-white rounded-[20px] p-6 shadow-md w-[90%] max-h-[80%]">
            <View className="flex-row justify-between items-center mb-2">
              <TouchableOpacity
                onPress={onClose}
                className="bg-white/20 rounded-full p-2 justify-center items-center"
              >
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
              <Text
                className="text-xl"
                style={{ fontFamily: fonts["BeVietNamPro-SemiBold"] }}
              >
                Request Details
              </Text>
            </View>

            <ScrollView
              contentContainerStyle={{
                paddingHorizontal: 10,
                paddingVertical: 20,
              }}
            >
              <View className="flex-row items-start mb-2">
                <Text
                  className="text-base w-[100px] text-[#737373]"
                  style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
                >
                  Request ID:
                </Text>
                <Text
                  className="text-base flex-1"
                  style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
                >
                  {request?._id}
                </Text>
              </View>

              <View className="flex-row items-start mb-2">
                <Text
                  className="text-base w-[100px] text-[#737373]"
                  style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
                >
                  User:
                </Text>
                <Text
                  className="text-base flex-1"
                  style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
                >
                  {userLogin?.fullName}
                </Text>
              </View>

              <View className="flex-row items-start mb-2">
                <Text
                  className="text-base w-[100px] text-[#737373]"
                  style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
                >
                  Loại:
                </Text>
                <Text
                  className="text-base flex-1"
                  style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
                >
                  {request?.type}
                </Text>
              </View>

              <View className="flex-row items-start mb-2">
                <Text
                  className="text-base w-[100px] text-[#737373]"
                  style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
                >
                  Request Date:
                </Text>
                <Text
                  className="text-base flex-1"
                  style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
                >
                  {moment(request?.requestDate).format("DD/MM/YYYY")}
                </Text>
              </View>

              <View className="flex-row items-start mb-2">
                <Text
                  className="text-base w-[100px] text-[#737373]"
                  style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
                >
                  Request Time:
                </Text>
                <Text
                  className="text-base flex-1"
                  style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
                >
                  {request?.requestTime}
                </Text>
              </View>

              <View className="flex-row items-start mb-2">
                <Text
                  className="text-base w-[100px] text-[#737373]"
                  style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
                >
                  Lý do:
                </Text>
                <Text
                  className="text-base flex-1"
                  style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
                >
                  {request?.reason}
                </Text>
              </View>
              <View className="flex-row items-start mb-2">
                <Text
                  className="text-base w-[100px] text-[#737373]"
                  style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
                >
                  Trạng thái:
                </Text>
                <Text
                  className="text-base flex-1"
                  style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
                >
                  {request?.status}
                </Text>
              </View>

              <View className="flex-row items-start mb-2">
                <Text
                  className="text-base w-[100px] text-[#737373]"
                  style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
                >
                  Absent Type:
                </Text>
                <Text
                  className="text-base flex-1"
                  style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
                >
                  {request?.absentType}
                </Text>
              </View>
              <View className="flex-row items-start mb-2">
                <Text
                  className="text-base w-[100px] text-[#737373]"
                  style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
                >
                  Going Out Minutes:
                </Text>
                <Text
                  className="text-base flex-1"
                  style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
                >
                  {request?.goingOutMinutes}
                </Text>
              </View>
            </ScrollView>

            <View className="flex-row justify-evenly w-full py-2">
              <TouchableOpacity
                className="rounded-md p-2 bg-[#2196F3] items-center"
                // style={styles.buttonApprove}
              >
                <Text
                  className="text-white font-bold"
                  // style={styles.textStyle}
                >
                  Phê duyệt
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="rounded-md p-2 bg-[#f44336] items-center"
                // style={styles.buttonReject}
              >
                <Text
                  className="text-white font-bold"
                  // style={styles.textStyle}
                >
                  Từ chối
                </Text>
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
      keyboardVerticalOffset={100}
    >
      <SafeAreaView>
        <LinearGradient
          colors={["#033495", "#0654B2", "#005AB4", "#38B6FF"]}
          locations={[0, 0.16, 0.32, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="w-full h-[109px] justify-between flex-row items-center"
        >
          <TouchableOpacity
            className=" ml-4 w-[30px] h-[30px]  border-none rounded-md justify-center items-center bg-white/20"
            onPress={() => router.back()}
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

        <View className="pr-3">
          <View className="flex-row mb-4">
            <View className="flex-1">
              <View className="bg-white border border-[#CBD5E1] rounded-md h-10 w-[130px]">
                <Text className="top-[10px] ml-[25px]">
                  {userLogin.role.name}
                </Text>
              </View>
            </View>
            <View className="flex-1 w-[219px] h-10">
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
            className=" text-sm mb-2"
            style={{
              fontFamily: fonts["BeVietNamPro-SemiBold"],
              color: "#331A1A",
            }}
          >
            Danh sách Xin phép
          </Text>
        </View>

        <FlatList
          data={displayedRequests}
          renderItem={renderLeaveRequest}
          keyExtractor={(item) => item._id}
          className=" mb-28"
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
        className="bg-[#0B6CA7] rounded-md absolute bottom-4 right-4 flex-row items-center justify-center w-[109px] h-10"
        onPress={() => {
          router.push("/request/createRequest");
        }}
      >
        <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" />
        <Text
          className="ml-2 text-[#FFFFFF] text-sm"
          style={{
            fontFamily: fonts["Inter-Medium"],
          }}
        >
          Tạo mới
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default Request;
