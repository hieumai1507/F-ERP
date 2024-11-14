import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [userInfos, setUserInfos] = useState({});

  useEffect(() => {
    const fetchUserInfos = async () => {
      try {
        const response = await axios.get('http://192.168.50.52:5001/get-all-user');
        if (response.data.status === 'ok') {
          const userInfosMap = {};
          response.data.data.forEach(userInfo => {
            userInfosMap[userInfo.email] = userInfo;
          });
          setUserInfos(userInfosMap);
        } else {
          console.error('Error fetching user infos:', response.data.data);
        }
      } catch (error) {
        console.error("Error fetching user infos:", error);
      }
    };

    fetchUserInfos();
  }, []);

  return (
    <UserContext.Provider value={userInfos}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserInfos = () => React.useContext(UserContext);