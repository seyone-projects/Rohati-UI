import { ThemedView } from "@/components/themed-view";
import { Slot, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "../context/AuthContext";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function InitialLayout() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const currentSegments = segments as string[];
    const rootSegment = currentSegments[0] || "";
    // Check if the current route is in the auth folder
    const inAuthGroup = rootSegment === "auth";

    // check if the current route is in the main folder
    const inMainGroup = rootSegment === "main";
    const inOnboardingGroup = rootSegment === "onboarding";

    // check if the user is in landing screen
    // const atRootLanding = !inAuthGroup && !inMainGroup;
    const atRootLanding = currentSegments.length === 0 || rootSegment === "";

    // if (!user && !inAuthGroup && !atRootLanding) {
    //   // Redirect to the login page if not authenticated
    //   // router.replace("/auth/login");
    //   router.replace("/"); // redirecting to the landing page designed
    // } else if (user && (inAuthGroup || atRootLanding)) {
    //   // Redirect to the main feed if authenticated and trying to access login
    //   if (segments[1] === "loginnew") {
    //     router.replace("/main");
    //   } else {
    //     router.replace("/auth/loginnew");
    //   }
    // }
    if (!user) {
      if (!inAuthGroup && !atRootLanding) {
        router.replace("/" as any);
      }
      return;
    }
    const hasCompletedOnboarding = user?.isOnboarded ?? false;
    if (!hasCompletedOnboarding) {
      if (!inOnboardingGroup) {
        router.replace("/onboarding" as any);
      }
    } else {
      if (inAuthGroup || atRootLanding || inOnboardingGroup) {
        router.replace("/main");
      }
    }
  }, [user, isLoading, segments]);

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return <ThemedView style={{ flex: 1 }} />;
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
}
