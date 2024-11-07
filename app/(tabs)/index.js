import React from 'react';
import { Image, Text, View, ImageBackground, Pressable } from 'react-native';
import { FontAwesome5, AntDesign } from '@expo/vector-icons'; // Import đúng
import { styled } from 'nativewind';
import { router } from 'expo-router';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImageBackground = styled(ImageBackground);
const StyledPressable = styled(Pressable);

const HomeScreen = () => {
  return (
      <StyledImageBackground
        source={require('@/assets/images/IMGBackGround.png')}
        className="w-full h-56 justify-start items-start"
        style={{ resizeMode: 'cover' }}
  >

      <StyledView className="flex-1 mx-5 my-8">
        {/* Phần thông tin người dùng */}
        <StyledView className="flex-row items-center mb-5">
          <Image source={require('@/assets/images/Ellipse_1132.png')} className="w-12 h-12 rounded-full" />
          <StyledView className="ml-3">
            <StyledText className="text-white text-lg font-bold">Lê Huyền Trang</StyledText>
            <StyledText className="text-white text-base ">Business Analyst</StyledText>
          </StyledView>
          <FontAwesome5 name="bell" size={24} color="white" style={{ marginLeft: 'auto' }} />
      </StyledView>

      <StyledView className="bg-white rounded-lg p-4 shadow-md">
        {/* Phần thời gian check-in/out */}
        <StyledView className="flex-row justify-between py-3 border-b border-gray-200">
          <StyledText className="text-sm text-gray-800">Ngày 28/10/2024</StyledText>
          <StyledText className="text-sm text-gray-800">07:30 - 17:30</StyledText>
        </StyledView>
        <StyledView className="flex-row justify-between py-1">
          <StyledText>Check in: 07:24</StyledText>
          <StyledText>Check out: --:--</StyledText>
        </StyledView>
        <StyledText className="text-lg font-bold mt-3 text-gray-800">HCNS</StyledText>
        <StyledView className="flex-row flex-wrap mt-5">

        <StyledPressable 
            className="w-[30%] m-[1.66%] p-3 bg-gray-100 rounded-lg items-center justify-center"
            onPress={() => router.push('/request/request')}>
            <FontAwesome5 name="file-alt" size={20} color="#007BFF" />
            <StyledText className="text-xs mt-1">Xin phép</StyledText>
          </StyledPressable>

          <StyledPressable 
            className="w-[30%] m-[1.66%] p-3 bg-gray-100 rounded-lg items-center justify-center"
            onPress={() => console.log("tap")}>
            <FontAwesome5 name="id-card" size={20} color="#007BFF" />
            <StyledText className="text-xs mt-1">Hồ sơ</StyledText>
          </StyledPressable>

          <StyledPressable 
            className="w-[30%] m-[1.66%] p-3 bg-gray-100 rounded-lg items-center justify-center"
            onPress={() => console.log("tap")}>
            <AntDesign name="checkcircleo" size={24} color="#007BFF" />
            <StyledText className="text-xs mt-1">Check-in</StyledText>
          </StyledPressable>

          <StyledPressable 
            className="w-[30%] m-[1.66%] p-3 bg-gray-100 rounded-lg items-center justify-center"
            onPress={() => console.log("tap")}>
            <FontAwesome5 name="calendar-alt" size={20} color="#007BFF" />
            <StyledText className="text-xs mt-1">Ngày lễ</StyledText>
          </StyledPressable>

          <StyledPressable 
            className="w-[30%] m-[1.66%] p-3 bg-gray-100 rounded-lg items-center justify-center"
            onPress={() => console.log("tap")}>
            <FontAwesome5 name="file-export" size={20} color="#007BFF" />
            <StyledText className="text-xs mt-1">Export</StyledText>
          </StyledPressable>

          <StyledPressable 
            className="w-[30%] m-[1.66%] p-3 bg-gray-100 rounded-lg items-center justify-center"
            onPress={() => console.log("tap")}>
            <FontAwesome5 name="money-bill" size={20} color="#007BFF" />
            <StyledText className="text-xs mt-1">Phạt tiền</StyledText>
          </StyledPressable>
        </StyledView>
      </StyledView>

      </StyledView>
    </StyledImageBackground>
  );
};

export default HomeScreen;
