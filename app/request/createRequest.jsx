import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  SafeAreaView,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import CustomPicker from "@/components/CustomPicker";
import { LinearGradient } from "expo-linear-gradient";
import fonts from "@/constants/fonts";
import { router } from "expo-router";
import { useSelector } from "react-redux";
import moment from "moment";
export default function CreateRequestScreen() {
  // Khai báo navigation để điều hướng màn hình
  const navigation = useNavigation();

  // Các state quản lý dữ liệu nhập liệu
  const [requestType, setRequestType] = useState("Đi muộn"); // Loại yêu cầu (Đi muộn, Về sớm, Xin nghỉ, Ra ngoài)
  const [requestTime, setRequestTime] = useState(new Date()); // Thời gian yêu cầu (giờ, phút)
  const [requestDate, setRequestDate] = useState(new Date()); // Ngày yêu cầu
  const [reason, setReason] = useState(""); // Lý do yêu cầu
  const [goingOutMinutes, setGoingOutMinutes] = useState("60"); // Thời gian vắng mặt (phút, chỉ dùng khi loại yêu cầu là "Ra ngoài")
  const [showTimePicker, setShowTimePicker] = useState(false); // Trạng thái hiển thị bộ chọn thời gian
  const [showDatePicker, setShowDatePicker] = useState(false); // Trạng thái hiển thị bộ chọn ngày
  const [absentType, setAbsentType] = useState("Cả ngày"); // Loại xin nghỉ (Cả ngày, Buổi sáng, Buổi chiều)

  // Các state quản lý dữ liệu người duyệt
  const [approvableUsers, setApprovableUsers] = useState([]); // Danh sách ID người có thể duyệt
  const [approvableFullNames, setApprovableFullNames] = useState([]); // Danh sách tên đầy đủ người có thể duyệt

  // Lấy thông tin người dùng từ Redux store
  const userLogin = useSelector((state) => state.auth.user);
  const userId = userLogin._id;
  const departmentName = userLogin.department.name;

  // Hàm xử lý khi thay đổi thời gian
  const handleTimeChange = (event, selectedDate) => {
    setShowTimePicker(false); // Ẩn bộ chọn thời gian
    if (selectedDate) {
      setRequestTime(selectedDate);
    }
  };

  // Hàm lấy danh sách người duyệt
  const fetchApprovableUsers = async () => {
    try {
      const token = await AsyncStorage.getItem("token"); // Lấy token từ AsyncStorage
      const response = await axios.get(
        `https://erpapi.folinas.com/api/v1/users/approvable-users?roleName=${departmentName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào header
          },
        }
      );
      if (response?.data?.success) {
        const { data } = response.data; // Destructure data từ response
        const userIds = data.map((user) => user._id); // Lấy danh sách ID
        const fullNames = data.map((user) => user.fullName); // Lấy danh sách tên đầy đủ
        setApprovableUsers(userIds);
        setApprovableFullNames(fullNames);
      } else {
        Alert.alert("Error", "Failed to fetch approvable users"); // Thông báo lỗi nếu fetch thất bại
      }
    } catch (error) {
      console.error("Error fetching approvable users:", error);
      Alert.alert("Error", "Error fetching approvable users"); // Thông báo lỗi nếu có lỗi xảy ra
    }
  };

  // Gọi fetchApprovableUsers khi component được mount
  useEffect(() => {
    fetchApprovableUsers();
  }, []);

  // Hàm xử lý khi thay đổi ngày
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false); // Ẩn bộ chọn ngày
    if (selectedDate) {
      setRequestDate(selectedDate);
    }
  };
  // Hàm kiểm tra xem thời gian đi muộn có hợp lệ không
  const validateLateArrival = () => {
    const hours = requestTime.getHours();
    const minutes = requestTime.getMinutes();
    if (hours > 8 || (hours === 8 && minutes >= 20)) {
      Alert.alert(
        "Lỗi",
        "Thời gian đi muộn không được quá 8 giờ 20 phút sáng."
      );
      return false;
    }
    return true;
  };

  // Hàm xử lý khi submit form
  const handleSubmit = async () => {
    // Validate dữ liệu nhập vào
    if (!reason) {
      Alert.alert("Lỗi", "Vui lòng nhập lý do!");
      return;
    }
    if (!requestTime) {
      Alert.alert("Lỗi", "Vui lòng nhập thời gian!");
      return;
    }
    if (!requestDate) {
      Alert.alert("Lỗi", "Vui lòng nhập ngày xin phép!");
      return;
    }
    if (!requestType) {
      Alert.alert("Lỗi", "Vui lòng nhập loại!");
      return;
    }
    // Kiểm tra thời gian đi muộn nếu loại yêu cầu là "Đi muộn"
    if (requestType === "Đi muộn" && !validateLateArrival()) {
      return;
    }
    // Mapping loại yêu cầu từ tiếng Việt sang tiếng Anh
    const typeMapping = {
      "Đi muộn": "Late Arrival",
      "Về sớm": "Early Leave",
      "Xin nghỉ": "Absent",
      "Ra ngoài": "Going Out",
    };

    const absentTypeMapping = {
      "Cả ngày": "Day",
      "Buổi sáng": "Half Day Morning",
      "Buổi chiều": "Half Day Afternoon",
    };

    const translatedType = typeMapping[requestType] || requestType;
    const translatedAbsentType =
      requestType === "Xin nghỉ" ? absentTypeMapping[absentType] : null;

    let timeToSend = null;
    let timeOfDayToSend = null;
    let goingOutMinutesToSend = null;

    if (translatedType === "Going Out") {
      goingOutMinutesToSend = parseInt(goingOutMinutes, 10);
    }
    if (translatedType === "Absent") {
      timeOfDayToSend = translatedAbsentType;
    } else {
      timeToSend = requestTime;
    }

    const now = moment().toISOString();

    const requestData = {
      type: translatedType,
      requestTime: timeToSend,
      requestDate: requestDate,
      reason: reason,
      from: now,
      to: now,
      goingOutMinutes: goingOutMinutesToSend,
      absentType: timeOfDayToSend,
      approvableUserIds: approvableUsers,
    };
    console.log("Request Data:", requestData);

    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.post(
        "https://erpapi.folinas.com/api/v1/checkInRequests",
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status === "ok") {
        Alert.alert("Thành công", "Đã tạo đơn thành công!");
        console.log("Leave request created successfully:", response.data.data);
        navigation.goBack();
      } else {
        Alert.alert("Lỗi", "Có lỗi xảy ra khi tạo đơn!");
        console.error("Error creating leave request:", response.data);
      }
    } catch (error) {
      console.error("Error creating request:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra, vui lòng thử lại sau!");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white items-center"
      keyboardVerticalOffset={100} // Adjust as needed
    >
      <SafeAreaView>
        <LinearGradient
          colors={["#033495", "#0654B2", "#005AB4", "#38B6FF"]}
          locations={[0, 0.16, 0.32, 1]} // Vị trí tương ứng với phần trăm
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }} // Hoặc điều chỉnh theo hướng gradient mong muốn
          className="w-full h-[109px] justify-between flex-row items-center"
        >
          <TouchableOpacity
            className=" ml-[15px] w-[30px] h-[30px]  border-none rounded-[6px] justify-center items-center"
            onPress={() => router.back()}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
            }}
          >
            <Ionicons name="chevron-back" size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <Text
            className="justify-center items-center text-[#FFFFFF] mr-[170px]"
            style={{
              fontFamily: fonts["BeVietNamPro-SemiBold"],
              fontSize: 16,
            }}
          >
            Tạo đơn
          </Text>
        </LinearGradient>
      </SafeAreaView>
      <View className="flex-1 bg-white p-4">
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "space-between",
          }}
        >
          <Text
            className="text-[#64748B] mb-2"
            style={{
              fontFamily: fonts["Inter-Regular"],
              fontSize: 14,
            }}
          >
            Vui lòng điền đầy đủ và cẩn thận
          </Text>
          {/* //UI display input loại */}
          <View className="mb-4 w-[360px]">
            <Text
              className="mb-1"
              style={{
                fontFamily: fonts["Inter-Medium"],
                fontSize: 14,
              }}
            >
              Loại
            </Text>
            <CustomPicker
              items={["Đi muộn", "Về sớm", "Xin nghỉ", "Ra ngoài"]}
              selectedValue={requestType}
              onValueChange={(value) => setRequestType(value)}
              placeholder="Chọn loại"
              className="w-[360px]"
            />
          </View>
          {/* //UI loại = Ra ngoài */}
          {requestType === "Ra ngoài" && (
            <View className="mb-4 ">
              <Text
                className="mb-1 font-bold"
                style={{
                  fontFamily: fonts["Inter-Medium"],
                  fontSize: 14,
                }}
              >
                Thời gian vắng mặt
              </Text>
              <CustomPicker
                items={["60", "120"]}
                selectedValue={goingOutMinutes}
                onValueChange={(value) => setGoingOutMinutes(value)}
                placeholder="Chọn thời gian"
              />
            </View>
          )}
          {/* //UI loại = Xin Nghỉ: Thời gian xin nghỉ */}
          {requestType === "Xin nghỉ" && (
            <View className="mb-4 w-[360px]">
              <Text
                className="mb-1 font-bold"
                style={{
                  fontFamily: fonts["Inter-Medium"],
                  fontSize: 14,
                }}
              >
                Thời gian xin nghỉ
              </Text>
              <CustomPicker
                items={["Buổi sáng", "Buổi chiều", "Cả ngày"]}
                selectedValue={absentType}
                onValueChange={(value) => setAbsentType(value)}
                placeholder="Chọn giờ nghỉ"
              />
            </View>
          )}
          {/* //UI loại khác xin nghỉ : Thời gian */}
          {requestType !== "Xin nghỉ" && (
            <View className="mb-4 w-[360px]">
              <Text
                className="mb-1 font-bold"
                style={{
                  fontFamily: fonts["Inter-Medium"],
                  fontSize: 14,
                }}
              >
                Thời gian
              </Text>
              <TouchableOpacity
                onPress={() => setShowTimePicker(true)}
                className="border border-gray-300 rounded p-2"
              >
                <Text>
                  {requestTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </TouchableOpacity>

              {showTimePicker && (
                <DateTimePicker
                  value={requestTime}
                  mode="time"
                  is24Hour={true}
                  display="default"
                  onChange={handleTimeChange}
                />
              )}
            </View>
          )}
          {/* UI ngày xin phép */}
          <View className="mb-4 w-[360px]">
            <Text
              className="mb-1 font-bold"
              style={{
                fontFamily: fonts["Inter-Medium"],
                fontSize: 14,
              }}
            >
              Ngày xin phép
            </Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="border border-gray-300 rounded p-2 w-[360px]"
            >
              <Text>{requestDate.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={requestDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleDateChange}
                minimumDate={new Date()} // Set minimum date to today
              />
            )}
          </View>
          {/* UI Lý do */}
          <View className="mb-4">
            <Text
              className="mb-1 font-bold"
              style={{
                fontFamily: fonts["Inter-Medium"],
                fontSize: 14,
              }}
            >
              Lý do
            </Text>
            <TextInput
              multiline
              placeholder="Type your message here"
              value={reason}
              onChangeText={setReason}
              className="border border-gray-300 rounded p-2 h-24 w-[360px]"
              style={{
                fontFamily: fonts["Inter-Medium"],
                fontSize: 14,
              }}
            />
          </View>
          {/* UI người duyệt */}
          <View className="mb-4 ">
            <Text
              className="mb-1 font-bold "
              style={{
                fontFamily: fonts["Inter-Medium"],
                fontSize: 14,
              }}
            >
              Người duyệt
            </Text>
            <View className="h-[40px] w-[360px] px-[12px] py-[8px] border border-[#CBD5E1]">
              <Text
                style={{
                  fontFamily: fonts["Inter-Regular"],
                  fontSize: 12,
                  paddingTop: 3,
                }}
              >
                {approvableFullNames.join(", ")}
              </Text>
            </View>
          </View>
          {/* Button Submit */}
          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-[#0B6CA7] rounded-[6px] py-3 w-[360px] h-[40px]"
          >
            <Text
              className="text-white text-center"
              style={{
                fontFamily: fonts["Inter-Medium"],
                fontSize: 14,
              }}
            >
              Submit
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
