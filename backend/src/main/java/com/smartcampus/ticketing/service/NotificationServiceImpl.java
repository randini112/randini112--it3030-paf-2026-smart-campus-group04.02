package com.smartcampus.ticketing.service;

import com.smartcampus.ticketing.model.Notification;
import com.smartcampus.ticketing.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Override
    public Notification createNotification(Notification notification) {
        return notificationRepository.save(notification);
    }
    
    @Override
    public List<Notification> getNotificationsByUserId(String userId) {
        return notificationRepository.findByUserId(userId);
    }
    
    @Override
    public List<Notification> getUnreadNotifications(String userId) {
        return notificationRepository.findByUserIdAndRead(userId, false);
    }
    
    @Override
    public long getUnreadCount(String userId) {
        return notificationRepository.countByUserIdAndRead(userId, false);
    }
    
    @Override
    public Notification markAsRead(String id) {
        Notification notification = notificationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        return notificationRepository.save(notification);
    }
    
    @Override
    public void markAllAsRead(String userId) {
        List<Notification> unread = notificationRepository.findByUserIdAndRead(userId, false);
        for (Notification n : unread) {
            n.setRead(true);
        }
        notificationRepository.saveAll(unread);
    }
    
    @Override
    public void deleteNotification(String id) {
        notificationRepository.deleteById(id);
    }
}