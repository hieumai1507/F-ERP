import axios from "axios";


export const loginUser = async (user) => {
  const response = await axios.post(
    " https://moody-eagles-occur.loca.lt/api/users/login",
    user,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};