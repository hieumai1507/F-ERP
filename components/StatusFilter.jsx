import React from "react";
import { View, TouchableOpacity, Text } from "react-native";

const StatusFilter = ({ selectedStatus, onSelectStatus, getStatusCount }) => {
  const statuses = [
    "All",
    "Pending",
    "Approved",
    "Rejected",
    "Canceled",
    "Ignored",
  ];

  return (
    <View className="flex-row flex-wrap justify-between mb-4 bg-[#FFFFFF] rounded-lg">
      {statuses.map((status) => (
        <TouchableOpacity
          key={status}
          onPress={() => onSelectStatus(status)}
          className={`w-[112px] h-[32px] rounded-lg   mr-1 items-center justify-center  ${
            selectedStatus === status ? "bg-[#F1F5F9]" : "bg-[#FFFFFF]"
          }`}
        >
          <Text className={` text-black`}>
            {status} ({getStatusCount(status)})
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default StatusFilter;
