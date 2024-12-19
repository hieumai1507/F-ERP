import { View, Text, TouchableOpacity } from "react-native";
import dayjs from "dayjs";

const PendingRequests = ({ leaveRequests, setFilteredRequests }) => {
  const pendingRequests = leaveRequests.filter(
    (request) => request.status === "Pending"
  );

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 12 }}>
        Pending Requests:
      </Text>
      {pendingRequests.map((request) => (
        <TouchableOpacity
          key={request._id}
          style={{
            backgroundColor: "#FFF5E5",
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
            elevation: 3,
          }}
          onPress={() =>
            setFilteredRequests(
              leaveRequests.filter((r) => r._id === request._id)
            )
          }
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "blue",
              marginBottom: 8,
            }}
          >
            {request.type}
          </Text>
          <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 8 }}>
            {request.reason || "N/A"} {/* Use || for simpler conditional */}
          </Text>
          <Text style={{ fontSize: 14, color: "#555" }}>
            <Text style={{ fontWeight: "bold" }}>Ngày xin nghỉ:</Text>{" "}
            {dayjs(request.date).isValid()
              ? dayjs(request.date).format("DD/MM/YYYY")
              : "Invalid Date"}
          </Text>
          <Text style={{ fontSize: 14, color: "#555" }}>
            <Text style={{ fontWeight: "bold" }}>Người gửi:</Text>{" "}
            {request.userEmail || "N/A"} {/* Use || here as well */}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default PendingRequests;
