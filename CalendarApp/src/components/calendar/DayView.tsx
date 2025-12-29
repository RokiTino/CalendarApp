import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '../../theme';
import { Meeting } from '../../types';
import { formatTime, formatDisplayDate, getTimeSlots } from '../../utils/dateUtils';

interface DayViewProps {
  selectedDate: Date;
  meetings: Meeting[];
  onMeetingPress: (meeting: Meeting) => void;
  onTimeSlotPress: (time: string) => void;
}

export const DayView: React.FC<DayViewProps> = ({
  selectedDate,
  meetings,
  onMeetingPress,
  onTimeSlotPress,
}) => {
  const timeSlots = getTimeSlots();

  const getMeetingForSlot = (slotTime: string): Meeting | undefined => {
    return meetings.find((meeting) => {
      return meeting.startTime <= slotTime && meeting.endTime > slotTime;
    });
  };

  const isSlotStart = (slotTime: string): boolean => {
    return meetings.some((meeting) => meeting.startTime === slotTime);
  };

  return (
    <View style={styles.container}>
      <View style={styles.dateHeader}>
        <Text style={styles.dateText}>{formatDisplayDate(selectedDate)}</Text>
        {meetings.length > 0 && (
          <Text style={styles.eventCount}>
            {meetings.length} event{meetings.length !== 1 ? 's' : ''}
          </Text>
        )}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {timeSlots.map((time) => {
          const meeting = getMeetingForSlot(time);
          const isStart = isSlotStart(time);

          return (
            <TouchableOpacity
              key={time}
              style={styles.timeSlot}
              onPress={() =>
                meeting ? onMeetingPress(meeting) : onTimeSlotPress(time)
              }
              activeOpacity={0.7}
            >
              <View style={styles.timeLabel}>
                <Text style={styles.timeText}>{formatTime(time)}</Text>
              </View>
              <View style={styles.slotContent}>
                {meeting && isStart ? (
                  <View
                    style={[
                      styles.meetingCard,
                      { backgroundColor: meeting.color || Colors.calendarEvent },
                    ]}
                  >
                    <Text style={styles.meetingTitle} numberOfLines={1}>
                      {meeting.title}
                    </Text>
                    <Text style={styles.meetingTime}>
                      {formatTime(meeting.startTime)} -{' '}
                      {formatTime(meeting.endTime)}
                    </Text>
                    {meeting.location && (
                      <Text style={styles.meetingLocation} numberOfLines={1}>
                        📍 {meeting.location}
                      </Text>
                    )}
                  </View>
                ) : meeting ? (
                  <View
                    style={[
                      styles.meetingContinuation,
                      { backgroundColor: meeting.color || Colors.calendarEvent },
                    ]}
                  />
                ) : (
                  <View style={styles.emptySlot} />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.backgroundSecondary,
  },
  dateText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  eventCount: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  timeSlot: {
    flexDirection: 'row',
    minHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  timeLabel: {
    width: 80,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    alignItems: 'flex-end',
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  timeText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  slotContent: {
    flex: 1,
    padding: Spacing.xs,
  },
  emptySlot: {
    flex: 1,
    minHeight: 44,
  },
  meetingCard: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    minHeight: 50,
  },
  meetingContinuation: {
    flex: 1,
    minHeight: 44,
    borderRadius: BorderRadius.sm,
    opacity: 0.6,
  },
  meetingTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textInverse,
  },
  meetingTime: {
    fontSize: FontSize.xs,
    color: Colors.textInverse,
    opacity: 0.9,
    marginTop: 2,
  },
  meetingLocation: {
    fontSize: FontSize.xs,
    color: Colors.textInverse,
    opacity: 0.8,
    marginTop: 2,
  },
});
