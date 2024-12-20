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
import { useNavigation } from "@react-navigation/native";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Fontisto from "react-native-vector-icons/Fontisto";
import Error from "react-native-vector-icons/MaterialIcons";
import { useState, useEffect } from "react";
import axios from "axios";
import { RadioButton } from "react-native-paper";
import { router } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { SERVER_URI } from "../../utils/uri";

function RegisterPage({ props }) {
  const [name, setName] = useState("");
  const [nameVerify, setNameVerify] = useState(false);
  const [email, setEmail] = useState("");
  const [emailVerify, setEmailVerify] = useState(false);
  const [mobile, setMobile] = useState("");
  const [mobileVerify, setMobileVerify] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordVerify, setPasswordVerify] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState("User");
  const [secretText, setSecretText] = useState("");

  const navigation = useNavigation();

  function handleSubmit() {
    const userData = {
      name: name,
      email,
      mobile,
      password,
      userType,
    };
    if (userType === "Admin" && secretText !== "Text1243") {
      return Alert.alert("Invalid Admin");
    }
    axios
      .post(`${SERVER_URI}/register`, userData)
      .then((res) => {
        if (res.data.status == "ok") {
          Alert.alert("Registered Successfully!!");
          router.push("./LoginScreen");
        } else {
          Alert.alert(JSON.stringify(res.data));
        }
      })
      .catch((error) => {
        console.error("Registration error:", error);
        //Or a more specific error message
        Alert.alert("Error", "Registration failed, Please try again");
      });
  }
  useEffect(() => {
    setUserType("User");
  }, []);
  function handleName(e) {
    const nameVar = e.nativeEvent.text;
    setName(nameVar);
    setNameVerify(nameVar.length > 1);
  }

  function handleEmail(e) {
    const emailVar = e.nativeEvent.text;
    setEmail(emailVar);
    setEmailVerify(/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(emailVar));
  }

  function handleMobile(e) {
    const mobileVar = e.nativeEvent.text;
    setMobile(mobileVar);
    setMobileVerify(/^0\d{9}$/.test(mobileVar)); // Sửa lại regex để yêu cầu số điện thoại bắt đầu bằng 0 và có 10 chữ số
  }

  function handlePassword(e) {
    const passwordVar = e.nativeEvent.text;
    setPassword(passwordVar);
    setPasswordVerify(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(passwordVar));
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#F5F5F5" }}
    >
      <ScrollView
        className="flex-grow "
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={"always"}
      >
        <View className="flex-1">
          <View className="justify-center items-center my-8">
            <Image
              className="h-[140px] w-[130px]"
              source={require("../../assets/images/F-ERP_Logo.png")}
            />
          </View>
          <View className=" pt-8 pb-4 px-5 rounded-tl-3xl rounded-tr-3xl">
            <Text className="text-3xl font-bold text-black text-center">
              F-ERP chào mừng bạn!
            </Text>

            <View className="flex flex-row justify-between items-center my-5">
              <Text className="text-xl text-[#0B6CA7] font-bold">Login as</Text>
              <View className="flex flex-row justify-center items-center">
                <TouchableOpacity
                  onPress={() => setUserType("User")}
                  className={`flex flex-row items-center px-4 py-2 rounded-full ${
                    userType === "User" ? "bg-[#0B6CA7]" : "bg-gray-200"
                  }`}
                >
                  <RadioButton
                    value="User"
                    status={userType === "User" ? "checked" : "unchecked"}
                    onPress={() => setUserType("User")}
                    color="#fff" // Đặt màu trắng cho nút radio khi được chọn
                  />
                  <Text
                    className={`text-lg ${
                      userType === "User" ? "text-white" : "text-black"
                    } ml-2`}
                  >
                    User
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="flex flex-row justify-center items-center">
                <TouchableOpacity
                  onPress={() => setUserType("Admin")}
                  className={`flex flex-row items-center px-4 py-2 rounded-full ${
                    userType === "Admin" ? "bg-[#0B6CA7]" : "bg-gray-200"
                  }`}
                >
                  <RadioButton
                    value="Admin"
                    status={userType === "Admin" ? "checked" : "unchecked"}
                    onPress={() => setUserType("Admin")}
                    color="#fff" // Đặt màu trắng cho nút radio khi được chọn
                  />
                  <Text
                    className={`text-lg ${
                      userType === "Admin" ? "text-white" : "text-black"
                    } ml-2`}
                  >
                    Admin
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {userType === "Admin" && (
              <View className="flex flex-row items-center border border-[#0B6CA7] rounded-full px-3 py-2 mt-4">
                <FontAwesome name="user-o" color="#420475" size={24} />
                <TextInput
                  placeholder="Secret Text"
                  className="flex-1 mt-[-3px] text-[#05375a]"
                  onChange={(e) => setSecretText(e.nativeEvent.text)}
                />
              </View>
            )}

            <View className="flex flex-row items-center border border-[#0B6CA7] rounded-full px-3 py-2 mt-4">
              <FontAwesome name="user-o" color="#420475" size={24} />
              <TextInput
                placeholder="Tên"
                className="flex-1 mt-[-3px] text-[#05375a]"
                onChange={handleName}
              />
              {name.length > 0 &&
                (nameVerify ? (
                  <Feather name="check-circle" color="green" size={20} />
                ) : (
                  <Error name="error" color="red" size={20} />
                ))}
            </View>
            {name.length > 0 && !nameVerify && (
              <Text className="ml-5 text-red-500">
                Name should be more than 1 character.
              </Text>
            )}

            <View className="flex flex-row items-center border border-[#0B6CA7] rounded-full px-3 py-2 mt-4">
              <Fontisto name="email" color="#420475" size={24} />
              <TextInput
                placeholder="Email"
                className="flex-1 mt-[-3px] text-[#05375a]"
                onChange={handleEmail}
              />
              {email.length > 0 &&
                (emailVerify ? (
                  <Feather name="check-circle" color="green" size={20} />
                ) : (
                  <Error name="error" color="red" size={20} />
                ))}
            </View>
            {email.length > 0 && !emailVerify && (
              <Text className="ml-5 text-red-500">
                Enter a valid email address
              </Text>
            )}

            <View className="flex flex-row items-center border border-[#0B6CA7] rounded-full px-3 py-2 mt-4">
              <FontAwesome name="mobile" color="#420475" size={35} />
              <TextInput
                placeholder="Số điện thoại"
                className="flex-1 mt-[-3px] text-[#05375a]"
                onChange={handleMobile}
                maxLength={10}
              />
              {mobile.length > 0 &&
                (mobileVerify ? (
                  <Feather name="check-circle" color="green" size={20} />
                ) : (
                  <Error name="error" color="red" size={20} />
                ))}
            </View>
            {mobile.length > 0 && !mobileVerify && (
              <Text className="ml-5 text-red-500">
                Phone number must start with 0 and have 10 digits
              </Text>
            )}

            <View className="flex flex-row items-center border border-[#0B6CA7] rounded-full px-3 py-2 mt-4">
              <FontAwesome name="lock" color="#420475" size={24} />
              <TextInput
                placeholder="Mật khẩu"
                className="flex-1 mt-[-3px] text-[#05375a]"
                onChange={handlePassword}
                secureTextEntry={showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {password.length > 0 && !showPassword ? (
                  <Feather
                    name="eye-off"
                    color={passwordVerify ? "green" : "red"}
                    size={23}
                  />
                ) : (
                  <Feather
                    name="eye"
                    color={passwordVerify ? "green" : "red"}
                    size={23}
                  />
                )}
              </TouchableOpacity>
            </View>
            {password.length > 0 && !passwordVerify && (
              <Text className="ml-5 text-red-500">
                Password must include uppercase, lowercase, number, and be at
                least 6 characters.
              </Text>
            )}
          </View>

          <View className="flex justify-center items-center mt-5">
            <TouchableOpacity
              className="bg-[#0B6CA7] rounded-full w-3/4 py-4"
              onPress={() => handleSubmit()}
            >
              <Text className="text-white text-xl font-bold text-center">
                Đăng ký
              </Text>
            </TouchableOpacity>
            <View style={{ padding: 15 }}>
              <Text
                style={{ fontSize: 14, fontWeight: "bold", color: "#919191" }}
              >
                ----Hoặc bạn đã có tài khoản----
              </Text>
            </View>
            <View className="items-center justify-center">
              <TouchableOpacity
                className="bg-[#0B6CA7] p-3 rounded-full"
                onPress={() => {
                  router.push("./LoginScreen");
                }}
              >
                <AntDesign name="login" size={24} color="white" />
              </TouchableOpacity>
              <Text className="text-[#0B6CA7] font-bold text-sm mt-2">
                Đăng nhập
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default RegisterPage;
