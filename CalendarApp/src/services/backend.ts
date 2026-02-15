/**
 * Backend API Service
 *
 * Updated for:
 * ✅ User-Owned Events (filtered by UserId from JWT)
 * ✅ Data Validation & DTOs (CreateEventDto, UpdateEventDto, EventResponseDto)
 * ✅ Centralized Error Handling (ErrorHandlingMiddleware)
 *
 * Endpoints:
 * - GET /api/Events - Get all user events
 * - POST /api/Events - Create new event (uses CreateEventDto)
 * - GET /api/Events/{id} - Get specific event
 * - PUT /api/Events/{id} - Update event (uses UpdateEventDto)
 * - DELETE /api/Events/{id} - Delete event
 */

const API_BASE_URL = 'http://localhost:5233/api';

/**
 * EventResponseDto - Response format from backend
 */
export interface EventResponseDto {
  id: number;
  title: string;
  description?: string;
  startDate: string; // ISO DateTime
  endDate: string; // ISO DateTime
  allDay: boolean;
  createdAt: string;
  userId: string;
}

/**
 * CreateEventDto - Request format for creating events
 */
export interface CreateEventDto {
  title: string;
  description?: string;
  startDate: string; // ISO DateTime
  endDate: string; // ISO DateTime
  allDay: boolean;
}

/**
 * UpdateEventDto - Request format for updating events (partial)
 */
export interface UpdateEventDto {
  title?: string;
  description?: string;
  startDate?: string; // ISO DateTime
  endDate?: string; // ISO DateTime
  allDay?: boolean;
}

/**
 * Error response from backend
 */
export interface ErrorResponse {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

// Type alias for backward compatibility
export type BackendEvent = EventResponseDto;

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    displayName?: string;
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

// Storage for auth token (in memory during app session)
let authToken: string | null = null;

/**
 * Get current auth token
 */
export const getAuthToken = (): string | null => {
  return authToken;
};

/**
 * Set auth token manually (useful for restoring session)
 */
export const setAuthToken = (token: string | null): void => {
  authToken = token;
  if (token) {
    console.log('[Backend] Auth token set:', token.slice(0, 10) + '...');
  } else {
    console.log('[Backend] Auth token cleared');
  }
};

const getHeaders = (includeAuth = true) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (includeAuth && authToken) {
    headers.Authorization = `Bearer ${authToken}`;
    console.log('[Backend] Authorization header set with token:', authToken.slice(0, 10) + '...');
  }

  return headers;
};

/**
 * Parse error response from backend
 */
const parseErrorResponse = async (response: Response): Promise<string> => {
  try {
    const errorData: ErrorResponse = await response.json();
    console.error('[Backend] Error response:', errorData);
    return errorData.message || `Error ${response.status}`;
  } catch {
    return `Error ${response.status}`;
  }
};

// =============================================================================
// AUTH ENDPOINTS
// =============================================================================

export const backendAuthService = {
  /**
   * Login with email and password
   */
  login: async (email: string, password: string): Promise<LoginResponse> => {
    console.log('[Backend Auth] Attempting login with email:', email);
    const response = await fetch(`${API_BASE_URL}/Auth/login`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorMessage = await parseErrorResponse(response);
      console.error('[Backend Auth] Login failed with status:', response.status, 'Message:', errorMessage);
      throw new Error(errorMessage);
    }

    const data: LoginResponse = await response.json();
    authToken = data.token;
    console.log('[Backend Auth] Login successful for user:', data.user.email, 'Token:', authToken.slice(0, 10) + '...');
    return data;
  },

  /**
   * Register a new user
   */
  register: async (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ): Promise<LoginResponse> => {
    console.log('[Backend Auth] Attempting registration with email:', email, 'firstName:', firstName, 'lastName:', lastName);
    const response = await fetch(`${API_BASE_URL}/Auth/register`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({ email, password, firstName, lastName }),
    });

    if (!response.ok) {
      const errorMessage = await parseErrorResponse(response);
      console.error('[Backend Auth] Registration failed with status:', response.status, 'Message:', errorMessage);
      throw new Error(errorMessage);
    }

    const data: LoginResponse = await response.json();
    authToken = data.token;
    console.log('[Backend Auth] Registration successful for user:', data.user.email, 'Token:', authToken.slice(0, 10) + '...');
    return data;
  },

  /**
   * Logout and clear token
   */
  logout: async (): Promise<void> => {
    console.log('[Backend Auth] Logout - clearing auth token');
    authToken = null;
  },

  /**
   * Get current auth token
   */
  getToken: (): string | null => {
    return authToken;
  },

  /**
   * Set auth token (for session persistence)
   */
  setToken: (token: string): void => {
    authToken = token;
  },
};

