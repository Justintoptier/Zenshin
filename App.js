import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Outfit_400Regular, Outfit_500Medium, Outfit_600SemiBold, Outfit_700Bold, Outfit_800ExtraBold, Outfit_900Black } from '@expo-google-fonts/outfit';
import { DancingScript_400Regular, DancingScript_700Bold } from '@expo-google-fonts/dancing-script';
import HomeScreen from './screens/HomeScreen';
import LogScreen from './screens/LogScreen';
import ProgressScreen from './screens/ProgressScreen';
import ProfileScreen from './screens/ProfileScreen';
import theme from './constants/theme';
import { initializeDatabase } from './database/db';

const Tab = createBottomTabNavigator();

const MyDarkTheme = {
  dark: true,
  colors: {
    primary: theme.colors.accent,
    background: theme.colors.background,
    card: theme.colors.background,
    text: theme.colors.textPrimary,
    border: theme.colors.border,
    notification: theme.colors.accent,
  },
  fonts: {
    regular: { fontFamily: 'Outfit_400Regular', fontWeight: '400' },
    medium: { fontFamily: 'Outfit_500Medium', fontWeight: '500' },
    bold: { fontFamily: 'Outfit_700Bold', fontWeight: '700' },
    heavy: { fontFamily: 'Outfit_900Black', fontWeight: '900' },
  },
};

const App = () => {
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Outfit_800ExtraBold,
    Outfit_900Black,
    DancingScript_400Regular,
    DancingScript_700Bold,
  });

  useEffect(() => { initializeDatabase(); }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={MyDarkTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.colors.background,
            borderTopColor: theme.colors.border,
            borderTopWidth: 1,
            height: 62,
            paddingBottom: 8,
            paddingTop: 6,
          },
          tabBarActiveTintColor: theme.colors.accent,
          tabBarInactiveTintColor: theme.colors.textSecondary,
          tabBarLabelStyle: { fontFamily: 'Outfit_700Bold', fontSize: 10, letterSpacing: 0.3 },
          tabBarIcon: ({ color }) => {
            const icons = { Home: 'home', Log: 'barbell-outline', Progress: 'stats-chart', Profile: 'person-outline' };
            return <Ionicons name={icons[route.name]} size={22} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Log" component={LogScreen} />
        <Tab.Screen name="Progress" component={ProgressScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
