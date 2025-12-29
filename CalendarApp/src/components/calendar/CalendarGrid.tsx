import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, FontSize, FontWeight } from '../../theme';
import { CalendarDay } from '../../types';
import { DAYS_OF_WEEK } from '../../utils/dateUtils';

interface CalendarGridProps {
  days: CalendarDay[];
  onDayPress: (day: CalendarDay) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  days,
  onDayPress,
}) => {
  return (
    <View style={styles.container}>
      {/* Week day headers */}
      <View style={styles.weekDaysRow}>
        {DAYS_OF_WEEK.map((day) => (
          <View key={day} style={styles.weekDayCell}>
            <Text
              style={[
                styles.weekDayText,
                (day === 'Sun' || day === 'Sat') && styles.weekendText,
              ]}
            >
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* Calendar days grid */}
      <View style={styles.daysGrid}>
        {days.map((day, index) => (
          <TouchableOpacity
            key={`${day.dateString}-${index}`}
            style={styles.dayCell}
            onPress={() => onDayPress(day)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.dayContent,
                day.isToday && styles.todayContent,
                day.isSelected && styles.selectedContent,
              ]}
            >
              <Text
                style={[
                  styles.dayText,
                  !day.isCurrentMonth && styles.otherMonthText,
                  day.isWeekend && styles.weekendText,
                  day.isToday && styles.todayText,
                  day.isSelected && styles.selectedText,
                ]}
              >
                {day.day}
              </Text>
            </View>

            {/* Event indicators */}
            {day.meetings.length > 0 && (
              <View style={styles.eventIndicators}>
                {day.meetings.slice(0, 3).map((meeting) => (
                  <View
                    key={meeting.id}
                    style={[
                      styles.eventDot,
                      { backgroundColor: meeting.color || Colors.calendarEvent },
                    ]}
                  />
                ))}
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.xs,
  },
  weekDaysRow: {
    flexDirection: 'row',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
  },
  weekDayText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
  },
  weekendText: {
    color: Colors.textLight,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%', // 100% / 7 days
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xs,
  },
  dayContent: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  todayContent: {
    backgroundColor: Colors.calendarToday + '20', // 20% opacity
    borderWidth: 1,
    borderColor: Colors.calendarToday,
  },
  selectedContent: {
    backgroundColor: Colors.calendarSelected,
  },
  dayText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.regular,
    color: Colors.textPrimary,
  },
  otherMonthText: {
    color: Colors.textLight,
  },
  todayText: {
    fontWeight: FontWeight.semibold,
    color: Colors.calendarToday,
  },
  selectedText: {
    color: Colors.textInverse,
    fontWeight: FontWeight.semibold,
  },
  eventIndicators: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 2,
    gap: 2,
  },
  eventDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
