import { useState } from "react";
import {
    Dimensions,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Fonts, MasterThemes, Spacing } from "../constants/theme";
import { useAuth } from "../context/AuthContext";
import { useColorScheme } from "../hooks/use-color-scheme";

const { width } = Dimensions.get("window");
const TOTAL_STEPS = 9;

const SELF_PRIORITY_OPTIONS = [
  {
    id: "ThatsMe",
    title: "That's me",
    description: "My own goals always end up at the bottom of the list.",
  },
  {
    id: "Sometimes",
    title: "Sometimes",
    description: "Some weeks I get to me, most weeks I don't.",
  },
  {
    id: "NotReally",
    title: "Not really",
    description: "I'm pretty good at carving out time for myself.",
  },
];

const GOAL_JOURNEY_OPTIONS = [
  {
    id: "NeverStarted",
    title: "I never really started",
    description: "It stayed an intention. Life filled the space.",
  },
  {
    id: "Stalled",
    title: "I started, then it stalled",
    description: "The first push faded after a week or two.",
  },
  {
    id: "LostMomentum",
    title: "I made progress, then lost momentum",
    description: "I was moving — then something pulled me off course.",
  },
  {
    id: "Achieved",
    title: "I actually achieved it",
    description: "I followed through. I want to keep that going.",
  },
];

const ROLE_MODEL_OPTIONS = [
  {
    id: "Yes",
    title: "Yes — that's me",
    description: "I want them to see me follow through, not give up.",
  },
  {
    id: "ALittle",
    title: "A little",
    description: "It crosses my mind sometimes.",
  },
  {
    id: "NotReally",
    title: "Not really",
    description: "I don't really frame it that way.",
  },
];

const BARRIER_OPTIONS = [
  {
    id: "Time",
    title: "Time",
    description: "There's never a free block in the day.",
  },
  {
    id: "Clarity",
    title: "Clarity",
    description: "I'm not sure what the actual next step is.",
  },
  {
    id: "Accountability",
    title: "Accountability",
    description: "No one's checking, so it slides.",
  },
  {
    id: "Energy",
    title: "Energy",
    description: "By the time I have a moment, I'm spent.",
  },
];

const COACHING_OPTIONS = [
  {
    id: "GentleCheckins",
    title: "A check-in that doesn't nag",
    description: "Soft, well-timed nudges — never pushy.",
  },
  {
    id: "BreakItDown",
    title: "Help breaking big goals into small steps",
    description: "Turn the mountain into one doable step.",
  },
  {
    id: "SeesWholeLife",
    title: "Someone who gets life isn't just about me",
    description: "Coaching that respects the whole family load.",
  },
  {
    id: "HoldsAccountable",
    title: "Someone who holds me to my word",
    description: "Kind, firm follow-through on what I said I'd do.",
  },
];

const AGE_STAGES = [
  {
    id: "Child",
    title: "Child (6–12)",
    description: "Concrete, playful, short steps",
  },
  {
    id: "Teen",
    title: "Teen (13–17)",
    description: "Autonomy, identity, peer-aware",
  },
  {
    id: "YoungAdult",
    title: "Young adult (18–24)",
    description: "Becoming, exploring, building",
  },
  {
    id: "Adult",
    title: "Adult (25–44)",
    description: "Career, family, big load",
  },
  {
    id: "Midlife",
    title: "Midlife (45–64)",
    description: "Refocus, depth, reset",
  },
  { id: "Elder", title: "65+", description: "Meaning, legacy, pace" },
];

export interface OnboardingData {
  selfPriority: string;
  goalJourney: string;
  roleModelPressure: string;
  primaryBarrier: string;
  coachingNeed: string;
  name: string;
  ageStage: string;
  culturalContext: string;
  lifestyle: string;
  rhythm: string;
}

interface OnboardingScreenProps {
  onComplete: (data: OnboardingData) => void;
}

