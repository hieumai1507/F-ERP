import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loading from "./Loading";
const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const { user, loading } = useSelector((state) => state.auth);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Set initializing to false after checking user state
    if (!loading) {
      setInitializing(false);
      if (!user) {
        router.replace("/auth/LoginScreen");
      }
    }
  }, [loading, user]);

  if (initializing || loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Loading />
      </View>
    );
  }

  return children;
};

export default ProtectedRoute;
