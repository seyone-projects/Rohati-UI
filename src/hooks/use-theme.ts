import { MasterThemes, RohatiTheme } from "@/constants/theme";
import { useColorScheme } from "react-native";

const CURRENT_BRAND_THEME_ID = "malar";

export function useTheme(): RohatiTheme {
  const scheme = useColorScheme();
  // Safe mapping constraint to guarantee activeMode evaluates to strictly "light" or "dark"
  const activeMode = scheme === "dark" ? "dark" : "light";

  const themeMap = MasterThemes[activeMode];
  return themeMap[CURRENT_BRAND_THEME_ID] || themeMap["classic"];
}
