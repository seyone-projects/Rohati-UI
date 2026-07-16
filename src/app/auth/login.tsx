import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/hooks/use-theme";
import * as authService from "@/services/authService";

export default function LoginScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { login: handleLocalSessionSave } = useAuth();

  // Local Form Input States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Validation Operational Tracking States
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async () => {
    setError("");

    if (!email || !password) {
      setError("Please enter both your email and password");
      return;
    }

    try {
      setLoading(true);

      // Fires your custom REST API login service call (Axios automatically handles AES scrambling!)
      const response = await authService.login({
        email: email.trim().toLowerCase(),
        password,
      });

      console.log("Login Network Success:", response);

      // Save token block locally via Context and boot straight into the authenticated feed layout
      if (response.accessToken && response.user) {
        // Fallback placeholder logic check if backend passes refresh tokens down line
        const refreshToken = response.refreshToken || "mock-refresh-token";
        await handleLocalSessionSave(response.accessToken, response.user);

        // Push cleanly past onboarding right into the main household grid feed
        router.replace("/main");
      } else {
        setError(
          "Invalid response block parameters from authentication server.",
        );
      }
    } catch (err: any) {
      console.error("Login processing error:", err);
      setError(
        err.response?.data?.error ||
          "Invalid email or password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.responsiveWrapper}>
            {/* BRANDING INTRO LOGO */}
            <Animated.View
              entering={FadeInUp.duration(400)}
              style={styles.header}
            >
              <ThemedText
                type="title"
                style={[styles.brandText, { color: theme.primary }]}
              >
                {theme.emoji} Rohati
              </ThemedText>
              <ThemedText type="subtitle" style={styles.titleText}>
                Welcome back
              </ThemedText>
              <ThemedText
                type="default"
                themeColor="textSecondary"
                style={styles.subtitleText}
              >
                Access your existing family gateway profile
              </ThemedText>
            </Animated.View>

            {/* ERROR ALERTS NOTIFICATION BANNER */}
            {error ? (
              <Animated.View
                entering={FadeInUp}
                style={[styles.errorCard, { borderColor: theme.accent }]}
              >
                <ThemedText type="smallBold" style={styles.errorText}>
                  {error}
                </ThemedText>
              </Animated.View>
            ) : null}

            {/* TACTICAL REGISTRATION INPUT LAYOUTS */}
            <View style={styles.formLayout}>
              <View style={styles.inputGroup}>
                <ThemedText type="smallBold" style={styles.fieldLabel}>
                  Email Address
                </ThemedText>
                <TextInput
                  style={[
                    styles.formInput,
                    {
                      backgroundColor: theme.backgroundElement,
                      color: theme.text,
                      borderColor: theme.cardBorder,
                    },
                  ]}
                  placeholder="you@example.com"
                  placeholderTextColor={theme.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.inputGroup}>
                <ThemedText type="smallBold" style={styles.fieldLabel}>
                  Password
                </ThemedText>
                <TextInput
                  style={[
                    styles.formInput,
                    {
                      backgroundColor: theme.backgroundElement,
                      color: theme.text,
                      borderColor: theme.cardBorder,
                    },
                  ]}
                  placeholder="Enter your security password"
                  placeholderTextColor={theme.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>

              {/* CENTRAL ACTION FORM SUBMITTER */}
              <Pressable
                disabled={loading}
                style={[
                  styles.primaryButton,
                  { backgroundColor: theme.primary },
                  loading && styles.disabledButton,
                ]}
                onPress={handleLoginSubmit}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <ThemedText type="smallBold" style={{ color: "#ffffff" }}>
                    Log In
                  </ThemedText>
                )}
              </Pressable>
            </View>

            {/* ROUTING GATES FOOTER */}
            <View style={styles.footer}>
              <ThemedText type="small" themeColor="textSecondary">
                Don't have an account?{" "}
              </ThemedText>
              <Pressable onPress={() => router.push("/auth/register")}>
                <ThemedText type="smallBold" style={{ color: theme.primary }}>
                  Sign up
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
    width: "100%",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacing.four,
  },
  responsiveWrapper: {
    width: "100%",
    maxWidth: 420,
    paddingHorizontal: Spacing.four,
  },
  header: {
    alignItems: "center",
    marginBottom: Spacing.five,
  },
  brandText: {
    fontSize: 28,
    fontWeight: "900",
    marginBottom: Spacing.two,
  },
  titleText: {
    fontWeight: "800",
    letterSpacing: -0.5,
    marginBottom: Spacing.one,
    textAlign: "center",
  },
  subtitleText: {
    textAlign: "center",
  },
  errorCard: {
    backgroundColor: "rgba(239, 68, 68, 0.06)",
    borderWidth: 1,
    borderRadius: 12,
    padding: Spacing.three,
    marginBottom: Spacing.four,
  },
  errorText: {
    color: "#EF4444",
    textAlign: "center",
  },
  formLayout: {
    gap: Spacing.three,
  },
  inputGroup: {
    gap: Spacing.one,
  },
  fieldLabel: {
    fontSize: 13,
    marginBottom: 2,
    paddingLeft: 4,
  },
  formInput: {
    height: 52,
    borderRadius: 14,
    paddingHorizontal: Spacing.three,
    fontSize: 16,
    borderWidth: 1,
  },
  primaryButton: {
    height: 54,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.two,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  disabledButton: {
    opacity: 0.6,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.five,
    paddingBottom: Spacing.four,
  },
});
