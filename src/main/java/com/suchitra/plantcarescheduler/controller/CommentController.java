package com.suchitra.plantcarescheduler.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.suchitra.plantcarescheduler.dto.commentdto.CommentRequestDTO;
import com.suchitra.plantcarescheduler.dto.commentdto.CommentResponseDTO;
import com.suchitra.plantcarescheduler.entity.Comment;
import com.suchitra.plantcarescheduler.entity.CommunityPost;
import com.suchitra.plantcarescheduler.entity.User;
import com.suchitra.plantcarescheduler.mapper.CommentMapper;
import com.suchitra.plantcarescheduler.service.CommentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;

    private final CommentMapper commentMapper;


    public CommentController(CommentService commentService,
                             CommentMapper commentMapper) {

        this.commentService = commentService;
        this.commentMapper = commentMapper;
    }


    // Add Comment
    @PostMapping
    public ResponseEntity<CommentResponseDTO> addComment(
            @Valid @RequestBody CommentRequestDTO requestDTO) {


        CommunityPost post = new CommunityPost();
        post.setPostId(requestDTO.getPostId());


        User user = new User();
        user.setId(requestDTO.getUserId());


        Comment comment = commentMapper.toEntity(requestDTO, post, user);


        Comment savedComment = commentService.addComment(comment);


        return new ResponseEntity<>(
                commentMapper.toResponseDTO(savedComment),
                HttpStatus.CREATED);
    }


    // Get All Comments
    @GetMapping
    public ResponseEntity<List<CommentResponseDTO>> getAllComments() {


        List<CommentResponseDTO> comments =
                commentService.getAllComments()
                        .stream()
                        .map(commentMapper::toResponseDTO)
                        .collect(Collectors.toList());


        return ResponseEntity.ok(comments);
    }


    // Get Comment By Id
    @GetMapping("/{id}")
    public ResponseEntity<CommentResponseDTO> getCommentById(
            @PathVariable Long id) {


        Comment comment = commentService.getCommentById(id)
                .orElseThrow(() ->
                        new RuntimeException("Comment not found with id: " + id));


        return ResponseEntity.ok(
                commentMapper.toResponseDTO(comment));
    }


    // Get Comments By Post Id
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<CommentResponseDTO>> getCommentsByPostId(
            @PathVariable Long postId) {


        List<CommentResponseDTO> comments =
                commentService.getCommentsByPostId(postId)
                        .stream()
                        .map(commentMapper::toResponseDTO)
                        .collect(Collectors.toList());


        return ResponseEntity.ok(comments);
    }


    // Get Comments By User Id
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CommentResponseDTO>> getCommentsByUserId(
            @PathVariable Long userId) {


        List<CommentResponseDTO> comments =
                commentService.getCommentsByUserId(userId)
                        .stream()
                        .map(commentMapper::toResponseDTO)
                        .collect(Collectors.toList());


        return ResponseEntity.ok(comments);
    }


    // Update Comment
    @PutMapping("/{id}")
    public ResponseEntity<CommentResponseDTO> updateComment(
            @PathVariable Long id,
            @Valid @RequestBody CommentRequestDTO requestDTO) {


        CommunityPost post = new CommunityPost();
        post.setPostId(requestDTO.getPostId());


        User user = new User();
        user.setId(requestDTO.getUserId());


        Comment comment =
                commentMapper.toEntity(requestDTO, post, user);


        Comment updatedComment =
                commentService.updateComment(id, comment);


        return ResponseEntity.ok(
                commentMapper.toResponseDTO(updatedComment));
    }


    // Delete Comment
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteComment(
            @PathVariable Long id) {

        commentService.deleteComment(id);

        return ResponseEntity.ok("Comment deleted successfully");
    }
}