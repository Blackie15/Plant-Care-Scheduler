package com.suchitra.plantcarescheduler.mapper;

import org.springframework.stereotype.Component;

import com.suchitra.plantcarescheduler.dto.userdto.UserRequestDTO;
import com.suchitra.plantcarescheduler.dto.userdto.UserResponseDTO;
import com.suchitra.plantcarescheduler.entity.User;
import com.suchitra.plantcarescheduler.entity.Role;

@Component
public class UserMapper {

    // Convert RequestDTO -> Entity
    public User toEntity(UserRequestDTO requestDTO) {

        User user = new User();

        user.setUsername(requestDTO.getUsername());
        user.setEmail(requestDTO.getEmail());
        user.setPasswordHash(requestDTO.getPassword());
        user.setRole(Role.valueOf(requestDTO.getRole().toUpperCase()));
        user.setLocation(requestDTO.getLocation());
        user.setGardeningExperience(requestDTO.getGardeningExperience());
        user.setTimezone(requestDTO.getTimezone());
        user.setNotificationPreferences(requestDTO.getNotificationPreferences());

        return user;
    }

    // Convert Entity -> ResponseDTO
    public UserResponseDTO toResponseDTO(User user) {

        UserResponseDTO responseDTO = new UserResponseDTO();

        responseDTO.setId(user.getId());
        responseDTO.setUsername(user.getUsername());
        responseDTO.setEmail(user.getEmail());
        responseDTO.setRole(user.getRole());
        responseDTO.setIsActive(user.getIsActive());
        responseDTO.setEmailVerified(user.getEmailVerified());
        responseDTO.setLocation(user.getLocation());
        responseDTO.setGardeningExperience(user.getGardeningExperience());
        responseDTO.setTimezone(user.getTimezone());
        responseDTO.setNotificationPreferences(user.getNotificationPreferences());
        responseDTO.setCreatedDate(user.getCreatedDate());
        responseDTO.setLastLogin(user.getLastLogin());

        return responseDTO;
    }

    // Update existing entity
    public void updateEntity(User existingUser, User updatedUser) {
        if (updatedUser.getUsername() != null && !updatedUser.getUsername().isBlank()) {
            existingUser.setUsername(updatedUser.getUsername());
        }
        if (updatedUser.getEmail() != null && !updatedUser.getEmail().isBlank()) {
            existingUser.setEmail(updatedUser.getEmail());
        }
        if (updatedUser.getPasswordHash() != null && !updatedUser.getPasswordHash().isBlank()) {
            existingUser.setPasswordHash(updatedUser.getPasswordHash());
        }
        if (updatedUser.getRole() != null) {
            existingUser.setRole(updatedUser.getRole());
        }
        if (updatedUser.getLocation() != null) {
            existingUser.setLocation(updatedUser.getLocation());
        }
        if (updatedUser.getGardeningExperience() != null) {
            existingUser.setGardeningExperience(updatedUser.getGardeningExperience());
        }
        if (updatedUser.getTimezone() != null) {
            existingUser.setTimezone(updatedUser.getTimezone());
        }
        if (updatedUser.getNotificationPreferences() != null) {
            existingUser.setNotificationPreferences(updatedUser.getNotificationPreferences());
        }
    }
}