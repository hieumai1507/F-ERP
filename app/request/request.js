import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Platform, KeyboardAvoidingView, RefreshControl,  
  Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import axios from 'axios';
import moment from 'moment'; // Import moment.js for date/time formatting
import { useSelector } from 'react-redux'; // Import useSelector
import CustomPicker from "@/components/CustomPicker"
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';

const Request = () => {
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [refreshing, setRefreshing] = useState(false); // Add refreshing state
  const userEmail = useSelector(state => state.auth.user?.email); // Get email from Redux

  useEffect(() => {
    // Set your department list here
    setDepartments([
      'Accountant','Admin', 'Amazon', 'Cleaner','Designer','Developer', 'Esty', 'FBA1', 'Fashion', 'Fullfillment', 'HR', 'Logistics', 
      'Manager', 'Media1', 'Media2', 'Media3', 'PKD1', 'PKD2', 'PKD3', 'PKD4', 'PKD5', 'PKD6', 'PKD7', 'PKD8', 
      'PKD9', 'PKD10', 'PKD11', 'PKD12', 'PKD13', 'PKD14', 'PKD15', 'Printsel','Resource','Technical','Varlders'
    ]);

    

    if (userEmail) { // Only fetch if userEmail exists
      fetchLeaveRequests();
    }
  }, [userEmail]); // Add userEmail to the dependency array
  const fetchLeaveRequests = async () => {
    setLoading(true); // Set loading to true before fetching
    setRefreshing(true)
    try {
      
      const token = await AsyncStorage.getItem('token'); // Get token from AsyncStorage

      if (!token) {
          console.error("Token not found in AsyncStorage, but continuing anyway");
          setLoading(false); // Set loading to false if token not found
          setRefreshing(false);
          return;
      }
      const response = await axios.get('http://192.168.50.53:5001/get-leave-requests-by-email', { // New route
        params: { email: userEmail },
        headers: {
          Authorization: `Bearer ${token}`, // Add Bearer prefix
        },
      });

      if (response.status === 200 && response.data.status === 'ok') {
        setLeaveRequests(response.data.data);
      } else {
        console.error("Error fetching leave requests", response.data);
        Alert.alert("Error", "Could not fetch leave requests. Please try again later.");
      }
    } catch (error) {
      // ... error handling
      console.error("Error fetching leave requests", error);
      Alert.alert("Error", error.message); //network error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  const onRefresh = () => {
    fetchLeaveRequests();
  }

  const getStatusCount = (status) => {
    if (status === 'All') {
        return leaveRequests.filter(req => {  // Count ALL within date range
            const requestDate = new Date(req.date.split('/').reverse().join('-'));
            return requestDate >= fromDate && requestDate <= toDate;
        }).length;
    } else {
        return leaveRequests.filter(req => { // Count specific status within date range
            const requestDate = new Date(req.date.split('/').reverse().join('-'));
            return req.status === status && requestDate >= fromDate && requestDate <= toDate;
        }).length;
    }
  };

  const renderLeaveRequest = ({ item }) => {
    const formattedDate = moment(item.date).format('DD/MM/YYYY'); // Format date
    const formattedTime = moment(item.time).format('HH:mm'); // Format time
    return (
    <View className="bg-white rounded-lg p-4 mb-4 shadow-md">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="font-bold text-lg text-gray-800">Loại: {item.type}</Text>
        <Text className={`px-2 py-1 rounded-full text-white ${
            item.status === 'Completed' ? 'bg-green-500' :
            item.status === 'Ignored' ? 'bg-red-500' :
            item.status === 'Pending' ? 'bg-yellow-500' :
            item.status === 'Approved' ? 'bg-blue-500' :
            item.status === 'Rejected' ? 'bg-gray-500' :
            item.status === 'Canceled' ? 'bg-orange-500' : ''
          }`}>
            {item.status}
          </Text>
      </View>
      <View className="space-y-1">
      <Text className="text-gray-600">Thời gian tạo: {moment(item.createdAt).fromNow()}</Text> {/* Use moment.js */}
          <Text className="text-gray-600">Ngày: {formattedDate}</Text> {/* Display formatted date */}
          <Text className="text-gray-600">Thời gian: {formattedTime}</Text> {/* Display formatted time */}
          <Text className="text-gray-600">Lý do: {item.reason}</Text>
          {item.thoiGianVangMat && item.type == "Ra Ngoài" && ( // Only display if thoiGianVangMat exists
            <Text className="text-gray-600">Thời gian vắng mặt: {item.thoiGianVangMat} phút</Text>
          )}
      </View>
    </View>
  );
}

if(loading) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Animatable.Text
        animation="pulse"
        easing="ease-out"
        iterationCount="infinite"
        style={{ marginTop: 10, fontSize: 16, color: '#555' }}
      >
        Loading...
      </Animatable.Text>
    </View>
  );
}

  const filteredLeaveRequests = leaveRequests.filter(req => {
    const requestDate = new Date(req.date.split('/').reverse().join('-'));
    return requestDate >= fromDate && requestDate <= toDate &&
           (selectedStatus === 'All' || req.status === selectedStatus);
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
      keyboardVerticalOffset={100} // Adjust as needed
    >
      
        <View className="flex-1 bg-gray-100 p-4">
                        
            <View className="flex-row flex-wrap justify-between mb-4">
              {['All', 'Pending', 'Approved', 'Rejected', 'Canceled', 'Ignored'].map(status => (
                <TouchableOpacity
                  key={status}
                  onPress={() => setSelectedStatus(status)}
                  className={`px-4 py-2 rounded-lg border border-gray-300 mr-2 mb-2 ${selectedStatus === status ? 'bg-[#0B6CA7]' : ''}`}
                >
                  <Text className={`${selectedStatus === status ? 'text-white' : 'text-gray-700'}`}>
                    {status} ({getStatusCount(status)})
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View className="flex-row justify-between mb-4">
              <View className="flex-1 mr-2">
                <CustomPicker
                  items={departments}
                  selectedValue={selectedDepartment}
                  onValueChange={setSelectedDepartment}
                  placeholder="Select Department"
                />
              </View>

              <View className="flex-1 flex-row items-center justify-between">
                <View>
                  <TouchableOpacity onPress={() => setShowFromPicker(true)} className="bg-white border border-gray-300 rounded-lg px-2 py-1">
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
                  <TouchableOpacity onPress={() => setShowToPicker(true)} className="bg-white border border-gray-300 rounded-lg px-2 py-1">
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

            <Text className="font-bold text-lg mb-2">Danh sách Xin phép</Text>
            <FlatList
                data={filteredLeaveRequests}
                renderItem={renderLeaveRequest}
                keyExtractor={(item) => item._id} // Use _id from database as key
                refreshControl={
                  <RefreshControl 
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
              />

            <TouchableOpacity
              className="bg-[#0B6CA7] rounded-full p-3 absolute bottom-4 right-4 flex-row items-center"
              onPress={() => {router.push("/request/createRequest")}}
            >
                <Ionicons name="add-circle" size={24} color="white" />
                <Text className="ml-2 text-white">Tạo mới</Text>
            </TouchableOpacity>
          </View>
      </KeyboardAvoidingView>
  );
};

export default Request;
