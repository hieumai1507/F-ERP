import React from "react";
import { Text, View } from "react-native";
import { useSelector } from "react-redux";
import ProtectedRoute from "@/components/ProtectedRoute";
const ProfileScreen = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <ProtectedRoute className="bg-[#F5F5F5]">
      <View className="flex-1 justify-center items-center p-4 bg-gray-100">
        <Text className="text-4xl font-bold mb-6">User Profile</Text>
        {user ? (
          <>
            <Text className="text-lg mb-4">Email: {user.email}</Text>
            <Text className="text-lg mb-4">Name: {user.fullName}</Text>
            <Text className="text-lg mb-4">
              Department: {user.department.name}
            </Text>
            <Text className="text-lg mb-4">Position: {user.role.name}</Text>
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
