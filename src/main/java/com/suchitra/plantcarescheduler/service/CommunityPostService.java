package com.suchitra.plantcarescheduler.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.suchitra.plantcarescheduler.entity.CommunityPost;
import com.suchitra.plantcarescheduler.entity.User;
import com.suchitra.plantcarescheduler.exception.ResourceNotFoundException;
import com.suchitra.plantcarescheduler.mapper.CommunityPostMapper;
import com.suchitra.plantcarescheduler.repository.CommunityPostRepository;
import com.suchitra.plantcarescheduler.repository.UserRepository;

@Service
public class CommunityPostService {

    private final CommunityPostRepository communityPostRepository;

    private final UserRepository userRepository;

    private final CommunityPostMapper communityPostMapper;

    private final ImageStorageService imageStorageService;

    public CommunityPostService(CommunityPostRepository communityPostRepository,
                                UserRepository userRepository,
                                CommunityPostMapper communityPostMapper,
                                ImageStorageService imageStorageService) {

        this.communityPostRepository = communityPostRepository;
        this.userRepository = userRepository;
        this.communityPostMapper = communityPostMapper;
        this.imageStorageService = imageStorageService;
    }

    // Create Post
    public CommunityPost createPost(CommunityPost post) {

        Long userId = post.getUser().getId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        post.setUser(user);

        return communityPostRepository.save(post);
    }

    // Get All Posts
    public List<CommunityPost> getAllPosts() {
        return communityPostRepository.findAll();
    }

    // Get Post By Id
    public Optional<CommunityPost> getPostById(Long id) {
        return communityPostRepository.findById(id);
    }

    // Get Posts By User Id
    public List<CommunityPost> getPostsByUserId(Long userId) {

        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }

        return communityPostRepository.findByUserId(userId);
    }

    // Search Posts By Title
    public List<CommunityPost> searchPostsByTitle(String title) {
        return communityPostRepository.findByTitleContainingIgnoreCase(title);
    }

    // Update Post
    public CommunityPost updatePost(Long id, CommunityPost updatedPost) {

        CommunityPost existingPost = communityPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Community post not found with id: " + id));

        Long userId = updatedPost.getUser().getId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        updatedPost.setUser(user);

        String previousImage = existingPost.getImage();
        String nextImage = updatedPost.getImage();

        communityPostMapper.updateEntity(existingPost, updatedPost);

        CommunityPost saved = communityPostRepository.save(existingPost);
        if (previousImage != null && !previousImage.equals(nextImage)) {
            imageStorageService.deleteIfLocalCommunityImage(previousImage);
        }
        return saved;
    }

    // Delete Post
    public void deletePost(Long id) {

        CommunityPost existingPost = communityPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Community post not found with id: " + id));

        String imageUrl = existingPost.getImage();
        communityPostRepository.delete(existingPost);
        imageStorageService.deleteIfLocalCommunityImage(imageUrl);
    }
}