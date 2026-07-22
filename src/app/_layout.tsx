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

    // Check if the current route is in the auth folder
    const inAuthGroup = segments[0] === "auth";

    // check if the current route is in the main folder
    const inMainGroup = segments[0] === "main";

    // check if the user is in landing screen
    const atRootLanding = !inAuthGroup && !inMainGroup;

    if (!user && !inAuthGroup && !atRootLanding) {
      // Redirect to the login page if not authenticated
      // router.replace("/auth/login");
      router.replace("/"); // redirecting to the landing page designed
    } else if (user && (inAuthGroup || atRootLanding)) {
      // Redirect to the main feed if authenticated and trying to access login
      if (segments[1] === "loginnew") {
        router.replace("/main");
      } else {
        router.replace("/auth/loginnew");
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
