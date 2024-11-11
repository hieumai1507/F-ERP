import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const loginUser = async (user) => {
  try {
      const response = await axios.post(
          "http://192.168.1.30:5001/login-user",
          user,
          {
              headers: {
                  "Content-Type": "application/json",
              },
              timeout: 10000, // Set a timeout
          }
      );
      return response.data;
  } catch (error) {
      console.error("Login error:", error);
      if (error.response && error.response.status === 502) {
          alert("Server error. Please try again later.");  // Or a more user-friendly in-app message
      }
      throw error; // Re-throw to be handled by the calling function
  }
};
export const registerUser = async (user) => {
  console.log(user);
  const response = await axios.post(
    "https://metal-sheep-guess.loca.lt/api/users/register",
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
  const token = await AsyncStorage.getItem("token"); // Use await here

  if (!token) {
    throw new Error("Not logged in");
  }

  try {
    const response = await axios.get(
      "https://metal-sheep-guess.loca.lt/api/users/profile",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000, // Set a timeout (e.g., 10 seconds)
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);

    if (error.response && (error.response.status === 401 || error.response.status === 504)) {
      // Handle both 401 and 504
      if (error.response.status === 401) {
        await AsyncStorage.removeItem('token'); // Use await here
      }
       // If 504, inform the user about the server issue.
      if(error.response.status === 504){
          alert("Server is unavailable. Please try again later."); //Or a more user-friendly in-app message
      }

    }
    // Re-throw the error so the calling function can handle it as needed
    throw error; 
  }
};