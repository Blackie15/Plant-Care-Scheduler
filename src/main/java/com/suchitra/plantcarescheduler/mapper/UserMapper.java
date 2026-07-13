package com.suchitra.plantcarescheduler.mapper;

import org.springframework.stereotype.Component;

import com.suchitra.plantcarescheduler.dto.userdto.UserRequestDTO;
import com.suchitra.plantcarescheduler.dto.userdto.UserResponseDTO;
import com.suchitra.plantcarescheduler.entity.User;

@Component
public class UserMapper {

    // Convert RequestDTO -> Entity
    public User toEntity(UserRequestDTO requestDTO) {

        User user = new User();

        user.setUsername(requestDTO.getUsername());
        user.setEmail(requestDTO.getEmail());
        user.setPasswordHash(requestDTO.getPassword());
        user.setRole(requestDTO.getRole());
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

        existingUser.setUsername(updatedUser.getUsername());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setPasswordHash(updatedUser.getPasswordHash());
        existingUser.setRole(updatedUser.getRole());
        existingUser.setLocation(updatedUser.getLocation());
        existingUser.setGardeningExperience(updatedUser.getGardeningExperience());
        existingUser.setTimezone(updatedUser.getTimezone());
        existingUser.setNotificationPreferences(updatedUser.getNotificationPreferences());
    }
}