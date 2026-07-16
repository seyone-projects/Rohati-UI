import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import Animated, {
  FadeInUp,
  SlideInLeft,
  SlideInRight,
} from "react-native-reanimated";

import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/hooks/use-theme";
import * as authService from "@/services/authService";
import MalarLogoImage from "../../assets/images/MalarLogo.jpeg";

const COUNTRY_CODES = [
  { code: "+1", name: "US 🇺🇸", length: 10 },
  { code: "+44", name: "UK 🇬🇧", length: 10 },
  { code: "+91", name: "IND 🇮🇳", length: 10 },
  { code: "+49", name: "GER/EU 🇩🇪", length: 11 },
];
export default function RegisterScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { login: handleRegisterSave } = useAuth();

  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  const [name, setName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showCodeDropdown, setShowCodeDropdown] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isGdprChecked, setIsGdprChecked] = useState(false);
  const [isDeclarationChecked, setIsTermsChecked] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isRegisterButtonDisabled =
    !isGdprChecked || !isDeclarationChecked || loading;

  // frontend validations
  const validateAndProceedToStepTwo = () => {
    setError("");
    const nameRegex = /^[A-Za-z\s.\-]+$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const cleanName = name.trim();
    if (cleanName.length < 2 || cleanName.length > 50) {
      return setError("Name must be between 2 and 50 characters long.");
    }
    if (!nameRegex.test(cleanName)) {
      return setError(
        "Name can only contain alphabets, spaces, periods, and hyphens.",
      );
    }
    if (!familyName.trim()) {
      return setError("Household family name is required.");
    }
    if (!email.trim() || !emailRegex.test(email.trim())) {
      return setError("Please enter a valid email address.");
    }
    const cleanPhoneDigitsOnly = phoneNumber.replace(/\D/g, "");
    if (cleanPhoneDigitsOnly.length !== selectedCountry.length) {
      return setError(
        `Phone number for ${selectedCountry.name} must be exactly ${selectedCountry.length} digits.`,
      );
    }

    setCurrentStep(2);
  };

  const handlePasswordValidation = async () => {
    setError("");

    if (password.length < 8 || password.length > 15) {
      return setError("Password must be between 8 and 15 characters long.");
    }
    if (!/[A-Z]/.test(password)) {
      return setError("Password must contain at least one uppercase letter.");
    }
    if (!/[a-z]/.test(password)) {
      return setError("Password must contain at least one lowercase letter.");
    }
    if (!/[0-9]/.test(password)) {
      return setError("Password must contain at least one numeric digit.");
    }

    const specialCharRegex = /[@!#&*]/;
    const invalidCharRegex = /[^A-Za-z0-9@!#&*]/;

    if (!specialCharRegex.test(password)) {
      return setError(
        "Password must contain at least one special character from: @!#&*",
      );
    }
    if (invalidCharRegex.test(password)) {
      return setError(
        "Password contains forbidden characters. Only use alphabets, numbers, and @!#&*",
      );
    }
    if (password !== confirmPassword) {
      return setError("Passwords entered do not match.");
    }

    try {
      setLoading(true);
      const cleanPhoneDigitsOnly = phoneNumber.replace(/\D/g, "");

      const response = await authService.register({
        name: name,
        familyName: familyName.trim(),
        email: email.trim().toLowerCase(),
        countryCode: selectedCountry.code,
        phoneNumber: cleanPhoneDigitsOnly,
        password,
        confirmPassword,
      });

      if (response.accessToken && response.user) {
        await handleRegisterSave(response.accessToken, response.user);
        router.replace("/onboarding" as any);
      } else {
        router.replace("/auth/login");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Registration failed. Check parameters.",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <LinearGradient
      colors={[theme.background, theme.backgroundElement]}
      style={styles.gradientContainer}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.responsiveWrapper}>
            <Pressable
              onPress={() => router.replace("/")}
              style={styles.brandingHeaderRow}
            >
              <View style={styles.logoFlexContainerSplitRow}>
                <Image
                  source={MalarLogoImage}
                  style={styles.brandLogoImageWidgetFrame}
                />
                <ThemedText
                  type="title"
                  style={[styles.brandText, { color: theme.primary }]}
                >
                  Rohati
                </ThemedText>
              </View>
              <ThemedText
                type="default"
                themeColor="textSecondary"
                style={styles.subtitleText}
              >
                Step {currentStep} of 2 — Onboarding Initialization
              </ThemedText>
            </Pressable>

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

            {/* STEP 1 CONTROLS PANELS */}
            {currentStep === 1 && (
              <Animated.View entering={SlideInLeft} style={styles.formLayout}>
                <ThemedText type="subtitle" style={styles.sectionHeadingTitle}>
                  Personal Details
                </ThemedText>

                <View style={styles.inputGroup}>
                  <ThemedText type="smallBold" style={styles.fieldLabel}>
                    Your Name
                  </ThemedText>
                  <TextInput
                    style={[
                      styles.formInput,
                      {
                        backgroundColor: theme.background,
                        color: theme.text,
                        borderColor: theme.cardBorder,
                      },
                    ]}
                    placeholder="Jane Doe"
                    placeholderTextColor={theme.textSecondary}
                    value={name}
                    onChangeText={setName}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <ThemedText type="smallBold" style={styles.fieldLabel}>
                    Family Last Name
                  </ThemedText>
                  <TextInput
                    style={[
                      styles.formInput,
                      {
                        backgroundColor: theme.background,
                        color: theme.text,
                        borderColor: theme.cardBorder,
                      },
                    ]}
                    placeholder="e.g. Smith Household"
                    placeholderTextColor={theme.textSecondary}
                    value={familyName}
                    onChangeText={setFamilyName}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <ThemedText type="smallBold" style={styles.fieldLabel}>
                    Email Address
                  </ThemedText>
                  <TextInput
                    style={[
                      styles.formInput,
                      {
                        backgroundColor: theme.background,
                        color: theme.text,
                        borderColor: theme.cardBorder,
                      },
                    ]}
                    placeholder="name@domain.com"
                    placeholderTextColor={theme.textSecondary}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>

                <View style={[styles.inputGroup, { zIndex: 100 }]}>
                  <ThemedText type="smallBold" style={styles.fieldLabel}>
                    Contact Phone Number
                  </ThemedText>
                  <View style={styles.phoneSelectionLayoutRow}>
                    <Pressable
                      style={[
                        styles.countryDropdownAnchorButton,
                        {
                          backgroundColor: theme.background,
                          borderColor: theme.cardBorder,
                        },
                      ]}
                      onPress={() => setShowCodeDropdown(!showCodeDropdown)}
                    >
                      <ThemedText type="smallBold">
                        {selectedCountry.code}
                      </ThemedText>
                      <SymbolView
                        name="chevron.down"
                        size={10}
                        tintColor={theme.text}
                      />
                    </Pressable>

                    <TextInput
                      style={[
                        styles.phoneMainInputBody,
                        {
                          backgroundColor: theme.background,
                          color: theme.text,
                          borderColor: theme.cardBorder,
                        },
                      ]}
                      placeholder="Enter phone number here"
                      placeholderTextColor={theme.textSecondary}
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                    />
                  </View>

                  {showCodeDropdown && (
                    <View
                      style={[
                        styles.floatingDropdownListCodeTray,
                        {
                          backgroundColor: theme.background,
                          borderColor: theme.cardBorder,
                        },
                      ]}
                    >
                      {COUNTRY_CODES.map((item) => (
                        <Pressable
                          key={item.code}
                          style={styles.dropdownOptionListItemRow}
                          onPress={() => {
                            setSelectedCountry(item);
                            setShowCodeDropdown(false);
                          }}
                        >
                          <ThemedText type="smallBold">
                            {item.name} ({item.code})
                          </ThemedText>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>

                <Pressable
                  style={[
                    styles.premiumCta,
                    { backgroundColor: theme.primary },
                  ]}
                  onPress={validateAndProceedToStepTwo}
                >
                  <ThemedText type="smallBold" style={{ color: "#fff" }}>
                    Continue to Credentials
                  </ThemedText>
                </Pressable>
              </Animated.View>
            )}
            {/* STEP 2 CONTROLS PANELS */}
            {currentStep === 2 && (
              <Animated.View entering={SlideInRight} style={styles.formLayout}>
                <ThemedText type="subtitle" style={styles.sectionHeadingTitle}>
                  Secure Account
                </ThemedText>

                <View style={styles.inputGroup}>
                  <ThemedText type="smallBold" style={styles.fieldLabel}>
                    Choose Password
                  </ThemedText>
                  <TextInput
                    style={[
                      styles.formInput,
                      {
                        backgroundColor: theme.background,
                        color: theme.text,
                        borderColor: theme.cardBorder,
                      },
                    ]}
                    placeholder="Minimum 8 characters"
                    placeholderTextColor={theme.textSecondary}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <ThemedText type="smallBold" style={styles.fieldLabel}>
                    Confirm Security Password
                  </ThemedText>
                  <TextInput
                    style={[
                      styles.formInput,
                      {
                        backgroundColor: theme.background,
                        color: theme.text,
                        borderColor: theme.cardBorder,
                      },
                    ]}
                    placeholder="Repeat selected string"
                    placeholderTextColor={theme.textSecondary}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.regulatoryMatrixBlockFrame}>
                  <Pressable
                    style={styles.checkboxTouchRowArea}
                    onPress={() => setIsGdprChecked(!isGdprChecked)}
                  >
                    <View
                      style={[
                        styles.checkboxContainerSquareBox,
                        {
                          borderColor: theme.cardBorder,
                          backgroundColor: isGdprChecked
                            ? theme.primary
                            : theme.background,
                        },
                      ]}
                    >
                      {isGdprChecked && (
                        <ThemedText style={styles.checkmarkIconSymbolLabel}>
                          ✓
                        </ThemedText>
                      )}
                    </View>
                    <ThemedText
                      type="small"
                      style={styles.legalExplanationTextStringLabel}
                    >
                      I consent to secure digital profile processing parameters
                      under international GDPR directives.
                    </ThemedText>
                  </Pressable>

                  <Pressable
                    style={styles.checkboxTouchRowArea}
                    onPress={() => setIsTermsChecked(!isDeclarationChecked)}
                  >
                    <View
                      style={[
                        styles.checkboxContainerSquareBox,
                        {
                          borderColor: theme.cardBorder,
                          backgroundColor: isDeclarationChecked
                            ? theme.primary
                            : theme.background,
                        },
                      ]}
                    >
                      {isDeclarationChecked && (
                        <ThemedText style={styles.checkmarkIconSymbolLabel}>
                          ✓
                        </ThemedText>
                      )}
                    </View>
                    <ThemedText
                      type="small"
                      style={styles.legalExplanationTextStringLabel}
                    >
                      I assert that I have read, understood, and explicitly
                      agree to the full Privacy Policy and Terms of Conditions
                      of Rohati.
                    </ThemedText>
                  </Pressable>
                </View>

                <View style={styles.buttonActionSplitNavigationContainerRow}>
                  <Pressable
                    style={[
                      styles.premiumBackBtn,
                      {
                        borderColor: theme.cardBorder,
                        backgroundColor: theme.backgroundElement,
                      },
                    ]}
                    onPress={() => setCurrentStep(1)}
                  >
                    <ThemedText type="smallBold" style={{ color: theme.text }}>
                      Back
                    </ThemedText>
                  </Pressable>

                  <Pressable
                    disabled={isRegisterButtonDisabled}
                    style={[
                      styles.premiumRegisterBtn,
                      { backgroundColor: theme.primary },
                      isRegisterButtonDisabled && styles.disabledPremiumBtn,
                    ]}
                    onPress={handlePasswordValidation}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <ThemedText type="smallBold" style={{ color: "#fff" }}>
                        Register Portal
                      </ThemedText>
                    )}
                  </Pressable>
                </View>
              </Animated.View>
            )}

            <View style={styles.footerLayoutGridContainerRow}>
              <ThemedText type="small" themeColor="textSecondary">
                Already have an account?{" "}
              </ThemedText>
              <Pressable onPress={() => router.push("/auth/login")}>
                <ThemedText type="smallBold" style={{ color: theme.primary }}>
                  Sign in
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
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
  brandingHeaderRow: {
    alignItems: "center",
    marginBottom: Spacing.five,
  },
  logoFlexContainerSplitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    marginBottom: 6,
  },
  brandLogoImageWidgetFrame: {
    width: 38,
    height: 38,
    resizeMode: "contain",
  },
  brandText: {
    fontSize: 34,
    fontWeight: "900",
  },
  subtitleText: {
    textAlign: "center",
    fontSize: 13,
  },
  sectionHeadingTitle: {
    fontWeight: "800",
    letterSpacing: -0.5,
    marginBottom: Spacing.three,
    paddingLeft: 2,
  },
  errorCard: {
    backgroundColor: "rgba(239, 68, 68, 0.05)",
    borderWidth: 1,
    borderRadius: 14,
    padding: Spacing.three,
    marginBottom: Spacing.four,
  },
  errorText: {
    color: "#EF4444",
    textAlign: "center",
  },
  formLayout: {
    gap: Spacing.three,
    width: "100%",
  },
  inputGroup: {
    gap: 4,
    position: "relative",
  },
  fieldLabel: {
    fontSize: 13,
    paddingLeft: 4,
    fontWeight: "600",
  },
  formInput: {
    height: 54,
    borderRadius: 16,
    paddingHorizontal: Spacing.three,
    fontSize: 16,
    borderWidth: 1,
  },
  phoneSelectionLayoutRow: {
    flexDirection: "row",
    gap: Spacing.two,
    height: 54,
  },
  countryDropdownAnchorButton: {
    width: 80,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  phoneMainInputBody: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    fontSize: 16,
  },
  floatingDropdownListCodeTray: {
    position: "absolute",
    top: 84,
    left: 0,
    width: 220,
    borderRadius: 16,
    borderWidth: 1,
    zIndex: 9999,
    padding: Spacing.two,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  dropdownOptionListItemRow: {
    paddingVertical: 12,
    paddingHorizontal: Spacing.two,
    borderRadius: 10,
  },
  regulatoryMatrixBlockFrame: {
    marginVertical: Spacing.two,
    gap: Spacing.three,
  },
  checkboxTouchRowArea: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.three,
    paddingVertical: 2,
  },
  checkboxContainerSquareBox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
    flexShrink: 0,
  },
  checkmarkIconSymbolLabel: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 16,
  },
  legalExplanationTextStringLabel: {
    fontSize: 12.5,
    lineHeight: 18,
    flex: 1,
  },
  premiumCta: {
    height: 56,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.two,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  buttonActionSplitNavigationContainerRow: {
    flexDirection: "row",
    gap: Spacing.three,
    marginTop: Spacing.two,
    width: "100%",
  },
  premiumBackBtn: {
    width: 100,
    height: 56,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  premiumRegisterBtn: {
    height: 56,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 4,
  },
  disabledPremiumBtn: {
    opacity: 0.45,
    shadowOpacity: 0,
    elevation: 0,
  },
  footerLayoutGridContainerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.five,
    paddingBottom: Spacing.four,
  },
});
