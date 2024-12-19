import React, { useCallback, useState } from "react";
import {
  Image,
  Text,
  View,
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from "react-native";
import { styled } from "nativewind";
import { router } from "expo-router";
import { useSelector } from "react-redux";
import { Avatar } from "react-native-paper";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import fonts from "@/constants/fonts";
import Calendar_2 from "@/assets/images/homeicon/Calendar_2.png";
import Group from "@/assets/images/homeicon/Group.png";
import Vector from "@/assets/images/homeicon/Vector.png";
import Contact from "@/assets/images/homeicon/Contact.png";
import img from "@/assets/images/homeicon/img.png";
import Loading from "@/components/Loading";
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImageBackground = styled(ImageBackground);
const StyledPressable = styled(Pressable);

const HomeScreen = (props) => {
  console.log(props);
  const user = useSelector((state) => state.auth.user);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      console.log("refresh data");
    }, 2000);
  }, []);
  if (refreshing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Loading />
      </View>
    );
  }
  // Lấy ngày và giờ hiện tại
  const currentDate = new Date();

  // Định dạng ngày theo kiểu dd/mm/yyyy
  const formattedDate = `${
    currentDate.getDate() < 10 ? "0" : ""
  }${currentDate.getDate()}/${currentDate.getMonth() + 1 < 10 ? "0" : ""}${
    currentDate.getMonth() + 1
  }/${currentDate.getFullYear()}`;

  // Định dạng giờ theo kiểu hh:mm - hh:mm
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
                    ? "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQMAAADCCAMAAAB6zFdcAAAAM1BMVEXFzeD////Byt7L0uPByd7Q1+b7/P3j5/Dv8fbe4+3r7vTFzuDL0+P19/rn6/LZ3urW2+lU+LHUAAAFLklEQVR4nO2dC3arMAxEQXwCcfjsf7XPkLw2tEka5AEziu8CeuKpJVmyLLIskUgkEkdFbsT+HXEQKbNqOPWN59y72D9nd/z/vWqbOv/mozSY9n116vIl1acYg1++G9v+5/rzvMs+QwL/7x/O9a/lT5zL2D9uF7wAzcP1e+pP2AQi4/mZAJ6TfQ3EtY9N4D+jdQ2k6F8K4OltayDFKyP4cghmI6PzVvDnHrDuEqR9UwFPY1IEufw+C72yh8LeIUFOaxSY6K0dFt2qTXDDVJCUi0IBT2vHHmTUSWAnPjgZtBJ4p2BjJ4RIYCSHlCpEAi+CAXMowiSwIIJoguKSE7k5rD8aPWDg3gnKg8EPLrGXEUL5tGC2ijr2OkIIjAlfEJdVBLMNcmprQEnAW09YUzT5C9aNADgbfMGaPQlOgrwj1cAlDZIGGVYD2ktIpAasiRNQgzxpkOektoCMjUkDT+zFaEFqwNqohtSgiL0YHcHlVAMaoCooM6SJo/qK7RGk+yBpkGVBl2w2NAi7aEwamNEAWE5MGiQNkgZJg6RB0sCEBoj+C3YN0j5IGkyks3LKnSegdaSkQdIgaUCtwcf7RJHy02OjVG3/+knvSlxJd+uK7Emb6eqOrQVBoJvgCtu16xYasF23QXsPWDVI+yArN9CALTyW6LhAqAE8NuaEcQH2fOMbtkNS+e7IC8MaYIuJM3TnRGwxcYbvPQ+0eDBD95TFIRv3rwyx17Qa/EGRbmqSAz1xvSP2ktaDvW3MOV9xoJ0i43tftEPgc4n4U1Ls9ajAbgTOkSCh02AW1GxJ4w2gCKwSIAspF0pLmIB5BNaXvhnwnMSXMn6DqrBzBoUrqKoiXdp8B6qqWMVeSADyzijhNyDeBiinyOwSUc95uAemYZ66sl0wLYGcFPmK6gsgCTRzZJxAlJe5TQFyQiA3hQxRVuSOChPBXrEW2trBf/RDts1sg+C8iXZA1oKwc9IY++dDCDojUKcKd5T67JF6ou4C9SHBhjO4os2hiWupv1Hm0JY00LpFKx5xQmsLpjRQdisy19R/om3MsaSB9rxsSgOdBKY00E5SZOxBeoa2kGJJA+01gyEN1JmjJQ20jxnYq+p3qPNGQxqo66qtHQ3UfUlJA0MalKJ+8NnyPfh/hFzOnbpFr6vP7JeNGaALw0BJMfzemT4+IhqSYq8hFESDInNj3ky4BPSXroieLPZDAuI7nuROsUS84iAvqKmT5gWxVxEIQgJuY8BsA+6NgPmyMXVkQHXuM+cMuBEIjO98Z4K78r5pOFtVpWiRn7Qd+aop5QU9AqJuMyYVRKoNJkT58OD/cuy1vYUX4LTBvLgrzVAcXwYpthPgSjcc2ybkgjoRvKQvjqrCVl7gEU11RJMQGTeYFvicbjyaCnsrMFG3R1JBsnZjR/hEhf4gJiHi0NOg1nCOL8OejvAJ3RBTBScy7O4GHlCfXCwV4hrBkvMlQmYpZXQjWLJ7sJTyEEawZNfMsowUC/+m38kxiNtgbDCMZgfHIMUuaVEA3cYnBnx5aAu8e9xMASkYFJjoNpo/K+7oVnBPg68xuKw8zoHoPXp0pCzHg0bDV0CTa3EsjmBJjUunsB9u35Ua08wkGecmuIEIEVIReoIFwTf38JHhEQgcxuqOlx4qCBFBCnY7uKH/uhV0SHRU9CNFUO1EB0A9TMKIIczoggP+QxpRUQ0cM+MMrmiezG7x0bmoKDYCZhLqgVjf8WvhfLhkfaPnFt/di8zq6XNbfIczMqsHDW3xTdrYPFvrP7kiUsVMV4ODAAAAAElFTkSuQmCC"
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
                {user.name}
              </StyledText>
              <StyledText
                className="text-white text-10"
                style={{
                  fontFamily: fonts["BeVietNamPro-Regular"],
                  fontSize: 12,
                }}
              >
                {" "}
                {user.department == "" ||
                user.department == undefined ||
                user.department == null
                  ? ""
                  : user.department}
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
                {formattedDate}
              </StyledText>
              <StyledText
                className="text-sm text-[#64748B]"
                style={{
                  fontFamily: fonts["BeVietNamPro-Regular"],
                  fontSize: 12,
                }}
              >
                07:30 - 17:30
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
                07:24
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
