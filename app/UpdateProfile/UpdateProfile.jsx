import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  SafeAreaView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useSelector } from "react-redux";
import { Avatar } from "react-native-paper";
import Back from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import * as FileSystem from "expo-file-system";
import fonts from "@/constants/fonts";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { SERVER_URI } from "../../utils/uri";

function UpdateProfile() {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [department, setDepartment] = useState("");
  const [mobile, setMobile] = useState("");
  const route = useRoute();
  const navigation = useNavigation();
  const [permissionStatus, setPermissionStatus] = useState(null);

  // Function to select photo

  const user = useSelector((state) => state.auth.user);
  const userEmail = user.email; // Get email directly from Redux

  useEffect(() => {
    (async () => {
      // check and request permission for both camera roll in one go
      const { status: cameraRollStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setPermissionStatus(cameraRollStatus);

      if (route.params?.data) {
        // Check if data exists
        const userData = route.params.data;
        setEmail(userData.email);
        setGender(userData.gender);
        setImage(userData.image);
        setDepartment(userData.department);
        setName(userData.name);
        setMobile(userData.mobile);
      }
    })();
  }, [route.params?.data]);

  //function select Photo
  const selectPhoto = async () => {
    if (permissionStatus !== "granted") {
      Alert.alert(
        "Permission Required",
        "This app needs access to your gallery. Please go to settings to grant access"
      );
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        return;
      } else {
        setPermissionStatus(status);
      }
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Image,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.canceled) {
        const asset = result.assets[0];

        setImage(asset.uri);
      }
    } catch (error) {
      console.warn("Error picking image:", error);
      Alert.alert("Error", "There was an error selecting your image.");
    }
  };

  //function updateProfile
  const updateProfile = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("mobile", mobile);
    formData.append("gender", gender);
    formData.append("department", department);
    if (image) {
      const uriParts = image.split(".");
      const fileType = uriParts[uriParts.length - 1];

      try {
        const info = await FileSystem.getInfoAsync(image);
        if (info.exists) {
          formData.append("image", {
            uri: image,
            name: `photo.${fileType}`,
            type: `image/${fileType}`,
          });
        } else {
          Alert.alert("Error", "Could not found image file.");
          return;
        }
      } catch (error) {
        console.error("File system error", error);
        Alert.alert("Error", "Error accessing image file");
      }
    }

    try {
      const res = await axios.post(`${SERVER_URI}/update-user`, {
        // Use correct IP if different
        name,
        mobile,
        gender,
        department,
        image, // Send base64 image data
        email: userEmail,
      });

      if (res.data.status === "Ok") {
        Toast.show({ type: "success", text1: "Updated" });
        //
        setTimeout(() => {
          Alert.alert("Thành công!", "Cập nhật hồ sơ thành công!", [
            { text: "OK", onPress: () => navigation.goBack() },
          ]);
        }, 1000); //
      } else {
        // Handle errors and display specific error messages
        Toast.show({
          type: "error",
          text1: "Update Failed",
          text2: res.data.data || "Something went wrong",
        });
        console.error("Server Error:", res.data.data || "Something went wrong");
        Alert.alert("Update Failed", res.data.data || "Something went wrong"); // hiển thị cảnh báo
      }
    } catch (error) {
      // Handle network or other errors
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: "Network error or server issue",
      });
      console.error("Error updating profile:", error);

      if (error.response) {
        console.error("Server responded with:", error.response.data); // Log detailed server error
        Alert.alert(
          "Update Failed",
          error.response.data.data || "Server error"
        );
      } else if (error.request) {
        console.error("No response from server:", error.request); // Log the request
        Alert.alert("Update Failed", "No response from server");
      } else {
        console.error("Error setting up the request:", error.message);
        Alert.alert("Update Failed", error.message);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"} // Điều chỉnh behavior dựa trên hệ điều hành
      style={{ flex: 1 }} // Đảm bảo KeyboardAvoidingView chiếm toàn bộ màn hình
    >
      <SafeAreaView>
        <LinearGradient
          colors={["#033495", "#0654B2", "#005AB4", "#38B6FF"]}
          locations={[0, 0.16, 0.32, 1]} // Vị trí tương ứng với phần trăm
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }} // Hoặc điều chỉnh theo hướng gradient mong muốn
          className="w-full h-[109px] justify-between flex-row items-center"
        >
          <TouchableOpacity
            className=" ml-[15px] w-[30px] h-[30px]  border-none rounded-[6px] justify-center items-center"
            onPress={() => router.back()}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
            }}
          >
            <Ionicons name="chevron-back" size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <Text
            className="justify-center items-center text-[#FFFFFF] mr-[170px]"
            style={{
              fontFamily: fonts["BeVietNamPro-SemiBold"],
              fontSize: 16,
            }}
          >
            Edit Profile
          </Text>
        </LinearGradient>
      </SafeAreaView>
      <ScrollView
        keyboardShouldPersistTaps={"always"}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View>
          <View style={styles.camDiv}>
            <View style={styles.camIconDiv}>
              <Back
                name="camera"
                size={22}
                style={styles.cameraIcon}
                onPress={() => router.back()}
              />
            </View>

            <TouchableOpacity onPress={() => selectPhoto()}>
              <Avatar.Image
                size={140}
                style={styles.avatar}
                source={{
                  uri: image
                    ? image
                    : "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
                }}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              marginTop: 50,
              marginHorizontal: 22,
            }}
          >
            <View style={styles.infoEditView}>
              <Text style={styles.infoEditFirst_text}>Username</Text>
              <TextInput
                placeholder="Your Name"
                placeholderTextColor="#999797"
                style={styles.infoEditSecond_text}
                onChangeText={setName}
                value={name}
              />
            </View>

            <View style={styles.infoEditView}>
              <Text style={styles.infoEditFirst_text}>Email</Text>
              <TextInput
                editable={false}
                placeholder={user.email}
                placeholderTextColor={"#000000"}
                style={styles.infoEditSecond_text}
              />
            </View>

            <View style={styles.infoEditView}>
              <Text style={styles.infoEditFirst_text}>Gender:</Text>

              <View style={styles.genderButtonContainer}>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    gender === "Male" && styles.selectedGenderButton,
                  ]}
                  onPress={() => setGender("Male")}
                >
                  <Text
                    style={[
                      styles.genderButtonText,
                      gender === "Male" && styles.selectedGenderButtonText,
                    ]}
                  >
                    Male
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    gender === "Female" && styles.selectedGenderButton,
                  ]}
                  onPress={() => setGender("Female")}
                >
                  <Text
                    style={[
                      styles.genderButtonText,
                      gender === "Female" && styles.selectedGenderButtonText,
                    ]}
                  >
                    Female
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.infoEditView}>
              <Text style={styles.infoEditFirst_text}>Department</Text>
              <TextInput
                placeholder="Department"
                placeholderTextColor={"#999797"}
                keyboardType="default"
                maxLength={10}
                style={styles.infoEditSecond_text}
                onChangeText={setDepartment}
                defaultValue={department}
              />
            </View>

            <View style={styles.infoEditView}>
              <Text style={styles.infoEditFirst_text}>Mobile No</Text>
              <TextInput
                placeholder="Your Mobile No"
                placeholderTextColor={"#999797"}
                keyboardType="numeric"
                maxLength={10}
                style={styles.infoEditSecond_text}
                onChangeText={setMobile}
                defaultValue={mobile}
              />
            </View>
          </View>
          <View style={styles.button}>
            <TouchableOpacity
              onPress={() => updateProfile()}
              style={styles.inBut}
            >
              <View>
                <Text style={styles.textSign}>Update</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.5,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    height: 1000,
  },
  button: {
    alignItems: "center",
    marginTop: 0,
    alignItems: "center",
    textAlign: "center",
    marginTop: 30,
  },
  textSign: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  inBut: {
    width: "70%",
    backgroundColor: "#0B6CA7",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 50,
  },
  header: {
    backgroundColor: "#0163D2",
    flexDirection: "row",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    borderRadius: 80,
    marginTop: 50,
    backgroundColor: "white",
    height: 160,
    width: 160,
    padding: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    elevation: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  camDiv: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  camIconDiv: {
    position: "absolute",
    right: 142,
    zIndex: 1,
    bottom: 5,
    height: 36,
    width: 36,
    backgroundColor: "#0163D2",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 18,
  },
  cameraIcon: {
    color: "white",
  },
  backIcon: {
    marginLeft: 20,
    color: "white",
  },
  nameText: {
    color: "white",
    fontSize: 24,

    fontStyle: "normal",
    fontFamily: "Open Sans",
    fontWeight: "bold",
    textAlign: "center",
  },
  infoEditView: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "#e6e6e6",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 12,
  },
  infoEditFirst_text: {
    color: "#7d7c7c",
    fontSize: 16,
    fontWeight: "400",
    marginRight: 12,
  },
  infoEditSecond_text: {
    color: "black",
    fontStyle: "normal",
    fontFamily: "Open Sans",
    fontSize: 15,
    textAlignVertical: "center",
    textAlign: "right",
  },
  genderButtonContainer: {
    flexDirection: "row",
  },
  genderButton: {
    backgroundColor: "#e0e0e0", // Light gray
    borderRadius: 20, // Rounded buttons
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  selectedGenderButton: {
    backgroundColor: "#2196F3", // Blue for selected (adjust as needed)
  },
  genderButtonText: {
    fontSize: 14, // Slightly smaller font size
    color: "#333", // Dark gray
  },
  selectedGenderButtonText: {
    color: "white",
  },
});
export default UpdateProfile;
