import React from 'react';
import { Image, Text, View, ImageBackground, Pressable, BackHandler, } from 'react-native';
import { FontAwesome5, AntDesign } from '@expo/vector-icons'; // Import đúng
import { styled } from 'nativewind';
import { router } from 'expo-router';
import { useNavigation} from '@react-navigation/native';
import { useSelector } from "react-redux";
import {useEffect, useState} from 'react';
import {Avatar} from 'react-native-paper';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { useFonts } from "expo-font";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImageBackground = styled(ImageBackground);
const StyledPressable = styled(Pressable);


const HomeScreen = (props) => {
  console.log(props);
  const user = useSelector((state) => state.auth.user);
  const [loaded, error] = useFonts({
    BeVietNam: require("@/assets/fonts/BeVietnamPro-SemiBold.ttf"),
  });
  

  useEffect(() => {
   console.log('Updated user data:', user);
   
  }, [user]);
  
    // Lấy ngày và giờ hiện tại
    const currentDate = new Date();
    
    // Định dạng ngày theo kiểu dd/mm/yyyy
    const formattedDate = `${currentDate.getDate() < 10 ? '0' : ''}${currentDate.getDate()}/${(currentDate.getMonth() + 1) < 10 ? '0' : ''}${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
    
    // Định dạng giờ theo kiểu hh:mm - hh:mm
  return (
      <StyledImageBackground
        source={require('@/assets/images/IMGBackGround.png')}
        className="w-full h-56 justify-start items-start"
        style={{ resizeMode: 'cover' }}
  >

      <StyledView className="flex-1 mx-5 my-8">
        {/* Phần thông tin người dùng */}
        <StyledView className="flex-row items-center mb-5">
          <Avatar.Image source={{
              uri:user==""||user==null?
              
              'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQMAAADCCAMAAAB6zFdcAAAAM1BMVEXFzeD////Byt7L0uPByd7Q1+b7/P3j5/Dv8fbe4+3r7vTFzuDL0+P19/rn6/LZ3urW2+lU+LHUAAAFLklEQVR4nO2dC3arMAxEQXwCcfjsf7XPkLw2tEka5AEziu8CeuKpJVmyLLIskUgkEkdFbsT+HXEQKbNqOPWN59y72D9nd/z/vWqbOv/mozSY9n116vIl1acYg1++G9v+5/rzvMs+QwL/7x/O9a/lT5zL2D9uF7wAzcP1e+pP2AQi4/mZAJ6TfQ3EtY9N4D+jdQ2k6F8K4OltayDFKyP4cghmI6PzVvDnHrDuEqR9UwFPY1IEufw+C72yh8LeIUFOaxSY6K0dFt2qTXDDVJCUi0IBT2vHHmTUSWAnPjgZtBJ4p2BjJ4RIYCSHlCpEAi+CAXMowiSwIIJoguKSE7k5rD8aPWDg3gnKg8EPLrGXEUL5tGC2ijr2OkIIjAlfEJdVBLMNcmprQEnAW09YUzT5C9aNADgbfMGaPQlOgrwj1cAlDZIGGVYD2ktIpAasiRNQgzxpkOektoCMjUkDT+zFaEFqwNqohtSgiL0YHcHlVAMaoCooM6SJo/qK7RGk+yBpkGVBl2w2NAi7aEwamNEAWE5MGiQNkgZJg6RB0sCEBoj+C3YN0j5IGkyks3LKnSegdaSkQdIgaUCtwcf7RJHy02OjVG3/+knvSlxJd+uK7Emb6eqOrQVBoJvgCtu16xYasF23QXsPWDVI+yArN9CALTyW6LhAqAE8NuaEcQH2fOMbtkNS+e7IC8MaYIuJM3TnRGwxcYbvPQ+0eDBD95TFIRv3rwyx17Qa/EGRbmqSAz1xvSP2ktaDvW3MOV9xoJ0i43tftEPgc4n4U1Ls9ajAbgTOkSCh02AW1GxJ4w2gCKwSIAspF0pLmIB5BNaXvhnwnMSXMn6DqrBzBoUrqKoiXdp8B6qqWMVeSADyzijhNyDeBiinyOwSUc95uAemYZ66sl0wLYGcFPmK6gsgCTRzZJxAlJe5TQFyQiA3hQxRVuSOChPBXrEW2trBf/RDts1sg+C8iXZA1oKwc9IY++dDCDojUKcKd5T67JF6ou4C9SHBhjO4os2hiWupv1Hm0JY00LpFKx5xQmsLpjRQdisy19R/om3MsaSB9rxsSgOdBKY00E5SZOxBeoa2kGJJA+01gyEN1JmjJQ20jxnYq+p3qPNGQxqo66qtHQ3UfUlJA0MalKJ+8NnyPfh/hFzOnbpFr6vP7JeNGaALw0BJMfzemT4+IhqSYq8hFESDInNj3ky4BPSXroieLPZDAuI7nuROsUS84iAvqKmT5gWxVxEIQgJuY8BsA+6NgPmyMXVkQHXuM+cMuBEIjO98Z4K78r5pOFtVpWiRn7Qd+aop5QU9AqJuMyYVRKoNJkT58OD/cuy1vYUX4LTBvLgrzVAcXwYpthPgSjcc2ybkgjoRvKQvjqrCVl7gEU11RJMQGTeYFvicbjyaCnsrMFG3R1JBsnZjR/hEhf4gJiHi0NOg1nCOL8OejvAJ3RBTBScy7O4GHlCfXCwV4hrBkvMlQmYpZXQjWLJ7sJTyEEawZNfMsowUC/+m38kxiNtgbDCMZgfHIMUuaVEA3cYnBnx5aAu8e9xMASkYFJjoNpo/K+7oVnBPg68xuKw8zoHoPXp0pCzHg0bDV0CTa3EsjmBJjUunsB9u35Ua08wkGecmuIEIEVIReoIFwTf38JHhEQgcxuqOlx4qCBFBCnY7uKH/uhV0SHRU9CNFUO1EB0A9TMKIIczoggP+QxpRUQ0cM+MMrmiezG7x0bmoKDYCZhLqgVjf8WvhfLhkfaPnFt/di8zq6XNbfIczMqsHDW3xTdrYPFvrP7kiUsVMV4ODAAAAAElFTkSuQmCC'
            :user.image
            }} className="w-12 h-12 rounded-full" />
          <StyledView className="ml-5">
            <StyledText className="text-[#F5F5F5] text-16 mb-2" style={{fontFamily: "BeVietNam"}}>{user.name}</StyledText>
            <StyledText className="text-[#F5F5F5] text-10" style={{fontFamily: "BeVietNam"}}> {user.department == '' ||
                  user.department == undefined ||
                  user.department == null
                    ? ''
                    : user.department}</StyledText>
          </StyledView>
          <SimpleLineIcons name="bell" size={24} color="#F5F5F5" style={{ marginLeft: 'auto' }} />
      </StyledView>

      <StyledView className="bg-white rounded-lg p-4 shadow-md">
        {/* Phần thời gian check-in/out */}
        <StyledView className="flex-row justify-between py-3 border-b border-gray-200">
        <StyledText className="text-sm text-gray-800">{formattedDate}</StyledText>
          <StyledText className="text-sm text-gray-800">07:30 - 17:30</StyledText>
        </StyledView>
        <StyledView className="flex-row justify-between py-1">
          <StyledText>Check in: 07:24</StyledText>
          <StyledText>Check out: --:--</StyledText>
        </StyledView>
        <StyledText className="text-lg mt-3 text-gray-800 font-semibold">HCNS</StyledText>
        <StyledView className="flex-row flex-wrap mt-5">

        <StyledPressable 
            className="w-[30%] m-[1.66%] p-3 bg-[#E7DBF9] rounded-lg items-center justify-center"
            onPress={() => router.push('/request/request')}>
            <FontAwesome5 name="file-alt" size={20} color="#9747FF" />
            <StyledText className="text-xs mt-1">Xin phép</StyledText>
          </StyledPressable>

          <StyledPressable 
            className="w-[30%] m-[1.66%] p-3 bg-[#FDE4ED] rounded-lg items-center justify-center"
            onPress={() => console.log("tap")}>
            <FontAwesome5 name="id-card" size={20} color="#F43C7D" />
            <StyledText className="text-xs mt-1">Hồ sơ</StyledText>
          </StyledPressable>

          <StyledPressable 
            className="w-[30%] m-[1.66%] p-3 bg-[#E9E9FD] rounded-lg items-center justify-center"
            onPress={() => console.log("tap")}>
            <AntDesign name="checkcircleo" size={24} color="#3A35DD" />
            <StyledText className="text-xs mt-1">Check-in</StyledText>
          </StyledPressable>

          <StyledPressable 
            className="w-[30%] m-[1.66%] p-3 bg-[#E9E9FD] rounded-lg items-center justify-center"
            onPress={() => console.log("tap")}>
            <FontAwesome5 name="calendar-alt" size={20} color="#3A35DD" />
            <StyledText className="text-xs mt-1">Ngày lễ</StyledText>
          </StyledPressable>

          <StyledPressable 
            className="w-[30%] m-[1.66%] p-3 bg-[#FEF0F0] rounded-lg items-center justify-center"
            onPress={() => console.log("tap")}>
            <FontAwesome5 name="file-export" size={20} color="#f56c6c" />
            <StyledText className="text-xs mt-1">Export</StyledText>
          </StyledPressable>

          <StyledPressable 
            className="w-[30%] m-[1.66%] p-3 bg-[#F1F8E8] rounded-lg items-center justify-center"
            onPress={() => console.log("tap")}>
            <FontAwesome5 name="money-bill" size={20} color="#1A8340" />
            <StyledText className="text-xs mt-1">Phạt tiền</StyledText>
          </StyledPressable>
        </StyledView>
      </StyledView>

      </StyledView>
    </StyledImageBackground>
  );
};

export default HomeScreen;