// =============================================================================
// EVENTS ENDPOINTS
// =============================================================================

export const backendEventService = {
  /**
   * Get all events for the current user (filtered by JWT userId)
   */
  getAllEvents: async (): Promise<EventResponseDto[]> => {
    console.log('[Backend Events] Fetching all events for current user...');
    const response = await fetch(`${API_BASE_URL}/Events`, {
      method: 'GET',
      headers: getHeaders(true),
    });

    if (!response.ok) {
      const errorMessage = await parseErrorResponse(response);
      console.error('[Backend Events] Failed to fetch events with status:', response.status, 'Message:', errorMessage);
      throw new Error(errorMessage);
    }

    const events = await response.json();
    console.log('[Backend Events] Fetched', events.length, 'events for user');
    return events;
  },

  /**
   * Get a specific event by ID (user must own the event)
   */
  getEventById: async (id: number): Promise<EventResponseDto> => {
    console.log('[Backend Events] Fetching event with ID:', id);
    const response = await fetch(`${API_BASE_URL}/Events/${id}`, {
      method: 'GET',
      headers: getHeaders(true),
    });

    if (!response.ok) {
      const errorMessage = await parseErrorResponse(response);
      console.error('[Backend Events] Failed to fetch event', id, 'with status:', response.status, 'Message:', errorMessage);
      throw new Error(errorMessage);
    }

    const event = await response.json();
    console.log('[Backend Events] Fetched event:', event.id, '-', event.title);
    return event;
  },

  /**
   * Create a new event (uses CreateEventDto)
   * User is automatically assigned from JWT token
   */
  createEvent: async (event: CreateEventDto): Promise<EventResponseDto> => {
    console.log('[Backend Events] Creating new event:', event.title);
    const response = await fetch(`${API_BASE_URL}/Events`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      const errorMessage = await parseErrorResponse(response);
      console.error('[Backend Events] Failed to create event with status:', response.status, 'Message:', errorMessage);
      throw new Error(errorMessage);
    }

    const createdEvent = await response.json();
    console.log('[Backend Events] Event created successfully with ID:', createdEvent.id);
    return createdEvent;
  },

  /**
   * Update an existing event (uses UpdateEventDto)
   * User must own the event to update it
   */
  updateEvent: async (
    id: number,
    event: UpdateEventDto
  ): Promise<EventResponseDto> => {
    console.log('[Backend Events] Updating event with ID:', id);
    const response = await fetch(`${API_BASE_URL}/Events/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      const errorMessage = await parseErrorResponse(response);
      console.error('[Backend Events] Failed to update event', id, 'with status:', response.status, 'Message:', errorMessage);
      throw new Error(errorMessage);
    }

    const updatedEvent = await response.json();
    console.log('[Backend Events] Event', id, 'updated successfully');
    return updatedEvent;
  },

  /**
   * Delete an event
   * User must own the event to delete it
   */
  deleteEvent: async (id: number): Promise<void> => {
    console.log('[Backend Events] Deleting event with ID:', id);
    const response = await fetch(`${API_BASE_URL}/Events/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });

    if (!response.ok) {
      const errorMessage = await parseErrorResponse(response);
      console.error('[Backend Events] Failed to delete event', id, 'with status:', response.status, 'Message:', errorMessage);
      throw new Error(errorMessage);
    }

    console.log('[Backend Events] Event', id, 'deleted successfully');
  },
};
