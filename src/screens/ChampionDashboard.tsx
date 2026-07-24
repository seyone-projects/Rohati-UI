import { useState } from "react";
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Fonts, MasterThemes, Spacing } from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";

const { width } = Dimensions.get("window");

export interface Milestone {
  id: string;
  title: string;
  done: boolean;
}

export interface Goal {
  id: string;
  title: string;
  why: string;
  milestones: Milestone[];
  progress: number;
}

const MOCK_GOALS_DATA: Goal[] = [
  {
    id: "goal_1",
    title: "Read for 15 minutes before bed",
    why: "To show the kids a healthy evening unwind routine",
    progress: 0.66,
    milestones: [
      { id: "m1", title: "Pick an inspiring book", done: true },
      { id: "m2", title: "Set phone on dock by 9:30pm", done: true },
      { id: "m3", title: "Complete a full 15-minute log", done: false },
    ],
  },
  {
    id: "goal_2",
    title: "Morning stretches with Sarah",
    why: "Build consistency and stay energized for family tasks",
    progress: 0.25,
    milestones: [
      { id: "m4", title: "Clear the living room rug area", done: true },
      { id: "m5", title: "Hold stretches for 10 minutes", done: false },
      { id: "m6", title: "Log post-activity energy check-in", done: false },
      { id: "m7", title: "Review weekend fitness pacing rhythm", done: false },
    ],
  },
];

const MOOD_CHIPS = [
  { key: "Glowing", emoji: "✨", label: "Glowing" },
  { key: "Steady", emoji: "🌱", label: "Steady" },
  { key: "Foggy", emoji: "🌫️", label: "Foggy" },
  { key: "Stretched", emoji: "🌀", label: "Stretched" },
  { key: "Tender", emoji: "🫶", label: "Tender" },
];

