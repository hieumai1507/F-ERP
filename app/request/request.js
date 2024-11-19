import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Platform, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import axios from 'axios';
import moment from 'moment'; // Import moment.js for date/time formatting
import { useSelector } from 'react-redux'; // Import useSelector
import CustomPicker from "@/components/CustomPicker"

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
  const userEmail = useSelector(state => state.auth.user?.email); // Get email from Redux

  useEffect(() => {
    // Set your department list here
    setDepartments([
      'Accountant','Admin', 'Amazon', 'Cleaner','Designer','Developer', 'Esty', 'FBA1', 'Fashion', 'Fullfillment', 'HR', 'Logistics', 
      'Manager', 'Media1', 'Media2', 'Media3', 'PKD1', 'PKD2', 'PKD3', 'PKD4', 'PKD5', 'PKD6', 'PKD7', 'PKD8', 
      'PKD9', 'PKD10', 'PKD11', 'PKD12', 'PKD13', 'PKD14', 'PKD15', 'Printsel','Resource','Technical','Varlders'
    ]);

    const fetchLeaveRequests = async () => {
      try {
        if (!userEmail) { // Check if userEmail exists
          console.error("User email not found in Redux store");
          return;
        }
        const response = await axios.get('http://192.168.50.53:5001/get-leave-requests-by-email', { // New route
          params: { email: userEmail }, // Send email as query parameter
        });

        if (response.data.status === 'ok') {
          setLeaveRequests(response.data.data);
        } else {
          // ... error handling
        }
      } catch (error) {
        // ... error handling
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveRequests();
  }, [userEmail]); // Add userEmail to the dependency array

  

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

  if (loading) {
    return <Text>Loading app...</Text>;
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
      <View className="flex-row items-center mb-8 py-4 bg-blue-500">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
        <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-[16px] font-bold mx-4 text-white">Xin phép</Text>
      </View>
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
