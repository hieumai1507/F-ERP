import React from "react";
import { View, Text } from "react-native";
import CustomPicker from "@/components/CustomPicker";

const MonthPicker = ({
  selectedMonth,
  onSelectMonth,
  userLogin,
  monthStrings,
}) => {
  return (
    <View className="pr-3">
      <View className="flex-row mb-4">
        <View className="flex-1">
          <View className="bg-white border border-[#CBD5E1] rounded-md h-10 w-[130px]">
            <Text className="top-[10px] ml-[25px]">{userLogin.role.name}</Text>
          </View>
        </View>
        <View className="flex-1 w-[219px] h-10">
          <CustomPicker
            items={monthStrings}
            selectedValue={selectedMonth.format("MMMM YYYY")}
            onValueChange={(monthString) => {
              onSelectMonth(monthString);
            }}
            placeholder="Select Month"
            className="mb-2"
          />
        </View>
      </View>
    </View>
  );
};

export default MonthPicker;
