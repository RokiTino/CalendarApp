import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { Meeting, MeetingFormData } from '../types';
import { generateId } from '../utils/dateUtils';
import { useAuth } from './AuthContext';

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

  // TODO: Replace with Firebase Firestore implementation
  const addMeeting = useCallback(
    async (data: MeetingFormData): Promise<Meeting> => {
      if (!user) {
        throw new Error('User must be authenticated');
      }

      setIsLoading(true);
      setError(null);

      try {
        // TODO: Implement Firebase Firestore add
        await new Promise((resolve) => setTimeout(resolve, 500));

        const newMeeting: Meeting = {
          id: generateId(),
          ...data,
          userId: user.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setMeetings((prev) => [...prev, newMeeting]);
        setIsLoading(false);

        return newMeeting;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to add meeting';
        setError(errorMessage);
        setIsLoading(false);
        throw new Error(errorMessage);
      }
    },
    [user]
  );

  const updateMeeting = useCallback(
    async (id: string, data: MeetingFormData): Promise<Meeting> => {
      if (!user) {
        throw new Error('User must be authenticated');
      }

      setIsLoading(true);
      setError(null);

      try {
        // TODO: Implement Firebase Firestore update
        await new Promise((resolve) => setTimeout(resolve, 500));

        const updatedMeeting: Meeting = {
          id,
          ...data,
          userId: user.id,
          createdAt:
            meetings.find((m) => m.id === id)?.createdAt ||
            new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setMeetings((prev) =>
          prev.map((m) => (m.id === id ? updatedMeeting : m))
        );
        setIsLoading(false);

        return updatedMeeting;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update meeting';
        setError(errorMessage);
        setIsLoading(false);
        throw new Error(errorMessage);
      }
    },
    [user, meetings]
  );

  const deleteMeeting = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Implement Firebase Firestore delete
      await new Promise((resolve) => setTimeout(resolve, 500));

      setMeetings((prev) => prev.filter((m) => m.id !== id));
      setIsLoading(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to delete meeting';
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
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // TODO: Implement Firebase Firestore fetch
      await new Promise((resolve) => setTimeout(resolve, 500));
      // For now, keep existing meetings
      setIsLoading(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch meetings';
      setError(errorMessage);
      setIsLoading(false);
    }
  }, [user]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Fetch meetings when user changes
  React.useEffect(() => {
    if (user) {
      refreshMeetings();
    } else {
      setMeetings([]);
    }
  }, [user, refreshMeetings]);

  const value: MeetingsContextType = {
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
  };

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
