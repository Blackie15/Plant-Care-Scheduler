package com.suchitra.plantcarescheduler.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.suchitra.plantcarescheduler.entity.Comment;
import com.suchitra.plantcarescheduler.entity.CommunityPost;
import com.suchitra.plantcarescheduler.entity.User;
import com.suchitra.plantcarescheduler.mapper.CommentMapper;
import com.suchitra.plantcarescheduler.repository.CommentRepository;
import com.suchitra.plantcarescheduler.repository.CommunityPostRepository;
import com.suchitra.plantcarescheduler.repository.UserRepository;

@Service
public class CommentService {

    private final CommentRepository commentRepository;

    private final CommunityPostRepository communityPostRepository;

    private final UserRepository userRepository;

    private final CommentMapper commentMapper;


    public CommentService(CommentRepository commentRepository,
                          CommunityPostRepository communityPostRepository,
                          UserRepository userRepository,
                          CommentMapper commentMapper) {

        this.commentRepository = commentRepository;
        this.communityPostRepository = communityPostRepository;
        this.userRepository = userRepository;
        this.commentMapper = commentMapper;
    }


    // Add Comment
    public Comment addComment(Comment comment) {

        Long postId = comment.getPost().getPostId();

        CommunityPost post = communityPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + postId));


        Long userId = comment.getUser().getId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));


        comment.setPost(post);
        comment.setUser(user);

        return commentRepository.save(comment);
    }


    // Get All Comments
    public List<Comment> getAllComments() {

        return commentRepository.findAll();
    }


    // Get Comment By Id
    public Optional<Comment> getCommentById(Long id) {

        return commentRepository.findById(id);
    }


    // Get Comments By Post Id
    public List<Comment> getCommentsByPostId(Long postId) {

        if (!communityPostRepository.existsById(postId)) {
            throw new RuntimeException("Post not found with id: " + postId);
        }

        return commentRepository.findByPostPostId(postId);
    }


    // Get Comments By User Id
    public List<Comment> getCommentsByUserId(Long userId) {

        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found with id: " + userId);
        }

        return commentRepository.findByUserId(userId);
    }


    // Update Comment
    public Comment updateComment(Long id, Comment updatedComment) {

        Comment existingComment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + id));


        Long postId = updatedComment.getPost().getPostId();

        CommunityPost post = communityPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + postId));


        Long userId = updatedComment.getUser().getId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));


        updatedComment.setPost(post);
        updatedComment.setUser(user);


        commentMapper.updateEntity(existingComment, updatedComment);

        return commentRepository.save(existingComment);
    }


    // Delete Comment
    public void deleteComment(Long id) {

        if (!commentRepository.existsById(id)) {
            throw new RuntimeException("Comment not found with id: " + id);
        }

        commentRepository.deleteById(id);
    }
}