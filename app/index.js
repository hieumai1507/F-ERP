import * as React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { useRouter } from "expo-router";
import AppGradient from "@/components/AppGradient";
import { SafeAreaView } from "react-native-safe-area-context";
export default function App() {
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  const router = useRouter();

  return (
    <View className="flex-1 justify-center">
      <AppGradient colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.8)"]} >
      <SafeAreaView className="flex flex-1 px-1 justify-between">
      <Text className="text-center text-white font-bold text-5xl pt-20">Chào mừng bạn đến mới F-ERP</Text>
      <View className="flex-row justify-around items-center absolute bottom-8 left-0 right-0">
        <TouchableOpacity
          className="bg-purple-600 py-3 px-5 rounded-full shadow" // Thay thế cho styles.button
          onPress={() => router.push("/auth/LoginScreen")}
        >
          <Text className="text-white text-3xl font-bold">Đăng nhập</Text>
        </TouchableOpacity>
      </View>
      </SafeAreaView>
      </AppGradient>
    </View>
  );
}
