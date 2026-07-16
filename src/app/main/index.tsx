// replacing the homescreen with my custom themes
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { FlatList, StyleSheet, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
// Dummy data for a simple social feed
const POSTS = [
  {
    id: "1",
    author: "Alice",
    content: "Just joined Rohati! Excited to connect with everyone.",
  },
  {
    id: "2",
    author: "Bob",
    content: "What a beautiful day to build a React Native app!",
  },
  { id: "3", author: "Charlie", content: "Can anyone recommend a good book?" },
];

export default function HomeFeedScreen() {
  const { user } = useAuth();
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <ThemedView type="backgroundElement" style={styles.header}>
        <ThemedText type="subtitle">
          Welcome, {user?.username || "User"}!
        </ThemedText>
      </ThemedView>

      <FlatList
        data={POSTS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.feed}
        renderItem={({ item }) => (
          <ThemedView
            type="backgroundElement"
            style={[styles.postCard, { borderColor: theme.cardBorder }]}
          >
            <View style={styles.postHeader}>
              <View
                style={[
                  styles.avatarPlaceholder,
                  { backgroundColor: theme.primary },
                ]}
              >
                <ThemedText type="smallBold" style={{ color: "#fff" }}>
                  {item.author[0]}
                </ThemedText>
              </View>
              <ThemedText type="smallBold">{item.author}</ThemedText>
            </View>
            <ThemedText style={styles.postContent}>{item.content}</ThemedText>
          </ThemedView>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: Spacing.four,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  feed: {
    padding: Spacing.three,
  },
  postCard: {
    padding: Spacing.four,
    borderRadius: 16,
    marginBottom: Spacing.three,
    borderWidth: 1,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.two,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.two,
  },
  postContent: {
    marginTop: Spacing.one,
  },
});
