package com.suchitra.plantcarescheduler.dto.consultationdto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConsultationRequestDTO {

    @NotNull(message = "User id is required")
    private Long userId;

    private Long specialistId;

    @NotNull(message = "Request date is required")
    private LocalDateTime requestDate;

    private LocalDateTime appointmentDate;

    @NotBlank(message = "Problem description is required")
    private String problemDescription;

    @NotBlank(message = "Consultation status is required")
    private String consultationStatus;

    private String meetingLink;
}