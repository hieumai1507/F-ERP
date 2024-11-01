import { StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import Colors from "@/constants/Colors";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';
import LoginScreen from '../LoginScreen/LoginScreen';

const Tab = createBottomTabNavigator(); // Use the Tab navigator from React Navigation

const TabLayout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    // Logic đăng nhập thành công
    setIsLoggedIn(true);
  };
  return (
      
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: Colors.primary,
  }}>
    {isLoggedIn ? (
          <>
          <Tabs.Screen 
            name="HomeScreen" 
            options={{
              tabBarLabel: "Trang chủ",
              tabBarIcon: ({ color }) => (
                <AntDesign name="home" size={24} color="black" />
              ),
            }}
          />
          <Tabs.Screen 
            name="CalendarScreen" 
            options={{
              tabBarLabel: "Lịch",
              tabBarIcon: ({ color }) => (
                <AntDesign name="calendar" size={24} color="black" />
              ),
            }}
          />
          <Tabs.Screen 
            name="ProfileScreen" 
            options={{
              tabBarLabel: "Hồ sơ",
              tabBarIcon: ({ color }) => (
                <AntDesign name="profile" size={24} color="black" />
              ),
            }}
          />
          <Tabs.Screen 
            name="PersonalScreen" 
            options={{
              tabBarLabel: "Cá nhân",
              tabBarIcon: ({ color }) => (
                <Ionicons name="person-outline" size={24} color="black" />
              ),
            }}
          />
          </>
        ) : (
          <Tab.Screen name="LoginScreen" options={{ tabBarButton: () => null }}>
            {props => <LoginScreen {...props} onLogin={handleLogin} />}
          </Tab.Screen>
          )}
        </Tabs>
      
  );
};

export default TabLayout;

const styles = StyleSheet.create({});