package com.suchitra.plantcarescheduler.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.core.Authentication;
import com.suchitra.plantcarescheduler.dto.authenticationdto.AuthenticationRequestDTO;
import com.suchitra.plantcarescheduler.dto.authenticationdto.AuthenticationResponseDTO;
import com.suchitra.plantcarescheduler.dto.userdto.UserProfileUpdateDTO;
import com.suchitra.plantcarescheduler.dto.userdto.UserRequestDTO;
import com.suchitra.plantcarescheduler.dto.userdto.UserResponseDTO;
import com.suchitra.plantcarescheduler.entity.User;
import com.suchitra.plantcarescheduler.mapper.UserMapper;
import com.suchitra.plantcarescheduler.security.JwtService;
import com.suchitra.plantcarescheduler.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserService userService;
    private final UserMapper userMapper;

    public AuthenticationController(AuthenticationManager authenticationManager,
                                    JwtService jwtService, UserService userService,UserMapper userMapper) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userService = userService;
        this.userMapper=userMapper;
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

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponseDTO> login(
            @RequestBody AuthenticationRequestDTO request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));

        String token = jwtService.generateToken(request.getEmail());

        return ResponseEntity.ok(new AuthenticationResponseDTO(token));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> getCurrentUser(
            Authentication authentication) {

        String email = authentication.getName();

        User user = userService.getUserByEmail(email);

        return ResponseEntity.ok(
                userMapper.toResponseDTO(user)
        );
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponseDTO> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UserProfileUpdateDTO updateDTO) {

        String email = authentication.getName();

        User updatedUser = userService.updateUserProfile(email, updateDTO);

        return ResponseEntity.ok(
                userMapper.toResponseDTO(updatedUser)
        );
    }
}