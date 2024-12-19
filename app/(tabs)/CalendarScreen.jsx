import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Calendar } from "react-native-calendars";
import moment from "moment";

const CalendarScreen = () => {
  const currentMonth = moment().format("YYYY-MM");

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Calendar
          current={currentMonth}
          style={styles.calendar}
          theme={{
            backgroundColor: "#fff", // White background
            calendarBackground: "#fff",
            textSectionTitleColor: "#000", // Black text for section titles
            selectedDayBackgroundColor: "#2196f3", // Blue highlight (you can change this)
            selectedDayTextColor: "#fff",
            todayTextColor: "#2196f3", // Blue for today
            dayTextColor: "#000", // Black text for days
            textDisabledColor: "#d9e1e8",
            monthTextColor: "#000", // Black month title
            arrowColor: "#000", // Black arrows
            // If you're using the default text styles from react-native-calendars,
            // you may also want to change these:
            "stylesheet.calendar.header": {
              week: {
                marginTop: 5,
                flexDirection: "row",
                justifyContent: "space-between",
              },
            },
          }}
          onDayPress={(day) => {
            console.log("selected day", day);
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  calendar: {
    borderWidth: 1,
    borderColor: "lightgrey",
  },
});

export default CalendarScreen;
