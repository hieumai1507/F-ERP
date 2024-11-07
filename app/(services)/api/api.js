import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const loginUser = async (user) => {
  const response = await axios.post(
    "https://swift-worms-knock.loca.lt/api/users/login",
    user,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};
export const registerUser = async (user) => {
  console.log(user);
  const response = await axios.post(
    "https://swift-worms-knock.loca.lt/api/users/register",
    user,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};
export const getProfile = async () => {
  const token = AsyncStorage.getItem("token"); // Hoặc AsyncStorage.getItem("token")

  if (!token) {
    // Xử lý trường hợp không có token (chưa đăng nhập): Ví dụ: redirect đến màn hình đăng nhập
    throw new Error("Not logged in"); 
  }


  try {

    const response = await axios.get(
      "https://swift-worms-knock.loca.lt/api/users/profile",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );



    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);

    if (error.response && error.response.status === 401) {


      AsyncStorage.removeItem('token');

    }


    throw error;

  }
};