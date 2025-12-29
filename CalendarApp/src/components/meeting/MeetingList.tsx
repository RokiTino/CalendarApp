import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Colors, Spacing, FontSize, FontWeight } from '../../theme';
import { Meeting } from '../../types';
import { MeetingCard } from './MeetingCard';

interface MeetingListProps {
  meetings: Meeting[];
  onMeetingPress: (meeting: Meeting) => void;
  emptyMessage?: string;
}

export const MeetingList: React.FC<MeetingListProps> = ({
  meetings,
  onMeetingPress,
  emptyMessage = 'No meetings scheduled',
}) => {
  if (meetings.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={meetings}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <MeetingCard meeting={item} onPress={() => onMeetingPress(item)} />
      )}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: Spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
