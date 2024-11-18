import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import {Avatar} from 'react-native-paper';
import Back from 'react-native-vector-icons/Ionicons';
import {RadioButton} from 'react-native-paper';
import axios from 'axios';
import {useRoute} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
const height = Dimensions.get('window').height * 1;
function UpdateProfile() {
  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [department, setDepartment] = useState('');
  const [mobile, setMobile] = useState('');
  const route = useRoute();
  const navigation = useNavigation();
  // Function to select photo
  const selectPhoto = async () => {
    // Request permission to access camera roll (if needed)
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access gallery is required!');
      return;
    }

    // Open the image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // You can set aspect ratio to crop image
      quality: 1, // Image quality
    });

    if (!result.canceled) {
      setImage(result.uri);
    }
  };

 
  useEffect(() => {
    if (route.params?.data) { // Check if data exists
    const userData = route.params.data;
    setEmail(userData.email);
    setGender(userData.gender);
    setImage(userData.image);
    setDepartment(userData.department);
    setName(userData.name);
    setMobile(userData.mobile);
  }
  },[route.params?.data]);
  const updateProfile = async () => { 
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('mobile', mobile);
    formData.append('gender', gender);
    formData.append('department', department);
    if (image) {
      const uriParts = image.split('.');
      const fileType = uriParts[uriParts.length - 1];

        try {
          const info = await FileSystem.getInfoAsync(image);
          if (info.exists) {
              formData.append('image', {
                uri: image,
                name: `photo.${fileType}`,
                type: `image/${fileType}`,
             });
          } else {
              throw new Error("File does not exist in local file system")
          }
      } catch (error) {
          console.log(error.message);
      }
    }

    try {
      const res = await axios.post('http://192.168.50.53:5001/update-user', formData, { // Use correct IP if different
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.status === "Ok") {
        Toast.show({ type: 'success', text1: 'Updated' });
        navigation.goBack();
      } else {
        // Handle errors and display specific error messages
        Toast.show({
          type: 'error',
          text1: 'Update Failed',
          text2: res.data.data || 'Something went wrong',
        });
        console.error("Server Error:", res.data.data || 'Something went wrong');
      }
    } catch (error) {
      // Handle network or other errors
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: 'Network error or server issue',
      });
      console.error("Error updating profile:", error);

        if (error.response) {
          console.error("Server responded with:", error.response.data); // Log detailed server error
          Alert.alert('Update Failed', error.response.data || 'Server error');
      } else if (error.request) {
          console.error("No response from server:", error.request); // Log the request
          Alert.alert('Update Failed', 'No response from server');

      } else {
          console.error("Error setting up the request:", error.message);
          Alert.alert('Update Failed', error.message);

      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Điều chỉnh behavior dựa trên hệ điều hành
      style={{ flex: 1 }} // Đảm bảo KeyboardAvoidingView chiếm toàn bộ màn hình
    >
      <ScrollView
        keyboardShouldPersistTaps={'always'}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 40}}>
        <View>
          <View style={styles.header}>
            <View style={{flex: 1}}>
            <TouchableOpacity onPress={() => navigation.goBack()} className="mr-2">
              <Ionicons name="chevron-back" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <View style={{flex: 3}}>
              <Text style={styles.nameText}>Edit Profile</Text>
            </View>
            <View style={{flex: 1}}></View>
          </View>
          <View style={styles.camDiv}>
            <View style={styles.camIconDiv}>
              <Back name="camera" size={22} style={styles.cameraIcon} onPress={() => route.back()} />
            </View>

            <TouchableOpacity onPress={() => selectPhoto()}>
              <Avatar.Image
                size={140}
                style={styles.avatar}
                source={{
                  uri:
                  image==""|| image==null
                      ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQMAAADCCAMAAAB6zFdcAAAAM1BMVEXFzeD////Byt7L0uPByd7Q1+b7/P3j5/Dv8fbe4+3r7vTFzuDL0+P19/rn6/LZ3urW2+lU+LHUAAAFLklEQVR4nO2dC3arMAxEQXwCcfjsf7XPkLw2tEka5AEziu8CeuKpJVmyLLIskUgkEkdFbsT+HXEQKbNqOPWN59y72D9nd/z/vWqbOv/mozSY9n116vIl1acYg1++G9v+5/rzvMs+QwL/7x/O9a/lT5zL2D9uF7wAzcP1e+pP2AQi4/mZAJ6TfQ3EtY9N4D+jdQ2k6F8K4OltayDFKyP4cghmI6PzVvDnHrDuEqR9UwFPY1IEufw+C72yh8LeIUFOaxSY6K0dFt2qTXDDVJCUi0IBT2vHHmTUSWAnPjgZtBJ4p2BjJ4RIYCSHlCpEAi+CAXMowiSwIIJoguKSE7k5rD8aPWDg3gnKg8EPLrGXEUL5tGC2ijr2OkIIjAlfEJdVBLMNcmprQEnAW09YUzT5C9aNADgbfMGaPQlOgrwj1cAlDZIGGVYD2ktIpAasiRNQgzxpkOektoCMjUkDT+zFaEFqwNqohtSgiL0YHcHlVAMaoCooM6SJo/qK7RGk+yBpkGVBl2w2NAi7aEwamNEAWE5MGiQNkgZJg6RB0sCEBoj+C3YN0j5IGkyks3LKnSegdaSkQdIgaUCtwcf7RJHy02OjVG3/+knvSlxJd+uK7Emb6eqOrQVBoJvgCtu16xYasF23QXsPWDVI+yArN9CALTyW6LhAqAE8NuaEcQH2fOMbtkNS+e7IC8MaYIuJM3TnRGwxcYbvPQ+0eDBD95TFIRv3rwyx17Qa/EGRbmqSAz1xvSP2ktaDvW3MOV9xoJ0i43tftEPgc4n4U1Ls9ajAbgTOkSCh02AW1GxJ4w2gCKwSIAspF0pLmIB5BNaXvhnwnMSXMn6DqrBzBoUrqKoiXdp8B6qqWMVeSADyzijhNyDeBiinyOwSUc95uAemYZ66sl0wLYGcFPmK6gsgCTRzZJxAlJe5TQFyQiA3hQxRVuSOChPBXrEW2trBf/RDts1sg+C8iXZA1oKwc9IY++dDCDojUKcKd5T67JF6ou4C9SHBhjO4os2hiWupv1Hm0JY00LpFKx5xQmsLpjRQdisy19R/om3MsaSB9rxsSgOdBKY00E5SZOxBeoa2kGJJA+01gyEN1JmjJQ20jxnYq+p3qPNGQxqo66qtHQ3UfUlJA0MalKJ+8NnyPfh/hFzOnbpFr6vP7JeNGaALw0BJMfzemT4+IhqSYq8hFESDInNj3ky4BPSXroieLPZDAuI7nuROsUS84iAvqKmT5gWxVxEIQgJuY8BsA+6NgPmyMXVkQHXuM+cMuBEIjO98Z4K78r5pOFtVpWiRn7Qd+aop5QU9AqJuMyYVRKoNJkT58OD/cuy1vYUX4LTBvLgrzVAcXwYpthPgSjcc2ybkgjoRvKQvjqrCVl7gEU11RJMQGTeYFvicbjyaCnsrMFG3R1JBsnZjR/hEhf4gJiHi0NOg1nCOL8OejvAJ3RBTBScy7O4GHlCfXCwV4hrBkvMlQmYpZXQjWLJ7sJTyEEawZNfMsowUC/+m38kxiNtgbDCMZgfHIMUuaVEA3cYnBnx5aAu8e9xMASkYFJjoNpo/K+7oVnBPg68xuKw8zoHoPXp0pCzHg0bDV0CTa3EsjmBJjUunsB9u35Ua08wkGecmuIEIEVIReoIFwTf38JHhEQgcxuqOlx4qCBFBCnY7uKH/uhV0SHRU9CNFUO1EB0A9TMKIIczoggP+QxpRUQ0cM+MMrmiezG7x0bmoKDYCZhLqgVjf8WvhfLhkfaPnFt/di8zq6XNbfIczMqsHDW3xTdrYPFvrP7kiUsVMV4ODAAAAAElFTkSuQmCC'
                      : image,
                }}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              marginTop: 50,
              marginHorizontal: 22,
            }}>
            <View style={styles.infoEditView}>
              <Text style={styles.infoEditFirst_text}>Username</Text>
              <TextInput
                placeholder="Your Name"
                placeholderTextColor={'#999797'}
                style={styles.infoEditSecond_text}
                onChange={setName}
                value={name}
              />
            </View>

            <View style={styles.infoEditView}>
              <Text style={styles.infoEditFirst_text}>Email</Text>
              <TextInput
                editable={false}
                placeholder="Your Email"
                placeholderTextColor={'#999797'}
                style={styles.infoEditSecond_text}
                onChange={e => setEmail(e.nativeEvent.text)}
                defaultValue={email}
              />
            </View>

            <View style={styles.infoEditView}>
              <Text style={styles.infoEditFirst_text}>Gender:</Text>

              <View style={styles.genderButtonContainer}>
                <TouchableOpacity
                  style={[styles.genderButton, gender === 'Male' && styles.selectedGenderButton]}
                  onPress={() => setGender('Male')}
                >
                  <Text style={[styles.genderButtonText, gender === 'Male' && styles.selectedGenderButtonText]}>Male</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.genderButton, gender === 'Female' && styles.selectedGenderButton]}
                  onPress={() => setGender('Female')}
                >
                  <Text style={[styles.genderButtonText, gender === 'Female' && styles.selectedGenderButtonText]}>Female</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.infoEditView}>
              <Text style={styles.infoEditFirst_text}>Department</Text>
              <TextInput
                placeholder="Department"
                placeholderTextColor={'#999797'}
                keyboardType="default"
                maxLength={10}
                style={styles.infoEditSecond_text}
                onChange={e => setDepartment(e.nativeEvent.text)}
                defaultValue={department}
              />
            </View>

            <View style={styles.infoEditView}>
              <Text style={styles.infoEditFirst_text}>Mobile No</Text>
              <TextInput
                placeholder="Your Mobile No"
                placeholderTextColor={'#999797'}
                keyboardType="numeric"
                maxLength={10}
                style={styles.infoEditSecond_text}
                onChange={e => setMobile(e.nativeEvent.text)}
                defaultValue={mobile}
              />
            </View>
          </View>
          <View style={styles.button}>
            <TouchableOpacity
              onPress={() => updateProfile()}
              style={styles.inBut}>
              <View>
                <Text style={styles.textSign}>Update Profile</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.5,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    height: 1000,
  },
  button: {
    alignItems: 'center',
    marginTop: 0,
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 30,
  },
  textSign: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  inBut: {
    width: '70%',
    backgroundColor: '#0163D2',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 50,
  },
  header: {
    backgroundColor: '#0163D2',
    flexDirection: 'row',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    borderRadius: 80,
    marginTop: 50,
    backgroundColor: 'white',
    height: 160,
    width: 160,
    padding: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camDiv: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  camIconDiv: {
    position: 'absolute',
    right: 142,
    zIndex: 1,
    bottom: 5,
    height: 36,
    width: 36,
    backgroundColor: '#0163D2',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
  },
  cameraIcon: {
    color: 'white',
  },
  backIcon: {
    marginLeft: 20,
    color: 'white',
  },
  nameText: {
    color: 'white',
    fontSize: 24,

    fontStyle: 'normal',
    fontFamily: 'Open Sans',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoEditView: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#e6e6e6',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 12,
  },
  infoEditFirst_text: {
    color: '#7d7c7c',
    fontSize: 16,
    fontWeight: '400',
    marginRight: 12,
  },
  infoEditSecond_text: {
    color: 'black',
    fontStyle: 'normal',
    fontFamily: 'Open Sans',
    fontSize: 15,
    textAlignVertical: 'center',
    textAlign: 'right',
  },
  genderButtonContainer: {
    flexDirection: 'row',
  },
  genderButton: {
    backgroundColor: '#e0e0e0', // Light gray
    borderRadius: 20, // Rounded buttons
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  selectedGenderButton: {
    backgroundColor: '#2196F3', // Blue for selected (adjust as needed)
  },
  genderButtonText: {
    fontSize: 14, // Slightly smaller font size
    color: '#333', // Dark gray
  },
  selectedGenderButtonText: {
    color: 'white',
  },
});
export default UpdateProfile;
