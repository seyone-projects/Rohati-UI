// import { View } from 'react-native';
import LandingPage from "@/screens/NewLandingPage";

export default function Index() {
  // This screen will be briefly mounted before the AuthGuard in _layout.tsx
  // redirects the user to either the login screen or the main feed.
  // return <View style={{ flex: 1, backgroundColor: '#fff' }} />;
  return <LandingPage />;
}
