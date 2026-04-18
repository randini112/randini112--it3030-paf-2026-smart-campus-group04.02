package com.smartcampus.ticketing.service;

import com.smartcampus.ticketing.model.Notification;
import java.util.List;

public interface NotificationService {
    Notification createNotification(Notification notification);
    List<Notification> getNotificationsByUserId(String userId);
    List<Notification> getUnreadNotifications(String userId);
    long getUnreadCount(String userId);
    Notification markAsRead(String id);
    void markAllAsRead(String userId);
    void deleteNotification(String id);
}