export default function ChampionDashboard() {
  const scheme = useColorScheme();
  const activeMode = scheme === "dark" ? "dark" : "light";

  const theme =
    MasterThemes[activeMode]["marigold"] || MasterThemes[activeMode]["classic"];

  const [activeMood, setActiveMood] = useState("Steady");
  const [goals, setGoals] = useState<Goal[]>(MOCK_GOALS_DATA);

  const renderNextMilestoneText = (goal: Goal) => {
    const nextPending = goal.milestones.find((m) => !m.done);
    return nextPending
      ? `Next: ${nextPending.title}`
      : "All milestones complete ✨";
  };

  return (
    <View style={[styles.canvas, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollViewport}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerBlock}>
          {/* <Text
            style={[
              styles.headerLabel,
              { color: theme.textSecondary, fontFamily: Fonts.sans },
            ]}
          >
            Today
          </Text> */}
          <Text
            style={[
              styles.greetingHeadline,
              { color: theme.primary, fontFamily: Fonts.serif },
            ]}
          >
            Good morning, parent
          </Text>
        </View>

        <View
          style={[
            styles.moodCardFrame,
            {
              backgroundColor: theme.backgroundElement,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <Text
            style={[
              styles.moodQuestion,
              { color: theme.text, fontFamily: Fonts.sans },
            ]}
          >
            How's the energy today?
          </Text>
          <Text
            style={[
              styles.moodInstruction,
              { color: theme.textSecondary, fontFamily: Fonts.sans },
            ]}
          >
            Tap one. I'll shape the day around it.
          </Text>

          <View style={styles.moodRow}>
            {MOOD_CHIPS.map((chip) => {
              const isSelected = chip.key === activeMood;
              return (
                <TouchableOpacity
                  key={chip.key}
                  activeOpacity={0.7}
                  onPress={() => setActiveMood(chip.key)}
                  style={styles.moodChipButton}
                >
                  <View
                    style={[
                      styles.moodEmojiContainer,
                      {
                        backgroundColor: isSelected
                          ? theme.primary
                          : "rgba(255,255,255,0.4)",
                      },
                    ]}
                  >
                    <Text style={styles.moodEmoji}>{chip.emoji}</Text>
                  </View>
                  <Text
                    style={[
                      styles.moodChipLabel,
                      {
                        color: isSelected ? theme.primary : theme.textSecondary,
                        fontWeight: isSelected ? "700" : "400",
                        fontFamily: Fonts.sans,
                      },
                    ]}
                  >
                    {chip.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <Text
          style={[
            styles.sectionLabelTitle,
            { color: theme.primary, fontFamily: Fonts.serif },
          ]}
        >
          Your goals
        </Text>

        {goals.map((goal) => (
          <View
            key={goal.id}
            style={[
              styles.goalCard,
              {
                backgroundColor: theme.backgroundElement,
                borderColor: theme.cardBorder,
              },
            ]}
          >
            <Text
              style={[
                styles.goalTitle,
                { color: theme.text, fontFamily: Fonts.sans },
              ]}
            >
              {goal.title}
            </Text>
            <Text
              style={[
                styles.goalWhySubtitle,
                { color: theme.textSecondary, fontFamily: Fonts.sans },
              ]}
            >
              {goal.why}
            </Text>

            <View
              style={[
                styles.progressTrack,
                { backgroundColor: "rgba(0,0,0,0.06)" },
              ]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: theme.primary,
                    width: `${goal.progress * 100}%`,
                  },
                ]}
              />
            </View>

            <Text
              style={[
                styles.nextMilestoneLabel,
                { color: theme.text, fontFamily: Fonts.sans },
              ]}
            >
              {renderNextMilestoneText(goal)}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View
        style={[
          styles.navigationDock,
          { backgroundColor: theme.background, borderColor: theme.cardBorder },
        ]}
      >
        <TouchableOpacity activeOpacity={0.8} style={styles.navItemButton}>
          <View
            style={[
              styles.navIconBackground,
              { backgroundColor: theme.primary },
            ]}
          >
            <Text style={[styles.navIconEmoji, { color: theme.background }]}>
              🏆
            </Text>
          </View>
          <Text
            style={[
              styles.navItemLabel,
              {
                color: theme.primary,
                fontFamily: Fonts.sans,
                fontWeight: "700",
              },
            ]}
          >
            Goals
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
  },
  scrollViewport: {
    flexGrow: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: 110,
  },
  headerBlock: {
    marginBottom: Spacing.four,
  },
  headerLabel: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 2,
  },
  greetingHeadline: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  moodCardFrame: {
    borderRadius: 20,
    borderWidth: 1,
    padding: Spacing.three * 1.2,
    marginBottom: Spacing.five,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  moodQuestion: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 4,
  },
  moodInstruction: {
    fontSize: 13,
    marginBottom: Spacing.three,
  },
  moodRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.one,
  },
  moodChipButton: {
    alignItems: "center",
    flex: 1,
  },
  moodEmojiContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  moodEmoji: {
    fontSize: 20,
  },
  moodChipLabel: {
    fontSize: 11,
  },
  sectionLabelTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: Spacing.three,
    letterSpacing: -0.3,
  },
  goalCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: Spacing.four,
    marginVertical: Spacing.two,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  goalTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 4,
  },
  goalWhySubtitle: {
    fontSize: 14,
    lineHeight: 18,
    fontStyle: "italic",
    marginBottom: Spacing.three,
  },
  progressTrack: {
    height: 6,
    width: "100%",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: Spacing.three,
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  nextMilestoneLabel: {
    fontSize: 13,
    fontWeight: "500",
    opacity: 0.9,
  },
  navigationDock: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 84,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 1,
    paddingBottom: Platform.OS === "ios" ? 16 : 0,
  },
  navItemButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.four,
  },
  navIconBackground: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
  },
  navIconEmoji: {
    fontSize: 18,
  },
  navItemLabel: {
    fontSize: 12,
  },
});
