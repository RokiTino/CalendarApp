import firestore from '@react-native-firebase/firestore';
import { CalendarEvent, CreateEventInput, UpdateEventInput, EVENT_COLORS } from '../types';
import { getEventsCollection, getEventDoc, generateId, getCurrentUser } from './firebase';

/**
 * Create a new event
 */
export const createEvent = async (input: CreateEventInput): Promise<CalendarEvent> => {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const eventId = generateId();
  const now = new Date();

  const event: CalendarEvent = {
    id: eventId,
    userId: user.uid,
    title: input.title.trim(),
    description: input.description?.trim() || '',
    date: input.date,
    startTime: input.startTime,
    endTime: input.endTime,
    color: input.color || EVENT_COLORS[Math.floor(Math.random() * EVENT_COLORS.length)],
    createdAt: now,
    updatedAt: now,
  };

  await getEventDoc(eventId).set({
    ...event,
    createdAt: firestore.FieldValue.serverTimestamp(),
    updatedAt: firestore.FieldValue.serverTimestamp(),
  });

  return event;
};

/**
 * Update an existing event
 */
export const updateEvent = async (input: UpdateEventInput): Promise<CalendarEvent> => {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const eventDoc = await getEventDoc(input.id).get();
  
  if (!eventDoc.exists) {
    throw new Error('Event not found');
  }

  const existingEvent = eventDoc.data() as CalendarEvent;
  
  if (existingEvent.userId !== user.uid) {
    throw new Error('You do not have permission to edit this event');
  }

  const updatedData: Partial<CalendarEvent> = {
    updatedAt: new Date(),
  };

  if (input.title !== undefined) updatedData.title = input.title.trim();
  if (input.description !== undefined) updatedData.description = input.description.trim();
  if (input.date !== undefined) updatedData.date = input.date;
  if (input.startTime !== undefined) updatedData.startTime = input.startTime;
  if (input.endTime !== undefined) updatedData.endTime = input.endTime;
  if (input.color !== undefined) updatedData.color = input.color;

  await getEventDoc(input.id).update({
    ...updatedData,
    updatedAt: firestore.FieldValue.serverTimestamp(),
  });

  return {
    ...existingEvent,
    ...updatedData,
  };
};

/**
 * Delete an event
 */
export const deleteEvent = async (eventId: string): Promise<void> => {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const eventDoc = await getEventDoc(eventId).get();
  
  if (!eventDoc.exists) {
    throw new Error('Event not found');
  }

  const event = eventDoc.data() as CalendarEvent;
  
  if (event.userId !== user.uid) {
    throw new Error('You do not have permission to delete this event');
  }

  await getEventDoc(eventId).delete();
};

/**
 * Get a single event by ID
 */
export const getEvent = async (eventId: string): Promise<CalendarEvent | null> => {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const eventDoc = await getEventDoc(eventId).get();
  
  if (!eventDoc.exists) {
    return null;
  }

  const event = eventDoc.data() as CalendarEvent;
  
  if (event.userId !== user.uid) {
    throw new Error('You do not have permission to view this event');
  }

  return {
    ...event,
    createdAt: event.createdAt?.toDate?.() || event.createdAt,
    updatedAt: event.updatedAt?.toDate?.() || event.updatedAt,
  };
};

/**
 * Get all events for the current user
 */
export const getAllEvents = async (): Promise<CalendarEvent[]> => {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const snapshot = await getEventsCollection()
    .where('userId', '==', user.uid)
    .orderBy('date', 'asc')
    .get();

  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      createdAt: data.createdAt?.toDate?.() || data.createdAt,
      updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
    } as CalendarEvent;
  });
};

/**
 * Get events for a specific date
 */
export const getEventsForDate = async (date: string): Promise<CalendarEvent[]> => {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const snapshot = await getEventsCollection()
    .where('userId', '==', user.uid)
    .where('date', '==', date)
    .orderBy('startTime', 'asc')
    .get();

  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      createdAt: data.createdAt?.toDate?.() || data.createdAt,
      updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
    } as CalendarEvent;
  });
};

/**
 * Get events for a date range
 */
export const getEventsInRange = async (
  startDate: string,
  endDate: string
): Promise<CalendarEvent[]> => {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const snapshot = await getEventsCollection()
    .where('userId', '==', user.uid)
    .where('date', '>=', startDate)
    .where('date', '<=', endDate)
    .orderBy('date', 'asc')
    .get();

  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      createdAt: data.createdAt?.toDate?.() || data.createdAt,
      updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
    } as CalendarEvent;
  });
};

/**
 * Subscribe to events for the current user (real-time updates)
 */
export const subscribeToEvents = (
  callback: (events: CalendarEvent[]) => void,
  onError?: (error: Error) => void
): (() => void) => {
  const user = getCurrentUser();
  if (!user) {
    onError?.(new Error('User not authenticated'));
    return () => {};
  }

  return getEventsCollection()
    .where('userId', '==', user.uid)
    .orderBy('date', 'asc')
    .onSnapshot(
      snapshot => {
        const events = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
            createdAt: data.createdAt?.toDate?.() || data.createdAt,
            updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
          } as CalendarEvent;
        });
        callback(events);
      },
      error => {
        onError?.(new Error(error.message));
      }
    );
};

export default {
  createEvent,
  updateEvent,
  deleteEvent,
  getEvent,
  getAllEvents,
  getEventsForDate,
  getEventsInRange,
  subscribeToEvents,
};
