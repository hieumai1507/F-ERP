import { ImageBackground, Text, View, SafeAreaView } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

import CustomButton from '@/components/custombutton';
import AppGradient from '@/components/AppGradient';
import { useRouter } from 'expo-router';

const App = () => {
  const router = useRouter();
  
  const handleGetStarted = () => {
    router.push('/LoginScreen'); // Điều hướng đến màn hình Login với tên mới
  };

  return (
    <View className="flex-1">
      <AppGradient colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.8)"]}>
        <SafeAreaView className='flex-1 mx-5 my-12 justify-between'>
          <View>
            <Text className='text-center text-white font-bold text-4xl'>Welcome to F-ERP</Text>
          </View>
          <View>
            <CustomButton
              onPress={handleGetStarted}
              title="Get Started"
            />
          </View>
          <StatusBar style="light" />
        </SafeAreaView>
      </AppGradient>
    </View>
  );
};

export default App;
