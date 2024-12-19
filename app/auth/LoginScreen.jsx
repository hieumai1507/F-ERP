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
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import Feather from "react-native-vector-icons/Feather";
import { useDispatch } from "react-redux";
import { setUser, setUserType } from "../(redux)/authSlice";
import { SERVER_URI } from "../../utils/uri";
import fonts from "@/constants/fonts";
const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVerify, setPasswordVerify] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const dispatch = useDispatch();
  const handleLoginError = (error) => {
    if (error.response && error.response.data && error.response.data.data) {
      Alert.alert("Error", error.response.data.data || "Login failed"); // Use data field for the message.
    } else {
      Alert.alert("Invalid Email or Password!");
    }
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

  function handleSubmit() {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Email and password cannot be blank!");
      return;
    }
    console.log(email, password);
    const userData = {
      email: email,
      password,
    };

    axios
      .post(`${SERVER_URI}/login-user`, userData)
      .then((res) => {
        if (res.status === 200 && res.data.status === "ok") {
          Alert.alert("Logged In Successfully");
          AsyncStorage.setItem("token", res.data.data);
          AsyncStorage.setItem("isLoggedIn", JSON.stringify(true));
          AsyncStorage.setItem("userType", res.data.userType);
          //Lưu userData và userType vào Redux store
          dispatch(setUser(res.data.userData));
          dispatch(setUserType(res.data.userType));
          if (res.data.userType === "Admin") {
            router.push("/AdminScreen");
          } else {
            router.push("/(tabs)/HomeScreen");
          }
        } else {
          // wrong user
          handleLoginError({ response: res });
        }
      })
      .catch((error) => {
        //check what this error is in the logs
        console.log("Axios catch block", error);
        //if there is a response, handle it
        if (error.response) {
          handleLoginError(error);
        }

        //otherwise, it's a network error
        else {
          Alert.alert("Error", "Could not connect to server");
        }
      });
  }

  async function getData() {
    const data = await AsyncStorage.getItem("isLoggedIn");
    console.log(data, "at index.jsx");
  }

  useEffect(() => {
    getData();
    console.log("Hii");
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
                    className="flex-1 text-[#05375a] mt-[-12px] px-2"
                    onChange={(e) => setEmail(e.nativeEvent.text)}
                    style={{ height: 36, width: 360 }}
                  />
                </View>
              </View>
              <View>
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
                    className="flex-1 text-[#05375a] mt-[-12px] px-2"
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
            <View style={{ padding: 15 }}>
              <Text
                style={{ fontSize: 14, fontWeight: "bold", color: "#919191" }}
              >
                ----Hoặc tiếp tục với----
              </Text>
            </View>
            <View className="items-center justify-center">
              <TouchableOpacity
                className="bg-[#0B6CA7] p-3 rounded-full"
                onPress={() => {
                  router.push("./RegisterScreen");
                }}
              >
                <FontAwesome
                  name="user-plus"
                  color="white"
                  className="text-white text-2xl"
                />
              </TouchableOpacity>
              <Text className="text-[#0B6CA7] font-bold text-sm mt-2">
                Đăng ký
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
