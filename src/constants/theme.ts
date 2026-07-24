// /**
//  * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
//  * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
//  */

import "@/global.css";

import { Platform } from "react-native";

// export const Colors = {
//   light: {
//     text: '#000000',
//     background: '#ffffff',
//     backgroundElement: '#F0F0F3',
//     backgroundSelected: '#E0E1E6',
//     textSecondary: '#60646C',
//   },
//   dark: {
//     text: '#ffffff',
//     background: '#000000',
//     backgroundElement: '#212225',
//     backgroundSelected: '#2E3135',
//     textSecondary: '#B0B4BA',
//   },
// } as const;

// export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

// export const Fonts = Platform.select({
//   ios: {
//     /** iOS `UIFontDescriptorSystemDesignDefault` */
//     sans: 'system-ui',
//     /** iOS `UIFontDescriptorSystemDesignSerif` */
//     serif: 'ui-serif',
//     /** iOS `UIFontDescriptorSystemDesignRounded` */
//     rounded: 'ui-rounded',
//     /** iOS `UIFontDescriptorSystemDesignMonospaced` */
//     mono: 'ui-monospace',
//   },
//   default: {
//     sans: 'normal',
//     serif: 'serif',
//     rounded: 'normal',
//     mono: 'monospace',
//   },
//   web: {
//     sans: 'var(--font-display)',
//     serif: 'var(--font-serif)',
//     rounded: 'var(--font-rounded)',
//     mono: 'var(--font-mono)',
//   },
// });

// export const Spacing = {
//   half: 2,
//   one: 4,
//   two: 8,
//   three: 16,
//   four: 24,
//   five: 32,
//   six: 64,
// } as const;

// export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
// export const MaxContentWidth = 800;

// I am gonna integrate the custom 6 themes i created for the website template

// ----- THEME INTERFACE DEFINITIONS ------------------
export interface RohatiTheme {
  id: string;
  name: string;
  emoji: string;
  text: string;
  textSecondary: string;
  background: string;
  backgroundElement: string;
  backgroundSelected: string;
  primary: string;
  primaryLight: string;
  secondary: string;
  accent: string;
  gold: string;
  gradientColors: [string, string];
  gradientSoftColors: [string, string];
  glowA: string;
  glowB: string;
  cardBorder: string;
}

