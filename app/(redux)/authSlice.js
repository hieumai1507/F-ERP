import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk } from "@reduxjs/toolkit";
// Function to load user from AsyncStorage
const loadUserFromStorage = async () => {
  try {
    const userInfo = await AsyncStorage.getItem("userInfo");
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error("Failed to load user info", error);
    return null;
  }
};

const initialState = {
  user: null,
  loading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    userType: null,
  },
  reducers: {
    loginAction: (state, action) => {
      state.user = action.payload;
      state.loading = false;
      AsyncStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    logoutAction: (state) => {
      state.user = null;
      state.userType = null; // Also clear userType
      state.loading = false;
      AsyncStorage.removeItem("userInfo");
      AsyncStorage.removeItem("token");
      AsyncStorage.removeItem("isLoggedIn");
      AsyncStorage.removeItem("userType"); // Remove userType from AsyncStorage as well
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setUserType: (state, action) => {
      state.userType = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },

    clearUser: (state) => {
      // New reducer for clearing all user data
      state.user = null;
      state.userType = null;
      state.token = null;
    },
  },
});

export const {
  loginAction,
  logoutAction,
  setUser,
  setLoading,
  setUserType,
  setToken,
  clearUser,
} = authSlice.actions;

export default authSlice.reducer;

// Thunk to load user from AsyncStorage when the app starts
export const loadUser = () => async (dispatch) => {
  const user = await loadUserFromStorage();
  if (user) {
    console.log("Loaded user from AsyncStorage:", user);
    dispatch(setUser(user));
  } else {
    console.log("No user found in AsyncStorage");
    dispatch(setLoading(false));
  }
};
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${SERVER_URI}/auth/login`, {
        email,
        password,
      });
      return response.data; // Trả về dữ liệu nếu đăng nhập thành công
    } catch (error) {
      return rejectWithValue(error.response.data); // Trả về lỗi nếu có
    }
  }
);

export const logoutUser = () => async (dispatch) => {
  try {
    await AsyncStorage.clear();
    dispatch(clearUser());
  } catch (error) {
    console.error("Error logging out:", error);
  }
};
