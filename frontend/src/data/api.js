import axios from 'axios';

// Create axios instance with base URL
// Uses environment variable in production, falls back to localhost for development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for cookies/sessions
  headers: {
    'Content-Type': 'application/json'
  }
});

// --- Authentication API ---

export const apiRegister = async (name, email, password, role) => {
  try {
    const response = await api.post('/auth/register', { name, email, password, role });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const apiLogin = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
};

export const apiGetCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    return null;
  }
};

export const apiLogout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  }
};

// --- User API ---

export const apiGetUserById = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    return null;
  }
};

// --- Event API ---

export const apiGetAllApprovedEvents = async () => {
  try {
    const response = await api.get('/events');
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

export const apiGetPendingEvents = async () => {
  try {
    const response = await api.get('/events/pending');
    return response.data;
  } catch (error) {
    console.error('Error fetching pending events:', error);
    return [];
  }
};

export const apiGetEventById = async (id) => {
  try {
    const response = await api.get(`/events/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
};

export const apiGetEventsForUser = async (userId) => {
  try {
    const response = await api.get(`/events/user/${userId}/joined`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user events:', error);
    return [];
  }
};

export const apiGetCreatedEvents = async (userId) => {
  try {
    const response = await api.get(`/events/created/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching created events:', error);
    return [];
  }
};

export const apiJoinEvent = async (eventId, userId) => {
  try {
    const response = await api.post(`/events/${eventId}/join`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to join event');
  }
};

export const apiCancelRsvp = async (eventId, userId) => {
  try {
    const response = await api.delete(`/events/${eventId}/leave`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to leave event');
  }
};

export const apiCreateEvent = async (eventData) => {
  try {
    const response = await api.post('/events', eventData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create event');
  }
};

export const apiHandleApproval = async (eventId, isApproved) => {
  try {
    const endpoint = isApproved ? `/events/${eventId}/approve` : `/events/${eventId}/reject`;
    const response = await api.put(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update event status');
  }
};

export const apiDeleteEvent = async (eventId) => {
  try {
    const response = await api.delete(`/events/${eventId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete event');
  }
};