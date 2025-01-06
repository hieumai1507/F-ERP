import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Platform,
  KeyboardAvoidingView,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import moment from "moment";
import { useSelector } from "react-redux";
import fonts from "@/constants/fonts";
import { LinearGradient } from "expo-linear-gradient";
import Loading from "@/components/Loading";
import RequestDetailModal from "@/components/RequestDetailModal";
import RequestItem from "@/components/RequestItem";
import StatusFilter from "@/components/StatusFilter";
import useLeaveRequests from "@/hooks/useLeaveRequest";
import MonthPicker from "@/components/MonthPicker";

const Request = () => {
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState(moment()); // Khởi tạo selectedMonth là tháng hiện tại
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showMyRequests, setShowMyRequests] = useState(true);

  const userLogin = useSelector((state) => state.auth.user);
  const userEmail = useSelector((state) => state.auth.user?.email);
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

  const {
    loading,
    refreshing,
    leaveRequests,
    currentUser,
    onRefresh,
    getStatusCount,
    setLoading,
    setRefreshing,
  } = useLeaveRequests(userId, userEmail);

  const handleSelectMonth = (monthString) => {
    const selectedMonthObject = lastSixMonths.find(
      (month) => month.format("MMMM YYYY") === monthString
    );
    setSelectedMonth(selectedMonthObject || moment());
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
        <StatusFilter
          selectedStatus={selectedStatus}
          onSelectStatus={setSelectedStatus}
          getStatusCount={(status) => getStatusCount(status, selectedMonth)}
        />
        <MonthPicker
          monthStrings={monthStrings}
          selectedMonth={selectedMonth}
          onSelectMonth={handleSelectMonth}
          userLogin={userLogin}
        />

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
          renderItem={({ item }) => (
            <RequestItem item={item} onPress={() => setSelectedRequest(item)} />
          )}
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
