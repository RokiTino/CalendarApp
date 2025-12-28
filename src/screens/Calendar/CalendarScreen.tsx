import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from '../../components/Header/Header';
import Calendar from '../../components/Calendar/Calendar';
import CalendarHeader from '../../components/Calendar/CalendarHeader';
import EventCard from '../../components/EventCard/EventCard';
import { CalendarStackParamList, CalendarEvent } from '../../types';
import { useEvents } from '../../context/EventContext';
import { formatDateToISO, sortEventsByTime } from '../../utils/dateUtils';
import { styles } from './styles';
import { theme } from '../../theme';

type CalendarScreenNavigationProp = NativeStackNavigationProp<
  CalendarStackParamList,
  'CalendarHome'
>;

const CalendarScreen: React.FC = () => {
  const navigation = useNavigation<CalendarScreenNavigationProp>();
  const {
    events,
    selectedDate,
    setSelectedDate,
    isLoading,
    refreshEvents,
    deleteEvent,
  } = useEvents();

  // Get events for selected date
  const selectedDateEvents = useMemo(() => {
    const dateString = formatDateToISO(selectedDate);
    const dayEvents = events.filter(event => event.date === dateString);
    return sortEventsByTime(dayEvents);
  }, [events, selectedDate]);

  // Handle date selection
  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
  }, [setSelectedDate]);

  // Handle add event
  const handleAddEvent = useCallback(() => {
    navigation.navigate('CreateEvent', {
      date: formatDateToISO(selectedDate),
    });
  }, [navigation, selectedDate]);

  // Handle event press
  const handleEventPress = useCallback((event: CalendarEvent) => {
    navigation.navigate('EditEvent', { eventId: event.id });
  }, [navigation]);

  // Handle event delete
  const handleEventDelete = useCallback(async (eventId: string) => {
    try {
      await deleteEvent(eventId);
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  }, [deleteEvent]);

  // Render event item
  const renderEventItem = useCallback(({ item }: { item: CalendarEvent }) => (
    <EventCard
      event={item}
      onPress={() => handleEventPress(item)}
      onDelete={() => handleEventDelete(item.id)}
    />
  ), [handleEventPress, handleEventDelete]);

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Events</Text>
      <Text style={styles.emptySubtitle}>
        Tap the + button to create a new event
      </Text>
    </View>
  );

  // Render list header (Calendar Header with add button)
  const renderListHeader = () => (
    <CalendarHeader
      selectedDate={selectedDate}
      onAddEvent={handleAddEvent}
      eventsCount={selectedDateEvents.length}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Calendar" />
      
      <Calendar
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        events={events}
      />

      <FlatList
        data={selectedDateEvents}
        renderItem={renderEventItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.eventListContent}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
            </View>
          ) : (
            renderEmptyState()
          )
        }
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refreshEvents}
            tintColor={theme.colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default CalendarScreen;
