import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { CalendarEvent, CalendarMonth } from '../../types';
import {
  generateCalendarMonth,
  getMonthName,
  getShortDayName,
  getPreviousMonth,
  getNextMonth,
  formatDateToISO,
} from '../../utils/dateUtils';
import CalendarDay from './CalendarDay';
import { styles } from './styles';
import { theme } from '../../theme';

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  events: CalendarEvent[];
  onMonthChange?: (year: number, month: number) => void;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const WEEKDAYS = [0, 1, 2, 3, 4, 5, 6]; // Sunday to Saturday

const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  onDateSelect,
  events,
  onMonthChange,
}) => {
  const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth());
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Generate calendar data for current month
  const calendarMonth: CalendarMonth = useMemo(() => {
    return generateCalendarMonth(currentYear, currentMonth, selectedDate, events);
  }, [currentYear, currentMonth, selectedDate, events]);

  // Navigate to previous month with animation
  const goToPreviousMonth = useCallback(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: SCREEN_WIDTH,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      const { year, month } = getPreviousMonth(currentYear, currentMonth);
      setCurrentYear(year);
      setCurrentMonth(month);
      onMonthChange?.(year, month);

      slideAnim.setValue(-SCREEN_WIDTH);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [currentYear, currentMonth, onMonthChange, slideAnim, fadeAnim]);

  // Navigate to next month with animation
  const goToNextMonth = useCallback(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -SCREEN_WIDTH,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      const { year, month } = getNextMonth(currentYear, currentMonth);
      setCurrentYear(year);
      setCurrentMonth(month);
      onMonthChange?.(year, month);

      slideAnim.setValue(SCREEN_WIDTH);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [currentYear, currentMonth, onMonthChange, slideAnim, fadeAnim]);

  // Go to today
  const goToToday = useCallback(() => {
    const today = new Date();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    onDateSelect(today);
    onMonthChange?.(today.getFullYear(), today.getMonth());
  }, [onDateSelect, onMonthChange]);

  // Handle day selection
  const handleDaySelect = useCallback((date: Date) => {
    onDateSelect(date);
  }, [onDateSelect]);

  // Render weekday headers
  const renderWeekdayHeaders = () => (
    <View style={styles.weekdayHeader}>
      {WEEKDAYS.map((day) => (
        <View key={day} style={styles.weekdayCell}>
          <Text style={styles.weekdayText}>{getShortDayName(day)}</Text>
        </View>
      ))}
    </View>
  );

  // Render calendar grid
  const renderCalendarGrid = () => {
    const rows = [];
    for (let i = 0; i < 6; i++) {
      const week = calendarMonth.days.slice(i * 7, (i + 1) * 7);
      rows.push(
        <View key={i} style={styles.weekRow}>
          {week.map((day, index) => (
            <CalendarDay
              key={`${day.date.toISOString()}-${index}`}
              day={day}
              onPress={() => handleDaySelect(day.date)}
            />
          ))}
        </View>
      );
    }
    return rows;
  };

  return (
    <View style={styles.container}>
      {/* Month Header */}
      <View style={styles.header}>
        <TouchableOpacity
          testID="prev-month-button"
          style={styles.navButton}
          onPress={goToPreviousMonth}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="chevron-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>

        <TouchableOpacity onPress={goToToday} style={styles.monthYearContainer}>
          <Text style={styles.monthYearText}>
            {getMonthName(currentMonth)} {currentYear}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="next-month-button"
          style={styles.navButton}
          onPress={goToNextMonth}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="chevron-forward" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {/* Weekday Headers */}
      {renderWeekdayHeaders()}

      {/* Calendar Grid with Animation */}
      <Animated.View
        style={[
          styles.calendarGrid,
          {
            transform: [{ translateX: slideAnim }],
            opacity: fadeAnim,
          },
        ]}
      >
        {renderCalendarGrid()}
      </Animated.View>
    </View>
  );
};

export default Calendar;
