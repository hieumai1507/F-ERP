import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Stack } from "expo-router/stack";
import { loadUser } from "./authSlice";
import { ToastProvider } from "react-native-toast-notifications";
import useFonts from "expo-font";
import Loading from "@/components/Loading";
function AppWrapper() {
  const dispatch = useDispatch();
  const [loaded, error] = useFonts({
    "BeVietNamPro-SemiBold": require("@/assets/fonts/BeVietNamPro-SemiBold.tff"),
    "BeVietNamPro-Regular": require("@/assets/fonts/BeVietNamPro-Regular.tff"),
    "BeVietNamPro-Medium": require("@/assets/fonts/BeVietNamPro-Medium.tff"),
    "BeVietNam-Medium": require("@/assets/fonts/BeVietNam-Medium.tff"),
    "Inter-Medium": require("@/assets/fonts/Inter_18pt-Medium.tff"),
    "Inter-Regular": require("@/assets/fonts/Inter_18pt-Regular.tff"),
  });
  useEffect(() => {
    if (loaded || error) {
      <View className="flex-1 justify-center items-center">
        <Loading />
      </View>;
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);
  return (
    <ToastProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="auth/LoginScreen"
          options={{ headerShown: false }}
        />

        <Stack.Screen name="AdminScreen" options={{ headerShown: false }} />
        <Stack.Screen
          name="request/request"
          options={{
            headerShown: false,
            title: "Xin phép",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="request/createRequest"
          options={{
            headerShown: false,
            title: "Tạo đơn",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="UpdateProfile/UpdateProfile"
          options={{
            headerShown: false,
            title: "Edit Profile",
            headerBackTitle: "Back",
          }}
        />

        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ToastProvider>
  );
}
export default AppWrapper;
