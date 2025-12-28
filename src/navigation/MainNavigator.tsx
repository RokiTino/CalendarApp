import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { MainTabParamList, CalendarStackParamList } from '../types';
import CalendarScreen from '../screens/Calendar/CalendarScreen';
import CreateEventScreen from '../screens/Event/CreateEventScreen';
import EditEventScreen from '../screens/Event/EditEventScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import { theme } from '../theme';

const Tab = createBottomTabNavigator<MainTabParamList>();
const CalendarStack = createNativeStackNavigator<CalendarStackParamList>();

// Calendar Stack Navigator
const CalendarStackNavigator: React.FC = () => {
  return (
    <CalendarStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 250,
      }}
    >
      <CalendarStack.Screen name="CalendarHome" component={CalendarScreen} />
      <CalendarStack.Screen
        name="CreateEvent"
        component={CreateEventScreen}
        options={{
          animation: 'slide_from_bottom',
          presentation: 'modal',
        }}
      />
      <CalendarStack.Screen
        name="EditEvent"
        component={EditEventScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
    </CalendarStack.Navigator>
  );
};

const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === 'CalendarTab') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen
        name="CalendarTab"
        component={CalendarStackNavigator}
        options={{
          tabBarLabel: 'Calendar',
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
