import { useState, useEffect } from 'react';
import type { Notification } from '../types';

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Weekly Report Due',
    message: 'Your weekly progress report is due tomorrow',
    type: 'warning',
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'New Project Assignment',
    message: 'You have been assigned to the API Gateway project',
    type: 'info',
    read: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    title: 'Review Scheduled',
    message: 'Project review scheduled for next Monday',
    type: 'info',
    read: true,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Simulate API call
    setNotifications(MOCK_NOTIFICATIONS);
    setUnreadCount(MOCK_NOTIFICATIONS.filter((n) => !n.read).length);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => prev - 1);
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };
}