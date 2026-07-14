package com.suchitra.plantcarescheduler.mapper;

import org.springframework.stereotype.Component;

import com.suchitra.plantcarescheduler.dto.commentdto.CommentRequestDTO;
import com.suchitra.plantcarescheduler.dto.commentdto.CommentResponseDTO;
import com.suchitra.plantcarescheduler.entity.Comment;
import com.suchitra.plantcarescheduler.entity.CommunityPost;
import com.suchitra.plantcarescheduler.entity.User;

@Component
public class CommentMapper {

    public Comment toEntity(CommentRequestDTO dto, CommunityPost post, User user) {

        Comment comment = new Comment();

        comment.setComment(dto.getComment());
        comment.setPost(post);
        comment.setUser(user);

        return comment;
    }


    public CommentResponseDTO toResponseDTO(Comment comment) {

        CommentResponseDTO dto = new CommentResponseDTO();

        dto.setCommentId(comment.getCommentId());

        dto.setPostId(
                comment.getPost() != null
                        ? comment.getPost().getPostId()
                        : null);

        dto.setUserId(
                comment.getUser() != null
                        ? comment.getUser().getId()
                        : null);

        dto.setComment(comment.getComment());
        dto.setCreatedDate(comment.getCreatedDate());
        dto.setUpdatedDate(comment.getUpdatedDate());

        return dto;
    }


    public void updateEntity(Comment existingComment, Comment updatedComment) {

        existingComment.setComment(updatedComment.getComment());
        existingComment.setPost(updatedComment.getPost());
        existingComment.setUser(updatedComment.getUser());
    }
}