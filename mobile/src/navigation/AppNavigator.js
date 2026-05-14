import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

// Import screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DashboardScreen from '../screens/DashboardScreen';
import DogListScreen from '../screens/DogListScreen';
import DogDetailScreen from '../screens/DogDetailScreen';
import DogFormScreen from '../screens/DogFormScreen';
import AdminUsersScreen from '../screens/AdminUsersScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Dog Stack Navigator
function DogStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#1e3a5f' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen 
        name="DogList" 
        component={DogListScreen} 
        options={{ title: 'My Dogs' }}
      />
      <Stack.Screen 
        name="DogDetail" 
        component={DogDetailScreen} 
        options={{ title: 'Dog Details' }}
      />
      <Stack.Screen 
        name="DogForm" 
        component={DogFormScreen} 
        options={({ route }) => ({ 
          title: route.params?.dog ? 'Edit Dog' : 'Add New Dog' 
        })}
      />
    </Stack.Navigator>
  );
}

// Admin Stack Navigator
function AdminStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#1e3a5f' },
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen 
        name="AdminUsers" 
        component={AdminUsersScreen} 
        options={{ title: 'User Management' }}
      />
    </Stack.Navigator>
  );
}

// Auth Stack Navigator (for unauthenticated users)
function AuthStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#1e3a5f' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen} 
        options={{ title: 'Create Account' }}
      />
    </Stack.Navigator>
  );
}

// Main Tab Navigator (authenticated users)
function MainTabNavigator() {
  const { isAdmin } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Dogs') {
            iconName = focused ? 'paw' : 'paw-outline';
          } else if (route.name === 'Admin') {
            iconName = focused ? 'people' : 'people-outline';
          }
          // If you don't have vector-icons installed, comment out the icon line
          // and the tabBarIcon option above
          return null; // Temporary fix if icons not installed
        },
        tabBarActiveTintColor: '#1e3a5f',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Dogs" component={DogStackNavigator} />
      {isAdmin && <Tab.Screen name="Admin" component={AdminStackNavigator} />}
    </Tab.Navigator>
  );
}

// Main App Navigator
export default function AppNavigator() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabNavigator /> : <AuthStackNavigator />}
    </NavigationContainer>
  );
}