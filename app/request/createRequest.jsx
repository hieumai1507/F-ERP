import React, { useState } from "react";
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
import { SERVER_URI } from "../../utils/uri";
import { LinearGradient } from "expo-linear-gradient";
import fonts from "@/constants/fonts";
import { router } from "expo-router";

export default function CreateRequestScreen() {
  const navigation = useNavigation();

  const [loai, setLoai] = useState("Đi muộn");
  const [thoiGian, setThoiGian] = useState(new Date());
  const [ngayXinPhep, setNgayXinPhep] = useState(new Date());
  const [lyDo, setLyDo] = useState("");
  const [thoiGianVangMat, setThoiGianVangMat] = useState("60");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [thoiGianXinNghi, setThoiGianXinNghi] = useState("Cả ngày");

  const onChangeTime = (event, selectedDate) => {
    setShowTimePicker(false);
    if (selectedDate) {
      setThoiGian(selectedDate);
    }
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setNgayXinPhep(selectedDate);
    }
  };

  const handleSubmit = async () => {
    // Validation logic here (similar to previous responses)
    //validate lý do
    if (!lyDo) {
      alert("Vui lòng nhập lý do!");
      return;
    }
    //validate thời gian
    if (!thoiGian) {
      alert("Vui lòng nhập thời gian!");
      return;
    }
    //validate ngày xin phép
    if (!ngayXinPhep) {
      alert("Vui lòng nhập ngày xin phép!");
      return;
    }
    //validate loại
    if (!loai) {
      alert("Vui lòng nhập loại!");
      return;
    }
    //condition loại = Đi muộn
    if (loai === "Late Arrival") {
      const hours = thoiGian.getHours();
      const minutes = thoiGian.getMinutes();

      if (hours >= 8) {
        if (hours === 8 && minutes < 20) return; // Specifically allows 8:00-8:19
        alert("Thời gian đi muộn không được quá 8 giờ 20 phút sáng");
        return;
      }
    }
    //translate from Vietnamese to English
    const TypeMapping = {
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
    const translatedType = TypeMapping[loai] || loai;
    const translatedAbsentType =
      loai === "Xin nghỉ" ? absentTypeMapping[thoiGianXinNghi] : null;
    //condition loại = Ra Ngoài
    let thoiGianVangMatToSend = null; // giữ nguyên giá trị nếu type là "Ra Ngoài"
    if (translatedType === "Going Out") {
      thoiGianVangMatToSend = parseInt(thoiGianVangMat, 10);
    }
    //condition loại = Xin nghỉ
    let timeToSend = thoiGian;
    let timeOfDayToSend = null;
    if (translatedType === "Absent") {
      timeToSend = null;
      timeOfDayToSend = translatedAbsentType;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.post(
        "https://erpapi.folinas.com/api/v1/checkInRequests",
        {
          token,
          type: translatedType,
          requestTime: timeToSend,
          requestDate: ngayXinPhep,
          reason: lyDo,
          goingOutMinutes: thoiGianVangMatToSend, // include thoiGianVangMat
          absentType: timeOfDayToSend, // Send the time of day
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "ok") {
        alert("Đã tạo đơn thành công!");
        console.log("Leave request created successfully:", response.data.data);
        navigation.goBack(); // Navigate back to the request screen after successful submission.
      } else {
        console.error("Error creating leave request:", response.data.data);
        // handle error, maybe show alert to user.
      }
    } catch (error) {
      console.error("Error creating request:", error);
      // handle error, maybe show alert to user
      Alert.alert("Error", "Something went wrong");
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
              selectedValue={loai}
              onValueChange={(value) => setLoai(value)}
              placeholder="Chọn loại"
              className="w-[360px]"
            />
          </View>
          {/* //UI loại = Ra ngoài */}
          {loai === "Ra ngoài" && (
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
                selectedValue={thoiGianVangMat}
                onValueChange={(value) => setThoiGianVangMat(value)}
                placeholder="Chọn thời gian"
              />
            </View>
          )}
          {/* //UI loại = Xin Nghỉ: Thời gian xin nghỉ */}
          {loai === "Xin nghỉ" && (
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
                selectedValue={thoiGianXinNghi}
                onValueChange={(value) => setThoiGianXinNghi(value)}
                placeholder="Chọn giờ nghỉ"
              />
            </View>
          )}
          {/* //UI loại khác xin nghỉ : Thời gian */}
          {loai !== "Xin nghỉ" && (
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
                  {thoiGian.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </TouchableOpacity>

              {showTimePicker && (
                <DateTimePicker
                  value={thoiGian}
                  mode="time"
                  is24Hour={true}
                  display="default"
                  onChange={onChangeTime}
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
              <Text>{ngayXinPhep.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={ngayXinPhep}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onChangeDate}
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
              value={lyDo}
              onChangeText={setLyDo}
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
                }}
              >
                Lỗ Quang Tính
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
