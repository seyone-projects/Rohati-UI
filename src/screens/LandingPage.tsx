import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import Animated, { FadeInRight, FadeInUp } from "react-native-reanimated";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { MaxContentWidth, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

const TOPIC_TAGS = [
  "Parenting advice",
  "Meal planning",
  "Travel ideas",
  "Self-care tips",
  "Finance guidance",
  "Activity ideas",
];

const CORE_PILLARS = [
  {
    id: "malar",
    icon: "brain.head.profile",
    title: "AI Coach — Malar",
    desc: "Your 24/7 personal family coach. Malar adapts completely to your family's culture, values, and daily routines.",
  },
  {
    id: "calendar",
    icon: "calendar",
    title: "Household Coordination",
    desc: "A shared calendar built for the household. Coordinate family schedules with role-based permissions.",
  },
  {
    id: "kids",
    icon: "person.crop.circle",
    title: "Kids Portal & Rewards",
    desc: "A dedicated dashboard built explicitly for children. Empower growth through gamified tasks and rewards.",
  },
];

export function LandingNavbar() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Animated.View entering={FadeInUp.delay(100)} style={styles.navbar}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Image
          source={require("../assets/images/MalarLogo.jpeg")}
          style={{ width: 32, height: 32, resizeMode: "contain" }}
        />
        <ThemedText
          type="smallBold"
          style={[styles.brandLogo, { color: theme.primary }]}
        >
          Rohati
        </ThemedText>
      </View>
      <Pressable
        style={styles.signinGate}
        onPress={() => router.push("/auth/login")}
      >
        <ThemedText type="smallBold" style={{ color: theme.primary }}>
          Sign In
        </ThemedText>
      </Pressable>
    </Animated.View>
  );
}
export function LandingHero() {
  const theme = useTheme();

  return (
    <View style={styles.heroSection}>
      <Animated.View
        entering={FadeInUp.delay(200)}
        style={[
          styles.heroBadge,
          {
            backgroundColor: theme.backgroundElement,
            borderColor: theme.cardBorder,
          },
        ]}
      >
        <SymbolView name="sparkles" size={12} tintColor={theme.gold} />
        <ThemedText
          type="code"
          style={{ fontSize: 10, textTransform: "uppercase" }}
        >
          Your AI Family Life Coach
        </ThemedText>
      </Animated.View>

      <ThemedText type="title" style={styles.mainHeroTitle}>
        Meet Malar
      </ThemedText>
      <ThemedText
        type="default"
        themeColor="textSecondary"
        style={styles.heroNarrative}
      >
        Malar is your household operating system. She maps schedules, targets
        child development milestones, supports your teens, and coordinates
        calendars automatically.
      </ThemedText>

      {/* HORIZONTAL STREAMING MEDIA TAG PILLS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tagStream}
        style={{ maxHeight: 40 }}
      >
        {TOPIC_TAGS.map((tag, tIdx) => (
          <View
            key={tIdx}
            style={[
              styles.pill,
              {
                backgroundColor: theme.backgroundElement,
                borderColor: theme.cardBorder,
              },
            ]}
          >
            <ThemedText type="code" style={{ fontSize: 11 }}>
              {tag}
            </ThemedText>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
export function LandingInteractiveConsole() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<"lotus" | "chores" | "goals">(
    "lotus",
  );
  const [visibleMessages, setVisibleMessages] = useState<number>(0);

  useEffect(() => {
    setVisibleMessages(1);
    const m1 = setTimeout(() => setVisibleMessages(2), 900);
    const m2 = setTimeout(() => setVisibleMessages(3), 2200);

    return () => {
      clearTimeout(m1);
      clearTimeout(m2);
    };
  }, [activeTab]);

  return (
    <View style={styles.consoleWrapper}>
      <View
        style={[
          styles.premiumConsoleCard,
          { backgroundColor: theme.background, borderColor: theme.cardBorder },
        ]}
      >
        {/* ENHANCED TAB BAR LAYOUT */}
        <View style={styles.enhancedTabRow}>
          {[
            { id: "lotus", label: "🎂 Birthday Party" },
            { id: "chores", label: "🧹 Assign Chores" },
            { id: "goals", label: "🎯 Set Goals" },
          ].map((tabItem) => {
            const isSelected = activeTab === tabItem.id;
            return (
              <Pressable
                key={tabItem.id}
                style={[
                  styles.enhancedTabButton,
                  {
                    backgroundColor: theme.backgroundElement,
                    borderColor: theme.cardBorder,
                  },
                  isSelected && {
                    backgroundColor: theme.primary,
                    borderColor: theme.primary,
                  },
                ]}
                onPress={() => setActiveTab(tabItem.id as any)}
              >
                <ThemedText
                  type="smallBold"
                  style={[
                    styles.tabButtonText,
                    { color: theme.text },
                    isSelected && { color: "#fff" },
                  ]}
                >
                  {tabItem.label}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>

        {/* CHAT INTERFACE HUB WITH OPTIMIZED TEXT WRAPPING */}
        <View style={styles.chatStreamWindow}>
          {activeTab === "lotus" && (
            <>
              {visibleMessages >= 1 && (
                <Animated.View
                  entering={FadeInRight.duration(400)}
                  style={[
                    styles.premiumUserBubble,
                    { backgroundColor: theme.primary },
                  ]}
                >
                  <ThemedText style={styles.bubbleTextOverride}>
                    Plan a birthday party for Emma — she's turning 8 and loves
                    unicorns!
                  </ThemedText>
                </Animated.View>
              )}
              {visibleMessages >= 2 && (
                <Animated.View
                  entering={FadeInUp.duration(500)}
                  style={[
                    styles.premiumAiBubble,
                    {
                      backgroundColor: theme.backgroundElement,
                      borderColor: theme.cardBorder,
                    },
                  ]}
                >
                  <View style={styles.aiHeaderRow}>
                    <ThemedText
                      type="smallBold"
                      style={{ color: theme.primary }}
                    >
                      Malar AI
                    </ThemedText>
                    <ThemedText style={{ fontSize: 12 }}>
                      {theme.emoji}
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.aiBodyTextOverride}>
                    Theme: Unicorn Magic{"\n"}
                    Activities: Headband craft, pin-the-horn game{"\n"}
                    Cake: Rainbow layer with edible glitter{"\n"}
                    Time: 2–4 PM (Perfect for age 8!)
                  </ThemedText>
                </Animated.View>
              )}
            </>
          )}

          {activeTab === "chores" && (
            <>
              {visibleMessages >= 1 && (
                <Animated.View
                  entering={FadeInRight.duration(400)}
                  style={[
                    styles.premiumUserBubble,
                    { backgroundColor: theme.primary },
                  ]}
                >
                  <ThemedText style={styles.bubbleTextOverride}>
                    Create a weekly chore chart for my 3 kids aged 5, 8, and 13
                  </ThemedText>
                </Animated.View>
              )}
              {visibleMessages >= 2 && (
                <Animated.View
                  entering={FadeInUp.duration(500)}
                  style={[
                    styles.premiumAiBubble,
                    {
                      backgroundColor: theme.backgroundElement,
                      borderColor: theme.cardBorder,
                    },
                  ]}
                >
                  <View style={styles.aiHeaderRow}>
                    <ThemedText
                      type="smallBold"
                      style={{ color: theme.primary }}
                    >
                      Malar AI
                    </ThemedText>
                    <ThemedText style={{ fontSize: 12 }}>
                      {theme.emoji}
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.aiBodyTextOverride}>
                    👶 Liam (5): Feed pets · Pick up toys{"\n"}
                    Anisha (8): Empty dishwasher · Wipe counters{"\n"}
                    🧑 Jordan (13): Vacuum corridors · Cook one dinner night
                  </ThemedText>
                </Animated.View>
              )}
            </>
          )}

          {activeTab === "goals" && (
            <>
              {visibleMessages >= 1 && (
                <Animated.View
                  entering={FadeInRight.duration(400)}
                  style={[
                    styles.premiumUserBubble,
                    { backgroundColor: theme.primary },
                  ]}
                >
                  <ThemedText style={styles.bubbleTextOverride}>
                    Help Sophia set a goal for learning piano
                  </ThemedText>
                </Animated.View>
              )}
              {visibleMessages >= 2 && (
                <Animated.View
                  entering={FadeInUp.duration(500)}
                  style={[
                    styles.premiumAiBubble,
                    {
                      backgroundColor: theme.backgroundElement,
                      borderColor: theme.cardBorder,
                    },
                  ]}
                >
                  <View style={styles.aiHeaderRow}>
                    <ThemedText
                      type="smallBold"
                      style={{ color: theme.primary }}
                    >
                      Malar AI
                    </ThemedText>
                    <ThemedText style={{ fontSize: 12 }}>
                      {theme.emoji}
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.aiBodyTextOverride}>
                    Sophia's 8-Week Piano Roadmap: 🎹{"\n"}
                    Weeks 1-2: Master left hand chords{"\n"}
                    Weeks 3-4: Sync right hand melody{"\n"}
                    🏆 Reward: Family home concert night!
                  </ThemedText>
                </Animated.View>
              )}
            </>
          )}
        </View>
      </View>

      {/* NEW PREMIUM FEATURE PROMO / ADS COMPONENT LOGIC */}
      <Animated.View
        entering={FadeInUp.delay(300)}
        style={[
          styles.premiumFeaturePromo,
          {
            backgroundColor: theme.backgroundElement,
            borderColor: theme.cardBorder,
          },
        ]}
      >
        <View style={styles.promoHeader}>
          <SymbolView
            name="sparkles"
            size={14}
            tintColor={theme.gold}
            weight="bold"
          />
          <ThemedText
            type="smallBold"
            style={{
              textTransform: "uppercase",
              letterSpacing: 0.5,
              fontSize: 11,
              color: theme.text,
            }}
          >
            Unlock Grow Tier Potential
          </ThemedText>
        </View>
        <ThemedText
          type="small"
          themeColor="textSecondary"
          style={styles.promoTextBody}
        >
          Get unlimited Malar AI support sessions, unlock full household
          tracking progress bars, and map local weekend exploration maps using
          our secure Activity Scout!
        </ThemedText>
      </Animated.View>
    </View>
  );
}

export default function LandingPage() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollTrack}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.responsiveWrapper}>
          <LandingNavbar />
          <LandingHero />
          <LandingInteractiveConsole />

          {/* PRIVACY ADS TRUST STRIP */}
          <View
            style={[
              styles.adsBanner,
              { backgroundColor: theme.backgroundSelected },
            ]}
          >
            <View style={styles.adsHeaderRow}>
              <SymbolView name="shield" size={14} tintColor={theme.primary} />
              <ThemedText
                type="smallBold"
                style={{ textTransform: "uppercase", letterSpacing: 0.5 }}
              >
                US COPPA Privacy Assurances
              </ThemedText>
            </View>
            <ThemedText
              type="small"
              themeColor="textSecondary"
              style={styles.adsBody}
            >
              No persistent GPS logs used. Zero ad targeting trackers or data
              brokers integrations allowed. Parents retain 100% control over
              permissions.
            </ThemedText>
          </View>

          {/* ACTION BUTTON GATEWAYS */}
          <View style={styles.actionLayout}>
            <Pressable
              style={[styles.mainCta, { backgroundColor: theme.primary }]}
              onPress={() => router.push("/auth/register")}
            >
              <ThemedText type="smallBold" style={{ color: "#fff" }}>
                Initialize Household Core
              </ThemedText>
            </Pressable>

            <Pressable
              style={[styles.secondaryCta, { borderColor: theme.cardBorder }]}
              onPress={() => router.push("/auth/login")}
            >
              <ThemedText type="smallBold">Sign In Existing Portal</ThemedText>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollTrack: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacing.four,
  },
  responsiveWrapper: {
    width: "100%",
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: Spacing.four,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.03)",
  },
  brandLogo: { fontSize: 22, fontWeight: "900" },
  signinGate: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
  },
  heroSection: { alignItems: "flex-start", marginVertical: Spacing.four },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    borderRadius: 20,
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderWidth: 1,
    marginBottom: Spacing.three,
  },
  mainHeroTitle: {
    fontWeight: "800",
    letterSpacing: -1,
    marginBottom: Spacing.two,
  },
  heroNarrative: { lineHeight: 24, fontSize: 15, marginBottom: Spacing.four },
  consoleWrapper: {
    width: "100%",
    marginVertical: Spacing.three,
  },
  premiumConsoleCard: {
    borderRadius: 28,
    borderWidth: 1,
    padding: Spacing.four,
    // Premium Drop Shadows for Web/Native Depth Layers
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 6,
  },
  enhancedTabRow: {
    flexDirection: "row",
    gap: Spacing.two,
    flexWrap: "wrap",
    marginBottom: Spacing.four,
    justifyContent: "center",
  },
  enhancedTabButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  tabButtonText: {
    fontSize: 13,
  },
  chatStreamWindow: {
    gap: Spacing.three,
    marginTop: Spacing.two,
  },
  premiumUserBubble: {
    alignSelf: "flex-end",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderBottomRightRadius: 4,
    maxWidth: "85%",
  },
  bubbleTextOverride: {
    color: "#ffffff",
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "500",
  },
  premiumAiBubble: {
    alignSelf: "flex-start",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    maxWidth: "85%",
    borderWidth: 1,
  },
  aiHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    marginBottom: 6,
  },
  aiBodyTextOverride: {
    fontSize: 15,
    lineHeight: 24,
    fontWeight: "500",
  },
  premiumFeaturePromo: {
    borderRadius: 22,
    padding: Spacing.four,
    marginTop: Spacing.four,
    borderWidth: 1,
    borderStyle: "dashed", // Gives it a premium marketing spot feel
  },
  promoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    marginBottom: Spacing.one,
  },
  promoTextBody: {
    lineHeight: 20,
    fontSize: 13.5,
  },
  tagStream: { flexDirection: "row", gap: Spacing.two },
  pill: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: Spacing.two,
    justifyContent: "center",
  },
  consoleCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: Spacing.four,
    marginVertical: Spacing.three,
    minHeight: 260,
  },
  tabRow: {
    flexDirection: "row",
    gap: Spacing.two,
    flexWrap: "wrap",
    marginBottom: Spacing.four,
  },
  tabButton: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  chatThreadFrame: { gap: Spacing.two },
  userBubble: {
    backgroundColor: "#3b82f6",
    alignSelf: "flex-end",
    padding: Spacing.three,
    borderRadius: 16,
    borderBottomRightRadius: 2,
    maxWidth: "85%",
  },
  aiBubble: {
    alignSelf: "flex-start",
    padding: Spacing.three,
    borderRadius: 16,
    borderBottomLeftRadius: 2,
    maxWidth: "85%",
    borderWidth: 1,
  },
  adsBanner: {
    borderRadius: 20,
    padding: Spacing.four,
    marginVertical: Spacing.three,
  },
  adsHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    marginBottom: Spacing.one,
  },
  adsBody: { lineHeight: 18, fontSize: 13 },
  actionLayout: {
    gap: Spacing.two,
    marginTop: Spacing.four,
    paddingBottom: Spacing.four,
  },
  mainCta: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryCta: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
});
