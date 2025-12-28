import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { CalendarEvent } from '../../types';
import { formatTime12Hour } from '../../utils/dateUtils';
import { styles } from './styles';
import { theme } from '../../theme';

interface EventCardProps {
  event: CalendarEvent;
  onPress?: () => void;
  onDelete?: () => void;
  showDate?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  onPress,
  onDelete,
  showDate = false,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={[styles.colorBar, { backgroundColor: event.color }]} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {event.title}
          </Text>
          {onDelete && (
            <TouchableOpacity
              onPress={onDelete}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="trash-outline" size={18} color={theme.colors.error} />
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.timeContainer}>
          <Icon
            name="time-outline"
            size={14}
            color={theme.colors.textSecondary}
          />
          <Text style={styles.timeText}>
            {formatTime12Hour(event.startTime)} - {formatTime12Hour(event.endTime)}
          </Text>
        </View>
        
        {event.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {event.description}
          </Text>
        ) : null}
        
        {showDate && (
          <View style={styles.dateContainer}>
            <Icon
              name="calendar-outline"
              size={14}
              color={theme.colors.textSecondary}
            />
            <Text style={styles.dateText}>{event.date}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default EventCard;
