package com.suchitra.plantcarescheduler.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.suchitra.plantcarescheduler.dto.userdto.UserProfileUpdateDTO;
import com.suchitra.plantcarescheduler.dto.userdto.UserRequestDTO;
import com.suchitra.plantcarescheduler.dto.userdto.UserResponseDTO;
import com.suchitra.plantcarescheduler.entity.User;
import com.suchitra.plantcarescheduler.mapper.UserMapper;
import com.suchitra.plantcarescheduler.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
@Validated
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

    public UserController(UserService userService, UserMapper userMapper) {
        this.userService = userService;
        this.userMapper = userMapper;
    }

    // Get User By Id
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long id) {

        User user = userService.getUserById(id);

        return ResponseEntity.ok(userMapper.toResponseDTO(user));
    }

    // Get All Users
    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {

        List<UserResponseDTO> users = userService.getAllUsers()
                .stream()
                .map(userMapper::toResponseDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(users);
    }

    // Get All Specialists
    @GetMapping("/specialists")
    public ResponseEntity<List<UserResponseDTO>> getSpecialists() {

        List<UserResponseDTO> specialists = userService.getSpecialists()
                .stream()
                .map(userMapper::toResponseDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(specialists);
    }

    // Update User
    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDTO> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserProfileUpdateDTO requestDTO) {

        User updatedUser = userService.updateUserById(id, requestDTO);

        return ResponseEntity.ok(userMapper.toResponseDTO(updatedUser));
    }

    // Delete User
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {

        userService.deleteUser(id);

        return ResponseEntity.ok("User deleted successfully");
    }

}