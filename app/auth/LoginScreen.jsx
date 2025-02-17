import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import Feather from "react-native-vector-icons/Feather";
import { useDispatch } from "react-redux";
import { loginUser, setUser, setUserType } from "../(redux)/authSlice";
import fonts from "@/constants/fonts";
const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVerify, setPasswordVerify] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const dispatch = useDispatch();
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  axios.interceptors.request.use(
    async (config) => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Đặt token vào header
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Email and password cannot be blank!");
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert("Error", "Invalid email format!");
      return;
    }

    try {
      const res = await fetch("https://erpapi.folinas.com/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      console.log("API Response data: ", JSON.stringify(data, null, 2));
      if (res.status === 404) {
        Alert.alert("Error", "User or password error!");
        return;
      }
      if (res.status === 401) {
        Alert.alert("Error", "Incorrect password!");
        return;
      }
      if (res.status === 200) {
        if (data && data.accessToken) {
          await AsyncStorage.setItem("token", data.accessToken);
          dispatch(setUser(data.user));
          dispatch(loginUser(data.user));
          Alert.alert("Success", "Login successful!");
          router.replace("/(tabs)/HomeScreen");
        } else {
          Alert.alert("Error", "Access token not found!");
        }
        return;
      }
      Alert.alert("Error", "Incorrect password");
    } catch (error) {
      console.error("Error during login:", error);
      Alert.alert("Error", error.message || "Something went wrong");
    }
  };

  async function getData() {
    const data = await AsyncStorage.getItem("isLoggedIn");
    console.log("Is Logged In?", data);
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"} // Điều chỉnh behavior dựa trên hệ điều hành
      style={{ flex: 1, backgroundColor: "#F5F5F5" }} // Đảm bảo KeyboardAvoidingView chiếm toàn bộ màn hình
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps={"always"}
      >
        <View className="mt-[100px]">
          <View className="flex justify-center items-center">
            <Image
              className="h-[140px] w-[130px]"
              source={require("../../assets/images/F-ERP_Logo.png")}
            />
          </View>
          <View className=" rounded-tl-30 rounded-tr-30 px-5 pt-[40px]">
            <Text
              className="text-[#331A1A] text-20 text-center"
              style={{
                fontFamily: fonts["BeVietNamPro-SemiBold"],
              }}
            >
              F-ERP chào mừng bạn!
            </Text>
            <View className="mt-[40px]  px-3">
              <View>
                <Text
                  className="mb-2"
                  style={{
                    fontFamily: fonts["Inter-Medium"],
                    fontSize: 14,
                    color: "#0F172A",
                  }}
                >
                  Email <Text className="text-red-500">*</Text>
                </Text>
                <View className="flex flex-row pt-3 pb-1  border border-[#CBD5E1] rounded-lg mb-2">
                  <TextInput
                    placeholder=" Email"
                    className="flex-1 text-[#05375a] mt-[-10px] px-2"
                    onChange={(e) => setEmail(e.nativeEvent.text)}
                    style={{ height: 36, width: 360 }}
                  />
                </View>
              </View>
              <View className="mt-1">
                <Text
                  className="mb-2"
                  style={{
                    fontFamily: fonts["Inter-Medium"],
                    fontSize: 14,
                    color: "#0F172A",
                  }}
                >
                  Mật khẩu <Text className="text-red-500">*</Text>
                </Text>
                <View className="flex flex-row pt-3 pb-1   border border-[#CBD5E1] rounded-lg">
                  <TextInput
                    placeholder=" Mật khẩu"
                    className="flex-1 text-[#05375a] mt-[-10px] px-2"
                    onChange={(e) => setPassword(e.nativeEvent.text)}
                    style={{ height: 36, width: 360 }}
                    secureTextEntry={showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    className="relative bottom-1 mr-2"
                  >
                    {!showPassword ? (
                      <Feather
                        name="eye"
                        color={passwordVerify ? "green" : "#0B6CA7"}
                        size={24}
                      />
                    ) : (
                      <Feather
                        name="eye-off"
                        color={passwordVerify ? "green" : "#0B6CA7"}
                        size={24}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          <View className="items-center text-center mx-10 mt-[40px]">
            <TouchableOpacity
              className="w-[105px] h-[40px] bg-[#0B6CA7] items-center justify-center rounded-[6px] "
              onPress={() => handleSubmit()}
            >
              <Text
                className="text-[#FFFFFF] text-14 font-bold text-center"
                style={{
                  fontFamily: fonts["Inter-Medium"],
                }}
              >
                Đăng nhập
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
