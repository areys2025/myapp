import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bell, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
  _id: string;
  message: string;
  date: string;
  isRead: boolean;
}

const CustomerNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();
  const token = localStorage.getItem('token');

  const Pinstance = axios.create({
    baseURL: 'https://myapp-ph0r.onrender.com/api/auth',
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

useEffect(() => {
  if (user) {
    Pinstance.get(`/notifications/customer/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {      
      if (Array.isArray(res.data)) {
        setNotifications(res.data);
      } else {
        setNotifications([]);
        console.warn("Expected array, got:", res.data);
      }
    })
    .catch(err => {
      console.error(err);
      setNotifications([]);
    });
  }
  
}, [user]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Page Title */}
      <div className="flex items-center gap-3 mb-6">
        <Bell className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
      </div>

      {/* Notification List */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {notifications.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            <AnimatePresence>
              {notifications.map((n) => (
                <motion.li
                  key={n._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex justify-between items-center p-4 hover:bg-gray-50 transition-colors ${
                    n.isRead ? 'bg-gray-50' : 'bg-blue-50'
                  }`}
                >
                  <div>
                    <p className="text-gray-800">{n.message}</p>
                    <span className="text-xs text-gray-500">
                      {new Date(n.date).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    {n.isRead ? (
                      <CheckCircle className="text-green-500 w-5 h-5" />
                    ) : (
                      <Clock className="text-yellow-500 w-5 h-5" />
                    )}
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        ) : (
          <div className="p-6 text-center text-gray-500">
            <Bell className="w-10 h-10 mx-auto text-gray-300 mb-3" />
            <p>No notifications yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerNotificationsPage;
