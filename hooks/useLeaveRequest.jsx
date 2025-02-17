import { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { Alert } from "react-native";

const useLeaveRequests = (userId, userEmail) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);

  useEffect(() => {
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
        `https://erpapi.folinas.com/api/v1/checkInRequests?page=1&limit=100&search=&name=&followType=ME`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setLeaveRequests(response.data.data); // Lưu toàn bộ data
        const filteredRequests = response.data.data.filter(
          (req) => req.userId === userId
        );
        setCurrentUser(filteredRequests); // Lưu data của user đang dùng
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

  const getStatusCount = (status, selectedMonth) => {
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

  return {
    loading,
    refreshing,
    leaveRequests,
    currentUser,
    fetchLeaveRequests,
    onRefresh,
    getStatusCount,
    setLoading,
    setRefreshing,
    setCurrentUser,
  };
};

export default useLeaveRequests;
