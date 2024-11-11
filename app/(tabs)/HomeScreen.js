import React from 'react';
import { Image, Text, View, ImageBackground, Pressable, BackHandler, } from 'react-native';
import { FontAwesome5, AntDesign } from '@expo/vector-icons'; // Import đúng
import { styled } from 'nativewind';
import { router } from 'expo-router';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {Avatar} from 'react-native-paper';
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImageBackground = styled(ImageBackground);
const StyledPressable = styled(Pressable);

const HomeScreen = (props) => {
  const navigation = useNavigation();
  console.log(props);
  const [userData, setUserData] = useState('');

  async function getData() {
    const token = await AsyncStorage.getItem('token');
    console.log(token);
    axios
      .post('http://192.168.1.30:5001/userdata', {token: token})
      .then(res => {
        console.log(res.data);
        setUserData(res.data.data);
      });
  }

  const handleBackPress = () => {
    Alert.alert('Exit App', 'Are you sure you want to exit?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {
        text: 'Exit',
        onPress: () => BackHandler.exitApp(),
      },
    ]);
    return true;
  };

  useFocusEffect(
    React.useCallback(() => {
      getData();
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      };
    },[]),
  );

  useEffect(() => {
   
  }, []);
  
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
              uri:userData==""||userData==null?
              
              'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQMAAADCCAMAAAB6zFdcAAAAM1BMVEXFzeD////Byt7L0uPByd7Q1+b7/P3j5/Dv8fbe4+3r7vTFzuDL0+P19/rn6/LZ3urW2+lU+LHUAAAFLklEQVR4nO2dC3arMAxEQXwCcfjsf7XPkLw2tEka5AEziu8CeuKpJVmyLLIskUgkEkdFbsT+HXEQKbNqOPWN59y72D9nd/z/vWqbOv/mozSY9n116vIl1acYg1++G9v+5/rzvMs+QwL/7x/O9a/lT5zL2D9uF7wAzcP1e+pP2AQi4/mZAJ6TfQ3EtY9N4D+jdQ2k6F8K4OltayDFKyP4cghmI6PzVvDnHrDuEqR9UwFPY1IEufw+C72yh8LeIUFOaxSY6K0dFt2qTXDDVJCUi0IBT2vHHmTUSWAnPjgZtBJ4p2BjJ4RIYCSHlCpEAi+CAXMowiSwIIJoguKSE7k5rD8aPWDg3gnKg8EPLrGXEUL5tGC2ijr2OkIIjAlfEJdVBLMNcmprQEnAW09YUzT5C9aNADgbfMGaPQlOgrwj1cAlDZIGGVYD2ktIpAasiRNQgzxpkOektoCMjUkDT+zFaEFqwNqohtSgiL0YHcHlVAMaoCooM6SJo/qK7RGk+yBpkGVBl2w2NAi7aEwamNEAWE5MGiQNkgZJg6RB0sCEBoj+C3YN0j5IGkyks3LKnSegdaSkQdIgaUCtwcf7RJHy02OjVG3/+knvSlxJd+uK7Emb6eqOrQVBoJvgCtu16xYasF23QXsPWDVI+yArN9CALTyW6LhAqAE8NuaEcQH2fOMbtkNS+e7IC8MaYIuJM3TnRGwxcYbvPQ+0eDBD95TFIRv3rwyx17Qa/EGRbmqSAz1xvSP2ktaDvW3MOV9xoJ0i43tftEPgc4n4U1Ls9ajAbgTOkSCh02AW1GxJ4w2gCKwSIAspF0pLmIB5BNaXvhnwnMSXMn6DqrBzBoUrqKoiXdp8B6qqWMVeSADyzijhNyDeBiinyOwSUc95uAemYZ66sl0wLYGcFPmK6gsgCTRzZJxAlJe5TQFyQiA3hQxRVuSOChPBXrEW2trBf/RDts1sg+C8iXZA1oKwc9IY++dDCDojUKcKd5T67JF6ou4C9SHBhjO4os2hiWupv1Hm0JY00LpFKx5xQmsLpjRQdisy19R/om3MsaSB9rxsSgOdBKY00E5SZOxBeoa2kGJJA+01gyEN1JmjJQ20jxnYq+p3qPNGQxqo66qtHQ3UfUlJA0MalKJ+8NnyPfh/hFzOnbpFr6vP7JeNGaALw0BJMfzemT4+IhqSYq8hFESDInNj3ky4BPSXroieLPZDAuI7nuROsUS84iAvqKmT5gWxVxEIQgJuY8BsA+6NgPmyMXVkQHXuM+cMuBEIjO98Z4K78r5pOFtVpWiRn7Qd+aop5QU9AqJuMyYVRKoNJkT58OD/cuy1vYUX4LTBvLgrzVAcXwYpthPgSjcc2ybkgjoRvKQvjqrCVl7gEU11RJMQGTeYFvicbjyaCnsrMFG3R1JBsnZjR/hEhf4gJiHi0NOg1nCOL8OejvAJ3RBTBScy7O4GHlCfXCwV4hrBkvMlQmYpZXQjWLJ7sJTyEEawZNfMsowUC/+m38kxiNtgbDCMZgfHIMUuaVEA3cYnBnx5aAu8e9xMASkYFJjoNpo/K+7oVnBPg68xuKw8zoHoPXp0pCzHg0bDV0CTa3EsjmBJjUunsB9u35Ua08wkGecmuIEIEVIReoIFwTf38JHhEQgcxuqOlx4qCBFBCnY7uKH/uhV0SHRU9CNFUO1EB0A9TMKIIczoggP+QxpRUQ0cM+MMrmiezG7x0bmoKDYCZhLqgVjf8WvhfLhkfaPnFt/di8zq6XNbfIczMqsHDW3xTdrYPFvrP7kiUsVMV4ODAAAAAElFTkSuQmCC'
            :userData.image
            }} className="w-12 h-12 rounded-full" />
          <StyledView className="ml-3">
            <StyledText className="text-white text-lg font-bold">{userData.name}</StyledText>
            <StyledText className="text-white text-base "> {userData.profession == '' ||
                  userData.profession == undefined ||
                  userData.profession == null
                    ? ''
                    : userData.profession}</StyledText>
          </StyledView>
          <FontAwesome5 name="bell" size={24} color="white" style={{ marginLeft: 'auto' }} />
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
        <StyledText className="text-lg font-bold mt-3 text-gray-800"> {userData.profession == '' ||
                  userData.profession == undefined ||
                  userData.profession == null
                    ? ''
                    : userData.profession}</StyledText>
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
