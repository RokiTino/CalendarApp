import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CalendarStackParamList } from '../types';
import { CalendarScreen, MeetingFormScreen } from '../screens/calendar';

const Stack = createNativeStackNavigator<CalendarStackParamList>();

export const CalendarNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="CalendarHome" component={CalendarScreen} />
      <Stack.Screen
        name="MeetingForm"
        component={MeetingFormScreen}
        options={{
          animation: 'slide_from_bottom',
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
};
