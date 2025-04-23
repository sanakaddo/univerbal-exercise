import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { z } from 'zod';

import { appRouteNames } from '@/routes';
import FavoritesScreen from '@/screens/favorites';
import HomeScreen from '@/screens/home';
import MovieScreen from '@/screens/movie';
import TopRatedScreen from '@/screens/top-rated';
import TvSeriesScreen from '@/screens/tv-series';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const envSchema = z.object({
  EXPO_PUBLIC_SERVER_IP: z.string().ip(),
  EXPO_PUBLIC_SERVER_PORT: z.string().length(4),
});
const result = envSchema.safeParse(process.env);
if (result.error) {
  console.error(result.error);
}
console.info('[app]: ENV', result.data);

// Bottom tabs
function BottomTabs() {
  return (
    <Tab.Navigator initialRouteName={appRouteNames.root}>
      <Tab.Screen
        name={appRouteNames.root}
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name={appRouteNames.topRated}
        component={TopRatedScreen}
        options={{
          tabBarLabel: 'Top Rated',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="star-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name={appRouteNames.favorites}
        component={FavoritesScreen}
        options={{
          tabBarLabel: 'Favorites',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Global stack navigator
export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" animated />
      <Stack.Navigator initialRouteName="tabs">
        <Stack.Screen
          name="tabs"
          component={BottomTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={appRouteNames.movie}
          component={MovieScreen}
          options={{ title: 'Movie' }}
        />
        <Stack.Screen
          name={appRouteNames.tvSeries}
          component={TvSeriesScreen}
          options={{ title: 'TV Series' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
