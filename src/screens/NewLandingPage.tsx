import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
    ArrowRight,
    BookOpen,
    Calendar,
    Compass,
    Flower,
    Lock,
    Mail,
    Phone,
    ShieldCheck,
    Target,
} from "lucide-react-native";
import {
    Dimensions,
    Image,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import AdCreativeSparkImage from "../assets/images/CreativeSpark.png";
import AdLearnifyImage from "../assets/images/LearnifyPartner.png";
import Malar from "../assets/images/Malar.png";
import MalarBackgroundCanvas from "../assets/images/Malar_BG_Landing.png";
import MalarHeroImage from "../assets/images/Malar_Hero.png";
import MalarLogoImage from "../assets/images/MalarLogo.png";
import AdNutriLifeImage from "../assets/images/NutriLife.png";

const { width } = Dimensions.get("window");

export default function LandingScreen() {
  const theme = useTheme();
  const router = useRouter();
  return (
    <View
      style={[styles.masterContainer, { backgroundColor: theme.background }]}
    >
      {/* Background Image */}
      <View style={styles.absoluteBackgroundLayer} pointerEvents="none">
        <Image
          source={MalarBackgroundCanvas}
          style={styles.fullScreenCanvasAsset}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContentLayout}
        showsVerticalScrollIndicator={false}
      >
        {/* trust badge */}
        <SafeAreaView edges={["top"]} style={styles.headerSafeAreaRow}>
          <View style={styles.trustBadgeContainer}>
            <ShieldCheck size={14} color="#5F7445" />
            <ThemedText style={styles.trustText}>
              Trusted by 10K+ Families
            </ThemedText>
          </View>
        </SafeAreaView>
        {/* Malar Logo */}
        <View style={styles.logoBrandingWrapper}>
          <Image source={MalarLogoImage} style={styles.logoAssetWidget} />
          <ThemedText style={styles.brandMottoText}>
            Bloom into your best self
          </ThemedText>
        </View>

        {/* web and mobile compatible text */}
        <View style={styles.typographyHeroGroup}>
          {Platform.OS === "web" ? (
            <ThemedText
              style={[
                styles.mainDisplayHeadingText,
                {
                  color: "#D05E43",
                  ...({
                    backgroundImage:
                      "linear-gradient(135deg, #D05E43, #A17E46, #42612D)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  } as any),
                },
              ]}
            >
              Your Family’s{"\n"}Personal AI Companion
            </ThemedText>
          ) : (
            <MaskedView
              style={styles.textMaskContainer}
              maskElement={
                <ThemedText style={styles.mainDisplayHeadingText}>
                  Your Family’s{"\n"}Personal AI Companion
                </ThemedText>
              }
            >
              <LinearGradient
                colors={["#D05E43", "#A17E46", "#42612D"]}
                start={{ x: 0.1, y: 0.2 }}
                end={{ x: 0.9, y: 0.8 }}
                style={StyleSheet.absoluteFill}
              />
            </MaskedView>
          )}

          <ThemedText style={styles.secondarySubheadDescription}>
            Plan, grow, learn and thrive together.{"\n"}Personalized guidance
            for parents, children and teens.
          </ThemedText>
        </View>
        {/* hero image */}
        <View style={styles.heroArtworkFrameContainer}>
          <Image source={MalarHeroImage} style={styles.heroImageAssetInline} />
        </View>
        {/* Features Cards */}
        <Animated.View
          entering={FadeInUp.duration(600).delay(200).springify().damping(15)}
          style={styles.overlapOuterCapsule}
        >
          <View style={styles.creamInnerPlate}>
            {/* Column 1: AI Coach */}
            <View style={styles.featureColumnItem}>
              <Image source={Malar} style={styles.sunflowerAssetInline} />
              <ThemedText style={styles.gridItemTitle}>AI Coach</ThemedText>
              <ThemedText style={styles.gridItemSub}>
                Smart guidance{"\n"}for every step
              </ThemedText>
            </View>

            <View style={styles.verticalSplitterLine} />

            {/* Column 2: Goals */}
            <View style={styles.featureColumnItem}>
              <Target
                size={20}
                color="#D05E43"
                strokeWidth={2.5}
                style={styles.directIconSpacing}
              />
              <ThemedText style={styles.gridItemTitle}>Goals</ThemedText>
              <ThemedText style={styles.gridItemSub}>
                Set goals and{"\n"}achieve more
              </ThemedText>
            </View>

            <View style={styles.verticalSplitterLine} />

            {/* Column 3: Planning */}
            <View style={styles.featureColumnItem}>
              <Calendar
                size={20}
                color="#5F7445"
                strokeWidth={2.5}
                style={styles.directIconSpacing}
              />
              <ThemedText style={styles.gridItemTitle}>Planning</ThemedText>
              <ThemedText style={styles.gridItemSub}>
                Plan days, trips{"\n"}and routines
              </ThemedText>
            </View>

            <View style={styles.verticalSplitterLine} />

            {/* Column 4: Activity Scout */}
            <View style={styles.featureColumnItem}>
              <Compass
                size={20}
                color="#D05E43"
                strokeWidth={2.5}
                style={styles.directIconSpacing}
              />
              <ThemedText style={styles.gridItemTitle}>
                Activity Scout
              </ThemedText>
              <ThemedText style={styles.gridItemSub}>
                Discover the activities for you
              </ThemedText>
            </View>

            <View style={styles.verticalSplitterLine} />

            <View style={styles.featureColumnItem}>
              <BookOpen
                size={20}
                color="#5F7445"
                strokeWidth={2.5}
                style={styles.directIconSpacing}
              />
              <ThemedText style={styles.gridItemTitle}>Journaling</ThemedText>
              <ThemedText style={styles.gridItemSub}>
                Reflect, grow{"\n"}and stay mindful
              </ThemedText>
            </View>
          </View>
        </Animated.View>

        {/* Partner spotlight - ads section */}
        <View style={styles.spotlightSectionHeader}>
          <ThemedText style={styles.spotlightSectionTitleText}>
            Partner Spotlight
          </ThemedText>
        </View>

        <View style={styles.spotlightMasterContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={width * 0.78 + 14}
            decelerationRate="fast"
            contentContainerStyle={styles.scrollTrackInnerPadding}
          >
            {/* CARD 1: LEARNIFY PARTNER */}
            <View style={styles.spotlightBaseCardItem}>
              <Image
                source={AdLearnifyImage}
                style={styles.adBannerMediaGraphic}
              />
              <Pressable
                style={[
                  styles.actionCtaTriggerPill,
                  { backgroundColor: theme.primary },
                ]}
                onPress={() => console.log("Navigate to Learnify Link")}
              >
                <ThemedText style={styles.actionCtaTextString}>
                  Try Free for 30 Days
                </ThemedText>
              </Pressable>
            </View>

            {/* CARD 2: NUTRILIFE */}
            <View style={styles.spotlightBaseCardItem}>
              <Image
                source={AdNutriLifeImage}
                style={styles.adBannerMediaGraphic}
              />
              <Pressable
                style={[
                  styles.actionCtaTriggerPill,
                  { backgroundColor: theme.primary },
                ]}
                onPress={() => console.log("Navigate to NutriLife Link")}
              >
                <ThemedText style={styles.actionCtaTextString}>
                  Get Your First Box Free
                </ThemedText>
              </Pressable>
            </View>

            {/* CARD 3: CREATIVE SPARK STUDIO */}
            <View style={styles.spotlightBaseCardItem}>
              <Image
                source={AdCreativeSparkImage}
                style={styles.adBannerMediaGraphic}
              />
              <Pressable
                style={[
                  styles.actionCtaTriggerPill,
                  { backgroundColor: theme.primary },
                ]}
                onPress={() => console.log("Navigate to CreativeSpark Link")}
              >
                <ThemedText style={styles.actionCtaTextString}>
                  Book a Free Trial Class
                </ThemedText>
              </Pressable>
            </View>
          </ScrollView>
        </View>

        {/* Our promises */}
        <View style={styles.trustMasterCapsuleContainer}>
          {/* Column 1: Private & Secure */}
          <View style={styles.trustBadgeColumnItem}>
            <View
              style={[
                styles.badgeCircleIconBackground,
                { backgroundColor: "#E9EFE3" },
              ]}
            >
              <Lock size={16} color="#5F7445" strokeWidth={2.5} />
            </View>
            <View style={styles.badgeTextFlexStack}>
              <ThemedText style={styles.badgeHeadingTitleText}>
                Private & Secure
              </ThemedText>
              <ThemedText style={styles.badgeSupportingBodyText}>
                Your data is yours.{"\n"}Always protected.
              </ThemedText>
            </View>
          </View>

          <View style={styles.trustVerticalSplitLine} />

          {/* Column 2: Family Safe */}
          <View style={styles.trustBadgeColumnItem}>
            <View
              style={[
                styles.badgeCircleIconBackground,
                { backgroundColor: "#FDF0E9" },
              ]}
            >
              <ShieldCheck size={16} color="#D05E43" strokeWidth={2.5} />
            </View>
            <View style={styles.badgeTextFlexStack}>
              <ThemedText style={styles.badgeHeadingTitleText}>
                Family Safe
              </ThemedText>
              <ThemedText style={styles.badgeSupportingBodyText}>
                Built for families,{"\n"}trusted by parents.
              </ThemedText>
            </View>
          </View>

          <View style={styles.trustVerticalSplitLine} />

          {/* Column 3: Child Focused */}
          <View style={styles.trustBadgeColumnItem}>
            <View
              style={[
                styles.badgeCircleIconBackground,
                { backgroundColor: "#E9EFE3" },
              ]}
            >
              <Flower size={16} color="#5F7445" strokeWidth={2.5} />
            </View>
            <View style={styles.badgeTextFlexStack}>
              <ThemedText style={styles.badgeHeadingTitleText}>
                Child Focused
              </ThemedText>
              <ThemedText style={styles.badgeSupportingBodyText}>
                Designed for every{"\n"}stage of growth.
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Get In touch */}
        <View style={styles.footerContactChannelsColumn}>
          <ThemedText style={styles.getInTouchLabelHeading}>
            Get in Touch
          </ThemedText>

          {/* phone and email */}
          <View style={styles.contactRowItemsAligner}>
            <Pressable
              style={styles.contactItemDetailRow}
              onPress={() => console.log("Dial Support Call Pipeline")}
            >
              <Phone size={14} color="#5F7445" />
              <ThemedText style={styles.contactItemString}>
                +91 98765 43210
              </ThemedText>
            </Pressable>

            <Pressable
              style={styles.contactItemDetailRow}
              onPress={() => console.log("Launch Native Mail Client Link")}
            >
              <Mail size={14} color="#5F7445" />
              <ThemedText style={styles.contactItemString}>
                hello@malar.ai
              </ThemedText>
            </Pressable>
          </View>

          {/* Socials */}
          <View style={styles.socialFollowContainerRow}>
            <ThemedText style={styles.followUsLabelText}>Follow us</ThemedText>

            <View style={styles.socialIconsRowStack}>
              {/* Instagram Button */}
              <Pressable
                style={styles.miniSocialCircleAsset}
                onPress={() => console.log("Redirect to Instagram Page")}
              >
                <FontAwesome name="instagram" size={16} color="#E1306C" />
              </Pressable>

              {/* YouTube Button */}
              <Pressable
                style={styles.miniSocialCircleAsset}
                onPress={() => console.log("Redirect to YouTube Channel")}
              >
                <FontAwesome name="youtube-play" size={16} color="#FF0000" />
              </Pressable>

              {/* X / Twitter Button */}
              <Pressable
                style={styles.miniSocialCircleAsset}
                onPress={() => console.log("Redirect to X Feed")}
              >
                <FontAwesome6 name="x-twitter" size={15} color="#000000" />
              </Pressable>

              {/* Facebook Button */}
              <Pressable
                style={styles.miniSocialCircleAsset}
                onPress={() => console.log("Redirect to Facebook Profile")}
              >
                <FontAwesome name="facebook" size={16} color="#1877F2" />
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
      {/* Sticky footer */}
      <SafeAreaView
        edges={["bottom"]}
        style={styles.stickyFooterContainerPanel}
      >
        <Pressable
          style={({ pressed }) => [
            styles.primaryLaunchCtaWidgetButton,
            { opacity: pressed ? 0.9 : 1 },
          ]}
          onPress={() => router.push("/auth/registernew" as any)}
        >
          <ThemedText style={styles.primaryLaunchCtaText}>
            Get Started Free
          </ThemedText>
          <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.5} />
        </Pressable>

        <View style={styles.accountRedirectAnchorRow}>
          <ThemedText style={styles.footerAccountPromptText}>
            Already have an account?{" "}
          </ThemedText>
          <Pressable onPress={() => router.push("/auth/loginnew" as any)}>
            <ThemedText style={styles.footerAccountRedirectActionText}>
              Login
            </ThemedText>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
  masterContainer: {
    flex: 1,
  },
  absoluteBackgroundLayer: {
    ...StyleSheet.absoluteFill,
    zIndex: -1,
  },
  fullScreenCanvasAsset: {
    width: "100%",
    height: "100%",
    resizeMode: "stretch",
  },
  scrollContentLayout: {
    flexGrow: 1,
    paddingBottom: 140,
  },
  headerSafeAreaRow: {
    alignItems: "flex-end",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  trustBadgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(95, 116, 69, 0.15)",
    gap: 6,
  },
  trustText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#5F7445",
  },
  logoBrandingWrapper: {
    alignItems: "center",
    marginTop: 10,
  },
  logoAssetWidget: {
    width: 130,
    height: 100,
    resizeMode: "cover",
  },
  brandMottoText: {
    fontSize: 12,
    fontStyle: "italic",
    color: "#5F7445",
    fontWeight: "500",
    marginTop: 2,
  },
  mainDisplayHeading: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    color: "#6D422B",
    lineHeight: 36,
    letterSpacing: -0.4,
  },
  premiumSectionHeaderRow: {
    paddingHorizontal: 24,
    marginTop: 15,
    marginBottom: 10,
  },
  premiumSectionLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#273C13",
  },
  premiumTrackHorizontalSpacing: {
    paddingLeft: 24,
    paddingRight: 12,
    gap: 12,
  },
  premiumHighlightCard: {
    width: width * 0.72,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.03)",
    gap: 8,
  },
  premiumCardBadgeText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
  },
  premiumCardBodyParagraph: {
    fontSize: 12,
    color: "#4B5563",
    lineHeight: 18,
  },
  cardMiniCtaTrigger: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginTop: 4,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  cardMiniCtaText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1F2937",
  },
  trustBadgesVerticalStack: {
    paddingHorizontal: 24,
    marginTop: 30,
    gap: 12,
  },
  horizontalBadgeItemRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    padding: 12,
    borderRadius: 16,
    gap: 12,
  },
  circleIconBadgeContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(95, 116, 69, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeTextLayoutNode: {
    flex: 1,
  },
  badgeTitleText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1F2937",
  },
  badgeDescriptionText: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 1,
  },
  stickyFooterContainerPanel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.88)",
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  primaryLaunchCtaWidgetButton: {
    backgroundColor: "#E07A5F",
    height: 52,
    borderRadius: 26,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    shadowColor: "#E07A5F",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryLaunchCtaText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  accountRedirectAnchorRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  footerAccountPromptText: {
    fontSize: 13,
    color: "#4B5563",
  },
  footerAccountRedirectActionText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#E07A5F",
  },

  footerContactChannelsColumn: {
    alignItems: "center",
    marginTop: 30,
    gap: 12,
    width: "100%",
  },
  getInTouchLabelHeading: {
    fontSize: 11,
    fontWeight: "700",
    color: "#5F7445",
    textTransform: "uppercase",
    letterSpacing: 1,
    opacity: 0.6,
  },
  contactRowItemsAligner: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
    width: "100%",
  },
  contactItemDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  contactItemString: {
    fontSize: 13,
    color: "#273C13",
    fontWeight: "600",
  },
  socialFollowContainerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    gap: 12,
  },
  followUsLabelText: {
    fontSize: 13,
    color: "#5F7445",
    fontWeight: "600",
    opacity: 0.8,
  },
  socialIconsRowStack: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  miniSocialCircleAsset: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    borderWidth: 1,
    borderColor: "rgba(95, 116, 69, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  typographyHeroGroup: {
    alignItems: "center",
    paddingHorizontal: 24,
    marginTop: 24,
    gap: 12,
  },
  textMaskContainer: {
    width: "100%",
    height: 72,
    justifyContent: "center",
    alignItems: "center",
  },
  mainDisplayHeadingText: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 36,
    letterSpacing: -0.4,
    backgroundColor: "transparent",
    color: "#000000",
  },
  secondarySubheadDescription: {
    fontSize: 14,
    textAlign: "center",
    color: "#5F7445",
    lineHeight: 20,
    fontWeight: "500",
    opacity: 0.85,
    marginTop: 4,
  },
  edgeBlendOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  horizontalTrackWrapper: {
    width: "100%",
    marginVertical: 16,
  },
  featuresHorizontalGrid: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 10,
    top: 0,
    gap: 2,
  },
  featureGridItem: {
    backgroundColor: "#FEF4E7",
    borderColor: "rgba(240, 230, 220, 0.4)",
    borderWidth: 1,
    width: width * 0.22,
    minWidth: 84,
    borderRadius: 22,
    paddingVertical: 16,
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#A17E46",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  heroArtworkFrameContainer: {
    position: "relative",
    width: "100%",
    alignItems: "center",
    zIndex: 1,
  },
  heroImageAssetInline: {
    width: width,
    height: 240,
    resizeMode: "cover",
  },
  overlapCapsuleContainer: {
    marginTop: -20,
    zIndex: 10,
    backgroundColor: "#FFFFFF",
    width: width * 0.95,
    alignSelf: "center",
    borderRadius: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 20,
    paddingHorizontal: 12,
    shadowColor: "#A17E46",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  featureColumnItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 2,
  },
  sunflowerAssetInline: {
    width: 25,
    height: 25,
    resizeMode: "contain",
    marginBottom: 8,
  },
  directIconSpacing: {
    marginBottom: 12,
  },
  gridItemTitle: {
    fontSize: 9.5,
    fontWeight: "700",
    color: "#273C13",
    textAlign: "center",
    letterSpacing: -0.2,
    marginBottom: 1,
  },
  gridItemSub: {
    fontSize: 8.2,
    color: "#5F7445",
    textAlign: "center",
    lineHeight: 8,
    fontWeight: "500",
    opacity: 0.8,
  },
  overlapOuterCapsule: {
    marginTop: -22,
    zIndex: 10,
    backgroundColor: "#FFFFFF",
    width: width * 0.95,
    alignSelf: "center",
    borderRadius: 24,
    padding: 8,
    shadowColor: "#A17E46",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 6,
  },
  creamInnerPlate: {
    backgroundColor: "#FEF4E7",
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-between",
    paddingVertical: 18,
    paddingHorizontal: 6,
  },
  verticalSplitterLine: {
    width: 1,
    backgroundColor: "#EFEBE4",
    marginVertical: 6,
  },
  spotlightSectionHeader: {
    paddingHorizontal: 24,
    marginTop: 28,
    marginBottom: 4,
    width: "100%",
    alignItems: "center",
  },
  spotlightSectionTitleText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#5F7445",
    letterSpacing: -0.3,
    alignItems: "center",
    justifyContent: "center",
  },
  spotlightMasterContainer: {
    width: "100%",
    marginVertical: 12,
  },
  scrollTrackInnerPadding: {
    paddingLeft: 24,
    paddingRight: 12,
    paddingVertical: 4,
  },
  spotlightBaseCardItem: {
    backgroundColor: "#FFFFFF",
    width: width * 0.78,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.06)",
    overflow: "hidden",
    paddingBottom: 14,
    marginRight: 14,
    shadowColor: "#A17E46",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  adBannerMediaGraphic: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  actionCtaTriggerPill: {
    marginHorizontal: 14,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 14,
  },
  actionCtaTextString: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  trustMasterCapsuleContainer: {
    backgroundColor: "#FCF9F5",
    width: width * 0.95,
    alignSelf: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(230, 220, 210, 0.4)",
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 8,
    marginTop: 24,
    marginBottom: 12,
    shadowColor: "#A17E46",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  trustBadgeColumnItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 2,
    gap: 4,
  },
  badgeCircleIconBackground: {
    width: 25,
    height: 25,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  badgeTextFlexStack: {
    flex: 1,
    justifyContent: "center",
  },
  badgeHeadingTitleText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#273C13",
    letterSpacing: -0.1,
    marginBottom: 2,
  },
  badgeSupportingBodyText: {
    fontSize: 8.5,
    color: "#5F7445",
    lineHeight: 11,
    fontWeight: "500",
    opacity: 0.85,
  },
  trustVerticalSplitLine: {
    width: 1,
    backgroundColor: "#EFEBE4",
    marginVertical: 4,
  },
});
