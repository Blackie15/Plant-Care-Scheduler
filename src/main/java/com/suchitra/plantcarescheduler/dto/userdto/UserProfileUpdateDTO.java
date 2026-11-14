package com.suchitra.plantcarescheduler.dto.userdto;

import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileUpdateDTO {

    private String username;

    @Email(message = "Enter a valid email")
    private String email;

    private String password;

    private String location;

    private Double latitude;

    private Double longitude;

    private String gardeningExperience;

    private String timezone;

    private String notificationPreferences;
}
