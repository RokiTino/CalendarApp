import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CalendarDay as CalendarDayType } from '../../types';
import { theme } from '../../theme';

interface CalendarDayProps {
  day: CalendarDayType;
  onPress: () => void;
}

const CalendarDay: React.FC<CalendarDayProps> = memo(({ day, onPress }) => {
  const getDayContainerStyle = () => {
    const baseStyle = [styles.dayContainer];

    if (day.isSelected) {
      baseStyle.push(styles.dayContainerSelected);
    } else if (day.isToday) {
      baseStyle.push(styles.dayContainerToday);
    }

    return baseStyle;
  };

  const getDayTextStyle = () => {
    const baseStyle = [styles.dayText];

    if (!day.isCurrentMonth) {
      baseStyle.push(styles.dayTextOutside);
    }

    if (day.isSelected) {
      baseStyle.push(styles.dayTextSelected);
    } else if (day.isToday) {
      baseStyle.push(styles.dayTextToday);
    }

    return baseStyle;
  };

  return (
    <TouchableOpacity
      testID="calendar-day"
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.6}
    >
      <View style={getDayContainerStyle()}>
        <Text style={getDayTextStyle()}>{day.day}</Text>
      </View>
      
      {/* Event indicators */}
      {day.hasEvents && (
        <View style={styles.eventIndicatorContainer}>
          {day.events.slice(0, 3).map((event, index) => (
            <View
              testID="event-indicator"
              key={event.id}
              style={[
                styles.eventIndicator,
                { backgroundColor: event.color },
              ]}
            />
          ))}
          {day.events.length > 3 && (
            <Text style={styles.moreEventsText}>+{day.events.length - 3}</Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    aspectRatio: 1,
    padding: 2,
    alignItems: 'center',
  },
  dayContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayContainerSelected: {
    backgroundColor: theme.colors.primary,
  },
  dayContainerToday: {
    backgroundColor: theme.colors.primary + '20',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
  },
  dayTextOutside: {
    color: theme.colors.textSecondary,
    opacity: 0.5,
  },
  dayTextSelected: {
    color: theme.colors.white,
  },
  dayTextToday: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  eventIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
    height: 6,
  },
  eventIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 1,
  },
  moreEventsText: {
    fontSize: 8,
    color: theme.colors.textSecondary,
    marginLeft: 2,
  },
});

export default CalendarDay;
