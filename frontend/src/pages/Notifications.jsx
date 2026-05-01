import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Bell } from 'lucide-react';

export const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mocked data
    setNotifications([
      { id: 1, message: 'Alice added an expense "Dinner" in Trip to Hawaii', date: '2 hours ago', read: false },
      { id: 2, message: 'Bob settled up with you in Roommates', date: '1 day ago', read: true },
      { id: 3, message: 'You were added to the group "Weekend Getaway"', date: '3 days ago', read: true }
    ]);
    setLoading(false);
  }, []);

  if (loading) return <div className="animate-pulse">Loading notifications...</div>;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`flex gap-4 p-4 rounded-xl border transition-colors ${notification.read ? 'bg-background' : 'bg-primary/5 border-primary/20'}`}
              >
                <div className={`mt-1 bg-primary/10 p-2 rounded-full h-min ${notification.read ? 'text-muted-foreground' : 'text-primary'}`}>
                  <Bell className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className={`text-base ${notification.read ? 'text-muted-foreground' : 'font-medium text-foreground'}`}>
                    {notification.message}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{notification.date}</p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 rounded-full bg-primary self-center"></div>
                )}
              </div>
            ))}
            {notifications.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No new notifications
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
