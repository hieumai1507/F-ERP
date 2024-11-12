import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const { user, loading } = useSelector((state) => state.auth);
  const [initializing, setInitializing] = useState(true); 

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
        if (!isLoggedIn) { //only redirect if 'isLoggedIn' is not true
          router.push("/Login/LoginScreen");
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      } finally {
        setInitializing(false);
      }
    };

    checkAuthStatus(); //run auth check immediately
  }, [router]);

  if (initializing || loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }


  return children;
};

export default ProtectedRoute;