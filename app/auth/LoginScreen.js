import { Image, View,
  TextInput,
  Text,
  TouchableOpacity  } from 'react-native';
import React, { useEffect } from 'react';
import { useRouter } from "expo-router";
import * as Yup from "yup";
import { Formik } from "formik";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../(services)/api/api";
import { useDispatch, useSelector } from "react-redux";
import { loginAction } from "../(redux)/authSlice";


const LoginSchema = Yup.object().shape({
  PhoneNumber: Yup.string()
    .matches(/^\d+$/, "Số điện thoại chỉ chứa số") // Kiểm tra rằng chỉ chứa số
    .min(10, "Số điện thoại quá ngắn!") // Đặt độ dài tối thiểu cho số điện thoại
    .max(15, "Số điện thoại quá dài!") // Đặt độ dài tối đa cho số điện thoại
    .required("Số điện thoại là bắt buộc"), // Yêu cầu trường này

  password: Yup.string()
    .min(6, "Mật khẩu quá ngắn!") // Đặt độ dài tối thiểu cho mật khẩu
    .required("Mật khẩu là bắt buộc"), // Yêu cầu trường này
});
const LoginScreen = () => {
  const router = useRouter();
  //dispatch
  const dispatch = useDispatch();
  const mutation = useMutation({
    mutationFn: loginUser,
    mutationKey: ["login"],
  });
  // console.log(mutation);
  const user = useSelector((state) => state.auth.user);
  useEffect(() => {
    if (user) {
      router.push("/(tabs)");
    }
  }, []);
  console.log("user", user);

  return (
    <View className="flex-1 bg-gray-100 justify-center p-4">
      <View className="items-center mb-10">
        <Image source={require('@/assets/images/F-ERP_Logo.png')} className="w-24 h-24 mb-5" />
        <Text className="text-2xl font-bold text-gray-800">F-ERP chào mừng bạn!</Text>
      </View>
      <Formik
        initialValues={{ PhoneNumber: "0123456789", password: "123456" }}
        validationSchema={LoginSchema}
        onSubmit={(values) => {
          console.log(values);
          mutation
            .mutateAsync(values)
            .then((data) => {
              console.log("data", data);
              dispatch(loginAction(data));
            })
            .catch((err) => {
              console.log(err);
            });
          router.push("/(tabs)");
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
      <View className="px-5">
        <View className="mb-5">
          <Text className="text-lg text-gray-700">
            Số điện thoại <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            className="h-12 border border-blue-500 rounded-lg px-3 bg-white"
            placeholder="Số điện thoại"
            placeholderTextColor="#888888"
            onBlur={handleBlur("PhoneNumber")}
            value={values.PhoneNumber}
            onChangeText={handleChange("PhoneNumber")}
            keyboardType="phone-pad"
            
          />
          {errors.PhoneNumber && touched.PhoneNumber ? (
              <Text className="text-red-500">{errors.PhoneNumber}</Text>
            ) : null}
        </View>

        <View className="mb-5">
          <Text className="text-lg text-gray-700">
            Mật khẩu <Text className="text-red-500">*</Text>
          </Text>
          <View className="relative">
            <TextInput
              className="h-12 border border-blue-500 rounded-lg px-3 bg-white"
              placeholder="Mật khẩu"
              placeholderTextColor="#888888"
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              secureTextEntry
            />
            {errors.password && touched.password ? (
              <Text className="text-red-500">{errors.password}</Text>
            ) : null}
          </View>
        </View>

        <View className="items-center">
          <TouchableOpacity  className="bg-blue-500 py-3 rounded-lg w-full items-center" onPress={handleSubmit}>
            <Text className="text-white text-lg font-bold">Đăng Nhập</Text>
          </TouchableOpacity>
        </View>
      </View>
      )}
      </Formik>
    </View>
  );
};

export default LoginScreen;