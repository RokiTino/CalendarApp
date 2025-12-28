import EventService from '../src/services/EventService';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

// Mock dependencies
jest.mock('@react-native-firebase/firestore', () => {
  const mockDoc = {
    id: 'event-123',
    data: () => ({
      title: 'Test Event',
      description: 'Test Description',
      date: '2024-01-15',
      startTime: '09:00',
      endTime: '10:00',
      color: '#4A90D9',
      userId: 'user-123',
      createdAt: { toDate: () => new Date('2024-01-01') },
      updatedAt: { toDate: () => new Date('2024-01-01') },
    }),
  };

  return {
    __esModule: true,
    default: jest.fn(() => ({
      collection: jest.fn(() => ({
        doc: jest.fn(() => ({
          get: jest.fn().mockResolvedValue({ exists: true, ...mockDoc }),
          set: jest.fn().mockResolvedValue(undefined),
          update: jest.fn().mockResolvedValue(undefined),
          delete: jest.fn().mockResolvedValue(undefined),
        })),
        add: jest.fn().mockResolvedValue({ id: 'new-event-123' }),
        where: jest.fn(() => ({
          where: jest.fn(() => ({
            orderBy: jest.fn(() => ({
              get: jest.fn().mockResolvedValue({
                docs: [mockDoc],
              }),
              onSnapshot: jest.fn((callback) => {
                callback({ docs: [mockDoc] });
                return jest.fn(); // unsubscribe
              }),
            })),
          })),
          orderBy: jest.fn(() => ({
            get: jest.fn().mockResolvedValue({
              docs: [mockDoc],
            }),
          })),
        })),
      })),
    })),
    FieldValue: {
      serverTimestamp: jest.fn(() => 'server-timestamp'),
    },
  };
});

jest.mock('@react-native-firebase/auth', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    currentUser: { uid: 'user-123' },
  })),
}));

describe('EventService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createEvent', () => {
    it('creates a new event', async () => {
      const eventData = {
        title: 'New Event',
        description: 'Description',
        date: '2024-01-15',
        startTime: '09:00',
        endTime: '10:00',
        color: '#4A90D9',
      };

      const result = await EventService.createEvent(eventData);
      
      expect(result).toBeDefined();
      expect(result.id).toBe('new-event-123');
    });

    it('throws error when user not authenticated', async () => {
      const mockAuth = auth();
      (mockAuth as any).currentUser = null;

      const eventData = {
        title: 'New Event',
        description: 'Description',
        date: '2024-01-15',
        startTime: '09:00',
        endTime: '10:00',
        color: '#4A90D9',
      };

      await expect(EventService.createEvent(eventData)).rejects.toThrow();
    });
  });

  describe('getEvent', () => {
    beforeEach(() => {
      const mockAuth = auth();
      (mockAuth as any).currentUser = { uid: 'user-123' };
    });

    it('retrieves an event by ID', async () => {
      const event = await EventService.getEvent('event-123');
      
      expect(event).toBeDefined();
      expect(event?.title).toBe('Test Event');
    });

    it('returns null for non-existent event', async () => {
      const mockFirestore = firestore();
      (mockFirestore.collection('events').doc as jest.Mock).mockReturnValue({
        get: jest.fn().mockResolvedValue({ exists: false }),
      });

      const event = await EventService.getEvent('non-existent');
      
      expect(event).toBeNull();
    });
  });

  describe('updateEvent', () => {
    beforeEach(() => {
      const mockAuth = auth();
      (mockAuth as any).currentUser = { uid: 'user-123' };
    });

    it('updates an existing event', async () => {
      const updates = {
        title: 'Updated Event',
        description: 'Updated Description',
      };

      await EventService.updateEvent('event-123', updates);
      
      const mockFirestore = firestore();
      expect(mockFirestore.collection('events').doc).toHaveBeenCalledWith('event-123');
    });
  });

  describe('deleteEvent', () => {
    beforeEach(() => {
      const mockAuth = auth();
      (mockAuth as any).currentUser = { uid: 'user-123' };
    });

    it('deletes an event', async () => {
      await EventService.deleteEvent('event-123');
      
      const mockFirestore = firestore();
      expect(mockFirestore.collection('events').doc).toHaveBeenCalledWith('event-123');
    });
  });

  describe('getAllEvents', () => {
    beforeEach(() => {
      const mockAuth = auth();
      (mockAuth as any).currentUser = { uid: 'user-123' };
    });

    it('retrieves all events for current user', async () => {
      const events = await EventService.getAllEvents();
      
      expect(Array.isArray(events)).toBe(true);
      expect(events.length).toBeGreaterThan(0);
    });
  });

  describe('getEventsForDate', () => {
    beforeEach(() => {
      const mockAuth = auth();
      (mockAuth as any).currentUser = { uid: 'user-123' };
    });

    it('retrieves events for a specific date', async () => {
      const events = await EventService.getEventsForDate('2024-01-15');
      
      expect(Array.isArray(events)).toBe(true);
    });
  });

  describe('getEventsInRange', () => {
    beforeEach(() => {
      const mockAuth = auth();
      (mockAuth as any).currentUser = { uid: 'user-123' };
    });

    it('retrieves events within a date range', async () => {
      const events = await EventService.getEventsInRange('2024-01-01', '2024-01-31');
      
      expect(Array.isArray(events)).toBe(true);
    });
  });

  describe('subscribeToEvents', () => {
    beforeEach(() => {
      const mockAuth = auth();
      (mockAuth as any).currentUser = { uid: 'user-123' };
    });

    it('sets up real-time subscription', () => {
      const callback = jest.fn();
      const unsubscribe = EventService.subscribeToEvents(callback);
      
      expect(typeof unsubscribe).toBe('function');
    });

    it('calls callback with events on update', () => {
      const callback = jest.fn();
      EventService.subscribeToEvents(callback);
      
      // The mock should trigger the callback
      expect(callback).toHaveBeenCalled();
    });
  });
});
