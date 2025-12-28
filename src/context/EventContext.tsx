import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { CalendarEvent, CreateEventInput, UpdateEventInput } from '../types';
import EventService from '../services/EventService';
import { useAuth } from './AuthContext';

interface EventContextType {
  events: CalendarEvent[];
  isLoading: boolean;
  error: string | null;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  createEvent: (input: CreateEventInput) => Promise<CalendarEvent>;
  updateEvent: (input: UpdateEventInput) => Promise<CalendarEvent>;
  deleteEvent: (eventId: string) => Promise<void>;
  getEventsForDate: (date: string) => CalendarEvent[];
  refreshEvents: () => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

interface EventProviderProps {
  children: ReactNode;
}

export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Load events when user authenticates
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (isAuthenticated && user) {
      setIsLoading(true);
      
      // Subscribe to real-time updates
      unsubscribe = EventService.subscribeToEvents(
        (updatedEvents) => {
          setEvents(updatedEvents);
          setIsLoading(false);
          setError(null);
        },
        (err) => {
          setError(err.message);
          setIsLoading(false);
        }
      );
    } else {
      setEvents([]);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isAuthenticated, user]);

  const refreshEvents = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      const fetchedEvents = await EventService.getAllEvents();
      setEvents(fetchedEvents);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const createEvent = useCallback(async (input: CreateEventInput): Promise<CalendarEvent> => {
    setError(null);
    try {
      const newEvent = await EventService.createEvent(input);
      // Event will be added via the real-time subscription
      return newEvent;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, []);

  const updateEvent = useCallback(async (input: UpdateEventInput): Promise<CalendarEvent> => {
    setError(null);
    try {
      const updatedEvent = await EventService.updateEvent(input);
      // Event will be updated via the real-time subscription
      return updatedEvent;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, []);

  const deleteEvent = useCallback(async (eventId: string): Promise<void> => {
    setError(null);
    try {
      await EventService.deleteEvent(eventId);
      // Event will be removed via the real-time subscription
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, []);

  const getEventsForDate = useCallback((date: string): CalendarEvent[] => {
    return events.filter(event => event.date === date);
  }, [events]);

  const value: EventContextType = {
    events,
    isLoading,
    error,
    selectedDate,
    setSelectedDate,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventsForDate,
    refreshEvents,
  };

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
};

export const useEvents = (): EventContextType => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

export default EventContext;
