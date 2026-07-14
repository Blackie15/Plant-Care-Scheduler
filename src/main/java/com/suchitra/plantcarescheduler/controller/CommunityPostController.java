package com.suchitra.plantcarescheduler.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.suchitra.plantcarescheduler.dto.communitypostdto.CommunityPostRequestDTO;
import com.suchitra.plantcarescheduler.dto.communitypostdto.CommunityPostResponseDTO;
import com.suchitra.plantcarescheduler.entity.CommunityPost;
import com.suchitra.plantcarescheduler.entity.User;
import com.suchitra.plantcarescheduler.mapper.CommunityPostMapper;
import com.suchitra.plantcarescheduler.service.CommunityPostService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/community-posts")
public class CommunityPostController {

    private final CommunityPostService communityPostService;

    private final CommunityPostMapper communityPostMapper;

    public CommunityPostController(CommunityPostService communityPostService, CommunityPostMapper communityPostMapper) {
        this.communityPostService = communityPostService;
        this.communityPostMapper = communityPostMapper;
    }

    // Create Post
    @PostMapping
    public ResponseEntity<CommunityPostResponseDTO> createPost(
            @Valid @RequestBody CommunityPostRequestDTO requestDTO) {

        User user = new User();
        user.setId(requestDTO.getUserId());

        CommunityPost post = communityPostMapper.toEntity(requestDTO, user);

        CommunityPost savedPost = communityPostService.createPost(post);

        return new ResponseEntity<>(
                communityPostMapper.toResponseDTO(savedPost),
                HttpStatus.CREATED);
    }

    // Get All Posts
    @GetMapping
    public ResponseEntity<List<CommunityPostResponseDTO>> getAllPosts() {

        List<CommunityPostResponseDTO> posts =
                communityPostService.getAllPosts()
                        .stream()
                        .map(communityPostMapper::toResponseDTO)
                        .collect(Collectors.toList());

        return ResponseEntity.ok(posts);
    }

    // Get Post By Id
    @GetMapping("/{id}")
    public ResponseEntity<CommunityPostResponseDTO> getPostById(@PathVariable Long id) {

        CommunityPost post = communityPostService.getPostById(id)
                .orElseThrow(() -> new RuntimeException("Community post not found with id: " + id));

        return ResponseEntity.ok(communityPostMapper.toResponseDTO(post));
    }

    // Get Posts By User Id
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CommunityPostResponseDTO>> getPostsByUserId(
            @PathVariable Long userId) {

        List<CommunityPostResponseDTO> posts =
                communityPostService.getPostsByUserId(userId)
                        .stream()
                        .map(communityPostMapper::toResponseDTO)
                        .collect(Collectors.toList());

        return ResponseEntity.ok(posts);
    }

    // Search Posts By Title
    @GetMapping("/search")
    public ResponseEntity<List<CommunityPostResponseDTO>> searchPostsByTitle(
            @RequestParam String title) {

        List<CommunityPostResponseDTO> posts =
                communityPostService.searchPostsByTitle(title)
                        .stream()
                        .map(communityPostMapper::toResponseDTO)
                        .collect(Collectors.toList());

        return ResponseEntity.ok(posts);
    }

    // Update Post
    @PutMapping("/{id}")
    public ResponseEntity<CommunityPostResponseDTO> updatePost(
            @PathVariable Long id,
            @Valid @RequestBody CommunityPostRequestDTO requestDTO) {

        User user = new User();
        user.setId(requestDTO.getUserId());

        CommunityPost post = communityPostMapper.toEntity(requestDTO, user);

        CommunityPost updatedPost =
                communityPostService.updatePost(id, post);

        return ResponseEntity.ok(
                communityPostMapper.toResponseDTO(updatedPost));
    }

    // Delete Post
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePost(@PathVariable Long id) {

        communityPostService.deletePost(id);

        return ResponseEntity.ok("Community post deleted successfully");
    }
}