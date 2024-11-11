import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Avatar } from 'react-native-paper';
import Back from 'react-native-vector-icons/Ionicons';
import { RadioButton } from 'react-native-paper';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

function UpdateProfile() {
  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [profession, setProfession] = useState('');
  const [mobile, setMobile] = useState('');
  const route = useRoute();

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

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  useEffect(() => {
    const userData = route.params.data;
    setEmail(userData.email);
    setGender(userData.gender);
    setImage(userData.image);
    setProfession(userData.profession);
    setName(userData.name);
    setMobile(userData.mobile);
  }, []);

  const updateProfile = () => {
    const formdata = { name, image, email, profession, mobile, gender };
    axios
      .post('http://192.168.50.52:5001/update-user', formdata)
      .then(res => {
        if (res.data.status === "Ok") {
          Toast.show({
            type: 'success',
            text1: 'Updated',
          });
        }
      });
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps={'always'}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <View>
        <View className="header flex-row">
          <View className="flex-1">
            <Back name="arrow-back" size={30} className="backIcon" />
          </View>
          <View className="flex-3">
            <Text className="nameText">Edit Profile</Text>
          </View>
          <View className="flex-1"></View>
        </View>

        <View className="camDiv">
          <View className="camIconDiv">
            <Back name="camera" size={22} className="cameraIcon" />
          </View>
          <TouchableOpacity onPress={selectPhoto}>
            <Avatar.Image
              size={140}
              className="avatar"
              source={{
                uri: image ? image : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQMAAADCCAMAAAB6zFdcAAAAM1BMVEXFzeD////Byt7L0uPByd7Q1+b7/P3j5/Dv8fbe4+3r7vTFzuDL0+P19/rn6/LZ3urW2+lU+LHUAAAFLklEQVR4nO2dC3arMAxEQXwCcfjsf7XPkLw2tEka5AEziu8CeuKpJVmyLLIskUgkEkdFbsT+HXEQKbNqOPWN59y72D9nd/z/vWqbOv/mozSY9n116vIl1acYg1++G9v+5/rzvMs+QwL/7x/O9a/lT5zL2D9uF7wAzcP1e+pP2AQi4/mZAJ6TfQ3EtY9N4D+jdQ2k6F8K4OltayDFKyP4cghmI6PzVvDnHrDuEqR9UwFPY1IEufw+C72yh8LeIUFOaxSY6K0dFt2qTXDDVJCUi0IBT2vHHmTUSWAnPjgZtBJ4p2BjJ4RIYCSHlCpEAi+CAXMowiSwIIJoguKSE7k5rD8aPWDg3gnKg8EPLrGXEUL5tGC2ijr2OkIIjAlfEJdVBLMNcmprQEnAW09YUzT5C9aNADgbfMGaPQlOgrwj1cAlDZIGGVYD2ktIpAasiRNQgzxpkOektoCMjUkDT+zFaEFqwNqohtSgiL0YHcHlVAMaoCooM6SJo/qK7RGk+yBpkGVBl2w2NAi7aEwamNEAWE5MGiQNkgZJg6RB0sCEBoj+C3YN0j5IGkyks3LKnSegdaSkQdIgaUCtwcf7RJHy02OjVG3/+knvSlxJd+uK7Emb6eqOrQVBoJvgCtu16xYasF23QXsPWDVI+yArN9CALTyW6LhAqAE8NuaEcQH2fOMbtkNS+e7IC8MaYIuJM3TnRGwxcYbvPQ+0eDBD95TFIRv3rwyx17Qa/EGRbmqSAz1xvSP2ktaDvW3MOV9xoJ0i43tftEPgc4n4U1Ls9ajAbgTOkSCh02AW1GxJ4w2gCKwSIAspF0pLmIB5BNaXvhnwnMSXMn6DqrBzBoUrqKoiXdp8B6qqWMVeSADyzijhNyDeBiinyOwSUc95uAemYZ66sl0wLYGcFPmK6gsgCTRzZJxAlJe5TQFyQiA3hQxRVuSOChPBXrEW2trBf/RDts1sg+C8iXZA1oKwc9IY++dDCDojUKcKd5T67JF6ou4C9SHBhjO4os2hiWupv1Hm0JY00LpFKx5xQmsLpjRQdisy19R/om3MsaSB9rxsSgOdBKY00E5SZOxBeoa2kGJJA+01gyEN1JmjJQ20jxnYq+p3qPNGQxqo66qtHQ3UfUlJA0MalKJ+8NnyPfh/hFzOnbpFr6vP7JeNGaALw0BJMfzemT4+IhqSYq8hFESDInNj3ky4BPSXroieLPZDAuI7nuROsUS84iAvqKmT5gWxVxEIQgJuY8BsA+6NgPmyMXVkQHXuM+cMuBEIjO98Z4K78r5pOFtVpWiRn7Qd+aop5QU9AqJuMyYVRKoNJkT58OD/cuy1vYUX4LTBvLgrzVAcXwYpthPgSjcc2ybkgjoRvKQvjqrCVl7gEU11RJMQGTeYFvicbjyaCnsrMFG3R1JBsnZjR/hEhf4gJiHi0NOg1nCOL8OejvAJ3RBTBScy7O4GHlCfXCwV4hrBkvMlQmYpZXQjWLJ7sJTyEEawZNfMsowUC/+m38kxiNtgbDCMZgfHIMUuaVEA3cYnBnx5aAu8e9xMASkYFJjoNpo/K+7oVnBPg68xuKw8zoHoPXp0pCzHg0bDV0CTa3EsjmBJjUunsB9u35Ua08wkGecmuIEIEVIReoIFwTf38JHhEQgcxuqOlx4qCBFBCnY7uKH/uhV0SHRU9CNFUO1EB0A9TMKIIczoggP+QxpRUQ0cM+MMrmiezG7x0bmoKDYCZhLqgVjf8WvhfLhkfaPnFt/di8zq6XNbfIczMqsHDW3xTdrYPFvrP7kiUsVMV4ODAAAAAElFTkSuQmCC',
              }}
            />
          </TouchableOpacity>
        </View>

        <View className="infoEditContainer mt-50 mx-22">
          <Text className="inputTitle">Name</Text>
          <TextInput
            placeholder="Name"
            className="textInput"
            onChangeText={setName}
            value={name}
          />
        </View>

        <View className="infoEditContainer mt-50 mx-22">
          <Text className="inputTitle">Email</Text>
          <TextInput
            placeholder="Email"
            className="textInput"
            onChangeText={setEmail}
            value={email}
          />
        </View>

        <View className="infoEditContainer mt-50 mx-22">
          <Text className="inputTitle">Gender</Text>
          <RadioButton.Group
            onValueChange={setGender}
            value={gender}
          >
            <View className="flexRow">
              <View className="flexRow radioDiv">
                <RadioButton value="Male" />
                <Text>Male</Text>
              </View>
              <View className="flexRow radioDiv">
                <RadioButton value="Female" />
                <Text>Female</Text>
              </View>
            </View>
          </RadioButton.Group>
        </View>

        <View className="infoEditContainer mt-50 mx-22">
          <Text className="inputTitle">Mobile</Text>
          <TextInput
            placeholder="Mobile"
            className="textInput"
            onChangeText={setMobile}
            value={mobile}
          />
        </View>

        <View className="infoEditContainer mt-50 mx-22">
          <Text className="inputTitle">Profession</Text>
          <TextInput
            placeholder="Profession"
            className="textInput"
            onChangeText={setProfession}
            value={profession}
          />
        </View>

        <TouchableOpacity className="submitBtn">
          <Text className="submitBtnText">Update Profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default UpdateProfile;
