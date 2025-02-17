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
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loading from "@/components/Loading";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImageBackground = styled(ImageBackground);
const StyledPressable = styled(Pressable);

const HomeScreen = (props) => {
  console.log(props);
  const user = useSelector((state) => state.auth.user);

  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    const today = new Date();
    const formattedDate = `${today.getDate()}/${
      today.getMonth() + 1
    }/${today.getFullYear()}`;
    setFormattedDate(formattedDate);

    const formatDateForAPI = (date) => {
      const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const dayOfWeek = daysOfWeek[date.getDay()];
      const month = months[date.getMonth()];
      return `${dayOfWeek}, ${date.getDate()} ${month} ${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} GMT`;
    };

    const fetchCheckInData = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.error("Token không tồn tại hoặc không hợp lệ.");
          setLoading(false);
          return;
        }

        // Lưu ngày ban đầu, tránh thay đổi đối tượng `today`
        const startOfDay = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          0,
          0,
          0,
          0
        );
        const endOfDay = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          23,
          59,
          59,
          999
        );

        const formattedFromDate = formatDateForAPI(startOfDay);
        const formattedToDate = formatDateForAPI(endOfDay);

        const API_URL = `${process.env.DOMAIN_URL}/${user._id}/detail?from=${formattedFromDate}&to=${formattedToDate}&page=1&limit=1`;

        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();

        if (data && data.data) {
          // Lọc dữ liệu theo ngày đúng
          const todayData = data.data.find((item) => {
            // Đảm bảo rằng ngày trong item.Ngày có định dạng đúng
            const [day, month, year] = item.Ngày.split("/").map((num) =>
              parseInt(num)
            );

            // Chuyển item.Ngày thành đối tượng Date hợp lệ
            const apiDate = new Date(year, month - 1, day); // month-1 vì tháng trong JavaScript bắt đầu từ 0

            const [dayFormatted, monthFormatted, yearFormatted] = formattedDate
              .split("/")
              .map((num) => parseInt(num));

            // Đảm bảo rằng bạn đang so sánh cùng định dạng ngày
            const formattedApiDate = `${apiDate.getDate()}/${
              apiDate.getMonth() + 1
            }/${apiDate.getFullYear()}`;

            // So sánh định dạng ngày
            return (
              `${dayFormatted}/${monthFormatted}/${yearFormatted}` ===
              formattedApiDate
            );
          });

          console.log("Today data:", todayData);

          if (todayData) {
            // Trích xuất giờ vào và giờ ra
            setCheckInTime(todayData["Giờ vào"] || "--:--");
            setCheckOutTime(todayData["Giờ ra"] || "--:--");
          } else {
            setCheckInTime("--:--");
            setCheckOutTime("--:--");
          }
        }
      } catch (error) {
        console.error("Error retrieving check-in/check-out data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCheckInData();
  }, [formattedDate]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Loading />
      </View>
    );
  }

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
                {checkInTime ? checkInTime : "--:--"}
              </Text>
              <Text
                style={{
                  color: "#64748B",
                  fontFamily: fonts["Inter-Regular"],
                  fontSize: 10,
                }}
              >
                {checkOutTime ? checkOutTime : "--:--"}
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
