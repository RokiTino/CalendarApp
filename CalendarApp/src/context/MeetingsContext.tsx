import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { Meeting, MeetingFormData } from '../types';
import { generateId } from '../utils/dateUtils';
import { useAuth } from './AuthContext';
import { backendEventService, EventResponseDto, CreateEventDto } from '../services/backend';

interface MeetingsContextType {
  meetings: Meeting[];
  isLoading: boolean;
  error: string | null;
  addMeeting: (data: MeetingFormData) => Promise<Meeting>;
  updateMeeting: (id: string, data: MeetingFormData) => Promise<Meeting>;
  deleteMeeting: (id: string) => Promise<void>;
  getMeetingById: (id: string) => Meeting | undefined;
  getMeetingsForDate: (date: string) => Meeting[];
  refreshMeetings: () => Promise<void>;
  clearError: () => void;
}

const MeetingsContext = createContext<MeetingsContextType | undefined>(undefined);

interface MeetingsProviderProps {
  children: ReactNode;
}

export const MeetingsProvider: React.FC<MeetingsProviderProps> = ({
  children,
}) => {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Convert backend event to meeting format
   */
  const convertBackendEventToMeeting = useCallback((event: EventResponseDto): Meeting => {
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    
    console.log('[Meetings] Converting backend event to meeting:', event.id, '-', event.title);
    return {
      id: event.id.toString(),
      title: event.title,
      description: event.description || '',
      date: startDate.toISOString().split('T')[0],
      startTime: startDate.toTimeString().slice(0, 5),
      endTime: endDate.toTimeString().slice(0, 5),
      location: '',
      color: '#3498db',
      userId: event.userId,
      createdAt: event.createdAt,
      updatedAt: event.createdAt,
    };
  }, []);

  /**
   * Convert meeting format to CreateEventDto
   */
  const convertMeetingToCreateEventDto = (meeting: Meeting): CreateEventDto => {
    const date = new Date(meeting.date);
    const [startHour, startMin] = meeting.startTime.split(':').map(Number);
    const [endHour, endMin] = meeting.endTime.split(':').map(Number);

    const startDate = new Date(date);
    startDate.setHours(startHour, startMin, 0);

    const endDate = new Date(date);
    endDate.setHours(endHour, endMin, 0);

    return {
      title: meeting.title,
      description: meeting.description || undefined,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      allDay: false,
    };
  };

  // Add a new meeting to backend
  const addMeeting = useCallback(
    async (data: MeetingFormData): Promise<Meeting> => {
      if (!user) {
        throw new Error('User must be authenticated');
      }

      console.log('[Meetings] Adding new meeting:', data.title);
      setIsLoading(true);
      setError(null);

      try {
        const createDto = convertMeetingToCreateEventDto({
          id: generateId(),
          ...data,
          userId: user.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        const createdEvent = await backendEventService.createEvent(createDto);
        const newMeeting = convertBackendEventToMeeting(createdEvent);

        console.log('[Meetings] Meeting added successfully with ID:', newMeeting.id);
        setMeetings((prev) => [...prev, newMeeting]);
        setIsLoading(false);

        return newMeeting;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to add meeting';
        console.error('[Meetings] Error adding meeting:', errorMessage);
        setError(errorMessage);
        setIsLoading(false);
        throw new Error(errorMessage);
      }
    },
    [user, convertBackendEventToMeeting]
  );

  // Update an existing meeting on backend
  const updateMeeting = useCallback(
    async (id: string, data: MeetingFormData): Promise<Meeting> => {
      if (!user) {
        throw new Error('User must be authenticated');
      }

      console.log('[Meetings] Updating meeting with ID:', id);
      setIsLoading(true);
      setError(null);

      try {
        const updateDto = convertMeetingToCreateEventDto({
          id,
          ...data,
          userId: user.id,
          createdAt:
            meetings.find((m) => m.id === id)?.createdAt ||
            new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        const eventId = Number.parseInt(id, 10);
        await backendEventService.updateEvent(eventId, updateDto);

        const updatedMeeting: Meeting = {
          id,
          ...data,
          userId: user.id,
          createdAt:
            meetings.find((m) => m.id === id)?.createdAt ||
            new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        console.log('[Meetings] Meeting', id, 'updated successfully');
        setMeetings((prev) =>
          prev.map((m) => (m.id === id ? updatedMeeting : m))
        );
        setIsLoading(false);

        return updatedMeeting;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update meeting';
        console.error('[Meetings] Error updating meeting:', errorMessage);
        setError(errorMessage);
        setIsLoading(false);
        throw new Error(errorMessage);
      }
    },
    [user, meetings]
  );

  // Delete a meeting from backend
  const deleteMeeting = useCallback(async (id: string): Promise<void> => {
    console.log('[Meetings] Deleting meeting with ID:', id);
    setIsLoading(true);
    setError(null);

    try {
      const eventId = Number.parseInt(id, 10);
      await backendEventService.deleteEvent(eventId);

      console.log('[Meetings] Meeting', id, 'deleted successfully');
      setMeetings((prev) => prev.filter((m) => m.id !== id));
      setIsLoading(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to delete meeting';
      console.error('[Meetings] Error deleting meeting:', errorMessage);
      setError(errorMessage);
      setIsLoading(false);
      throw new Error(errorMessage);
    }
  }, []);

  const getMeetingById = useCallback(
    (id: string): Meeting | undefined => {
      return meetings.find((m) => m.id === id);
    },
    [meetings]
  );

  const getMeetingsForDate = useCallback(
    (date: string): Meeting[] => {
      return meetings
        .filter((m) => m.date === date)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
    },
    [meetings]
  );

  const refreshMeetings = useCallback(async (): Promise<void> => {
    if (!user) {
      console.log('[Meetings] User not authenticated, skipping refresh');
      return;
    }

    console.log('[Meetings] Refreshing meetings for user:', user.id);
    setIsLoading(true);
    setError(null);

    try {
      const backendEvents = await backendEventService.getAllEvents();
      const convertedMeetings = backendEvents.map((event) =>
        convertBackendEventToMeeting(event)
      );
      console.log('[Meetings] Refreshed', convertedMeetings.length, 'meetings');
      setMeetings(convertedMeetings);
      setIsLoading(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch meetings';
      console.error('[Meetings] Error refreshing meetings:', errorMessage);
      setError(errorMessage);
      setIsLoading(false);
    }
  }, [user, convertBackendEventToMeeting]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Fetch meetings when user changes
  React.useEffect(() => {
    console.log('[Meetings] User changed:', user?.id);
    if (user) {
      console.log('[Meetings] Loading initial meetings for user');
      refreshMeetings();
    } else {
      console.log('[Meetings] No user, clearing meetings');
      setMeetings([]);
    }
  }, [user, refreshMeetings]);

  const value: MeetingsContextType = useMemo(
    () => ({
      meetings,
      isLoading,
      error,
      addMeeting,
      updateMeeting,
      deleteMeeting,
      getMeetingById,
      getMeetingsForDate,
      refreshMeetings,
      clearError,
    }),
    [meetings, isLoading, error, addMeeting, updateMeeting, deleteMeeting, getMeetingById, getMeetingsForDate, refreshMeetings, clearError]
  );

  return (
    <MeetingsContext.Provider value={value}>
      {children}
    </MeetingsContext.Provider>
  );
};

export const useMeetings = (): MeetingsContextType => {
  const context = useContext(MeetingsContext);
  if (context === undefined) {
    throw new Error('useMeetings must be used within a MeetingsProvider');
  }
  return context;
};
