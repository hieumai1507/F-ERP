import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, Image, FlatList,Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native'; // Import TouchableOpacity
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'; // Import TabView 


function AdminScreen({navigation}) {
  const [userData, setUserData] = useState('');
  const [allUserData, setAllUserData] = useState('');
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [index, setIndex] = useState(0); // State for the active tab
  const [routes] = useState([
    { key: 'users', title: 'Users' },
    { key: 'requests', title: 'Leave Requests' }, // New tab for leave requests
  ]);
  const [userInfos, setUserInfos] = useState({}); // Store user info for quick lookup
  async function getAllData() {
    axios.get('http://192.168.50.52:5001/get-all-user').then(res => {
      console.log(res.data);
      setAllUserData(res.data.data);
    });
  }

  async function getData() {
    const token = await AsyncStorage.getItem('token');
    console.log(token);
    axios
      .post('http://192.168.50.52:5001/userdata', {token: token})
      .then(res => {
        console.log(res.data);
        setUserData(res.data.data);
      });
  }
  useEffect(() => {
    getData();
    getAllData();
  }, []);
  function signOut() {
    AsyncStorage.setItem('isLoggedIn', '');
    AsyncStorage.setItem('token', '');
    AsyncStorage.setItem('userType', '');
    router.push("/Login/LoginScreen");
  }

  function deleteUser(data) {
    axios
      .post('http://192.168.50.52:5001/delete-user', {id: data._id})
      .then(res => {
        console.log(res.data);
        if(res.data.status=="Ok"){
          Alert.alert("User deleted");
          getAllData();
        }
      });
  }

  const UserCard = ({data}) => (
    <View style={styles.card}>
      <Image
        source={{
          uri:
            data.image == '' || data.image == null
              ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQMAAADCCAMAAAB6zFdcAAAAM1BMVEXFzeD////Byt7L0uPByd7Q1+b7/P3j5/Dv8fbe4+3r7vTFzuDL0+P19/rn6/LZ3urW2+lU+LHUAAAFLklEQVR4nO2dC3arMAxEQXwCcfjsf7XPkLw2tEka5AEziu8CeuKpJVmyLLIskUgkEkdFbsT+HXEQKbNqOPWN59y72D9nd/z/vWqbOv/mozSY9n116vIl1acYg1++G9v+5/rzvMs+QwL/7x/O9a/lT5zL2D9uF7wAzcP1e+pP2AQi4/mZAJ6TfQ3EtY9N4D+jdQ2k6F8K4OltayDFKyP4cghmI6PzVvDnHrDuEqR9UwFPY1IEufw+C72yh8LeIUFOaxSY6K0dFt2qTXDDVJCUi0IBT2vHHmTUSWAnPjgZtBJ4p2BjJ4RIYCSHlCpEAi+CAXMowiSwIIJoguKSE7k5rD8aPWDg3gnKg8EPLrGXEUL5tGC2ijr2OkIIjAlfEJdVBLMNcmprQEnAW09YUzT5C9aNADgbfMGaPQlOgrwj1cAlDZIGGVYD2ktIpAasiRNQgzxpkOektoCMjUkDT+zFaEFqwNqohtSgiL0YHcHlVAMaoCooM6SJo/qK7RGk+yBpkGVBl2w2NAi7aEwamNEAWE5MGiQNkgZJg6RB0sCEBoj+C3YN0j5IGkyks3LKnSegdaSkQdIgaUCtwcf7RJHy02OjVG3/+knvSlxJd+uK7Emb6eqOrQVBoJvgCtu16xYasF23QXsPWDVI+yArN9CALTyW6LhAqAE8NuaEcQH2fOMbtkNS+e7IC8MaYIuJM3TnRGwxcYbvPQ+0eDBD95TFIRv3rwyx17Qa/EGRbmqSAz1xvSP2ktaDvW3MOV9xoJ0i43tftEPgc4n4U1Ls9ajAbgTOkSCh02AW1GxJ4w2gCKwSIAspF0pLmIB5BNaXvhnwnMSXMn6DqrBzBoUrqKoiXdp8B6qqWMVeSADyzijhNyDeBiinyOwSUc95uAemYZ66sl0wLYGcFPmK6gsgCTRzZJxAlJe5TQFyQiA3hQxRVuSOChPBXrEW2trBf/RDts1sg+C8iXZA1oKwc9IY++dDCDojUKcKd5T67JF6ou4C9SHBhjO4os2hiWupv1Hm0JY00LpFKx5xQmsLpjRQdisy19R/om3MsaSB9rxsSgOdBKY00E5SZOxBeoa2kGJJA+01gyEN1JmjJQ20jxnYq+p3qPNGQxqo66qtHQ3UfUlJA0MalKJ+8NnyPfh/hFzOnbpFr6vP7JeNGaALw0BJMfzemT4+IhqSYq8hFESDInNj3ky4BPSXroieLPZDAuI7nuROsUS84iAvqKmT5gWxVxEIQgJuY8BsA+6NgPmyMXVkQHXuM+cMuBEIjO98Z4K78r5pOFtVpWiRn7Qd+aop5QU9AqJuMyYVRKoNJkT58OD/cuy1vYUX4LTBvLgrzVAcXwYpthPgSjcc2ybkgjoRvKQvjqrCVl7gEU11RJMQGTeYFvicbjyaCnsrMFG3R1JBsnZjR/hEhf4gJiHi0NOg1nCOL8OejvAJ3RBTBScy7O4GHlCfXCwV4hrBkvMlQmYpZXQjWLJ7sJTyEEawZNfMsowUC/+m38kxiNtgbDCMZgfHIMUuaVEA3cYnBnx5aAu8e9xMASkYFJjoNpo/K+7oVnBPg68xuKw8zoHoPXp0pCzHg0bDV0CTa3EsjmBJjUunsB9u35Ua08wkGecmuIEIEVIReoIFwTf38JHhEQgcxuqOlx4qCBFBCnY7uKH/uhV0SHRU9CNFUO1EB0A9TMKIIczoggP+QxpRUQ0cM+MMrmiezG7x0bmoKDYCZhLqgVjf8WvhfLhkfaPnFt/di8zq6XNbfIczMqsHDW3xTdrYPFvrP7kiUsVMV4ODAAAAAElFTkSuQmCC'
              : data.image,
        }}
        style={styles.image}
      />
      <View style={styles.cardDetails}>
        <Text style={styles.name}>{data.name}</Text>
        <Text style={styles.email}>{data.email}</Text>
        <Text style={styles.userType}>{data.userType}</Text>
      </View>
      <View>
        <Icon
          name="delete"
          size={30}
          color="black"
          onPress={() => deleteUser(data)}
        />
      </View>
    </View>
  );

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const response = await axios.get('http://192.168.50.52:5001/get-all-leave-requests'); // Get all leave requests

        if (response.data.status === 'ok') {
          setLeaveRequests(response.data.data);
        } else {
          console.error('Error fetching leave requests:', response.data.data);
        }
      } catch (error) {
        console.error("Error fetching leave requests:", error);
      }
    };

    fetchLeaveRequests();

    const fetchUserInfos = async () => { // Fetch all user info
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

    }
    fetchUserInfos();
  }, []);



  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      const response = await axios.post('http://192.168.50.52:5001/update-leave-request-status', {
        requestId,
        status: newStatus
      });

      if (response.data.status === 'ok') {
        // Update the leave request in the state
        setLeaveRequests(prevRequests =>
          prevRequests.map(request =>
            request._id === requestId ? response.data.data : request
          )
        );

        Alert.alert('Status updated successfully'); // Show success message

      } else {
        console.error("Error updating status:", response.data.data);
        Alert.alert('Error updating status', 'Please try again'); // Show error message
      }
    } catch (error) {
      console.error("Error updating status:", error);
      Alert.alert('Error updating status', 'Please try again'); // Show error message

    }

  }
  


