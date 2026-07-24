import { type RohatiTheme } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { View, type ViewProps } from "react-native";

export type ViewThemeColorKey = {
  [K in keyof RohatiTheme]: RohatiTheme[K] extends string ? K : never;
}[keyof RohatiTheme];

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  type?: ViewThemeColorKey;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  type,
  ...otherProps
}: ThemedViewProps) {
  const theme = useTheme();

  const targetColorKey = type ?? "background";
  const resolvedBackgroundColor =
    typeof theme[targetColorKey] === "string"
      ? (theme[targetColorKey] as string)
      : (theme["background"] as string);

  return (
    <View
      style={[{ backgroundColor: resolvedBackgroundColor }, style]}
      {...otherProps}
    />
  );
}
