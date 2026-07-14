package com.suchitra.plantcarescheduler.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.suchitra.plantcarescheduler.dto.notificationdto.NotificationRequestDTO;
import com.suchitra.plantcarescheduler.dto.notificationdto.NotificationResponseDTO;
import com.suchitra.plantcarescheduler.entity.Notification;
import com.suchitra.plantcarescheduler.mapper.NotificationMapper;
import com.suchitra.plantcarescheduler.service.NotificationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final NotificationMapper notificationMapper;

    public NotificationController(NotificationService notificationService,
                                  NotificationMapper notificationMapper) {
        this.notificationService = notificationService;
        this.notificationMapper = notificationMapper;
    }

    // Create Notification
    @PostMapping
    public ResponseEntity<NotificationResponseDTO> createNotification(
            @Valid @RequestBody NotificationRequestDTO requestDTO) {

        Notification notification = notificationMapper.toEntity(requestDTO);

        Notification savedNotification = notificationService.createNotification(notification);

        return new ResponseEntity<>(
                notificationMapper.toResponseDTO(savedNotification),
                HttpStatus.CREATED);
    }

    // Get All Notifications
    @GetMapping
    public ResponseEntity<List<NotificationResponseDTO>> getAllNotifications() {

        List<NotificationResponseDTO> notifications = notificationService.getAllNotifications()
                .stream()
                .map(notificationMapper::toResponseDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(notifications);
    }

    // Get Notification By Id
    @GetMapping("/{id}")
    public ResponseEntity<NotificationResponseDTO> getNotificationById(@PathVariable Long id) {

        Notification notification = notificationService.getNotificationById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found with id: " + id));

        return ResponseEntity.ok(notificationMapper.toResponseDTO(notification));
    }

    // Get Notifications By User Id
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationResponseDTO>> getNotificationsByUserId(@PathVariable Long userId) {

        List<NotificationResponseDTO> notifications = notificationService.getNotificationsByUserId(userId)
                .stream()
                .map(notificationMapper::toResponseDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(notifications);
    }

    // Mark Notification As Read
    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationResponseDTO> markAsRead(@PathVariable Long id) {

        Notification notification = notificationService.markAsRead(id);

        return ResponseEntity.ok(notificationMapper.toResponseDTO(notification));
    }

    // Delete Notification
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteNotification(@PathVariable Long id) {

        notificationService.deleteNotification(id);

        return ResponseEntity.ok("Notification deleted successfully");
    }
}