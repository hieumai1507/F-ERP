import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Platform, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import {useNavigation} from '@react-navigation/native';

const Request = () => {
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const navigation = useNavigation();
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = ['DEV', 'HR', 'HCNS', 'BM', 'Media', 'Marketing', 'Varldens'];
        setDepartments(data);
        setSelectedDepartment(data[0]);
      } catch (error) {
        console.error("Error fetching departments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  const leaveRequests = [
    { type: 'Về sớm', createdAt: '23/10/24 16:47', date: '23/10/2024', time: '08:00', reason: 'Em xin phép về sớm do có việc cá nhân', status: 'Completed' },
    { type: 'Đi muộn', createdAt: '23/10/24 16:47', date: '23/10/2024', time: '08:00', reason: 'Em xin phép về sớm do có việc cá nhân', status: 'Ignored' },
    { type: 'Nghỉ phép', createdAt: '24/10/24 09:12', date: '25/10/2024', time: 'Cả ngày', reason: 'Nghỉ phép', status: 'Pending' },
    { type: 'Về sớm', createdAt: '24/10/24 14:35', date: '24/10/2024', time: '17:00', reason: 'Có việc gia đình', status: 'Approved' },
    { type: 'Đi muộn', createdAt: '25/10/24 11:00', date: '26/10/2024', time: '10:00', reason: 'Khám bệnh', status: 'Rejected' },
    { type: 'Nghỉ phép', createdAt: '26/10/24 15:20', date: '27/10/2024', time: 'Cả ngày', reason: 'Du lịch', status: 'Canceled' },
  ];

  const renderLeaveRequest = ({ item }) => (
    <View className="bg-white rounded-lg p-4 mb-4 shadow-md">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="font-bold text-lg text-gray-800">Loại: {item.type}</Text>
        <Text className={`px-2 py-1 rounded-full text-white ${item.status === 'Completed' ? 'bg-green-500' : item.status === 'Ignored' ? 'bg-red-500' : item.status === 'Pending' ? 'bg-yellow-500' : item.status === 'Approved' ? 'bg-blue-500' : item.status === 'Rejected' ? 'bg-gray-500' : item.status === 'Canceled' ? 'bg-orange-500' : ''}`}>
          {item.status}
        </Text>
      </View>
      <View className="space-y-1">
        <Text className="text-gray-600">TG tạo: {item.createdAt}</Text>
        <Text className="text-gray-600">Ngày: {item.date}</Text>
        <Text className="text-gray-600">Thời gian: {item.time}</Text>
        <Text className="text-gray-600">Lý do: {item.reason}</Text>
      </View>
    </View>
  );

  if (loading) {
    return <Text>Loading departments...</Text>;
  }

  const filteredLeaveRequests = leaveRequests.filter(req => 
    selectedStatus === 'All' || req.status.toLowerCase() === selectedStatus.toLowerCase()
  );

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
        <Text className="flex-1 text-center text-2xl font-bold mx-4 text-white">Xin phép</Text>
      </View>
        <View className="flex-1 bg-gray-100 p-4">
                        
            <View className="flex-row flex-wrap justify-between mb-4">
              {['All', 'Pending', 'Approved', 'Rejected', 'Canceled', 'Ignored'].map(status => (
                <TouchableOpacity
                  key={status}
                  onPress={() => setSelectedStatus(status)}
                  className={`px-4 py-2 rounded-lg border border-gray-300 mr-2 mb-2 ${selectedStatus === status ? 'bg-blue-500' : ''}`}
                >
                  <Text className={`${selectedStatus === status ? 'text-white' : 'text-gray-700'}`}>
                    {status} ({leaveRequests.filter(req => selectedStatus === 'All' || req.status.toLowerCase() === status.toLowerCase()).length})
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View className="flex-row justify-between mb-4">
              <View className="flex-1 mr-2">
                <Picker
                  selectedValue={selectedDepartment}
                  onValueChange={(itemValue) => setSelectedDepartment(itemValue)}
                  style={{ backgroundColor: 'white', borderColor: 'gray', borderRadius: 8, paddingHorizontal: 10 }}
                >
                  {departments.map(dept => (
                    <Picker.Item key={dept} label={dept} value={dept} />
                  ))}
                </Picker>
              </View>

              <View className="flex-1 flex-row items-center justify-between">
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
                <Text className="mx-2">-</Text>
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

            <Text className="font-bold text-lg mb-2">Danh sách Xin phép</Text>
            <FlatList
              data={filteredLeaveRequests}
              renderItem={renderLeaveRequest}
              keyExtractor={(item, index) => index.toString()}
            />

            <TouchableOpacity
              className="bg-blue-500 rounded-full p-3 absolute bottom-4 right-4 flex-row items-center"
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
