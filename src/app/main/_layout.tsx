import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";
import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function MainLayout() {
  const { logout } = useAuth();
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.backgroundElement,
        },
        headerShadowVisible: false,
        headerTintColor: theme.text,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Rohati Feed",
          headerRight: () => (
            <TouchableOpacity onPress={logout} style={{ marginRight: 15 }}>
              {/* <Text style={{ color: "#208AEF", fontWeight: "bold" }}>
                Logout
              </Text> */}
              <ThemedText type="smallBold" style={{ color: theme.primary }}>
                Logout
              </ThemedText>
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
