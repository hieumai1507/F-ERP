import { Image, Text, TextInput, View, Pressable, Alert } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router'; // Thêm import này

interface LoginProps {
  onLogin: (credentials: { phoneNumber: number; password: string }) => void; // This function takes no arguments and returns void
}

const LoginScreen = ({ onLogin }: LoginProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter(); // Khai báo router để điều hướng

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = () => {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      Alert.alert('Số điện thoại phải là dạng chữ số và bao gồm 10 chữ số.');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Mật khẩu phải có ít nhất 8 kí tự');
      return;
    }
    if (phoneNumber && password) {
      onLogin({ phoneNumber: parseInt(phoneNumber), password }); // Gọi hàm onLogin với đối số
      router.replace('/(tabs)'); // Điều hướng đến màn hình tabs sau khi đăng nhập thành công
    } else {
      Alert.alert('Vui lòng nhập đầy đủ thông tin.');
    }
  };
  

  return (
    <View className="flex-1 bg-gray-100 justify-center p-4">
      <View className="items-center mb-10">
        <Image source={require('@/assets/images/F-ERP_Logo.png')} className="w-24 h-24 mb-5" />
        <Text className="text-2xl font-bold text-gray-800">F-ERP chào mừng bạn!</Text>
      </View>

      <View className="px-5">
        <View className="mb-5">
          <Text className="text-lg text-gray-700">
            Số điện thoại <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            className="h-12 border border-blue-500 rounded-lg px-3 bg-white"
            placeholder="Số điện thoại"
            placeholderTextColor="#888888"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="numeric"
          />
        </View>

        <View className="mb-5">
          <Text className="text-lg text-gray-700">
            Mật khẩu <Text className="text-red-500">*</Text>
          </Text>
          <View className="relative">
            <TextInput
              className="h-12 border border-blue-500 rounded-lg px-3 bg-white"
              placeholder="Mật khẩu"
              placeholderTextColor="#888888"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <Pressable onPress={togglePasswordVisibility} className="absolute right-3 top-3 p-2">
              <Image
                source={showPassword ? require('@/assets/images/eye-close-up.png') : require('@/assets/images/closed-eyes.png')}
                className="w-6 h-6"
              />
            </Pressable>
          </View>
        </View>

        <View className="items-center">
          <Pressable className="bg-blue-500 py-3 rounded-lg w-full items-center" onPress={handleLogin}>
            <Text className="text-white text-lg font-bold">Đăng Nhập</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
