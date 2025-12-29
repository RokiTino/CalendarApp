import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '../../theme';
import { Meeting } from '../../types';
import { formatTime } from '../../utils/dateUtils';

interface MeetingCardProps {
  meeting: Meeting;
  onPress: () => void;
}

export const MeetingCard: React.FC<MeetingCardProps> = ({ meeting, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.colorIndicator,
          { backgroundColor: meeting.color || Colors.calendarEvent },
        ]}
      />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {meeting.title}
        </Text>
        <Text style={styles.time}>
          {formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}
        </Text>
        {meeting.location && (
          <Text style={styles.location} numberOfLines={1}>
            📍 {meeting.location}
          </Text>
        )}
        {meeting.description && (
          <Text style={styles.description} numberOfLines={2}>
            {meeting.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  colorIndicator: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  time: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  location: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  description: {
    fontSize: FontSize.sm,
    color: Colors.textLight,
  },
});
