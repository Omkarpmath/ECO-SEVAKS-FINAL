// src/contexts/AppContext.jsx
import { createContext, useContext, useState } from 'react';
import { initialUsers, initialEvents } from '../data/mockData';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [users, setUsers] = useState(initialUsers);
  const [events, setEvents] = useState(initialEvents);
  const [currentUser, setCurrentUser] = useState(null);

  // === Auth Functions ===
  const login = (email, password) => {
    const user = Object.values(users).find(u => u.email === email);
    if (user && password === 'password123') { // Demo password
      setCurrentUser(user);
      return { success: true, user };
    }
    return { success: false, message: 'Invalid credentials.' };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const register = ({ name, email, password, role }) => {
    if (Object.values(users).find(u => u.email === email)) {
      return { success: false, message: 'Email already registered.' };
    }
    const newId = Object.keys(users).length + 1;
    const newUser = { id: newId, name, email, role, joinedEvents: [], createdEvents: [] };
    setUsers(prevUsers => ({ ...prevUsers, [newId]: newUser }));
    return { success: true };
  };

  // === Event Functions ===
  const getEventById = (id) => events.find(e => e.id === id);
  const getEventsByOrganizer = (userId) => events.filter(e => e.organizer === userId);
  const getJoinedEvents = (userId) => {
    const user = users[userId];
    if (!user) return [];
    return events.filter(e => user.joinedEvents.includes(e.id));
  };
  const getPendingEvents = () => events.filter(e => e.status === 'pending');

  const joinEvent = (eventId) => {
    if (!currentUser) return;
    
    // Add event to user's list
    const updatedUser = { ...currentUser, joinedEvents: [...currentUser.joinedEvents, eventId] };
    setCurrentUser(updatedUser);
    setUsers(prev => ({ ...prev, [currentUser.id]: updatedUser }));

    // Add user to event's list
    setEvents(prevEvents => prevEvents.map(e => 
      e.id === eventId ? { ...e, attendees: [...e.attendees, currentUser.id] } : e
    ));
  };

  const cancelRsvp = (eventId) => {
    if (!currentUser) return;

    // Remove event from user's list
    const updatedUser = { ...currentUser, joinedEvents: currentUser.joinedEvents.filter(id => id !== eventId) };
    setCurrentUser(updatedUser);
    setUsers(prev => ({ ...prev, [currentUser.id]: updatedUser }));

    // Remove user from event's list
    setEvents(prevEvents => prevEvents.map(e => 
      e.id === eventId ? { ...e, attendees: e.attendees.filter(id => id !== currentUser.id) } : e
    ));
  };

  const addEvent = (eventData) => {
    const newEvent = {
      ...eventData,
      id: events.length + 1,
      attendees: [],
      organizer: currentUser.id,
      status: 'pending',
      imageUrl: `https://placehold.co/400x200/a0eec0/1f4d1f?text=${eventData.title.replace(/ /g,'+')}`
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const handleApproval = (eventId, isApproved) => {
    setEvents(prevEvents => prevEvents.map(e => 
      e.id === eventId ? { ...e, status: isApproved ? 'approved' : 'rejected' } : e
    ));
  };

  const value = {
    users,
    events,
    currentUser,
    login,
    logout,
    register,
    getEventById,
    getEventsByOrganizer,
    getJoinedEvents,
    getPendingEvents,
    joinEvent,
    cancelRsvp,
    addEvent,
    handleApproval,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to easily use our context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};