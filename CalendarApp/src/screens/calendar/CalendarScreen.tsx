import React, { useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CalendarStackParamList, CalendarViewMode, CalendarDay, Meeting } from '../../types';
import { CalendarHeader, CalendarGrid, DayView } from '../../components/calendar';
import { MeetingList } from '../../components/meeting';
import { useMeetings } from '../../context/MeetingsContext';
import { getMonthDays, formatDateString } from '../../utils/dateUtils';
import { Colors, Spacing, FontSize, FontWeight } from '../../theme';

type CalendarScreenProps = {
  navigation: NativeStackNavigationProp<CalendarStackParamList, 'CalendarHome'>;
};

export const CalendarScreen: React.FC<CalendarScreenProps> = ({ navigation }) => {
  const { meetings, getMeetingsForDate } = useMeetings();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const calendarDays = useMemo(() => {
    return getMonthDays(year, month, selectedDate, meetings);
  }, [year, month, selectedDate, meetings]);

  const selectedDateMeetings = useMemo(() => {
    const dateString = formatDateString(selectedDate);
    return getMeetingsForDate(dateString);
  }, [selectedDate, getMeetingsForDate]);

  const handlePrevious = useCallback(() => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(year, month - 1, 1));
    } else {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() - 1);
      setSelectedDate(newDate);
      setCurrentDate(new Date(newDate.getFullYear(), newDate.getMonth(), 1));
    }
  }, [viewMode, year, month, selectedDate]);

  const handleNext = useCallback(() => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(year, month + 1, 1));
    } else {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() + 1);
      setSelectedDate(newDate);
      setCurrentDate(new Date(newDate.getFullYear(), newDate.getMonth(), 1));
    }
  }, [viewMode, year, month, selectedDate]);

  const handleToday = useCallback(() => {
    const today = new Date();
    setSelectedDate(today);
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
  }, []);

  const handleDayPress = useCallback((day: CalendarDay) => {
    setSelectedDate(day.date);
    setViewMode('day');
  }, []);

  const handleViewModeChange = useCallback((mode: CalendarViewMode) => {
    setViewMode(mode);
  }, []);

  const handleMeetingPress = useCallback(
    (meeting: Meeting) => {
      navigation.navigate('MeetingForm', { meeting });
    },
    [navigation]
  );

  const handleTimeSlotPress = useCallback(
    (_time: string) => {
      const dateString = formatDateString(selectedDate);
      navigation.navigate('MeetingForm', { date: dateString });
    },
    [navigation, selectedDate]
  );

  const handleAddMeeting = useCallback(() => {
    const dateString = formatDateString(selectedDate);
    navigation.navigate('MeetingForm', { date: dateString });
  }, [navigation, selectedDate]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerContainer}>
        <Text style={styles.screenTitle}>Calendar</Text>
      </View>

      <CalendarHeader
        year={year}
        month={month}
        viewMode={viewMode}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onViewModeChange={handleViewModeChange}
        onToday={handleToday}
      />

      {viewMode === 'month' && (
        <View style={styles.monthViewContainer}>
          <CalendarGrid days={calendarDays} onDayPress={handleDayPress} />
          <View style={styles.meetingsSection}>
            <Text style={styles.meetingsSectionTitle}>
              Meetings for Selected Day
            </Text>
            <MeetingList
              meetings={selectedDateMeetings}
              onMeetingPress={handleMeetingPress}
              emptyMessage="No meetings for this day"
            />
          </View>
        </View>
      )}

      {viewMode === 'day' && (
        <DayView
          selectedDate={selectedDate}
          meetings={selectedDateMeetings}
          onMeetingPress={handleMeetingPress}
          onTimeSlotPress={handleTimeSlotPress}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={handleAddMeeting}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  screenTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  monthViewContainer: {
    flex: 1,
  },
  meetingsSection: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  meetingsSectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
    padding: Spacing.md,
    backgroundColor: Colors.backgroundSecondary,
  },
  fab: {
    position: 'absolute',
    right: Spacing.lg,
    bottom: Spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  fabText: {
    fontSize: 28,
    color: Colors.textInverse,
    fontWeight: FontWeight.regular,
    marginTop: -2,
  },
});
