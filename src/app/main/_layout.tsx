import { Stack } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { TouchableOpacity, Text } from 'react-native';

export default function MainLayout() {
  const { logout } = useAuth();

  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Rohati Feed',
          headerRight: () => (
            <TouchableOpacity onPress={logout} style={{ marginRight: 15 }}>
              <Text style={{ color: '#208AEF', fontWeight: 'bold' }}>Logout</Text>
            </TouchableOpacity>
          )
        }} 
      />
    </Stack>
  );
}
