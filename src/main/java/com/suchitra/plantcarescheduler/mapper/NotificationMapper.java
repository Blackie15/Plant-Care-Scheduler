package com.suchitra.plantcarescheduler.mapper;

import org.springframework.stereotype.Component;

import com.suchitra.plantcarescheduler.dto.notificationdto.NotificationRequestDTO;
import com.suchitra.plantcarescheduler.dto.notificationdto.NotificationResponseDTO;
import com.suchitra.plantcarescheduler.entity.Notification;
import com.suchitra.plantcarescheduler.entity.User;

@Component
public class NotificationMapper {

    // RequestDTO -> Entity
    public Notification toEntity(NotificationRequestDTO requestDTO) {

        Notification notification = new Notification();

        notification.setTitle(requestDTO.getTitle());
        notification.setMessage(requestDTO.getMessage());
        notification.setNotificationType(requestDTO.getNotificationType());

        User user = new User();
        user.setId(requestDTO.getUserId());
        notification.setUser(user);

        return notification;
    }

    // Entity -> ResponseDTO
    public NotificationResponseDTO toResponseDTO(Notification notification) {

        NotificationResponseDTO responseDTO = new NotificationResponseDTO();

        responseDTO.setNotificationId(notification.getNotificationId());
        responseDTO.setUserId(notification.getUser().getId());
        responseDTO.setTitle(notification.getTitle());
        responseDTO.setMessage(notification.getMessage());
        responseDTO.setNotificationType(notification.getNotificationType());
        responseDTO.setIsRead(notification.getIsRead());
        responseDTO.setCreatedDate(notification.getCreatedDate());

        return responseDTO;
    }
    //no update entity becoz we only update isRead() in markAsRead() 
}