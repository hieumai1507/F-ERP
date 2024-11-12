import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

import { useRouter } from "expo-router";
import ProtectedRoute from "../../components/ProtectedRoute";

const PersonalScreen = () => {
  const router = useRouter();
  const handleLogout = async () => {
    await AsyncStorage.setItem('isLoggedIn', '');
    await AsyncStorage.setItem('token', '');
    await AsyncStorage.setItem('userType', '');
    router.push("/Login/LoginScreen")
  };

  return (
    <ProtectedRoute>
      <View className="flex-1 p-5 bg-gray-100">
        <Text className="text-4xl font-bold mb-5 text-center text-gray-800">Cá nhân</Text>
        <View className="my-2">
          <TouchableOpacity className="flex-row items-center py-4 px-2 rounded-lg bg-white mb-2 shadow" onPress={() => router.push('../UpdateProfile/UpdateProfile.jsx')}>
            <Icon name="user" size={24} color="#4caf50" />
            <Text className="flex-1 text-lg ml-2 text-gray-800">Account</Text>
            <Icon name="angle-right" size={24} color="#999" className="ml-auto" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center py-4 px-2 rounded-lg bg-white mb-2 shadow">
            <Icon name="bell" size={24} color="#ff9800" />
            <Text className="flex-1 text-lg ml-2 text-gray-800">Notifications</Text>
            <Icon name="angle-right" size={24} color="#999" className="ml-auto" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center py-4 px-2 rounded-lg bg-white mb-2 shadow">
            <Icon name="lock" size={24} color="#f44336" />
            <Text className="flex-1 text-lg ml-2 text-gray-800">Privacy</Text>
            <Icon name="angle-right" size={24} color="#999" className="ml-auto" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center py-4 px-2 rounded-lg bg-white mb-2 shadow">
            <Icon name="info-circle" size={24} color="#3f51b5" />
            <Text className="flex-1 text-lg ml-2 text-gray-800">About</Text>
            <Icon name="angle-right" size={24} color="#999" className="ml-auto" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center py-4 px-2 rounded-lg bg-white mb-2 shadow" onPress={handleLogout}>
            <Icon name="sign-out" size={24} color="#e91e63" />
            <Text className="flex-1 text-lg ml-2 text-gray-800">Logout</Text>
            <Icon name="angle-right" size={24} color="#999" className="ml-auto" />
          </TouchableOpacity>
        </View>
      </View>
    </ProtectedRoute>
  )
}

export default PersonalScreen