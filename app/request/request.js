import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ImageBackground, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

const requestData = [
  {
    type: 'Về sớm',
    date: '23/10/2024',
    time: '08:00',
    reason: 'Em xin phép về sớm do có việc cá nhân',
    status: 'Completed',
  },
  {
    type: 'Đi muộn',
    date: '23/10/2024',
    time: '08:00',
    reason: 'Em xin phép đi muộn do có việc cá nhân',
    status: 'Ignored',
  },
];

export default function RequestScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('All');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (event, date) => {
    const currentDate = date || selectedDate;
    setShowDatePicker(Platform.OS === 'ios'); // Chỉ hiển thị picker liên tục trên iOS
    if (currentDate > new Date()) {
      setSelectedDate(currentDate);
    }
  };

  const renderItem = ({ item }) => (
    <View className="p-4 bg-white shadow-sm rounded-lg mb-4 border border-gray-200">
      <Text className="text-base font-bold text-textPrimary">{item.type}</Text>
      <View className="flex-row justify-between">
        <Text className="text-sm text-gray-500">Ngày: {item.date}</Text>
        <Text className={`text-sm font-bold ${item.status === 'Completed' ? 'text-blue-500' : 'text-red-500'}`}>
          {item.status}
        </Text>
      </View>
      <Text className="text-sm text-gray-500">Thời gian: {item.time}</Text>
      <Text className="text-sm text-gray-500">Lý do: {item.reason}</Text>
    </View>
  );

  return (
    <ImageBackground
      source={require('@/assets/images/Frame_48095964.png')}
      className="w-full h-56 justify-start items-start"
    >
      <View className="flex-1 bg-background p-6">
        <Text className="text-xl font-bold text-textPrimary mb-4">Xin phép</Text>
        
        <View className="flex-row justify-between items-center bg-white p-2 rounded-lg mb-4 border border-gray-300">
          {['All', 'Pending', 'Approved', 'Rejected', 'Canceled', 'Ignored'].map((tab, index) => (
            <TouchableOpacity
              key={tab}
              className={`mr-2 px-4 py-2 rounded-full ${
                selectedTab === tab ? 'bg-blue-500' : 'bg-gray-200'
              }`}
              onPress={() => setSelectedTab(tab)}
            >
              <Text className={`text-sm font-medium ${selectedTab === tab ? 'text-white' : 'text-gray-600'}`}>
                {tab} ({index})
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-gray-600">Department</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Text className="text-gray-600">
              {selectedDate.toLocaleDateString()} - {selectedDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            minimumDate={new Date()} // Chỉ cho phép chọn ngày trong tương lai
            onChange={handleDateChange}
          />
        )}

        <View className="p-4 bg-white shadow-sm rounded-lg mb-4 border border-gray-300">
          <Text className="text-base font-bold text-textPrimary mb-2">Danh sách Xin phép</Text>
          <FlatList
            data={requestData}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>

        <TouchableOpacity
          className="mt-4 p-4 bg-blue-500 rounded-md flex-row justify-center items-center"
          onPress={() => router.push('/request/createRequest')}
        >
          <Text className="text-white text-center text-lg">Tạo mới</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
