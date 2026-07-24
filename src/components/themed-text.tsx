import { Fonts, type RohatiTheme } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Platform, StyleSheet, Text, type TextProps } from "react-native";

export type TextThemeColorKey = {
  [K in keyof RohatiTheme]: RohatiTheme[K] extends string ? K : never;
}[keyof RohatiTheme];

export type ThemedTextProps = TextProps & {
  type?:
    | "default"
    | "title"
    | "small"
    | "smallBold"
    | "subtitle"
    | "link"
    | "linkPrimary"
    | "code";
  themeColor?: TextThemeColorKey;
};

export function ThemedText({
  style,
  type = "default",
  themeColor,
  ...rest
}: ThemedTextProps) {
  const theme = useTheme();

  // Safeguard: Fall back to 'text' key if an invalid value passes through runtime layers
  const targetColorKey = themeColor ?? "text";
  const resolvedColor =
    typeof theme[targetColorKey] === "string"
      ? (theme[targetColorKey] as string)
      : (theme["text"] as string);

  return (
    <Text
      style={[
        { color: resolvedColor },
        type === "default" && styles.default,
        type === "title" && styles.title,
        type === "small" && styles.small,
        type === "smallBold" && styles.smallBold,
        type === "subtitle" && styles.subtitle,
        type === "link" && styles.link,
        type === "linkPrimary" && styles.linkPrimary,
        type === "code" && styles.code,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
  },
  smallBold: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
  },
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "700",
  },
  link: {
    lineHeight: 20,
    fontSize: 14,
  },
  linkPrimary: {
    lineHeight: 20,
    fontSize: 14,
  },
  code: {
    fontFamily: Fonts.mono,
    fontWeight: Platform.select({ android: "700" }) ?? "500",
    fontSize: 12,
  },
});