const renderLeaveRequest = ({ item }) => {
  
  const creatorInfo = userInfos[item.userEmail]; // Get creator info

  return (
  <View style={styles.card}>
  <View style={styles.cardDetails}>
    <Text style={styles.requestInfo}>Request ID: {item._id}</Text>
    {creatorInfo && ( // Check if creatorInfo is available
      <>
        <Text style={styles.requestInfo}>Creator Name: {creatorInfo.name}</Text>
        <Text style={styles.requestInfo}>Creator Email: {creatorInfo.email}</Text>
      </>
    )}
    <Text style={styles.requestInfo}>Type: {item.type}</Text>
    <Text style={styles.requestInfo}>Time: {item.time ? new Date(item.time).toLocaleTimeString() : ''}</Text> {/* Format time */}
    <Text style={styles.requestInfo}>Date: {item.date ? new Date(item.date).toLocaleDateString() : ''}</Text> {/* Format date */}


    <Text style={styles.requestInfo}>Reason: {item.reason}</Text>
    {/* ... other details (thoiGianVangMat if needed) */}
    <Text style={styles.status}>Status: {item.status}</Text>

    {/* status update buttons */}
    <View style={styles.statusButtons}>
      {['Pending', 'Approved', 'Rejected', 'Canceled', 'Ignored'].map((status) => (
        <TouchableOpacity
        key={status}
        onPress={() => handleStatusUpdate(item._id, status)}
        style={[styles.statusButton, item.status === status && styles.activeStatusButton]}
        >
       <Text style={item.status === status ? styles.activeStatusText : styles.statusButtonText}>{status}</Text>
     </TouchableOpacity>
      ))}
    </View>

  </View>
</View>
  );
};
  const renderScene = SceneMap({
    users: () => (
      <View style={styles.scene}>
          {/* Existing user management interface */}
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userData.name}</Text>
            <Text style={styles.userType}>{userData.userType}</Text>
            <Text style={styles.userType}>Total User: {allUserData.length}</Text>
          </View>
          <FlatList
          data={allUserData}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item._id}
          renderItem={({item}) => <UserCard data={item} />}
        />

      </View>

    ),
    requests: () => (
      <View style={styles.scene}>

        {/* Leave request management interface */}
        <FlatList
          data={leaveRequests}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item._id}
          renderItem={renderLeaveRequest} 
        />


      </View>
    ),
  });


  return (
    <>
      <View style={styles.container}>
         {/* Tab View */}
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: '100%' }} // or Dimensions.get('window').width
          renderTabBar={props => (
            <TabBar
              {...props}
              indicatorStyle={{ backgroundColor: 'blue' }} // Customize indicator
              style={{ backgroundColor: 'white' }} // Customize tab bar background
            />
          )}
        />
      </View>
      <Button
        mode="contained"
        onPress={() => signOut()}
        style={{
          backgroundColor: '#0163d2',
          width: '100%',
          borderRadius: 0,
          margin: 0,
        }}
        labelStyle={{fontSize: 16}}>
        Log Out
      </Button>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  userInfo: {
    marginBottom: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  userType: {
    fontSize: 18,
    color: '#777777',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  cardDetails: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: '#777777',
  },
  status: {
    fontSize: 14,
    color: '#777777',
    marginBottom: 5,
  },  
  statusButtons: {
      flexDirection: 'row',
      flexWrap: 'wrap', // Allow buttons to wrap to the next line
      marginTop: 10,
    },
    statusButton: {
      backgroundColor: '#f0f0f0', // Default background color
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 5,
      marginRight: 5, // Space between buttons
      marginBottom: 5, // Space between rows of buttons
    },
    statusButtonText: {
      color: '#333', // Default text color
    },
    activeStatusButton: {
      backgroundColor: 'blue', // Background color for active status
    },
    activeStatusText: {
      color: 'white', // Text color for active status
    },
    scene: {
      flex: 1,
      padding: 20,
    },
    requestInfo: {
      fontSize: 16,
      color: '#333',
      marginBottom: 3,

    },
});
export default AdminScreen;