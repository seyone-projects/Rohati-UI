import { useAuth } from "../../context/AuthContext";
import OnboardingScreen, { OnboardingData } from "../../screens/OnboardingPage"; // Points straight to your file location

export default function OnboardingRoute() {
  const { login, user } = useAuth();

  const handleWizardSubmit = async (formData: OnboardingData) => {
    try {
      console.log(
        "Onboarding profile dataset collected successfully:",
        formData,
      );
      if (user) {
        const updatedProfile = {
          ...user,
          name: formData.name,
          isOnboarded: true,
        };

        await login("dummy_or_existing_token", updatedProfile);
      }
    } catch (error) {
      console.error("Failed saving onboarding metrics:", error);
    }
  };

  return <OnboardingScreen onComplete={handleWizardSubmit} />;
}
