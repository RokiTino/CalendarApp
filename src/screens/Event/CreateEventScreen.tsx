import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from '../../components/Header/Header';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { CalendarStackParamList, CreateEventInput, EVENT_COLORS } from '../../types';
import { useEvents } from '../../context/EventContext';
import { validateEvent } from '../../utils/validation';
import { formatDateToISO, generateTimeSlots, formatTime12Hour } from '../../utils/dateUtils';
import { styles } from './styles';
import { theme } from '../../theme';

type CreateEventNavigationProp = NativeStackNavigationProp<
  CalendarStackParamList,
  'CreateEvent'
>;

type CreateEventRouteProp = RouteProp<CalendarStackParamList, 'CreateEvent'>;

const CreateEventScreen: React.FC = () => {
  const navigation = useNavigation<CreateEventNavigationProp>();
  const route = useRoute<CreateEventRouteProp>();
  const { createEvent } = useEvents();

  const initialDate = route.params?.date || formatDateToISO(new Date());

  const [eventData, setEventData] = useState<CreateEventInput>({
    title: '',
    description: '',
    date: initialDate,
    startTime: '09:00',
    endTime: '10:00',
    color: EVENT_COLORS[0],
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const timeSlots = generateTimeSlots();

  const handleInputChange = (field: keyof CreateEventInput, value: string) => {
    setEventData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleColorSelect = (color: string) => {
    setEventData(prev => ({ ...prev, color }));
  };

  const handleTimeSelect = (field: 'startTime' | 'endTime', time: string) => {
    handleInputChange(field, time);
    if (field === 'startTime') {
      setShowStartTimePicker(false);
    } else {
      setShowEndTimePicker(false);
    }
  };

  const handleSubmit = async () => {
    const validation = validateEvent(eventData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      await createEvent(eventData);
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create event');
    } finally {
      setIsLoading(false);
    }
  };

  const renderTimePicker = (
    field: 'startTime' | 'endTime',
    show: boolean,
    onClose: () => void
  ) => {
    if (!show) return null;

    return (
      <View style={styles.timePickerContainer}>
        <View style={styles.timePickerHeader}>
          <Text style={styles.timePickerTitle}>
            Select {field === 'startTime' ? 'Start' : 'End'} Time
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.timePickerClose}>Done</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          style={styles.timePickerScroll}
          showsVerticalScrollIndicator={false}
        >
          {timeSlots.map((time) => (
            <TouchableOpacity
              key={time}
              style={[
                styles.timeSlot,
                eventData[field] === time && styles.timeSlotSelected,
              ]}
              onPress={() => handleTimeSelect(field, time)}
            >
              <Text
                style={[
                  styles.timeSlotText,
                  eventData[field] === time && styles.timeSlotTextSelected,
                ]}
              >
                {formatTime12Hour(time)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title="New Event"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Input
            label="Title"
            placeholder="Event title"
            value={eventData.title}
            onChangeText={(text) => handleInputChange('title', text)}
            error={errors.title}
            leftIcon="create-outline"
          />

          <Input
            label="Description"
            placeholder="Add a description (optional)"
            value={eventData.description}
            onChangeText={(text) => handleInputChange('description', text)}
            error={errors.description}
            leftIcon="document-text-outline"
            multiline
            numberOfLines={3}
          />

          <Text style={styles.label}>Date</Text>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{eventData.date}</Text>
          </View>

          <View style={styles.timeRow}>
            <View style={styles.timeColumn}>
              <Text style={styles.label}>Start Time</Text>
              <TouchableOpacity
                style={[styles.timeButton, errors.startTime && styles.timeButtonError]}
                onPress={() => setShowStartTimePicker(true)}
              >
                <Text style={styles.timeButtonText}>
                  {formatTime12Hour(eventData.startTime)}
                </Text>
              </TouchableOpacity>
              {errors.startTime && (
                <Text style={styles.errorText}>{errors.startTime}</Text>
              )}
            </View>

            <View style={styles.timeColumn}>
              <Text style={styles.label}>End Time</Text>
              <TouchableOpacity
                style={[styles.timeButton, errors.endTime && styles.timeButtonError]}
                onPress={() => setShowEndTimePicker(true)}
              >
                <Text style={styles.timeButtonText}>
                  {formatTime12Hour(eventData.endTime)}
                </Text>
              </TouchableOpacity>
              {errors.endTime && (
                <Text style={styles.errorText}>{errors.endTime}</Text>
              )}
            </View>
          </View>

          <Text style={styles.label}>Color</Text>
          <View style={styles.colorGrid}>
            {EVENT_COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  eventData.color === color && styles.colorOptionSelected,
                ]}
                onPress={() => handleColorSelect(color)}
              />
            ))}
          </View>

          <Button
            title="Create Event"
            onPress={handleSubmit}
            loading={isLoading}
            style={styles.submitButton}
          />
        </ScrollView>

        {renderTimePicker('startTime', showStartTimePicker, () =>
          setShowStartTimePicker(false)
        )}
        {renderTimePicker('endTime', showEndTimePicker, () =>
          setShowEndTimePicker(false)
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateEventScreen;
