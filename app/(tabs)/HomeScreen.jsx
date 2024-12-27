import React, { useEffect, useState } from "react";
import {
  Image,
  Text,
  View,
  ImageBackground,
  Pressable,
  SafeAreaView,
} from "react-native";

import { styled } from "nativewind";
import { router } from "expo-router";
import { useSelector } from "react-redux";
import { Avatar } from "react-native-paper";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import fonts from "@/constants/fonts";
import Calendar_2 from "@/assets/images/homeIcon/Calendar_2.png";
import Group from "@/assets/images/homeIcon/Group.png";
import Vector from "@/assets/images/homeIcon/Vector.png";
import Contact from "@/assets/images/homeIcon/Contact.png";
import img from "@/assets/images/homeIcon/img.png";
import Loading from "@/components/Loading";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImageBackground = styled(ImageBackground);
const StyledPressable = styled(Pressable);

const API_URL =
  "https://erpapi.folinas.com/api/v1/checkIns/7913Q3CMR9LKWU42/detail";

const HomeScreen = (props) => {
  console.log(props);
  const user = useSelector((state) => state.auth.user);

  // Lấy ngày và giờ hiện tại
  const currentDate = new Date();

  // Định dạng ngày theo kiểu dd/mm/yyyy
  const formattedDate = `${
    currentDate.getDate() < 10 ? "0" : ""
  }${currentDate.getDate()}/${currentDate.getMonth() + 1 < 10 ? "0" : ""}${
    currentDate.getMonth() + 1
  }/${currentDate.getFullYear()}`;

  return (
    <SafeAreaView className="bg-[#F5F5F5] flex-1">
      <StyledImageBackground
        source={require("@/assets/images/IMGBackGround.png")}
        className="h-[180px] justify-start items-start"
        style={{ resizeMode: "cover" }}
      >
        <StyledView className="flex-1 mx-5 mt-[41px]">
          {/* Phần thông tin người dùng */}
          <StyledView className="flex-row items-center mb-5 px-2">
            <Avatar.Image
              source={{
                uri:
                  user == "" || user == null
                    ? "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
                    : user.image,
              }}
              className="w-[50px] h-[50px] rounded-full"
            />
            <StyledView className="ml-5">
              <StyledText
                className="text-white text-16 mb-[5px]"
                style={{
                  fontFamily: fonts["BeVietNamPro-SemiBold"],
                  fontSize: 16,
                }}
              >
                {user.fullName}
              </StyledText>
              <StyledText
                className="text-white text-10"
                style={{
                  fontFamily: fonts["BeVietNamPro-Regular"],
                  fontSize: 12,
                }}
              >
                {" "}
                {user.role.name || "Chưa cập nhật"}
              </StyledText>
            </StyledView>
            <SimpleLineIcons
              name="bell"
              size={24}
              color="white"
              style={{ marginLeft: "auto" }}
            />
          </StyledView>
          <StyledView className="bg-[#F5F5F5] rounded-lg px-4 mt-[18px]">
            {/* Phần thời gian check-in/out */}
            <StyledView className="flex-row justify-between py-3 border-b border-[#94A3B8]">
              <StyledText
                className="text-sm text-[#64748B]"
                style={{
                  fontFamily: fonts["BeVietNamPro-Regular"],
                  fontSize: 12,
                }}
              >
                Ngày {formattedDate}
              </StyledText>
              <StyledText
                className="text-sm text-[#64748B]"
                style={{
                  fontFamily: fonts["BeVietNamPro-Regular"],
                  fontSize: 12,
                }}
              >
                7:30-16:30
              </StyledText>
            </StyledView>
            <StyledView className="flex-row justify-between py-1  pt-2">
              <StyledText
                className="text-[#64748B]"
                style={{
                  fontFamily: fonts["Inter-Regular"],
                  fontSize: 10,
                }}
              >
                Check in
              </StyledText>
              <StyledText
                className="text-[#64748B]"
                style={{
                  fontFamily: fonts["Inter-Regular"],
                  fontSize: 10,
                }}
              >
                Check out
              </StyledText>
            </StyledView>
            <View className="flex-row justify-between py-1 mb-[12px] px-2">
              <Text
                style={{
                  color: "#64748B",
                  fontFamily: fonts["Inter-Regular"],
                  fontSize: 10,
                }}
              >
                --:--
              </Text>
              <Text
                style={{
                  color: "#64748B",
                  fontFamily: fonts["Inter-Regular"],
                  fontSize: 10,
                }}
              >
                --:--
              </Text>
            </View>
            <StyledText
              className="text-lg mt-3 text-[#331A1A] font-semibold"
              style={{
                fontFamily: fonts["BeVietNamPro-SemiBold"],
                fontSize: 14,
              }}
            >
              HCNS
            </StyledText>
            <StyledView className="flex-row flex-wrap pt-[10px]">
              <StyledPressable
                className="w-[74px] h-[74px] m-[1.66%] p-3 bg-white rounded-lg items-center justify-center"
                onPress={() => router.push("/request/request")}
              >
                <View className="w-[40px] h-[40px] justify-center items-center bg-[#E7DBF9] rounded-[8px]">
                  <Image source={Calendar_2} size={18} />
                </View>
                <StyledText className="text-[9px] mt-2">Xin phép</StyledText>
              </StyledPressable>
              <StyledPressable
                className="w-[74px] h-[74px] m-[1.66%] p-3 bg-white rounded-lg items-center justify-center"
                onPress={() => console.log("tap")}
              >
                <View className="w-[40px] h-[40px] justify-center items-center bg-[#FDE4ED] rounded-[8px]">
                  <Image source={Group} size={18} />
                </View>
                <StyledText className="text-[9px] mt-2">Hồ sơ</StyledText>
              </StyledPressable>
              <StyledPressable
                className="w-[74px] h-[74px] m-[1.66%] p-3 bg-white rounded-lg items-center justify-center"
                onPress={() => console.log("tap")}
              >
                <View className="w-[40px] h-[40px] justify-center items-center bg-[#E9E9FD] rounded-[8px]">
                  <Image source={Vector} size={18} />
                </View>
                <StyledText className="text-[9px] mt-2">Check-in</StyledText>
              </StyledPressable>
              <StyledPressable
                className="w-[74px] h-[74px] m-[1.66%] p-3 bg-white rounded-lg items-center justify-center"
                onPress={() => console.log("tap")}
              >
                <View className="w-[40px] h-[40px] justify-center items-center bg-[#E9E9FD] rounded-[8px]">
                  <Image source={Vector} size={18} />
                </View>
                <StyledText className="text-[9px] mt-2">Ngày lễ</StyledText>
              </StyledPressable>
              <StyledPressable
                className="w-[74px] h-[74px] m-[1.66%] p-3 bg-white rounded-lg items-center justify-center"
                onPress={() => console.log("tap")}
              >
                <View className="w-[40px] h-[40px] justify-center items-center bg-[#FEF0F0] rounded-[8px]">
                  <Image source={Contact} size={18} />
                </View>
                <StyledText className="text-[9px] mt-2">Export</StyledText>
              </StyledPressable>
              <StyledPressable
                className="w-[74px] h-[74px] m-[1.66%] p-3 bg-white rounded-lg items-center justify-center"
                onPress={() => console.log("tap")}
              >
                <View className="w-[40px] h-[40px] justify-center items-center bg-[#F1F8E8] rounded-[8px]">
                  <Image source={img} size={18} />
                </View>
                <StyledText className="text-[9px] mt-2">Phạt tiền</StyledText>
              </StyledPressable>
            </StyledView>
          </StyledView>
        </StyledView>
      </StyledImageBackground>
    </SafeAreaView>
  );
};

export default HomeScreen;
