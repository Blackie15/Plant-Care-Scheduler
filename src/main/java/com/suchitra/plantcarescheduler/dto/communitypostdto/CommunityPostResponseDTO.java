package com.suchitra.plantcarescheduler.dto.communitypostdto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommunityPostResponseDTO {

    private Long id;

    private Long userId;

    private String title;

    private String description;

    private String image;

    private Integer likes;

    private LocalDateTime createdDate;

    private LocalDateTime updatedDate;

}