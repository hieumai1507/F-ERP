import React from 'react';
import { Tabs } from "expo-router";
import { AntDesign, Ionicons } from '@expo/vector-icons';
function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => {
        let IconComponent;
        let iconName;

        if (route.name === "HomeScreen") {
          IconComponent = AntDesign;
          iconName = "home";
        } else if (route.name === "CalendarScreen") {
          IconComponent = AntDesign;
          iconName = "calendar";
        } else if (route.name === "ProfileScreen") {
          IconComponent = AntDesign;
          iconName = "profile";
        } else if (route.name === "PersonalScreen") {
          IconComponent = Ionicons;
          iconName = "person-outline";
        }

        return {
          tabBarIcon: ({ color }) => (
            <IconComponent name={iconName} size={24} color={color} />
          ),
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#005AB4",
        };
      }}
    >
      <Tabs.Screen name="HomeScreen" />
      <Tabs.Screen name="CalendarScreen" />
      <Tabs.Screen name="ProfileScreen" />
      <Tabs.Screen name="PersonalScreen" />
    </Tabs>
  );
}

export default TabLayout;
