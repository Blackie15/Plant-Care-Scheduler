package com.suchitra.plantcarescheduler.dto.notificationdto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponseDTO {

    private Long notificationId;

    private Long userId;

    private String title;

    private String message;

    private String notificationType;

    private Boolean isRead;

    private LocalDateTime createdDate;

}