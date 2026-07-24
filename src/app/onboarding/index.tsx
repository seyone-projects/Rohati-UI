import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../context/AuthContext";
import OnboardingScreen, { OnboardingData } from "../../screens/OnboardingPage"; // Points straight to your file location
import * as authService from "../../services/authService";

export default function OnboardingRoute() {
  const { login, user } = useAuth();

  const handleWizardSubmit = async (formData: OnboardingData) => {
    try {
      console.log(
        "Onboarding profile dataset collected successfully:",
        formData,
      );
      if (user) {
        // Send request to backend to mark user as onboarded
        const response = await authService.completeOnboarding({
          name: formData.name,
        });

        if (response.success && response.user) {
          const storedToken = await AsyncStorage.getItem("accessToken");
          await login(storedToken || "dummy_token", response.user);
        }
      }
    } catch (error) {
      console.log("Failed saving onboarding metrics:", error);
    }
  };

  return <OnboardingScreen onComplete={handleWizardSubmit} />;
}
