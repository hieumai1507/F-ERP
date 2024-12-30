import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Stack } from "expo-router/stack";
import { loadUser } from "./authSlice";
import { ToastProvider } from "react-native-toast-notifications";
function AppWrapper() {
  const dispatch = useDispatch();

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
        <Stack.Screen
          name="request/RequestDetailModal"
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
