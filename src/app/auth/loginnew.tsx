import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/hooks/use-theme";
import * as authService from "@/services/authService";
import { useRouter } from "expo-router";
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  // SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

import MalarBackgroundCanvas from "../../assets/images/Malar_BG.png";
import MalarLogoImage from "../../assets/images/MalarLogo.png";

const GoogleIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.53-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-8.72z"
    />
    <Path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.11 0-5.74-2.11-6.68-4.96H1.21v3.15C3.18 21.88 7.31 24 12 24z"
    />
    <Path
      fill="#FBBC05"
      d="M5.32 14.24A7.16 7.16 0 0 1 5 12c0-.79.13-1.57.32-2.34V6.51H1.21A11.94 11.94 0 0 0 0 12c0 1.92.45 3.74 1.21 5.39l4.11-3.15z"
    />
    <Path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.18 2.12 1.21 5.39l4.11 3.15c.94-2.85 3.57-4.96 6.68-4.96z"
    />
  </Svg>
);

const AppleIcon = () => {
  const theme = useTheme();
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill={theme.text}>
      <Path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.56 2.95-1.39z" />
    </Svg>
  );
};

const FacebookIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="#1877F2">
    <Path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </Svg>
);

export default function LoginScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { login: handleLocalSessionSave } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getInputContainerStyle = (fieldName: string) => [
    styles.inputContainerRow,
    {
      backgroundColor: "rgba(255, 255, 255, 0.7)",
      borderColor:
        focusedField === fieldName ? theme.primary : theme.cardBorder,
    },
  ];
  const handleLoginSubmit = async () => {
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter both your email and password");
      return;
    }

    try {
      setLoading(true);

      const response = await authService.login({
        email: email.trim().toLowerCase(),
        password,
      });

      console.log("Login Network Success:", response);

      if (response.accessToken && response.user) {
        await handleLocalSessionSave(response.accessToken, response.user);
        router.replace("/main" as any);
      } else {
        setError("Invalid response parameters from authentication server.");
      }
    } catch (err: any) {
      console.log("Login processing error:", err);
      setError(
        err.response?.data?.error ||
          "Invalid email or password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.layoutCanvas, { backgroundColor: theme.background }]}>
      {/* Full Background */}
      <View style={styles.fullBgLayer} pointerEvents="none">
        <Image
          source={MalarBackgroundCanvas}
          style={styles.fullScreenDisplay}
        />
      </View>

      {/* Back arrow */}
      <SafeAreaView edges={["top"]} style={styles.topSafeAreaWrapper}>
        <View style={styles.topNavActionHeaderRow}>
          <Pressable
            onPress={() => router.replace("/" as any)}
            style={styles.circleBackButton}
          >
            <ArrowLeft size={20} color={theme.text} strokeWidth={2.5} />
          </Pressable>
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardViewportContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContentLayout}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.responsiveConstraint}>
            {/* malar logo */}
            <View style={styles.brandHeaderWrapper}>
              <Image source={MalarLogoImage} style={styles.brandLogoWidget} />
            </View>

            {/* Heading */}
            <Animated.View
              entering={FadeInUp.duration(400)}
              style={styles.heading}
            >
              <ThemedText
                type="subtitle"
                style={[styles.sectionHeadingTitle, { color: theme.text }]}
              >
                Welcome Back
              </ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                You have been missed! Let's continue growing
              </ThemedText>
            </Animated.View>

            {/* Error alerts */}
            {error ? (
              <Animated.View entering={FadeInUp} style={styles.errorAlertCard}>
                <ThemedText type="smallBold" style={styles.errorText}>
                  {error}
                </ThemedText>
              </Animated.View>
            ) : null}
            {/* Login fields */}
            <View style={styles.inputFormVerticalStack}>
              {/* Email Address */}
              <View style={getInputContainerStyle("email")}>
                <Mail
                  size={18}
                  color={theme.textSecondary}
                  style={styles.inputLeftIcon}
                />
                <TextInput
                  style={[styles.textInputBody, { color: theme.text }]}
                  placeholder="Email Address"
                  placeholderTextColor={theme.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  autoCorrect={false}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                />
              </View>

              {/* Password */}
              <View style={getInputContainerStyle("password")}>
                <Lock
                  size={18}
                  color={theme.textSecondary}
                  style={styles.inputLeftIcon}
                />
                <TextInput
                  style={[styles.textInputBody, { color: theme.text }]}
                  placeholder="Password"
                  placeholderTextColor={theme.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  textContentType="password"
                  autoCorrect={false}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.rightToggleIcon}
                >
                  {showPassword ? (
                    <EyeOff size={18} color={theme.textSecondary} />
                  ) : (
                    <Eye size={18} color={theme.textSecondary} />
                  )}
                </Pressable>
              </View>

              {/* forgot password link */}
              <View style={styles.forgotPasswordRow}>
                <Pressable
                  onPress={() => router.push("/auth/forgot-password" as any)}
                >
                  <ThemedText
                    type="smallBold"
                    style={[
                      styles.forgotPasswordTextLink,
                      { color: theme.primary },
                    ]}
                  >
                    Forgot Password?
                  </ThemedText>
                </Pressable>
              </View>
            </View>
            {/* sign in */}
            <Pressable
              disabled={loading}
              style={({ pressed }) => [
                styles.primaryCtaButton,
                { backgroundColor: theme.accent },
                loading && styles.disabledCtaState,
                !loading && pressed && { opacity: 0.9 },
              ]}
              onPress={handleLoginSubmit}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <ThemedText type="smallBold" style={styles.ctaButtonTextString}>
                  Log In
                </ThemedText>
              )}
            </Pressable>

            {/* divider */}
            <View style={styles.dividerLayoutRow}>
              <View
                style={[
                  styles.horizontalDividerLine,
                  { backgroundColor: theme.cardBorder },
                ]}
              />
              <ThemedText
                type="small"
                style={[
                  styles.dividerLabelText,
                  { color: theme.textSecondary },
                ]}
              >
                Or sign in with
              </ThemedText>
              <View
                style={[
                  styles.horizontalDividerLine,
                  { backgroundColor: theme.cardBorder },
                ]}
              />
            </View>

            {/* socials */}
            <View style={styles.socialActionButtonsRow}>
              <Pressable
                style={({ pressed }) => [
                  styles.circularSocialCircleTarget,
                  { borderColor: theme.cardBorder, opacity: pressed ? 0.8 : 1 },
                ]}
                onPress={() => console.log("Execute Google Auth Pipeline Link")}
              >
                <GoogleIcon />
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.circularSocialCircleTarget,
                  { borderColor: theme.cardBorder, opacity: pressed ? 0.8 : 1 },
                ]}
                onPress={() => console.log("Execute Apple Identity Framework")}
              >
                <AppleIcon />
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.circularSocialCircleTarget,
                  { borderColor: theme.cardBorder, opacity: pressed ? 0.8 : 1 },
                ]}
                onPress={() => console.log("Execute Meta Framework Hook")}
              >
                <FacebookIcon />
              </Pressable>
            </View>

            {/* sign up redirect */}
            <View style={styles.globalFooterRedirectionRow}>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Don't have an account?{" "}
              </ThemedText>
              <Pressable
                onPress={() => router.push("/auth/registernew" as any)}
              >
                <ThemedText type="smallBold" style={{ color: theme.primary }}>
                  Sign up
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// Style sheet for logiin screen
const styles = StyleSheet.create({
  layoutCanvas: {
    flex: 1,
  },
  fullBgLayer: {
    ...StyleSheet.absoluteFill,
    zIndex: -1,
  },
  fullScreenDisplay: {
    width: "100%",
    height: "100%",
    resizeMode: "stretch",
  },
  topSafeAreaWrapper: {
    width: "100%",
  },
  topNavActionHeaderRow: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    flexDirection: "row",
    alignItems: "center",
  },
  circleBackButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  keyboardViewportContainer: {
    flex: 1,
    width: "100%",
  },
  scrollContentLayout: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingBottom: Spacing.six,
  },
  responsiveConstraint: {
    width: "100%",
    maxWidth: 400,
    paddingHorizontal: Spacing.five,
  },
  brandHeaderWrapper: {
    alignItems: "center",
    marginTop: Spacing.two,
    marginBottom: Spacing.three,
  },
  brandLogoWidget: {
    width: 160,
    height: 160,
    resizeMode: "contain",
  },
  heading: {
    alignItems: "center",
    marginBottom: Spacing.four,
    gap: 4,
  },
  sectionHeadingTitle: {
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  errorAlertCard: {
    backgroundColor: "rgba(198, 90, 42, 0.08)",
    borderWidth: 1,
    borderColor: "#C65A2A",
    borderRadius: 12,
    padding: Spacing.three,
    marginBottom: Spacing.three,
  },
  errorText: {
    color: "#C65A2A",
    textAlign: "center",
  },
  inputFormVerticalStack: {
    gap: Spacing.three,
    width: "100%",
  },
  inputContainerRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
  },
  inputLeftIcon: {
    marginRight: Spacing.three,
    flexShrink: 0,
  },
  textInputBody: {
    flex: 1,
    height: "100%",
    fontSize: 15,
    fontWeight: "500",
  },
  rightToggleIcon: {
    padding: Spacing.one,
  },
  forgotPasswordRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: -2,
    paddingRight: 4,
  },
  forgotPasswordTextLink: {
    fontSize: 13,
    fontWeight: "600",
  },
  primaryCtaButton: {
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.four,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  ctaButtonTextString: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  disabledCtaState: {
    opacity: 0.4,
  },
  dividerLayoutRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: Spacing.four,
    width: "100%",
    gap: Spacing.three,
  },
  horizontalDividerLine: {
    flex: 1,
    height: 1,
    opacity: 0.4,
  },
  dividerLabelText: {
    fontSize: 12,
    fontWeight: "500",
  },
  socialActionButtonsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.four,
    width: "100%",
    marginBottom: Spacing.two,
  },
  circularSocialCircleTarget: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  globalFooterRedirectionRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.five,
  },
});
