import { View, Text, Image, TextInput, 
  TouchableOpacity, ScrollView, Alert,
  Platform, KeyboardAvoidingView, Keyboard, 
  TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import Feather from 'react-native-vector-icons/Feather';
import { useDispatch } from 'react-redux';
import { setUser, setUserType } from '../(redux)/authSlice'
const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVerify, setPasswordVerify] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const handleLoginError = (error) => {
    if (error.response && error.response.data && error.response.data.data) {
      Alert.alert('Error', error.response.data.data || 'Login failed'); // Use data field for the message.
    } else {
      Alert.alert('Error', 'Có lỗi xảy ra, vui lòng thử lại sau!');
    }
    console.error(error);
  };
  
  axios.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Đặt token vào header
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });


  function handleSubmit() {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Email và mật khẩu không được để trống.');
      return;
    }
    console.log(email, password);
    const userData = {
      email: email,
      password,
    };

    axios.post('http://192.168.50.53:5001/login-user', userData).then(res => {
      console.log(res.data);
      if (res.status === 200 && res.data.status === 'ok') {
        Alert.alert('Logged In Successfully');
        AsyncStorage.setItem('token', res.data.data);
        AsyncStorage.setItem('isLoggedIn', JSON.stringify(true));
        AsyncStorage.setItem('userType', res.data.userType);
        //Lưu userData và userType vào Redux store
        dispatch(setUser(res.data.userData));
        dispatch(setUserType(res.data.userType));
        if (res.data.userType === "Admin") {
          router.push('/AdminScreen');
        } else {
          router.push('/(tabs)/HomeScreen');
        }
      }else {
        // wrong user 
        handleLoginError({ response: res });
      }
    })
    .catch(error => {
      //chek what this error is in the logs
      console.error("Axios catch block", error);
      //if there is a response, handle it 
      if(error.response) { handleLoginError(error); }

      //otherwise, it's a network error
      else { Alert.alert("Error", "Could not connect to server"); }

    });
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
    
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Điều chỉnh behavior dựa trên hệ điều hành
      style={{ flex: 1, }} // Đảm bảo KeyboardAvoidingView chiếm toàn bộ màn hình
    >
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={'always'}>
            <View className="pt-20">
              <View className="flex justify-center items-center">
                <Image className="h-[140px] w-[130px] mt-8" source={require('../../assets/images/F-ERP_Logo.png')} />
              </View>
              <View className=" rounded-tl-30 rounded-tr-30 px-5 py-7">
                <Text className="text-[#000000] font-bold text-20 text-center my-6 font-">F-ERP chào mừng bạn!</Text>
                <View className="flex flex-row pt-3 pb-1 mt-4 px-3 border border-[#0B6CA7] rounded-lg mb-2">
                  <FontAwesome name="user-o" color="#420475" className="mr-2 text-lg" />
                  <TextInput
                    placeholder=" Email"
                    className="flex-1 text-[#05375a] mt-[-12px]"
                    onChange={e => setEmail(e.nativeEvent.text)}
                    style={{ height: 36, width: 360 }}
                  />
                </View>
                <View className="flex flex-row pt-3 pb-1 mt-4 px-3 border border-[#0B6CA7] rounded-lg">
                  <FontAwesome name="lock" color="#420475" className="mr-2 text-lg" />
                  <TextInput
                    placeholder=" Mật khẩu"
                    className="flex-1 text-[#05375a] mt-[-12px]"
                    onChange={e => setPassword(e.nativeEvent.text)}
                    style={{ height: 36, width: 360 }}
                    secureTextEntry={showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}
                    className="relative bottom-1"
                  >
                    {showPassword ? (
                      <Feather name="eye-off" color={passwordVerify ? 'green' : '#0B6CA7'} size={24} />
                    ) : (
                      <Feather name="eye" color={passwordVerify ? 'green' : '#0B6CA7'} size={24} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
              <View className="items-center  text-center mx-10 mt-4">
                <TouchableOpacity className="w-[150px] bg-[#0B6CA7] items-center px-4 py-4 rounded-lg" onPress={() => handleSubmit()}>
                  <Text className="text-[#FFFFFF] text-14 font-bold text-center">Đăng nhập</Text>
                </TouchableOpacity>
                <View style={{ padding: 15 }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#919191' }}>
                    ----Hoặc tiếp tục với----
                  </Text>
                </View>
                <View className="items-center justify-center">
                  <TouchableOpacity
                    className="bg-[#0B6CA7] p-3 rounded-full"
                    onPress={() => {
                      router.push('./RegisterScreen')
                    }}>
                    <FontAwesome
                      name="user-plus"
                      color="white"
                      className="text-white text-2xl"
                    />
                  </TouchableOpacity>
                  <Text className="text-[#0B6CA7] font-bold text-sm mt-2">Đăng ký</Text>
                </View>
              </View>
            </View>
          </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
