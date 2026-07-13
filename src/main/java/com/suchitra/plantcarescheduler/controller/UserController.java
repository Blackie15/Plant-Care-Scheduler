package com.suchitra.plantcarescheduler.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.suchitra.plantcarescheduler.dto.userdto.LoginRequestDTO;
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

    // Register User
    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> registerUser(
            @Valid @RequestBody UserRequestDTO requestDTO) {

        User user = userMapper.toEntity(requestDTO);

        User savedUser = userService.registerUser(user);

        return new ResponseEntity<>(
                userMapper.toResponseDTO(savedUser),
                HttpStatus.CREATED);
    }

    // Login User
    @PostMapping("/login")
    public ResponseEntity<UserResponseDTO> loginUser(
            @Valid @RequestBody LoginRequestDTO loginRequestDTO) {

        User user = userService.loginUser(
                loginRequestDTO.getEmail(),
                loginRequestDTO.getPassword());

        return ResponseEntity.ok(userMapper.toResponseDTO(user));
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

    // Update User
    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDTO> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserRequestDTO requestDTO) {

        User user = userMapper.toEntity(requestDTO);

        User updatedUser = userService.updateUser(id, user);

        return ResponseEntity.ok(userMapper.toResponseDTO(updatedUser));
    }

    // Delete User
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {

        userService.deleteUser(id);

        return ResponseEntity.ok("User deleted successfully");
    }

}