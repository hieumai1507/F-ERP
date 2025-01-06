import React from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import fonts from "@/constants/fonts";
import moment from "moment";

const RequestDetailModal = ({ visible, request, user, onClose }) => {
  if (!visible) return null;
  if (!request) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="m-5 bg-white rounded-[20px] p-6 shadow-md w-[90%] max-h-[80%]">
          <View className="flex-row justify-between items-center mb-2">
            <TouchableOpacity
              onPress={onClose}
              className="bg-white/20 rounded-full p-2 justify-center items-center"
            >
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
            <Text
              className="text-xl"
              style={{ fontFamily: fonts["BeVietNamPro-SemiBold"] }}
            >
              Request Details
            </Text>
          </View>

          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 10,
              paddingVertical: 20,
            }}
          >
            <View className="flex-row items-start mb-2">
              <Text
                className="text-base w-[100px] text-[#737373]"
                style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
              >
                Request ID:
              </Text>
              <Text
                className="text-base flex-1"
                style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
              >
                {request?._id}
              </Text>
            </View>

            <View className="flex-row items-start mb-2">
              <Text
                className="text-base w-[100px] text-[#737373]"
                style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
              >
                User:
              </Text>
              <Text
                className="text-base flex-1"
                style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
              >
                {user?.fullName}
              </Text>
            </View>

            <View className="flex-row items-start mb-2">
              <Text
                className="text-base w-[100px] text-[#737373]"
                style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
              >
                Loại:
              </Text>
              <Text
                className="text-base flex-1"
                style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
              >
                {request?.type}
              </Text>
            </View>

            <View className="flex-row items-start mb-2">
              <Text
                className="text-base w-[100px] text-[#737373]"
                style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
              >
                Request Date:
              </Text>
              <Text
                className="text-base flex-1"
                style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
              >
                {moment(request?.requestDate).format("HH:mm DD/MM/YYYY")}
              </Text>
            </View>

            <View className="flex-row items-start mb-2">
              <Text
                className="text-base w-[100px] text-[#737373]"
                style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
              >
                Request Time:
              </Text>
              <Text
                className="text-base flex-1"
                style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
              >
                {request?.requestTime}
              </Text>
            </View>

            <View className="flex-row items-start mb-2">
              <Text
                className="text-base w-[100px] text-[#737373]"
                style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
              >
                Lý do:
              </Text>
              <Text
                className="text-base flex-1"
                style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
              >
                {request?.reason}
              </Text>
            </View>
            <View className="flex-row items-start mb-2">
              <Text
                className="text-base w-[100px] text-[#737373]"
                style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
              >
                Trạng thái:
              </Text>
              <Text
                className="text-base flex-1"
                style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
              >
                {request?.status}
              </Text>
            </View>

            <View className="flex-row items-start mb-2">
              <Text
                className="text-base w-[100px] text-[#737373]"
                style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
              >
                Absent Type:
              </Text>
              <Text
                className="text-base flex-1"
                style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
              >
                {request?.absentType}
              </Text>
            </View>
            <View className="flex-row items-start mb-2">
              <Text
                className="text-base w-[100px] text-[#737373]"
                style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
              >
                Going Out Minutes:
              </Text>
              <Text
                className="text-base flex-1"
                style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
              >
                {request?.goingOutMinutes}
              </Text>
            </View>
          </ScrollView>

          <View className="flex-row justify-evenly w-full py-2">
            <TouchableOpacity
              className="rounded-md p-2 bg-[#2196F3] items-center"
              // style={styles.buttonApprove}
            >
              <Text
                className="text-white font-bold"
                // style={styles.textStyle}
              >
                Phê duyệt
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="rounded-md p-2 bg-[#f44336] items-center"
              // style={styles.buttonReject}
            >
              <Text
                className="text-white font-bold"
                // style={styles.textStyle}
              >
                Từ chối
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default RequestDetailModal;
