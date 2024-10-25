import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useGetAllUsersQuery } from "@/src/features/user/user.service"; // Import the API hook
import { useAppSelector } from "@/src/hooks/hooks";
import { useInviteMemberWalletMutation } from "@/src/features/wallet/wallet.service";

const screenWidth = Dimensions.get("window").width;

interface User {
  _id: string;
  name: string;
  email: string;
  avatar_url: string;
  invitations: [
    {
      wallet?: string;
      status?: string;
    }
  ];
}
const UserCard = ({
  user,
  walletId,
  onInvite,
}: {
  user: User;
  walletId: string;
  onInvite: (userId: string) => void;
}) => {
  // Check if any invitation's wallet matches the walletId
  const isWalletInvited = user.invitations.some(
    (item) => item.wallet === walletId
  );

  return (
    <View style={styles.card}>
      <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      {/* Conditional rendering based on the invitation status */}
      {isWalletInvited ? (
        <Text style={{ margin: "auto" }}>Đang chờ</Text>
      ) : (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => onInvite(user._id)}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const NoResultsView = () => (
  <View style={styles.noResultsContainer}>
    <Image
      source={{
        uri: "https://cdn4.iconfinder.com/data/icons/digital-marketing-6-2/35/285-512.png",
      }}
      style={styles.noResultsImage}
    />
    <Text style={styles.noResultsText}>
      Sorry! Your search does not match any results
    </Text>
  </View>
);

const SearchMember = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch users from the API
  // const { data: users, isLoading, error } = useGetAllUsersQuery();
  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useGetAllUsersQuery(undefined, {
    pollingInterval: 5000, // Refetch every 10 seconds
  });
  const auth = useAppSelector((state) => state.auth);
  const inviterId = auth.user._id;
  const { walletId } = auth;
  const [inviteMember] = useInviteMemberWalletMutation(); // Use invite member mutation

  const handleInvite = async (userId: string) => {
    try {
      await inviteMember({
        inviterId,
        userId,
        walletId,
      }).unwrap();
      Alert.alert("Success", "User invited successfully!");
    } catch (err) {
      Alert.alert("Error", "Failed to invite user. Please try again.");
    }
  };
  if (isLoading || users === undefined) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error loading users</Text>;
  }

  const filteredUsers = users?.filter(
    (user) =>
      user?._id !== inviterId && // Loại trừ người dùng hiện tại
      (user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user?.email?.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [{}];

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by name or email"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {filteredUsers && filteredUsers.length === 0 ? (
        <NoResultsView />
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <UserCard user={item} walletId={walletId} onInvite={handleInvite} />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
  },
  searchBar: {
    width: screenWidth * 0.9,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
    borderColor: "#eee",
    borderWidth: 1,
  },
  card: {
    width: screenWidth * 0.9,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  infoContainer: {
    display: "flex",
    width: screenWidth * 0.55,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  email: {
    fontSize: 14,
    color: "#888",
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    margin: "auto",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#00f",
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 20,
    color: "#00f",
  },
  noResultsContainer: {
    flex: 1,
    alignItems: "center",
  },
  noResultsImage: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  noResultsText: {
    fontSize: 16,
    color: "#f00",
  },
});

export default SearchMember;
