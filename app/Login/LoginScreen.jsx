import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginError = (error) => {
    if (error.response && error.response.data) {
      Alert.alert('Error', error.response.data.data || 'Login failed'); // Use data field for the message.
    } else {
      Alert.alert('Error', 'Có lỗi xảy ra, vui lòng thử lại sau!');
    }
    console.error(error);
};

  function handleSubmit() {
    console.log(email, password);
    const userData = {
      email: email,
      password,
    };

    axios.post('http://192.168.50.52:5001/login-user', userData).then(res => {
      console.log(res.data);
      if (res.data.status === 'ok') {
        Alert.alert('Logged In Successfully');
        AsyncStorage.setItem('token', res.data.data);
        AsyncStorage.setItem('isLoggedIn', JSON.stringify(true));
        AsyncStorage.setItem('userType', res.data.userType);
        if (res.data.userType === "Admin") {
          router.push('../AdminScreen');
        } else {
          router.push('../(tabs)/HomeScreen');
        }
      }else {
        // wrong user 
        handleLoginError({ response: { data: res.data } });
      }
    })
    .catch(handleLoginError);
  }

  async function getData() {
    const data = await AsyncStorage.getItem('isLoggedIn');
    console.log(data, 'at index.jsx');
  }

  useEffect(() => {
    getData();
    console.log("Hii");
  }, []);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={'always'}>
      <View className="bg-white">
        <View className="flex justify-center items-center">
          <Image className="h-65 w-65 mt-8" source={require('../../assets/images/F-ERP_Logo.png')} />
        </View>
        <View className="bg-white rounded-tl-30 rounded-tr-30 px-5 py-7">
          <Text className="text-[#418dea] font-bold text-3xl text-center">Login !!!</Text>
          <View className="flex flex-row pt-3 pb-1 mt-4 px-3 border border-[#420475] rounded-full">
            <FontAwesome name="user-o" color="#420475" className="mr-2 text-lg" />
            <TextInput
              placeholder="Mobile or Email"
              className="flex-1 text-[#05375a] mt-[-12px]"
              onChange={e => setEmail(e.nativeEvent.text)}
            />
          </View>
          <View className="flex flex-row pt-3 pb-1 mt-4 px-3 border border-[#420475] rounded-full">
            <FontAwesome name="lock" color="#420475" className="mr-2 text-lg" />
            <TextInput
              placeholder="Password"
              className="flex-1 text-[#05375a] mt-[-12px]"
              onChange={e => setPassword(e.nativeEvent.text)}
            />
          </View>
        </View>
        <View className="items-center mt-[-5px] text-center mx-5">
          <TouchableOpacity className="w-3/4 bg-[#418dea] items-center px-4 py-4 rounded-full" onPress={() => handleSubmit()}>
            <Text className="text-white text-lg font-bold text-center">Log in</Text>
          </TouchableOpacity>
          <View style={{ padding: 15 }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#919191' }}>
              ----Or Continue as----
            </Text>
          </View>
          <View className="items-center justify-center">
            <TouchableOpacity
              className="bg-[#418dea] p-3 rounded-full"
              onPress={() => {
                router.push('./RegisterScreen')
              }}>
              <FontAwesome
                name="user-plus"
                color="white"
                className="text-white text-2xl"
              />
            </TouchableOpacity>
            <Text className="text-[#418dea] font-bold text-sm mt-2">Sign Up</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default LoginScreen;
