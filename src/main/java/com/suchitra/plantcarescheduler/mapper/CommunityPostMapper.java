package com.suchitra.plantcarescheduler.mapper;

import org.springframework.stereotype.Component;

import com.suchitra.plantcarescheduler.dto.communitypostdto.CommunityPostRequestDTO;
import com.suchitra.plantcarescheduler.dto.communitypostdto.CommunityPostResponseDTO;
import com.suchitra.plantcarescheduler.entity.CommunityPost;
import com.suchitra.plantcarescheduler.entity.User;

@Component
public class CommunityPostMapper {

    public CommunityPost toEntity(CommunityPostRequestDTO dto, User user) {

        CommunityPost post = new CommunityPost();

        post.setUser(user);
        post.setTitle(dto.getTitle());
        post.setDescription(dto.getDescription());
        post.setImage(dto.getImage());

        return post;
    }

    public CommunityPostResponseDTO toResponseDTO(CommunityPost post) {

        CommunityPostResponseDTO dto = new CommunityPostResponseDTO();

        dto.setId(post.getPostId());

        dto.setUserId(
                post.getUser() != null
                        ? post.getUser().getId()
                        : null);

        dto.setTitle(post.getTitle());
        dto.setDescription(post.getDescription());
        dto.setImage(post.getImage());
        dto.setCreatedDate(post.getCreatedDate());
        dto.setUpdatedDate(post.getUpdatedDate());

        return dto;
    }

    public void updateEntity(CommunityPost existingPost, CommunityPost updatedPost) {

        existingPost.setUser(updatedPost.getUser());
        existingPost.setTitle(updatedPost.getTitle());
        existingPost.setDescription(updatedPost.getDescription());
        existingPost.setImage(updatedPost.getImage());
    }
}