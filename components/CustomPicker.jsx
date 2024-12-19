import fonts from "@/constants/fonts";
import { Entypo } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";

const screenHeight = Dimensions.get("window").height;

const CustomPicker = ({ items, selectedValue, onValueChange, placeholder }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleItemPress = (value) => {
    onValueChange(value);
    setModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Text>{selectedValue ? selectedValue : placeholder}</Text>
        <Entypo name="chevron-down" size={16} color="#94A3B8" />
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ScrollView style={styles.scrollView}>
              {items.map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => handleItemPress(item)}
                  style={styles.item}
                >
                  <Text
                    style={{
                      fontFamily: fonts["Inter-Regular"],
                      fontSize: 14,
                    }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-[#005AB4] font-bold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "white",
    borderColor: "#CBD5E1",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,

    flexDirection: "row", // Enable flex direction for alignment
    alignItems: "center", // Align items vertically to center
    justifyContent: "space-between",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "80%", // Điều chỉnh chiều rộng của modal nếu cần
  },
  scrollView: {
    maxHeight: screenHeight * 0.4, // Giới hạn chiều cao của scrollView
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  cancelButton: {
    marginTop: 20,
  },
});

export default CustomPicker;
