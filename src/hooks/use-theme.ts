/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

// import { Colors } from '@/constants/theme';
// import { useColorScheme } from '@/hooks/use-color-scheme';

// export function useTheme() {
//   const scheme = useColorScheme();
//   const theme = scheme === 'unspecified' ? 'light' : scheme;

//   return Colors[theme];
// }
// Modifying the hook to use the custom themes that i have designed
import { MasterThemes, RohatiTheme } from "@/constants/theme";
import { useColorScheme } from "react-native";

const CUURENT_BRAND_THEME_ID = "lotus";

export function useTheme(): RohatiTheme {
  const scheme = useColorScheme();
  const activeMode = scheme === "unspecified" ? "light" : scheme;
  const themeMap = MasterThemes[activeMode];
  return themeMap[CUURENT_BRAND_THEME_ID] || themeMap["classic"];
}
