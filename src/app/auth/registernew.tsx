import { useRouter } from "expo-router";
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
import Animated, { BounceIn, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

// Lucide Cross-Platform Icons for premium mockup tracking
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  User,
  Users,
} from "lucide-react-native";

import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/hooks/use-theme";
import * as authService from "@/services/authService";

// Image Imports — Core Identity & Unified Background Frame
import MalarBackgroundCanvas from "../../assets/images/Malar_BG.png";
import MalarLogoImage from "../../assets/images/MalarLogo.png";

const COUNTRY_CODES = [
  { code: "+1", name: "United States 🇺🇸", length: 10 },
  { code: "+44", name: "United Kingdom 🇬🇧", length: 10 },
  { code: "+91", name: "India 🇮🇳", length: 10 },
];

export default function RegisterScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { login: handleRegisterion } = useAuth();

  const [focusedField, setFocusedField] = useState<string | null>(null);

  // registration form state variables
  const [name, setName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const [phoneNumber, setPhoneNumber] = useState("");
  // const [showCodeModal, setShowCodeModal] = useState(false);
  const [showCodeDropdown, setShowCodeDropdown] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // checkbox states - COPPA complaince and policy compliance
  const [isAdultVerified, setIsAdultVerified] = useState(false);
  const [isTermsChecked, setIsTermsChecked] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isFormInvalid = !isAdultVerified || !isTermsChecked || loading;

  const getInputContainerStyle = (fieldName: string) => [
    styles.inputContainerRow,
    {
      backgroundColor: "rgba(255, 255, 255, 0.7)",
      borderColor:
        focusedField === fieldName ? theme.primary : theme.cardBorder,
    },
  ];
  const validateRegistration = async () => {
    setError("");
    const nameRegex = /^[A-Za-z\s.\-]+$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (name.trim().length < 2) {
      return setError("Please enter your full name.");
    }
    if (!nameRegex.test(name.trim())) {
      return setError("Name can only contain letters and standard characters.");
    }
    if (!familyName.trim()) {
      return setError(
        "Family Name is required to build your household portal.",
      );
    }
    if (familyName.trim().length < 2) {
      return setError("Family Name must be at least 2 characters long.");
    }
    if (!email.trim() || !emailRegex.test(email.trim())) {
      return setError("Please enter a valid email address.");
    }

    let cleanPhone = phoneNumber.replace(/\D/g, "");
    if (
      selectedCountry.code === "+1" &&
      cleanPhone.startsWith("1") &&
      cleanPhone.length === 11
    ) {
      cleanPhone = cleanPhone.substring(1);
    }
    if (cleanPhone.length !== selectedCountry.length) {
      return setError(
        `Phone number must be exactly ${selectedCountry.length} digits.`,
      );
    }
    if (password.length < 8) {
      return setError("Password must be at least 8 characters long.");
    }
    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      setLoading(true);
      const response = await authService.register({
        name: name.trim(),
        familyName: familyName.trim() || "Household",
        email: email.trim().toLowerCase(),
        countryCode: selectedCountry.code,
        phoneNumber: cleanPhone,
        password,
        confirmPassword,
      });

      if (response.accessToken && response.user) {
        await handleRegisterion(response.accessToken, response.user);
        // router.replace("/onboarding" as any);
        router.replace("/auth/loginnew");
      } else {
        setError("Invalid response from authentication server");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Registration failed. Verify inputs.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.layoutCanvas, { backgroundColor: theme.background }]}>
      {/* Full Background Image */}
      <View style={styles.fullBgLayer} pointerEvents="none">
        <Image
          source={MalarBackgroundCanvas}
          style={styles.fullScreenDisplay}
        />
      </View>

      {/* Back Arrow */}
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
            {/* Malar Logo */}
            <View style={styles.brandHeaderWrapper}>
              <Image source={MalarLogoImage} style={styles.brandLogoWidget} />
            </View>

            {/* Form title */}
            <View style={styles.heading}>
              <ThemedText
                type="subtitle"
                style={[styles.sectionHeadingTitle, { color: theme.text }]}
              >
                Create your account
              </ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Join Rohati — it only takes a minute.
              </ThemedText>
            </View>

            {/* Error notification */}
            {error ? (
              <Animated.View entering={FadeInUp} style={styles.errorAlertCard}>
                <ThemedText type="smallBold" style={styles.errorText}>
                  {error}
                </ThemedText>
              </Animated.View>
            ) : null}
            {/* Registration Form */}
            <View style={styles.inputFormVerticalStack}>
              {/* Full Name  */}
              <View style={getInputContainerStyle("name")}>
                <User
                  size={18}
                  color={theme.textSecondary}
                  style={styles.inputLeftIcon}
                />
                <TextInput
                  style={[styles.textInputBody, { color: theme.text }]}
                  placeholder="Full Name"
                  placeholderTextColor={theme.textSecondary}
                  value={name}
                  onChangeText={setName}
                  textContentType="name"
                  autoCorrect={false}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
              {/* family Name */}
              <View style={getInputContainerStyle("familyNameField")}>
                <Users
                  size={18}
                  color={theme.textSecondary}
                  style={styles.inputLeftIcon}
                />
                <TextInput
                  style={[styles.textInputBody, { color: theme.text }]}
                  placeholder="Family Name (e.g., Smith Family)"
                  placeholderTextColor={theme.textSecondary}
                  value={familyName}
                  onChangeText={setFamilyName}
                  textContentType="familyName"
                  autoCorrect={false}
                  onFocus={() => setFocusedField("familyNameField")}
                  onBlur={() => setFocusedField(null)}
                />
              </View>

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

              {/* Phone Number and Country code */}
              {/* <View style={[styles.phoneCodeRow, { zIndex: 5000 }]}> */}
              <View style={styles.phoneCodeRow}>
                {/* Anchor Dropdown Button Channel */}
                <Pressable
                  style={[
                    styles.countryAnchor,
                    {
                      borderColor: theme.cardBorder,
                      backgroundColor: "rgba(255, 255, 255, 0.7)",
                    },
                  ]}
                  onPress={() => setShowCodeDropdown(!showCodeDropdown)}
                >
                  <ThemedText type="smallBold" style={{ color: theme.text }}>
                    {selectedCountry.code}
                  </ThemedText>
                  <ChevronDown size={14} color={theme.textSecondary} />
                </Pressable>

                {/* Main Phone Input Body Frame */}
                <View
                  style={[
                    getInputContainerStyle("phone"),
                    { flex: 1, marginTop: 0 },
                  ]}
                >
                  <Phone
                    size={18}
                    color={theme.textSecondary}
                    style={styles.inputLeftIcon}
                  />
                  <TextInput
                    style={[styles.textInputBody, { color: theme.text }]}
                    placeholder="Phone Number"
                    placeholderTextColor={theme.textSecondary}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                    textContentType="telephoneNumber"
                    onFocus={() => {
                      setFocusedField("phone");
                      setShowCodeDropdown(false);
                    }}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>

                {/* 🔒 INLINE FLOATING DROPDOWN MENU SELECTION TRAY */}
                {showCodeDropdown && (
                  <Animated.View
                    entering={FadeInUp.duration(150)}
                    style={[
                      styles.inlineFloatingDropdownTray,
                      {
                        backgroundColor: theme.background,
                        borderColor: theme.cardBorder,
                      },
                    ]}
                  >
                    {COUNTRY_CODES.map((item) => (
                      <Pressable
                        key={item.code}
                        style={({ pressed }) => [
                          styles.inlineDropdownListItemRow,
                          {
                            backgroundColor: pressed
                              ? theme.backgroundElement
                              : "transparent",
                          },
                        ]}
                        onPress={() => {
                          setSelectedCountry(item);
                          setShowCodeDropdown(false);
                        }}
                      >
                        <ThemedText
                          type="smallBold"
                          style={{ color: theme.text }}
                        >
                          {item.code}{" "}
                          <ThemedText
                            type="small"
                            style={{ color: theme.textSecondary }}
                          >
                            {item.name}
                          </ThemedText>
                        </ThemedText>
                      </Pressable>
                    ))}
                  </Animated.View>
                )}
              </View>
              {showCodeDropdown && <View style={styles.dropdownBufferSpace} />}

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
                  textContentType="newPassword"
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

              {/* Confirm Password */}
              <View style={getInputContainerStyle("confirmPassword")}>
                <Lock
                  size={18}
                  color={theme.textSecondary}
                  style={styles.inputLeftIcon}
                />
                <TextInput
                  style={[styles.textInputBody, { color: theme.text }]}
                  placeholder="Confirm Password"
                  placeholderTextColor={theme.textSecondary}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  textContentType="newPassword"
                  autoCorrect={false}
                  onFocus={() => setFocusedField("confirmPassword")}
                  onBlur={() => setFocusedField(null)}
                />
                <Pressable
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.rightToggleIcon}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} color={theme.textSecondary} />
                  ) : (
                    <Eye size={18} color={theme.textSecondary} />
                  )}
                </Pressable>
              </View>
            </View>
            {/* Policy checks */}
            <View style={styles.complianceMatrixWrapper}>
              {/* Checkbox A: COPPA Adult Gate */}
              <Pressable
                style={styles.checkbox}
                onPress={() => setIsAdultVerified(!isAdultVerified)}
              >
                <View
                  style={[
                    styles.checkboxBoxSquareFrame,
                    {
                      borderColor: isAdultVerified ? theme.accent : theme.text,
                      backgroundColor: isAdultVerified
                        ? theme.accent
                        : "transparent",
                    },
                  ]}
                >
                  {isAdultVerified && (
                    <Animated.View entering={BounceIn}>
                      <Check size={12} color="#FFFFFF" strokeWidth={3} />
                    </Animated.View>
                  )}
                </View>
                <ThemedText
                  type="small"
                  style={[styles.legalString, { color: theme.text }]}
                >
                  I verify under COPPA rules that I am a parent or legal
                  guardian over 18.
                </ThemedText>
              </Pressable>

              {/* Checkbox B: Terms & Privacy Agreements */}
              <Pressable
                style={styles.checkbox}
                onPress={() => setIsTermsChecked(!isTermsChecked)}
              >
                <View
                  style={[
                    styles.checkboxBoxSquareFrame,
                    {
                      borderColor: isTermsChecked ? theme.accent : theme.text,
                      backgroundColor: isTermsChecked
                        ? theme.accent
                        : "transparent",
                    },
                  ]}
                >
                  {isTermsChecked && (
                    <Animated.View entering={BounceIn}>
                      <Check size={12} color="#FFFFFF" strokeWidth={3} />
                    </Animated.View>
                  )}
                </View>
                <ThemedText
                  type="small"
                  style={[styles.legalString, { color: theme.text }]}
                >
                  I agree to the{" "}
                  <ThemedText type="smallBold" style={{ color: theme.primary }}>
                    Terms & Conditions
                  </ThemedText>{" "}
                  and{" "}
                  <ThemedText type="smallBold" style={{ color: theme.primary }}>
                    Privacy Policy
                  </ThemedText>
                </ThemedText>
              </Pressable>
            </View>

            {/* Register Button */}
            <Pressable
              disabled={isFormInvalid}
              style={({ pressed }) => [
                styles.primaryCtaButton,
                { backgroundColor: theme.accent }, // Maps directly to your Forest Green (#5F7445)
                isFormInvalid && styles.disabledCtaState,
                !isFormInvalid && pressed && { opacity: 0.9 },
              ]}
              onPress={validateRegistration}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <ThemedText type="smallBold" style={styles.ctaButtonTextString}>
                  Register
                </ThemedText>
              )}
            </Pressable>

            {/* Sign in link */}
            <View style={styles.globalFooterRedirectionRow}>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Already have an account?{" "}
              </ThemedText>
              <Pressable onPress={() => router.push("/auth/loginnew")}>
                <ThemedText type="smallBold" style={{ color: theme.primary }}>
                  Login
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* <Modal visible={showCodeModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlayScrimCanvas}>
          <View
            style={[
              styles.modalBottomCardTray,
              {
                backgroundColor: theme.background,
                borderColor: theme.cardBorder,
              },
            ]}
          >
            <SafeAreaView>
              <ThemedText
                type="smallBold"
                style={[styles.modalTitleHeaderText, { color: theme.text }]}
              >
                Select Country Code
              </ThemedText>
              {COUNTRY_CODES.map((item) => (
                <Pressable
                  key={item.code}
                  style={({ pressed }) => [
                    styles.modalListItemRowSelection,
                    {
                      backgroundColor: pressed
                        ? theme.backgroundElement
                        : "transparent",
                    },
                  ]}
                  onPress={() => {
                    setSelectedCountry(item);
                    setShowCodeModal(false);
                  }}
                >
                  <ThemedText type="default" style={{ color: theme.text }}>
                    {item.name} ({item.code})
                  </ThemedText>
                </Pressable>
              ))}
              <Pressable
                style={[
                  styles.modalCloseButtonCancelFrame,
                  { backgroundColor: theme.backgroundElement },
                ]}
                onPress={() => setShowCodeModal(false)}
              >
                <ThemedText type="smallBold" style={{ color: theme.text }}>
                  Cancel
                </ThemedText>
              </Pressable>
            </SafeAreaView>
          </View>
        </View>
      </Modal> */}
    </View>
  );
}

