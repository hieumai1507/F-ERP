import React from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import ProtectedRoute from "@/components/ProtectedRoute";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import fonts from "@/constants/fonts";
import { useRoute } from "@react-navigation/native";
const ProfileScreen = () => {
  const user = useSelector((state) => state.auth.user);
  const route = useRoute();

  return (
    <ProtectedRoute className="bg-[#F5F5F5]">
      <SafeAreaView>
        <LinearGradient
          colors={["#033495", "#0654B2", "#005AB4", "#38B6FF"]}
          locations={[0, 0.16, 0.32, 1]} // Vị trí tương ứng với phần trăm
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }} // Hoặc điều chỉnh theo hướng gradient mong muốn
          className="w-full h-[109px] justify-between flex-row items-center"
        >
          <Text
            className="justify-center items-center text-[#FFFFFF] ml-36"
            style={{
              fontFamily: fonts["BeVietNamPro-SemiBold"],
              fontSize: 16,
            }}
          >
            Base Information
          </Text>
        </LinearGradient>
      </SafeAreaView>
      <View className="flex-1 justify-center items-center p-4 bg-gray-100">
        {user ? (
          <>
            <Text className="text-lg mb-4">Email: {user.email}</Text>
            <Text className="text-lg mb-4">Code: {user.code}</Text>

            <Text className="text-lg mb-4">Name: {user.fullName}</Text>
            <Text className="text-lg mb-4">Gender: {user.gender}</Text>
            <Text className="text-lg mb-4">
              Department: {user.department.name}
            </Text>
            <Text className="text-lg mb-4">Role: {user.role.name}</Text>
          </>
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Loading />
          </View>
        )}
      </View>
    </ProtectedRoute>
  );
};

export default ProfileScreen;