export default function OnboardingScreen({
  onComplete,
}: OnboardingScreenProps) {
  const scheme = useColorScheme();
  const activeMode = scheme === "dark" ? "dark" : "light";

  const theme =
    MasterThemes[activeMode]["marigold"] || MasterThemes[activeMode]["classic"];

  const [currentStep, setCurrentStep] = useState(0);
  const [selfPriority, setSelfPriority] = useState("");
  const [goalJourney, setGoalJourney] = useState("");
  const [roleModel, setRoleModel] = useState("");
  const [barrier, setBarrier] = useState("");
  const [coachingNeed, setCoachingNeed] = useState("");
  const [name, setName] = useState("");
  const [ageStage, setAgeStage] = useState("");
  const [culturalContext, setCulturalContext] = useState("");
  const [lifestyle, setLifestyle] = useState("");
  const [rhythm, setRhythm] = useState("");

  const { user } = useAuth();

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete({
        selfPriority,
        goalJourney,
        roleModelPressure: roleModel,
        primaryBarrier: barrier,
        coachingNeed,
        name: user?.name || "",
        ageStage,
        culturalContext,
        lifestyle,
        rhythm,
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const isContinueBlocked = () => {
    switch (currentStep) {
      case 1:
        return !selfPriority;
      case 2:
        return !goalJourney;
      case 3:
        return !roleModel;
      case 4:
        return !barrier;
      case 5:
        return !coachingNeed;
      case 6:
        return !ageStage;
      default:
        return false;
    }
  };
  return (
    <SafeAreaView
      style={[styles.canvas, { backgroundColor: theme.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flexFill}
      >
        <View style={styles.screenShell}>
          {/* STAGE A: PROGRESS STRIP INDICATOR TRACKER */}
          <View style={styles.indicatorContainer}>
            {Array.from({ length: TOTAL_STEPS }).map((_, stepIdx) => (
              <View
                key={stepIdx}
                style={[
                  styles.indicatorBar,
                  {
                    backgroundColor:
                      stepIdx <= currentStep ? theme.primary : theme.cardBorder,
                  },
                ]}
              />
            ))}
          </View>

          {/* TEACHER FIX: Placing the touch dismiss handle right here intercepts background gestures without blocking input fields */}
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
          >
            <View style={styles.flexFill}>
              {/* STAGE B: CENTRAL CLEAN APPLICATION VIEWPORT LAYOUT */}
              <ScrollView
                contentContainerStyle={styles.scrollContentLayout}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled" // Tells the scrolling view to pass focus to active inputs instantly
              >
                {currentStep === 0 && <StepWelcomeHub theme={theme} />}

                {currentStep === 1 && (
                  <StepSelectionList
                    prompt="Most parents spend more time running the family's schedule than working on their own goals. Does that land?"
                    options={SELF_PRIORITY_OPTIONS}
                    selectedValue={selfPriority}
                    onSelect={setSelfPriority}
                    theme={theme}
                  />
                )}

                {currentStep === 2 && (
                  <StepSelectionList
                    prompt="Think about the last goal you set for yourself. What honestly happened to it?"
                    options={GOAL_JOURNEY_OPTIONS}
                    selectedValue={goalJourney}
                    onSelect={setGoalJourney}
                    theme={theme}
                  />
                )}

                {currentStep === 3 && (
                  <StepSelectionList
                    prompt="Some parents quietly worry: “My kids are watching me start things and not finish.” Does that resonate?"
                    options={ROLE_MODEL_OPTIONS}
                    selectedValue={roleModel}
                    onSelect={setRoleModel}
                    theme={theme}
                  />
                )}

                {currentStep === 4 && (
                  <StepSelectionList
                    prompt="When you're trying to move toward something, what usually gets in the way the most?"
                    options={BARRIER_OPTIONS}
                    selectedValue={barrier}
                    onSelect={setBarrier}
                    theme={theme}
                  />
                )}

                {currentStep === 5 && (
                  <StepSelectionList
                    prompt="If a coach were going to actually help you — not annoy you — what would that look like?"
                    options={COACHING_OPTIONS}
                    selectedValue={coachingNeed}
                    onSelect={setCoachingNeed}
                    theme={theme}
                  />
                )}

                {currentStep === 6 && (
                  <StepSelectionList
                    prompt="What life stage are you in?"
                    subtitle="I'll adjust language, pace and examples to fit."
                    options={AGE_STAGES}
                    selectedValue={ageStage}
                    onSelect={setAgeStage}
                    theme={theme}
                  />
                )}

                {(currentStep === 7 || currentStep === 8) && (
                  <StepLifestyleCalibration
                    currentStep={currentStep + 1} // Maps internal components dynamically matching your 8/9 textarea layout checks
                    culturalContext={culturalContext}
                    setCulturalContext={setCulturalContext}
                    lifestyle={lifestyle}
                    setLifestyle={setLifestyle}
                    rhythm={rhythm}
                    setRhythm={setRhythm}
                    theme={theme}
                  />
                )}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>

          {/* STAGE C: BOTTOM STICKY NAVIGATION TOOLBAR DOCK */}
          <View
            style={[styles.navFooterDock, { borderColor: theme.cardBorder }]}
          >
            <TouchableOpacity
              activeOpacity={0.6}
              disabled={currentStep === 0}
              onPress={handleBack}
              style={[
                styles.backLinkWrapper,
                currentStep === 0 && styles.invisibleElement,
              ]}
            >
              <Text
                style={[
                  styles.backTextLabel,
                  { color: theme.textSecondary, fontFamily: Fonts.sans },
                ]}
              >
                Back
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.84}
              disabled={isContinueBlocked()}
              onPress={handleNext}
              style={[
                styles.continueButton,
                { backgroundColor: theme.primary },
                isContinueBlocked() && styles.continueButtonDisabled,
              ]}
            >
              <Text
                style={[
                  styles.continueButtonText,
                  { color: theme.background, fontFamily: Fonts.sans },
                ]}
              >
                {currentStep < TOTAL_STEPS - 1 ? "Continue" : "Begin"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function StepWelcomeHub({ theme }: { theme: any }) {
  return (
    <View style={styles.welcomeContainer}>
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: theme.backgroundElement },
        ]}
      >
        <Text style={styles.iconEmoji}>🌻</Text>
      </View>
      {/* TEACHER FIX: Changed Fonts.default.serif to Fonts.serif */}
      <Text
        style={[
          styles.heroHeader,
          { color: theme.primary, fontFamily: Fonts.serif },
        ]}
      >
        Welcome to Malar
      </Text>
      <Text
        style={[
          styles.heroSubDescription,
          { color: theme.text, fontFamily: Fonts.sans },
        ]}
      >
        A warm AI coach for parents who keep putting their own goals last. A few
        honest questions first — then we begin.
      </Text>
    </View>
  );
}

interface StepSelectionListProps {
  prompt: string;
  subtitle?: string;
  options: Array<{ id: string; title: string; description: string }>;
  selectedValue: string;
  onSelect: (value: string) => void;
  theme: any;
}

function StepSelectionList({
  prompt,
  subtitle = "", // TEACHER FIX: Destructured safely with an empty fallback string assignment
  options,
  selectedValue,
  onSelect,
  theme,
}: StepSelectionListProps) {
  return (
    <View style={styles.formContainer}>
      <Text
        style={[
          styles.questionPrompt,
          { color: theme.primary, fontFamily: Fonts.serif },
        ]}
      >
        {prompt}
      </Text>

      {/* Safe conditional string length validation handle */}
      {subtitle.length > 0 ? (
        <Text
          style={[
            styles.subTextDescription,
            { color: theme.textSecondary, fontFamily: Fonts.sans },
          ]}
        >
          {subtitle}
        </Text>
      ) : null}

      {options.map((option) => {
        const isSelected = option.id === selectedValue;
        return (
          <TouchableOpacity
            key={option.id}
            activeOpacity={0.82}
            onPress={() => onSelect(option.id)}
            style={[
              styles.cardFrame,
              {
                backgroundColor: isSelected
                  ? theme.primary
                  : theme.backgroundElement,
                borderColor: isSelected ? theme.primary : theme.cardBorder,
              },
            ]}
          >
            <View style={styles.cardTextGroup}>
              <Text
                style={[
                  styles.cardTitle,
                  {
                    color: isSelected ? theme.background : theme.text,
                    fontFamily: Fonts.sans,
                  },
                ]}
              >
                {option.title}
              </Text>
              <Text
                style={[
                  styles.cardDescription,
                  {
                    color: isSelected
                      ? theme.primaryLight
                      : theme.textSecondary,
                    fontFamily: Fonts.sans,
                  },
                ]}
              >
                {option.description}
              </Text>
            </View>

            <View
              style={[
                styles.radioRing,
                {
                  borderColor: isSelected
                    ? theme.background
                    : theme.textSecondary,
                },
              ]}
            >
              {isSelected && (
                <View
                  style={[
                    styles.radioCore,
                    { backgroundColor: theme.background },
                  ]}
                />
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function StepNameInput({
  name,
  onNameChange,
  theme,
}: {
  name: string;
  onNameChange: (v: string) => void;
  theme: any;
}) {
  return (
    <View style={styles.formContainer}>
      {/* TEACHER FIX: Changed Fonts.default.serif to Fonts.serif */}
      <Text
        style={[
          styles.questionPrompt,
          { color: theme.primary, fontFamily: Fonts.serif },
        ]}
      >
        Now the warm stuff — what should I call you?
      </Text>
      {/* TEACHER FIX: Changed Fonts.default.sans to Fonts.sans */}
      <Text
        style={[
          styles.subTextDescription,
          { color: theme.textSecondary, fontFamily: Fonts.sans },
        ]}
      >
        First name is plenty. I'll use it to keep things warm.
      </Text>
      <TextInput
        style={[
          styles.inputBox,
          {
            backgroundColor: theme.backgroundElement,
            borderColor: theme.cardBorder,
            color: theme.text,
            fontFamily: Fonts.sans, // TEACHER FIX: Changed Fonts.default.sans to Fonts.sans
          },
        ]}
        placeholder="Your name"
        placeholderTextColor={theme.textSecondary}
        value={name}
        onChangeText={onNameChange}
        autoCapitalize="words"
        autoCorrect={false}
      />
    </View>
  );
}

function StepLifestyleCalibration({
  currentStep,
  culturalContext,
  setCulturalContext,
  lifestyle,
  setLifestyle,
  rhythm,
  setRhythm,
  theme,
}: any) {
  if (currentStep === 8) {
    return (
      <View style={styles.formContainer}>
        {/* TEACHER FIX: Changed Fonts.default.serif to Fonts.serif */}
        <Text
          style={[
            styles.questionPrompt,
            { color: theme.primary, fontFamily: Fonts.serif },
          ]}
        >
          What should I honor about your life?
        </Text>
        {/* TEACHER FIX: Changed Fonts.default.sans to Fonts.sans */}
        <Text
          style={[
            styles.subTextDescription,
            { color: theme.textSecondary, fontFamily: Fonts.sans },
          ]}
        >
          Two quick things to keep close — answer whatever feels right.
        </Text>

        {/* TEACHER FIX: Changed Fonts.default.sans to Fonts.sans */}
        <Text
          style={[
            styles.fieldLabelHeader,
            { color: theme.primary, fontFamily: Fonts.sans },
          ]}
        >
          CULTURE, FAITH, LANGUAGE, TRADITIONS
        </Text>
        <TextInput
          style={[
            styles.inputBox,
            styles.inputMultilineBox,
            {
              backgroundColor: theme.backgroundElement,
              borderColor: theme.cardBorder,
              color: theme.text,
              fontFamily: Fonts.sans,
            }, // TEACHER FIX: Changed Fonts.default.sans
          ]}
          placeholder="e.g. Tamil-American, observe Diwali & Thanksgiving, prefer Tamil names"
          placeholderTextColor={theme.textSecondary}
          value={culturalContext}
          onChangeText={setCulturalContext}
          multiline
          numberOfLines={2}
        />

        {/* TEACHER FIX: Changed Fonts.default.sans to Fonts.sans */}
        <Text
          style={[
            styles.fieldLabelHeader,
            { color: theme.primary, fontFamily: Fonts.sans },
          ]}
        >
          THE REAL SHAPE OF YOUR DAYS
        </Text>
        <TextInput
          style={[
            styles.inputBox,
            styles.inputMultilineBox,
            {
              backgroundColor: theme.backgroundElement,
              borderColor: theme.cardBorder,
              color: theme.text,
              fontFamily: Fonts.sans,
            }, // TEACHER FIX: Changed Fonts.default.sans
          ]}
          placeholder="e.g. night-shift nurse, two kids under 6, low energy mornings"
          placeholderTextColor={theme.textSecondary}
          value={lifestyle}
          onChangeText={setLifestyle}
          multiline
          numberOfLines={3}
        />
      </View>
    );
  }

  return (
    <View style={styles.formContainer}>
      {/* TEACHER FIX: Changed Fonts.default.serif to Fonts.serif */}
      <Text
        style={[
          styles.questionPrompt,
          { color: theme.primary, fontFamily: Fonts.serif },
        ]}
      >
        What does a typical week look like?
      </Text>
      {/* TEACHER FIX: Changed Fonts.default.sans to Fonts.sans */}
      <Text
        style={[
          styles.subTextDescription,
          { color: theme.textSecondary, fontFamily: Fonts.sans },
        ]}
      >
        School pickups, work blocks, weekend rituals — anything that anchors
        your days. (Optional.)
      </Text>
      <TextInput
        style={[
          styles.inputBox,
          styles.inputMultilineBox,
          {
            backgroundColor: theme.backgroundElement,
            borderColor: theme.cardBorder,
            color: theme.text,
            fontFamily: Fonts.sans,
            height: 120,
          }, // TEACHER FIX: Changed Fonts.default.sans
        ]}
        placeholder="e.g. school run 8am, work 9–5, family dinner 6:30"
        placeholderTextColor={theme.textSecondary}
        value={rhythm}
        onChangeText={setRhythm}
        multiline
        numberOfLines={4}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
  },
  flexFill: {
    flex: 1,
  },
  screenShell: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.one,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.five,
  },
  indicatorBar: {
    height: 5,
    flex: 1,
    marginHorizontal: 2.5,
    borderRadius: 3,
  },
  scrollContentLayout: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: Spacing.five,
  },
  welcomeContainer: {
    alignItems: "center",
    width: "100%",
    paddingHorizontal: Spacing.two,
  },
  iconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.four,
  },
  iconEmoji: {
    fontSize: 38,
  },
  heroHeader: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: Spacing.three,
    letterSpacing: -0.6,
  },
  heroSubDescription: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    paddingHorizontal: Spacing.three,
    opacity: 0.9,
  },
  formContainer: {
    width: "100%",
  },
  questionPrompt: {
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 30,
    marginBottom: Spacing.four,
    letterSpacing: -0.4,
  },
  subTextDescription: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: Spacing.four,
    opacity: 0.85,
  },
  cardFrame: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 18,
    borderWidth: 1,
    padding: Spacing.three,
    marginVertical: Spacing.one * 1.5,
    shadowColor: "#2B1A04",
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1.5,
  },
  cardTextGroup: {
    flex: 1,
    paddingRight: Spacing.three,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 3,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  radioRing: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  radioCore: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  inputBox: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    height: 54,
    fontSize: 16,
    marginTop: Spacing.one,
    marginBottom: Spacing.three,
  },
  inputMultilineBox: {
    height: 84,
    paddingTop: Spacing.two,
    textAlignVertical: "top",
  },
  fieldLabelHeader: {
    fontSize: 11,
    fontWeight: "700",
    marginTop: Spacing.two,
    marginBottom: Spacing.one,
    letterSpacing: 1.2,
  },
  navFooterDock: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.three,
    borderTopWidth: 1,
  },
  backLinkWrapper: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.one,
  },
  invisibleElement: {
    opacity: 0,
  },
  backTextLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  continueButton: {
    borderRadius: 26,
    paddingVertical: 15,
    paddingHorizontal: 34,
    minWidth: 130,
    alignItems: "center",
  },
  continueButtonDisabled: {
    opacity: 0.25,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
