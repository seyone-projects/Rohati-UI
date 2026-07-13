import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { useAuth } from '../../context/AuthContext';

// Dummy data for a simple social feed
const POSTS = [
  { id: '1', author: 'Alice', content: 'Just joined Rohati! Excited to connect with everyone.' },
  { id: '2', author: 'Bob', content: 'What a beautiful day to build a React Native app!' },
  { id: '3', author: 'Charlie', content: 'Can anyone recommend a good book?' },
];

export default function HomeFeedScreen() {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome, {user?.username || 'User'}!</Text>
      </View>
      
      <FlatList
        data={POSTS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.feed}
        renderItem={({ item }) => (
          <View style={styles.postCard}>
            <View style={styles.postHeader}>
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{item.author[0]}</Text>
              </View>
              <Text style={styles.authorName}>{item.author}</Text>
            </View>
            <Text style={styles.postContent}>{item.content}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  feed: {
    padding: 10,
  },
  postCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#208AEF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  authorName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  postContent: {
    fontSize: 16,
    color: '#444',
    lineHeight: 22,
  },
});