// ----- STYLESHEET TO REPLICATE THE REFERRED DESIGN ----------------
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
    height: 38,
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
  phoneCodeRow: {
    flexDirection: "row",
    gap: Spacing.two,
    width: "100%",
    position: "relative",
  },
  countryAnchor: {
    width: 78,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  inlineFloatingDropdownTray: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    width: 220,
    borderRadius: 12,
    borderWidth: 1.5,
    padding: Spacing.one,
    zIndex: 9999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 6,
  },
  inlineDropdownListItemRow: {
    paddingVertical: 12,
    paddingHorizontal: Spacing.three,
    borderRadius: 8,
    marginVertical: 1,
  },
  dropdownBufferSpace: {
    height: 145,
    width: "100%",
  },
  complianceMatrixWrapper: {
    marginVertical: Spacing.three,
    gap: Spacing.two,
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    paddingVertical: 2,
  },
  checkboxBoxSquareFrame: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  legalString: {
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  primaryCtaButton: {
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
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
  globalFooterRedirectionRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.four,
  },
  // modalOverlayScrimCanvas: {
  //   flex: 1,
  //   backgroundColor: "rgba(0,0,0,0.4)",
  //   justifyContent: "flex-end",
  // },
  // modalBottomCardTray: {
  //   borderTopLeftRadius: 20,
  //   borderTopRightRadius: 20,
  //   borderWidth: 1,
  //   padding: Spacing.four,
  //   paddingBottom: Spacing.five,
  // },
  // modalTitleHeaderText: {
  //   fontSize: 16,
  //   textAlign: "center",
  //   marginBottom: Spacing.three,
  // },
  // modalListItemRowSelection: {
  //   paddingVertical: 14,
  //   paddingHorizontal: Spacing.three,
  //   borderRadius: 10,
  //   marginVertical: 2,
  // },
  // modalCloseButtonCancelFrame: {
  //   height: 46,
  //   borderRadius: 12,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   marginTop: Spacing.three,
  // },
});
