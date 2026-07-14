package com.suchitra.plantcarescheduler.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.suchitra.plantcarescheduler.entity.Notification;
import com.suchitra.plantcarescheduler.entity.User;
import com.suchitra.plantcarescheduler.repository.NotificationRepository;
import com.suchitra.plantcarescheduler.repository.UserRepository;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    // Create Notification
    public Notification createNotification(Notification notification) {

        Long userId = notification.getUser().getId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        notification.setUser(user);

        return notificationRepository.save(notification);
    }

    // Get All Notifications
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    // Get Notification By Id
    public Optional<Notification> getNotificationById(Long id) {
        return notificationRepository.findById(id);
    }

    // Get Notifications By User Id
    public List<Notification> getNotificationsByUserId(Long userId) {

        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found with id: " + userId);
        }

        return notificationRepository.findByUserId(userId);
    }

    // Mark Notification As Read
    public Notification markAsRead(Long id) {

        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found with id: " + id));

        notification.setIsRead(true);

        return notificationRepository.save(notification);
    }

    // Delete Notification
    public void deleteNotification(Long id) {

        if (!notificationRepository.existsById(id)) {
            throw new RuntimeException("Notification not found with id: " + id);
        }

        notificationRepository.deleteById(id);
    }
}