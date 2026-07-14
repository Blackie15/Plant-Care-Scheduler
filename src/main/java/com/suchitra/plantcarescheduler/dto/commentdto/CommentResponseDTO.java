package com.suchitra.plantcarescheduler.dto.commentdto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponseDTO {

    private Long commentId;

    private String comment;

    private Long postId;

    private Long userId;

    private LocalDateTime createdDate;

    private LocalDateTime updatedDate;
}