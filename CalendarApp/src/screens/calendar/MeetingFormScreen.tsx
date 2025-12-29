import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { CalendarStackParamList, MeetingFormData } from '../../types';
import { Button, Input, Header } from '../../components/common';
import { useMeetings } from '../../context/MeetingsContext';
import { Colors, Spacing, FontSize, FontWeight } from '../../theme';
import { validateMeetingForm } from '../../utils/validation';
import { formatDateString } from '../../utils/dateUtils';

type MeetingFormScreenProps = {
  navigation: NativeStackNavigationProp<CalendarStackParamList, 'MeetingForm'>;
  route: RouteProp<CalendarStackParamList, 'MeetingForm'>;
};

const COLORS = [
  '#4A90D9',
  '#5C6BC0',
  '#26A69A',
  '#66BB6A',
  '#FFA726',
  '#EF5350',
  '#AB47BC',
  '#EC407A',
];

export const MeetingFormScreen: React.FC<MeetingFormScreenProps> = ({
  navigation,
  route,
}) => {
  const { meeting, date } = route.params || {};
  const { addMeeting, updateMeeting, deleteMeeting, isLoading } = useMeetings();

  const isEditing = !!meeting;

  const [formData, setFormData] = useState<MeetingFormData>({
    title: meeting?.title || '',
    description: meeting?.description || '',
    date: meeting?.date || date || formatDateString(new Date()),
    startTime: meeting?.startTime || '09:00',
    endTime: meeting?.endTime || '10:00',
    location: meeting?.location || '',
    color: meeting?.color || COLORS[0],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof MeetingFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleColorSelect = (color: string) => {
    setFormData((prev) => ({ ...prev, color }));
  };

  const handleSubmit = async () => {
    const validationErrors = validateMeetingForm(
      formData.title,
      formData.date,
      formData.startTime,
      formData.endTime
    );

    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {};
      validationErrors.forEach((err) => {
        errorMap[err.field] = err.message;
      });
      setErrors(errorMap);
      return;
    }

    try {
      if (isEditing && meeting) {
        await updateMeeting(meeting.id, formData);
      } else {
        await addMeeting(formData);
      }
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', 'Failed to save meeting. Please try again.');
    }
  };

  const handleDelete = () => {
    if (!meeting) return;

    Alert.alert(
      'Delete Meeting',
      'Are you sure you want to delete this meeting?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMeeting(meeting.id);
              navigation.goBack();
            } catch (err) {
              Alert.alert('Error', 'Failed to delete meeting.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title={isEditing ? 'Edit Meeting' : 'New Meeting'}
        leftIcon={<Text style={styles.backIcon}>←</Text>}
        onLeftPress={() => navigation.goBack()}
        rightIcon={
          isEditing ? (
            <TouchableOpacity onPress={handleDelete}>
              <Text style={styles.deleteIcon}>🗑</Text>
            </TouchableOpacity>
          ) : undefined
        }
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Input
            label="Title *"
            placeholder="Meeting title"
            value={formData.title}
            onChangeText={(text) => handleChange('title', text)}
            error={errors.title}
          />

          <Input
            label="Description"
            placeholder="Add description (optional)"
            value={formData.description}
            onChangeText={(text) => handleChange('description', text)}
            multiline
            numberOfLines={3}
          />

          <Input
            label="Date *"
            placeholder="YYYY-MM-DD"
            value={formData.date}
            onChangeText={(text) => handleChange('date', text)}
            error={errors.date}
          />

          <View style={styles.timeRow}>
            <View style={styles.timeInput}>
              <Input
                label="Start Time *"
                placeholder="HH:MM"
                value={formData.startTime}
                onChangeText={(text) => handleChange('startTime', text)}
                error={errors.startTime}
              />
            </View>
            <View style={styles.timeInput}>
              <Input
                label="End Time *"
                placeholder="HH:MM"
                value={formData.endTime}
                onChangeText={(text) => handleChange('endTime', text)}
                error={errors.endTime}
              />
            </View>
          </View>

          <Input
            label="Location"
            placeholder="Add location (optional)"
            value={formData.location}
            onChangeText={(text) => handleChange('location', text)}
          />

          <View style={styles.colorSection}>
            <Text style={styles.colorLabel}>Color</Text>
            <View style={styles.colorRow}>
              {COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    formData.color === color && styles.colorOptionSelected,
                  ]}
                  onPress={() => handleColorSelect(color)}
                >
                  {formData.color === color && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title={isEditing ? 'Update Meeting' : 'Create Meeting'}
              onPress={handleSubmit}
              loading={isLoading}
              fullWidth
            />
            <Button
              title="Cancel"
              onPress={() => navigation.goBack()}
              variant="outline"
              fullWidth
              style={styles.cancelButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  backIcon: {
    fontSize: 24,
    color: Colors.primary,
  },
  deleteIcon: {
    fontSize: 20,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  timeRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  timeInput: {
    flex: 1,
  },
  colorSection: {
    marginBottom: Spacing.md,
  },
  colorLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorOptionSelected: {
    borderWidth: 3,
    borderColor: Colors.textPrimary,
  },
  checkmark: {
    color: Colors.textInverse,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  buttonContainer: {
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },
  cancelButton: {
    marginTop: 0,
  },
});
