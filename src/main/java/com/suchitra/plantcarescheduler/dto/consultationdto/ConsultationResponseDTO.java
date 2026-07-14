package com.suchitra.plantcarescheduler.dto.consultationdto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConsultationResponseDTO {

    private Long consultationId;

    private Long userId;

    private Long specialistId;

    private LocalDateTime requestDate;

    private LocalDateTime appointmentDate;

    private String problemDescription;

    private String consultationStatus;

    private String meetingLink;

    private LocalDateTime createdDate;
}