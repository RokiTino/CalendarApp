import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, FontSize, FontWeight } from '../../theme';
import { MONTHS } from '../../utils/dateUtils';
import { CalendarViewMode } from '../../types';

interface CalendarHeaderProps {
  year: number;
  month: number;
  viewMode: CalendarViewMode;
  onPrevious: () => void;
  onNext: () => void;
  onViewModeChange: (mode: CalendarViewMode) => void;
  onToday: () => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  year,
  month,
  viewMode,
  onPrevious,
  onNext,
  onViewModeChange,
  onToday,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.navigationRow}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={onPrevious}
          activeOpacity={0.7}
        >
          <Text style={styles.navButtonText}>‹</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.titleContainer}
          onPress={onToday}
          activeOpacity={0.7}
        >
          <Text style={styles.title}>
            {MONTHS[month]} {year}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={onNext}
          activeOpacity={0.7}
        >
          <Text style={styles.navButtonText}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.viewModeRow}>
        <TouchableOpacity
          style={[
            styles.viewModeButton,
            viewMode === 'day' && styles.viewModeButtonActive,
          ]}
          onPress={() => onViewModeChange('day')}
        >
          <Text
            style={[
              styles.viewModeText,
              viewMode === 'day' && styles.viewModeTextActive,
            ]}
          >
            Day
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.viewModeButton,
            viewMode === 'month' && styles.viewModeButtonActive,
          ]}
          onPress={() => onViewModeChange('month')}
        >
          <Text
            style={[
              styles.viewModeText,
              viewMode === 'month' && styles.viewModeTextActive,
            ]}
          >
            Month
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  navigationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  navButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  navButtonText: {
    fontSize: 32,
    color: Colors.primary,
    fontWeight: FontWeight.medium,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  viewModeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  viewModeButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
    borderRadius: 20,
    backgroundColor: Colors.backgroundSecondary,
  },
  viewModeButtonActive: {
    backgroundColor: Colors.primary,
  },
  viewModeText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
  },
  viewModeTextActive: {
    color: Colors.textInverse,
  },
});
