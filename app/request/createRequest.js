import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function CreateRequestScreen() {
  const navigation = useNavigation();

  const [loai, setLoai] = useState('Đi muộn');
  const [thoiGian, setThoiGian] = useState(new Date());
  const [ngayXinPhep, setNgayXinPhep] = useState(new Date());
  const [lyDo, setLyDo] = useState('');
  const [thoiGianVangMat, setThoiGianVangMat] = useState('60');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);


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

  const handleSubmit = () => {
    // Validation logic here (similar to previous responses)
    if (!lyDo) {
      alert("Vui lòng nhập lý do!");
      return;
    }
    if (!thoiGian) {
      alert("Vui lòng nhập thời gian!");
      return;
    }
    if (!ngayXinPhep) {
      alert("Vui lòng nhập ngày xin phép!");
      return;
    }
    if (!loai) {
      alert("Vui lòng nhập loại!");
      return;
    }
    if (loai === "Đi muộn" && thoiGian.getHours() >= 12) {
      alert("Thời gian đi muộn không được quá 12 giờ trưa");
      return;
    }


    // Submit data
    console.log('Data submitted:', { loai, thoiGian, ngayXinPhep, lyDo, thoiGianVangMat });
  };


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
      keyboardVerticalOffset={100} // Adjust as needed
    >
         <View className="flex-row items-center mb-8 py-4 bg-blue-500">
            <TouchableOpacity onPress={() => navigation.goBack()} className="mr-2">
            <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-center flex-1 mx-4 text-white">Tạo đơn</Text>
          </View>
        <View className="flex-1 bg-white p-4">
          
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>
          <Text className="text-gray-500 mb-2">Vui lòng điền đầy đủ và cẩn thận</Text>


          <View className="mb-4">
            <Text className="mb-1 font-bold">Loại</Text>
            <Picker
              selectedValue={loai}
              onValueChange={(itemValue) => setLoai(itemValue)}
              className="border border-gray-300 rounded"
            >
              <Picker.Item label="Đi Muộn" value="Đi muộn" />
              <Picker.Item label="Về Sớm" value="Về sớm" />
              <Picker.Item label="Xin nghỉ" value="Xin nghỉ" />
              <Picker.Item label="Ra Ngoài" value="Ra ngoài" />
            </Picker>
          </View>

          {loai === 'Ra ngoài' && (
            <View className="mb-4 ">
              <Text className="mb-1 font-bold">Thời gian vắng mặt</Text>
              <Picker
                selectedValue={thoiGianVangMat}
                onValueChange={(value) => setThoiGianVangMat(value)}
                className="border border-gray-300 rounded"
              >
                <Picker.Item label="60 phút" value="60" />
                <Picker.Item label="120 phút" value="120" />
              </Picker>
            </View>
          )}




          <View className="mb-4">
            <Text className="mb-1 font-bold">Thời gian</Text>
            <TouchableOpacity onPress={() => setShowTimePicker(true)} className="border border-gray-300 rounded p-2">
              <Text>{thoiGian.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </TouchableOpacity>

            {showTimePicker && (
              <DateTimePicker
                value={thoiGian}
                mode="time"
                is24Hour={false}
                display="default"
                onChange={onChangeTime}
              />
            )}


          </View>


          <View className="mb-4">
            <Text className="mb-1 font-bold">Ngày xin phép</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} className="border border-gray-300 rounded p-2">
              <Text>{ngayXinPhep.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={ngayXinPhep}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onChangeDate}
                minimumDate={new Date()} // Set minimum date to today
              />
            )}

          </View>


          <View className="mb-4">
            <Text className="mb-1 font-bold">Lý do</Text>
            <TextInput
              multiline
              placeholder="Type your message here"
              value={lyDo}
              onChangeText={setLyDo}
              className="border border-gray-300 rounded p-2 h-24"
            />
          </View>


          <View className="mb-4">
            <Text className="mb-1 font-bold">Người duyệt</Text>
            <Text>Lỗ Quang Tính</Text>
          </View>




          <TouchableOpacity onPress={handleSubmit} className="bg-blue-500 rounded-lg py-3">
            <Text className="text-white text-center text-lg">Submit</Text>
          </TouchableOpacity>

      </ScrollView>
        </View>
    </KeyboardAvoidingView>
  );
}