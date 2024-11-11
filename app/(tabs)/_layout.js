import React from 'react';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Tabs } from "expo-router";


function TabLayout() {
  return (
    <Tabs>

      <Tabs.Screen 
        name="HomeScreen" 
        options={{
          headerShown: false,
          tabBarLabel: "Trang chủ",
          tabBarIcon: ({ color }) => (
            <AntDesign name="home" size={24} color={color} /> // Sử dụng màu tab hiện tại
          ),
        }}
      />
      <Tabs.Screen 
        name="CalendarScreen" 
        options={{
          headerShown: false,
          tabBarLabel: "Lịch",
          tabBarIcon: ({ color }) => (
            <AntDesign name="calendar" size={24} color={color} /> // Sử dụng màu tab hiện tại
          ),
        }}
      />
      <Tabs.Screen 
        name="ProfileScreen" 
        options={{
          headerShown: false,
          tabBarLabel: "Hồ sơ",
          tabBarIcon: ({ color }) => (
            <AntDesign name="profile" size={24} color={color} /> // Sử dụng màu tab hiện tại
          ),
        }}
      />
      <Tabs.Screen 
        name="PersonalScreen" 
        options={{
          headerShown: false, 
          tabBarLabel: "Cá nhân",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={24} color={color} /> // Sử dụng màu tab hiện tại
          ),
        }}
      />
    </Tabs>
  );
};
export default TabLayout;