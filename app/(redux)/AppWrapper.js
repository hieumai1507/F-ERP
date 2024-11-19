import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Stack } from "expo-router/stack";
import { loadUser } from "./authSlice";

function AppWrapper() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);
  return (
    <Stack>
      <Stack.Screen name="index"  options={{ headerShown: false }} />
      <Stack.Screen name="auth/LoginScreen"  options={{ headerShown: false }} />
      <Stack.Screen name="auth/RegisterScreen" options={{ headerShown: false}} />
      <Stack.Screen name="AdminScreen" options={{ headerShown: false }} />
    </Stack>
  );
}
export default AppWrapper;