// -------- LIGHT MODE - CUSTOM THEMES ---------------------------------
const LightThemes: Record<string, RohatiTheme> = {
  lotus: {
    id: "lotus",
    name: "Lotus",
    emoji: "🪷",
    text: "#2D0015",
    textSecondary: "#831843",
    background: "#FFFFFF",
    backgroundElement: "#FFF5F9",
    backgroundSelected: "#FCE7F3",
    primary: "#F472B6",
    primaryLight: "#F9A8D4",
    secondary: "#FCE7F3",
    accent: "#14B8A6",
    gold: "#F5A623",
    gradientColors: ["#F472B6", "#F9A8D4"],
    gradientSoftColors: ["rgba(244,114,182,0.15)", "rgba(249,168,212,0.15)"],
    glowA: "rgba(244,114,182,0.5)",
    glowB: "rgba(249,168,212,0.4)",
    cardBorder: "rgba(244,114,182,0.18)",
  },
  rose: {
    id: "rose",
    name: "Rose",
    emoji: "🌹",
    text: "#3F0712",
    textSecondary: "#991B1B",
    background: "#FFFFFF",
    backgroundElement: "#FFF5F5",
    backgroundSelected: "#FCE7F3",
    primary: "#DC2626",
    primaryLight: "#EF4444",
    secondary: "#FCE7F3",
    accent: "#10B981",
    gold: "#D97706",
    gradientColors: ["#DC2626", "#EF4444"],
    gradientSoftColors: ["rgba(220,38,38,0.15)", "rgba(239,68,68,0.15)"],
    glowA: "rgba(220,38,38,0.5)",
    glowB: "rgba(239,68,68,0.4)",
    cardBorder: "rgba(220,38,38,0.18)",
  },
  jasmine: {
    id: "jasmine",
    name: "Jasmine",
    emoji: "🌼",
    text: "#022C16",
    textSecondary: "#065F46",
    background: "#FFFFFF",
    backgroundElement: "#F7FDF9",
    backgroundSelected: "#E8FBF0",
    primary: "#16a34a",
    primaryLight: "#BBF7D0",
    secondary: "#F7FDF9",
    accent: "#6366F1",
    gold: "#F59E0B",
    gradientColors: ["#16a34a", "#86EFAC"],
    gradientSoftColors: ["rgba(134,239,172,0.15)", "rgba(187,247,208,0.15)"],
    glowA: "rgba(134,239,172,0.5)",
    glowB: "rgba(187,247,208,0.4)",
    cardBorder: "rgba(134,239,172,0.18)",
  },
  marigold: {
    id: "marigold",
    name: "Marigold",
    emoji: "🌻",
    text: "#1E2A22",
    textSecondary: "#4D3222",
    background: "#FFF9F2",
    backgroundElement: "#F7C948",
    backgroundSelected: "#2E5A44",
    primary: "#2E5A44",
    primaryLight: "#FDE68A",
    secondary: "#4D3222",
    accent: "#2E5A44",
    gold: "#F9C74F",
    gradientColors: ["#F7C948", "#2E5A44"],
    gradientSoftColors: ["rgba(247,201,72,0.12)", "rgba(46,90,68,0.12)"],
    glowA: "rgba(46,90,68,0.4)",
    glowB: "rgba(247,201,72,0.3)",
    cardBorder: "rgba(77,50,34,0.12)",
  },

  lilac: {
    id: "lilac",
    name: "Lilac",
    emoji: "🪻",
    text: "#210041",
    textSecondary: "#5B21B6",
    background: "#FFF5F9",
    backgroundElement: "#FAF5FF",
    backgroundSelected: "#F3E8FF",
    primary: "#9333ea",
    primaryLight: "#F3E8FF",
    secondary: "#F472B6",
    accent: "#06B6D4",
    gold: "#F5A623",
    gradientColors: ["#9333ea", "#D8B4FE"],
    gradientSoftColors: ["rgba(216,180,254,0.15)", "rgba(244,114,182,0.15)"],
    glowA: "rgba(216,180,254,0.5)",
    glowB: "rgba(244,114,182,0.4)",
    cardBorder: "rgba(216,180,254,0.18)",
  },
  classic: {
    id: "classic",
    name: "Classic",
    emoji: "💼",
    text: "#0F172A",
    textSecondary: "#334155",
    background: "#F1F5F9",
    backgroundElement: "#FFFDF9",
    backgroundSelected: "#FAF6E8",
    primary: "#1E293B",
    primaryLight: "#FFFDF5",
    secondary: "#D97706",
    accent: "#EC4899",
    gold: "#D97706",
    gradientColors: ["#1E293B", "#334155"],
    gradientSoftColors: ["rgba(30,41,59,0.15)", "rgba(217,119,6,0.15)"],
    glowA: "rgba(30,41,59,0.5)",
    glowB: "rgba(217,119,6,0.4)",
    cardBorder: "rgba(30,41,59,0.15)",
  },
  malar: {
    id: "malar",
    name: "Malar",
    emoji: "🌱",
    text: "#6D422B",
    textSecondary: "#8D8D8D",
    background: "#FFF9F2",
    backgroundElement: "#EAF3E3",
    backgroundSelected: "#F8C9CB",
    primary: "#C65A2A",
    primaryLight: "#F8C9CB",
    secondary: "#A8BE95",
    accent: "#5F7445",
    gold: "#E8A62C",
    gradientColors: ["#C65A2A", "#E8A62C"],
    gradientSoftColors: ["rgba(198,90,42,0.1)", "rgba(232,166,44,0.1)"],
    glowA: "rgba(198,90,42,0.3)",
    glowB: "rgba(95,116,69,0.2)",
    cardBorder: "rgba(109,66,43,0.12)",
  },
};

//----- DARK MODE CIUSTOM THEMES-----------------------------------
const DarkThemes: Record<string, RohatiTheme> = {
  lotus: {
    ...LightThemes.lotus,
    text: "#FFFFFF",
    textSecondary: "#F9A8D4",
    background: "#1A000D",
    backgroundElement: "#4A0426",
    backgroundSelected: "#831843",
  },
  rose: {
    ...LightThemes.rose,
    text: "#FFFFFF",
    textSecondary: "#EF4444",
    background: "#1C0000",
    backgroundElement: "#450A0A",
    backgroundSelected: "#7F1D1D",
  },
  jasmine: {
    ...LightThemes.jasmine,
    text: "#FFFFFF",
    textSecondary: "#86EFAC",
    background: "#021E0F",
    backgroundElement: "#064E3B",
    backgroundSelected: "#14532D",
  },
  marigold: {
    ...LightThemes.marigold,
    text: "#FCF9F2",
    textSecondary: "#FDE68A",
    background: "#121A15",
    backgroundElement: "#1B2A21",
    backgroundSelected: "#F7C948",
  },
  lilac: {
    ...LightThemes.lilac,
    text: "#FFFFFF",
    textSecondary: "#D8B4FE",
    background: "#120024",
    backgroundElement: "#3B0764",
    backgroundSelected: "#581C87",
  },
  classic: {
    ...LightThemes.classic,
    text: "#FFFFFF",
    textSecondary: "#94A3B8",
    background: "#020617",
    backgroundElement: "#0F172A",
    backgroundSelected: "#1E293B",
  },
  malar: {
    ...LightThemes.malar,
    text: "#FFF9F2",
    textSecondary: "#A8BE95",
    background: "#1E120C",
    backgroundElement: "#2A1B14",
    backgroundSelected: "#3D251B",
  },
};

export const MasterThemes = {
  light: LightThemes,
  dark: DarkThemes,
};

export type ThemeColor = keyof RohatiTheme;

// ----------OTHER STYLING ------------------------------------------
export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "var(--font-display)",
    serif: "var(--font-serif)",
    rounded: "var(--font-rounded)",
    mono: "var(--font-mono)",
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
