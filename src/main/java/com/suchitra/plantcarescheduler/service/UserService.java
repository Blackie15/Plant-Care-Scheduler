package com.suchitra.plantcarescheduler.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.suchitra.plantcarescheduler.dto.userdto.UserProfileUpdateDTO;
import com.suchitra.plantcarescheduler.entity.User;
import com.suchitra.plantcarescheduler.exception.EmailAlreadyExistsException;
import com.suchitra.plantcarescheduler.exception.UserNotFoundException;
import com.suchitra.plantcarescheduler.exception.UsernameAlreadyExistsException;
import com.suchitra.plantcarescheduler.mapper.UserMapper;
import com.suchitra.plantcarescheduler.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder= passwordEncoder;
    }

    // Register User
    public User registerUser(User user) {

        if (userRepository.existsByUsername(user.getUsername())) {
            throw new UsernameAlreadyExistsException("Username already exists");
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new EmailAlreadyExistsException("Email already exists");
        }

        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        user.setCreatedDate(LocalDateTime.now());

        return userRepository.save(user);
    }

    // Get User By Id
    public User getUserById(Long id) {

        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
    }

    public User getUserByEmail(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found with email: " + email));
    }
    
    // Get All Users
    public List<User> getAllUsers() {

        return userRepository.findAll();
    }

    // Get All Specialists
    public List<User> getSpecialists() {
        return userRepository.findByRole(com.suchitra.plantcarescheduler.entity.Role.SPECIALIST);
    }

    // Update User
    public User updateUser(Long id, User user) {

        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));

        userMapper.updateEntity(existingUser, user);

        if (user.getPasswordHash() != null && !user.getPasswordHash().isBlank()) {
            existingUser.setPasswordHash(
                    passwordEncoder.encode(user.getPasswordHash()));
        }
        return userRepository.save(existingUser);
    }

    // Update Current User Profile
    public User updateUserProfile(String currentEmail, UserProfileUpdateDTO dto) {
        User existingUser = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + currentEmail));

        return applyProfileUpdates(existingUser, dto);
    }

    // Update User by ID with DTO
    public User updateUserById(Long id, UserProfileUpdateDTO dto) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));

        return applyProfileUpdates(existingUser, dto);
    }

    private User applyProfileUpdates(User existingUser, UserProfileUpdateDTO dto) {
        if (dto.getUsername() != null && !dto.getUsername().isBlank() && !dto.getUsername().equals(existingUser.getUsername())) {
            if (userRepository.existsByUsername(dto.getUsername())) {
                throw new UsernameAlreadyExistsException("Username '" + dto.getUsername() + "' is already taken");
            }
            existingUser.setUsername(dto.getUsername().trim());
        }

        if (dto.getEmail() != null && !dto.getEmail().isBlank() && !dto.getEmail().equalsIgnoreCase(existingUser.getEmail())) {
            if (userRepository.existsByEmail(dto.getEmail())) {
                throw new EmailAlreadyExistsException("Email '" + dto.getEmail() + "' is already in use");
            }
            existingUser.setEmail(dto.getEmail().trim());
        }

        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            existingUser.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        }

        if (dto.getLocation() != null) {
            existingUser.setLocation(dto.getLocation().trim());
        }

        if (dto.getGardeningExperience() != null) {
            existingUser.setGardeningExperience(dto.getGardeningExperience().trim());
        }

        if (dto.getTimezone() != null) {
            existingUser.setTimezone(dto.getTimezone().trim());
        }

        if (dto.getNotificationPreferences() != null) {
            existingUser.setNotificationPreferences(dto.getNotificationPreferences().trim());
        }

        return userRepository.save(existingUser);
    }

    // Delete User
    public void deleteUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));

        userRepository.delete(user);
    }

}