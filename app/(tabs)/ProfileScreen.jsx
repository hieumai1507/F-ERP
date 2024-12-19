import React, { useEffect } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";
import ProtectedRoute from "@/components/ProtectedRoute";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
const ProfileScreen = () => {
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);

  function signOut() {
    AsyncStorage.setItem("isLoggedIn", "");
    AsyncStorage.setItem("token", "");
    AsyncStorage.setItem("userType", "");
    router.push("/auth/LoginScreen");
  }

  return (
    <ProtectedRoute className="bg-[#F5F5F5]">
      <View className="flex-1 justify-center items-center p-4 bg-gray-100">
        <Text className="text-4xl font-bold mb-6">User Profile</Text>
        {user ? (
          <>
            <Text className="text-lg mb-4">Phone Number: {user.mobile}</Text>
            <Text className="text-lg mb-4">Email: {user.email}</Text>
            <Text className="text-lg mb-4">Name: {user.name}</Text>
            <Text className="text-lg mb-4">Department: {user.department}</Text>
            <TouchableOpacity
              className="h-12 bg-purple-600 justify-center items-center rounded-lg px-5 mt-4"
              onPress={() => signOut()}
            >
              <Text className="text-white text-lg font-bold">Logout</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text className="text-lg mb-4">Loading user data...</Text>
        )}
      </View>
    </ProtectedRoute>
  );
};

export default ProfileScreen;
