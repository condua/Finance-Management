import { useAppSelector } from "@/src/hooks/hooks";
import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

interface Invitation {
  id: number;
  name: string;
  email: string;
  event: string;
  imageUrl: string;
}

const invitations: Invitation[] = [
  {
    id: 1,
    name: "Phan Hoàng Phúc",
    email: "phanhoangphuc0311@gmail.com",
    event: "Tiệc cưới",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxdm6KtsRZaI88FU5IJeL-7-FJ-VPwMaszJu6RAz6JWa-HpwL0_4uUMQGAP1od2tLnuHM&usqp=CAU", // replace with actual image URL
  },
  {
    id: 2,
    name: "Nguyễn Văn A",
    email: "phanhoangphuc@gmail.com",
    event: "Cắm trại",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxdm6KtsRZaI88FU5IJeL-7-FJ-VPwMaszJu6RAz6JWa-HpwL0_4uUMQGAP1od2tLnuHM&usqp=CAU", // replace with actual image URL
  },
  {
    id: 3,
    name: "Phan Hoàng Phúc",
    email: "phanhoangphuc0311@gmail.com",
    event: "Họp lớp",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxdm6KtsRZaI88FU5IJeL-7-FJ-VPwMaszJu6RAz6JWa-HpwL0_4uUMQGAP1od2tLnuHM&usqp=CAU", // replace with actual image URL
  },
  {
    id: 4,
    name: "Phan Hoàng Phúc",
    email: "phanhoangphuc0311@gmail.com",
    event: "Du lịch",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxdm6KtsRZaI88FU5IJeL-7-FJ-VPwMaszJu6RAz6JWa-HpwL0_4uUMQGAP1od2tLnuHM&usqp=CAU", // replace with actual image URL
  },
  {
    id: 5,
    name: "Phan Hoàng Phúc",
    email: "phanhoangphuc0311@gmail.com",
    event: "Mua sắm",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxdm6KtsRZaI88FU5IJeL-7-FJ-VPwMaszJu6RAz6JWa-HpwL0_4uUMQGAP1od2tLnuHM&usqp=CAU", // replace with actual image URL
  },
];

const notifications = () => {
  const auth = useAppSelector((state) => state.auth);
  const userId = auth.user;
  const { walletId } = auth;
  // const invitations = userId?.invitations;
  const handleRespond = () => {};
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        Bạn có {invitations.length} lời mời vào ví nhóm
      </Text>
      {invitations.map((invitation) => (
        <View key={invitation.id} style={styles.invitationContainer}>
          <Image source={{ uri: invitation.imageUrl }} style={styles.avatar} />
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{invitation.name}</Text>
            <Text style={styles.email}>{invitation.email}</Text>
            <Text style={styles.event}>Mời bạn vào ví {invitation.event}</Text>
            <View>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.acceptButton}>
                  <Text style={styles.acceptText}>Chấp nhận</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.declineButton}>
                  <Text style={styles.declineText}>Từ chối</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  invitationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 5,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  email: {
    fontSize: 14,
    color: "gray",
  },
  event: {
    fontSize: 14,
    marginTop: 2,
  },
  buttonsContainer: {
    flexDirection: "row",
  },
  acceptButton: {
    backgroundColor: "#8e44ad",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10,
  },
  acceptText: {
    color: "#fff",
    fontWeight: "bold",
  },
  declineButton: {
    backgroundColor: "#e0e0e0",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  declineText: {
    color: "#333",
    fontWeight: "bold",
  },
});

export default notifications;
