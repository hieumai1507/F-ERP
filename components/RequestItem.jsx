import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import moment from "moment";
import fonts from "@/constants/fonts";

const RequestItem = ({ item, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View className="bg-white rounded-[20px] p-4 shadow-md mt-2 h-[114px]">
        <View className="flex-row justify-between items-center mb-2">
          <Text
            className="text-sm text-[#333434]"
            style={{ fontFamily: fonts["BeVietNam-Medium"] }}
          >
            Loại: <Text>{item?.type}</Text>
          </Text>
          <View
            className={`px-2 py-1 rounded-full text-white 
                        ${
                          item.status === "Completed"
                            ? "bg-green-50"
                            : item.status === "Ignored"
                            ? "bg-red-50"
                            : item.status === "Pending"
                            ? "bg-yellow-50"
                            : item.status === "Approved"
                            ? "bg-blue-50"
                            : item.status === "Rejected"
                            ? "bg-gray-50"
                            : item.status === "Canceled"
                            ? "bg-orange-50"
                            : ""
                        }`}
          >
            <Text
              className={`text-xs  
                ${
                  item.status === "Completed"
                    ? "text-green-400"
                    : item.status === "Ignored"
                    ? "text-red-400"
                    : item.status === "Pending"
                    ? "text-yellow-400"
                    : item.status === "Approved"
                    ? "text-blue-400"
                    : item.status === "Rejected"
                    ? "text-gray-400"
                    : item.status === "Canceled"
                    ? "text-orange-400"
                    : ""
                }`}
              style={{ fontFamily: fonts["BeVietNamPro-SemiBold"] }}
            >
              {item?.status}
            </Text>
          </View>
        </View>

        <View className="mt-2">
          <View className="flex-row justify-between">
            <Text
              className="text-[#9098B1] w-1/4 text-center text-[10px]"
              style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
            >
              TG tạo
            </Text>
            <Text
              className="text-[#9098B1] w-1/4 text-center text-[10px]"
              style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
            >
              Ngày
            </Text>
            {item?.requestTime ? (
              <Text
                className="text-[#9098B1] w-1/4 text-center text-[10px]"
                style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
              >
                Thời gian
              </Text>
            ) : null}
            {item?.absentType ? (
              <Text
                className="text-[#9098B1] w-1/4 text-center text-[10px]"
                style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
              >
                Loại nghỉ
              </Text>
            ) : null}
            {item?.goingOutMinutes ? (
              <Text
                className="text-[#9098B1] w-1/4 text-center text-[10px]"
                style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
              >
                Thời gian vắng mặt
              </Text>
            ) : null}
            <Text
              className="text-[#9098B1] w-1/4 text-center text-[10px]"
              style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
            >
              Lý do
            </Text>
          </View>

          <View className="flex-row justify-between py-2">
            <View className="w-1/4 items-center">
              <Text
                className="text-gray-800 text-center text-[10px]"
                style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
              >
                {moment(item.createdAt).format("DD/MM/YY")}
              </Text>
              <Text
                className="text-gray-800 text-center text-[10px]"
                style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
              >
                {moment(item?.createdAt).format("HH:mm")}
              </Text>
            </View>
            <Text
              className="text-gray-800 w-1/4 text-center text-[10px]"
              style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
            >
              {moment(item?.requestDate).format("DD/MM/YYYY")}
            </Text>
            {item?.requestTime ? (
              <Text
                className="text-gray-800 w-1/4 text-center text-[10px]"
                style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
              >
                {item?.requestTime}
              </Text>
            ) : null}
            {item?.absentType ? (
              <Text
                className="text-gray-800 w-1/4 text-center text-[10px]"
                style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
              >
                {item?.absentType}
              </Text>
            ) : null}
            {item?.goingOutMinutes ? (
              <Text
                className="text-gray-800 w-1/4 text-center text-[10px]"
                style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
              >
                {item?.goingOutMinutes}
              </Text>
            ) : null}
            <Text
              className="text-gray-800 w-1/4 text-center text-[10px]"
              style={{ fontFamily: fonts["BeVietNamPro-Regular"] }}
            >
              {item?.reason}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RequestItem;
