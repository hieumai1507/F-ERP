import React from "react";
import { Tabs } from "expo-router";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import fonts from "@/constants/fonts";
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
          headerShown: false,
          tabBarActiveTintColor: "#005AB4",
          tabBarInactiveTintColor: "gray", // Màu khi không active (Thêm dòng này)
          tabBarStyle: {
            marginBottom: 15,
            height: 75,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#FFFFFF",
            paddingBottom: 10,
            paddingTop: 10,
          },
          tabBarIcon: ({ color }) => (
            <IconComponent name={iconName} size={24} color={color} />
          ),
        };
      }}
    >
      <Tabs.Screen
        name="HomeScreen"
        options={{
          tabBarLabel: "Trang chủ",
          headerTitleStyle: {
            fontFamily: fonts["BeVietNamPro-SemiBold"],
            fontSize: 12,
          },
        }}
      />
      <Tabs.Screen
        name="CalendarScreen"
        options={{
          tabBarLabel: "Lịch",
          headerTitleStyle: {
            fontFamily: fonts["BeVietNamPro-SemiBold"],
            fontSize: 12,
          },
        }}
      />
      <Tabs.Screen
        name="ProfileScreen"
        options={{
          tabBarLabel: "Hồ sơ",
          headerTitleStyle: {
            fontFamily: fonts["BeVietNamPro-SemiBold"],
            fontSize: 12,
          },
        }}
      />
      <Tabs.Screen
        name="PersonalScreen"
        options={{
          tabBarLabel: "Cá nhân",
          headerTitleStyle: {
            fontFamily: fonts["BeVietNamPro-SemiBold"],
            fontSize: 12,
          },
        }}
      />
    </Tabs>
  );
}

export default TabLayout;
