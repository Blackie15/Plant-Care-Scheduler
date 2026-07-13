package com.suchitra.plantcarescheduler.dto.userdto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDTO {

    private Long id;

    private String username;

    private String email;

    private String role;

    private Boolean isActive;

    private Boolean emailVerified;

    private String location;

    private String gardeningExperience;

    private String timezone;

    private String notificationPreferences;

    private LocalDateTime createdDate;

    private LocalDateTime lastLogin;

}