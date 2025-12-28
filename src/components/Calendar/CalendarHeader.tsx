import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { formatDateDisplay } from '../../utils/dateUtils';
import { styles } from './styles';
import { theme } from '../../theme';

interface CalendarHeaderProps {
  selectedDate: Date;
  onAddEvent: () => void;
  eventsCount: number;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  selectedDate,
  onAddEvent,
  eventsCount,
}) => {
  return (
    <View style={styles.selectedDateContainer}>
      <View style={styles.selectedDateInfo}>
        <Text style={styles.selectedDateText}>
          {formatDateDisplay(selectedDate)}
        </Text>
        <Text style={styles.eventsCountText}>
          {eventsCount === 0
            ? 'No events'
            : `${eventsCount} event${eventsCount > 1 ? 's' : ''}`}
        </Text>
      </View>
      <TouchableOpacity
        testID="add-event-button"
        style={styles.addEventButton}
        onPress={onAddEvent}
        activeOpacity={0.7}
      >
        <Icon name="add" size={24} color={theme.colors.white} />
      </TouchableOpacity>
    </View>
  );
};

export default CalendarHeader;
