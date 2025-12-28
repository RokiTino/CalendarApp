import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from '../../components/Header/Header';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { CalendarStackParamList, UpdateEventInput, EVENT_COLORS, CalendarEvent } from '../../types';
import { useEvents } from '../../context/EventContext';
import { validateEvent } from '../../utils/validation';
import { generateTimeSlots, formatTime12Hour } from '../../utils/dateUtils';
import { styles } from './styles';
import { theme } from '../../theme';

type EditEventNavigationProp = NativeStackNavigationProp<
  CalendarStackParamList,
  'EditEvent'
>;

type EditEventRouteProp = RouteProp<CalendarStackParamList, 'EditEvent'>;

const EditEventScreen: React.FC = () => {
  const navigation = useNavigation<EditEventNavigationProp>();
  const route = useRoute<EditEventRouteProp>();
  const { events, updateEvent, deleteEvent } = useEvents();

  const { eventId } = route.params;
  const [event, setEvent] = useState<CalendarEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '09:00',
    endTime: '10:00',
    color: EVENT_COLORS[0],
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const timeSlots = generateTimeSlots();

  // Load the event when the screen mounts
  useEffect(() => {
    const foundEvent = events.find(e => e.id === eventId);
    if (foundEvent) {
      setEvent(foundEvent);
      setEventData({
        title: foundEvent.title,
        description: foundEvent.description || '',
        date: foundEvent.date,
        startTime: foundEvent.startTime,
        endTime: foundEvent.endTime,
        color: foundEvent.color,
      });
    }
    setIsLoading(false);
  }, [eventId, events]);

  const handleInputChange = (field: keyof typeof eventData, value: string) => {
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
    setIsSaving(true);

    try {
      const updateData: UpdateEventInput = {
        id: eventId,
        ...eventData,
      };
      await updateEvent(updateData);
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update event');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              await deleteEvent(eventId);
              navigation.goBack();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete event');
              setIsDeleting(false);
            }
          },
        },
      ]
    );
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

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header
          title="Edit Event"
          showBackButton
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!event) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header
          title="Edit Event"
          showBackButton
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.loadingContainer}>
          <Text>Event not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title="Edit Event"
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
            title="Save Changes"
            onPress={handleSubmit}
            loading={isSaving}
            style={styles.submitButton}
          />

          <Button
            title="Delete Event"
            onPress={handleDelete}
            variant="danger"
            loading={isDeleting}
            style={styles.deleteButton}
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

export default EditEventScreen;
