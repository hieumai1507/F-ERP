import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';

interface RequestItem {
  type: string;
  date: string;
  time: string;
  reason: string;
  status: string;
}

const requestData: RequestItem[] = [
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

  const renderItem = ({ item }: { item: RequestItem }) => (
    <View className="p-4 bg-white shadow-sm rounded-lg mb-4">
      <Text className="text-base font-bold text-textPrimary">{item.type}</Text>
      <Text className="text-sm text-gray-500">Ngày: {item.date}</Text>
      <Text className="text-sm text-gray-500">Thời gian: {item.time}</Text>
      <Text className="text-sm text-gray-500">Lý do: {item.reason}</Text>
      <Text className="text-sm text-gray-500">Trạng thái: {item.status}</Text>
    </View>
  );

  return (
    <ImageBackground
      source={require('@/assets/images/Frame_48095964.png')}
      className="w-full h-56 justify-start items-start"
    >
    <View className="flex-1 bg-background p-6">
      <Text className="text-xl font-bold text-textPrimary mb-4">Xin phép</Text>
      <View className="flex-row justify-between mb-4">
        {['All', 'Pending', 'Approved', 'Rejected', 'Canceled', 'Ignored'].map((tab) => (
          <TouchableOpacity
            key={tab}
            className={`mr-4 p-2 rounded-md ${
              selectedTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onPress={() => setSelectedTab(tab)}
          >
            <Text className="text-sm font-medium">{tab} (0)</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View className="p-4 bg-white shadow-sm rounded-lg mb-4">
        <Text className="text-base font-bold text-textPrimary">Danh sách Xin phép</Text>
        <FlatList
          data={requestData}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()} // sử dụng index làm key
        />
      </View>
      <TouchableOpacity
        className="mt-4 p-4 bg-blue-500 rounded-md"
        onPress={() => router.push('/request/createRequest')}
      >
        <Text className="text-white text-center text-lg">Tạo mới</Text>
      </TouchableOpacity>
    </View>
    </ImageBackground>
  );
}
