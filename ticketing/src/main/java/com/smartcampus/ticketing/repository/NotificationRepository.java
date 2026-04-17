package com.smartcampus.ticketing.repository;

import com.smartcampus.ticketing.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByUserId(String userId);
    List<Notification> findByUserIdAndRead(String userId, boolean read);
    long countByUserIdAndRead(String userId, boolean read);
}