import React from 'react';
import { View, Text, TextInput, Button, ImageBackground } from 'react-native';

export default function CreateRequestScreen() {
  return (
    <ImageBackground
      source={require('@/assets/images/Frame_48095964.png')}
      className="w-full h-56 justify-start items-start"
    >
    <View className="flex-1 bg-background p-6">
      <Text className="text-xl font-bold text-textPrimary mb-4">Tạo đơn</Text>
      <TextInput
        placeholder="Loại"
        placeholderTextColor="#AAAAAA"
        className="border border-gray-300 p-2 mb-4"
      />
      <TextInput
        placeholder="Thời gian"
        placeholderTextColor="#AAAAAA"
        className="border border-gray-300 p-2 mb-4"
      />
      <TextInput
        placeholder="Ngày xin phép"
        placeholderTextColor="#AAAAAA"
        className="border border-gray-300 p-2 mb-4"
      />
      <TextInput
        placeholder="Lý do"
        placeholderTextColor="#AAAAAA"
        className="border border-gray-300 p-2 mb-4"
      />
      <Button
        title="Submit"
        color="#0068FF"
        onPress={() => {/* Xử lý gửi đơn */}}
      />
    </View>
    </ImageBackground>
  );
}
