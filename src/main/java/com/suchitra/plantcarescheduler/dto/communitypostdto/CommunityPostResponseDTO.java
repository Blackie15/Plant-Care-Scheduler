package com.suchitra.plantcarescheduler.dto.communitypostdto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommunityPostResponseDTO {

    private Long postId;

    private Long userId;

    private String username;

    private String title;

    private String description;

    private String image;

    private Integer likes;

    private LocalDateTime createdDate;

    private LocalDateTime updatedDate;
}