import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, Image, FlatList,Alert, Dimensions, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native'; // Import TouchableOpacity
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'; // Import TabView 
import dayjs from 'dayjs';

function AdminScreen({navigation}) {
  const [userData, setUserData] = useState('');
  const [allUserData, setAllUserData] = useState('');
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [index, setIndex] = useState(0); // State for the active tab
  const [filteredRequests, setFilteredRequests] = useState([]);  // Filtered requests by status
  const [selectedStatus, setSelectedStatus] = useState(null); // Currently selected status filter
  const [loading, setLoading] = useState(true); // add loading state
  const [routes] = useState([
    { key: 'users', title: 'Users' },
    { key: 'requests', title: 'Leave Requests' }, // New tab for leave requests
  ]);
  const [userInfos, setUserInfos] = useState({}); // Store user info for quick lookup
  const [initialLayout, setInitialLayout] = useState({
    width: Dimensions.get('window').width,
  });
  async function getAllData() {
    axios.get('http://192.168.50.52:5001/get-all-user').then(res => {
      console.log(res.data);
      setAllUserData(res.data.data);
    })
    .catch(error => {
      console.error("Error fetching users", error);
      Alert.alert("Error", "Could not fetch users");
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
    setFilteredRequests(leaveRequests); 
  }, [leaveRequests]);
  //filter requests by status
  const filterRequestsByStatus = (status) => {
    setSelectedStatus(status);
    if (status === null) {
      setFilteredRequests(leaveRequests);
    } else {
      setFilteredRequests(leaveRequests.filter(request => request.status === status));
    }
  };


  const renderLeaveRequestHeader = () => {
    const totalRequests = leaveRequests.length;
    const today = dayjs();
    const requestsToday = leaveRequests.filter(request => dayjs(request.date).isSame(today, 'day')).length;  // Get the count

    const statusCounts = leaveRequests.reduce((counts, request) => {
      counts[request.status] = (counts[request.status] || 0) + 1;
      return counts;
    }, {});


    return (
      <View>  {/* Use a View to contain all header content */}
       
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statusFilterContainer}> {/* Keep ScrollView for filters */}
         <TouchableOpacity onPress={() => filterRequestsByStatus(null)} style={styles.statusFilterButton}>
          <Text style={[styles.statusFilterText, !selectedStatus && styles.activeStatusFilterText]}>All</Text>
        </TouchableOpacity>
          {Object.keys(statusCounts).map(status => (
            <TouchableOpacity
              key={status}
              onPress={() => filterRequestsByStatus(status)}
              style={[styles.statusFilterButton, selectedStatus === status && styles.activeStatusFilterButton]}
            >
              <Text style={[styles.statusFilterText, selectedStatus === status && styles.activeStatusFilterText]}>
                {status} ({statusCounts[status]})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };


  const renderLeaveRequestsSection = () => (
    <View style={styles.scene}>
      {renderLeaveRequestHeader()} {/* Render the header */}
      <FlatList
        data={filteredRequests} // Use filtered requests
        keyExtractor={item => item._id}
        renderItem={renderLeaveRequest}
        ListHeaderComponent={() => (
          <View>
            <Text>Total Leave Requests: {leaveRequests.length}</Text>
            <Text>Total Leave Requests Today: {dayjs().format('MM-DD-YYYY')} : {' '}
             {leaveRequests.filter(request => dayjs(request.date).isSame(dayjs(), 'day')).length}
             </Text>
            <Text style={styles.pendingTitle}>Pending Requests:</Text>
            {leaveRequests.filter(request => request.status === 'Pending').map(request => (
              <TouchableOpacity 
                key={request._id} 
                style={styles.pendingRequest}
                onPress={() => {
                  setFilteredRequests(leaveRequests.filter(r => r._id === request._id));
                }}
              >
                <Text>
                  {request.reason ? request.reason : 'N/A'} -{' '}
                  {dayjs(request.date).isValid() ? dayjs(request.date).format('MM-DD-YYYY') : 'Invalid Date'} ({request.userEmail ? request.userEmail : 'N/A'})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      />
    </View>
  );

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
    const fetchData = async () => {
      try {
        const leaveRequestsResponse = await axios.get('http://192.168.50.52:5001/get-all-leave-requests');
        const userInfosResponse = await axios.get('http://192.168.50.52:5001/get-all-user');


        if (leaveRequestsResponse.data.status === 'ok' && userInfosResponse.data.status === "Ok") {
          setLeaveRequests(leaveRequestsResponse.data.data);


          const userInfosMap = {};
          userInfosResponse.data.data.forEach(userInfo => {
            userInfosMap[userInfo.email] = userInfo;
          });
          setUserInfos(userInfosMap);

          setLoading(false); // Set loading to false after data is fetched
        } else {
          // Handle error cases for both APIs
          console.error("Error fetching requests or user info", leaveRequestsResponse.data, userInfosResponse.data);
        }

      } catch (error) {
          console.error("Error fetching requests or user info", error);
      }
    }

    fetchData();
  }, []);
  if(loading) {
    return <View><Text>Loading...</Text></View>;
  }


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
    <Text style={styles.requestInfo}>Request ID: {item._id || 'N/A'}</Text>
    {creatorInfo ? ( // Check if creatorInfo is available
      <>
        <Text style={styles.requestInfo}>Creator Name: {creatorInfo.name || 'N/A'}</Text>
        <Text style={styles.requestInfo}>Creator Email: {creatorInfo.email || 'N/A'}</Text>
      </>
    ): (
      <Text style={styles.requestInfo}>Creator information not found</Text>
    )}
    <Text style={styles.requestInfo}>Type: {item.type}</Text>
    {item.time && (
           <Text style={styles.requestInfo}>Time: {new Date(item.time).toLocaleTimeString()}</Text>
        )}
    {item.date && (
           <Text style={styles.requestInfo}>Date: {new Date(item.date).toLocaleDateString()}</Text>
        )}


    <Text style={styles.requestInfo}>Reason: {item.reason || 'N/A'}</Text>
    {item.thoiGianVangMat && item.type == "Ra ngoài" && (
          <Text style={styles.requestInfo}>Time Off: {item.thoiGianVangMat}</Text>
        )}

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
    requests: renderLeaveRequestsSection,
  });


  return (
    <>
      <View style={styles.container}>
         {/* Tab View */}
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={initialLayout}
          onLayout={event => setInitialLayout(event.nativeEvent.layout)} // Update layout on mount and resize
          renderTabBar={props => (
            <TabBar
              {...props}
              indicatorStyle={{ backgroundColor: 'blue' }} // Customize indicator
              style={{ backgroundColor: '#40e0d0' }} // Customize tab bar background
              labelStyle= {{ color: "#FFFFFF", fontWeight: 'bold' }} // Customize
              activeLabelStyle={{ color:'FF6347'}}
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
    pendingTitle: {
      fontWeight: 'bold',
      marginTop: 10,
      marginBottom: 5,
      fontSize: 18,


    },

    pendingRequest: {
      padding: 10,
      borderWidth: 1,
      borderColor: 'red',
      marginBottom: 5,
      borderRadius: 8,
  },
    statusFilterContainer: {
      flexDirection: 'row',
      marginBottom: 10,
    },
    statusFilterButton: {
      backgroundColor: '#f0f0f0',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 5,
      marginRight: 5,
    },


    statusFilterText: {
      color: '#333',
    },

    activeStatusFilterButton: {
      backgroundColor: 'blue',
    },

    activeStatusFilterText: {

      color: 'white',
      fontWeight: 'bold',
    },
});
export default AdminScreen;