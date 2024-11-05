import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { useRouter } from "expo-router";
import { logoutAction } from "./(redux)/authSlice";
import ProtectedRoute from "../components/ProtectedRoute";
const PersonalScreen = () => {
  const router = useRouter(); 
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logoutAction());
    router.push("/");
  };

  return (
    <ProtectedRoute>
      <View className="flex-1 justify-center items-center p-4 bg-gray-100">
        <Text className="text-4xl font-bold mb-6">User Profile</Text>
        {user ? (
          <>
            <Text className="text-lg mb-4">Phone Number: {user.PhoneNumber}</Text>
            <TouchableOpacity
              className="h-12 bg-purple-600 justify-center items-center rounded-lg px-5 mt-4"
              onPress={handleLogout}
            >
              <Text className="text-white text-lg font-bold">Logout</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text className="text-lg mb-4">No user logged in</Text>
        )}
      </View>
    </ProtectedRoute>
  )
}

export default PersonalScreen
