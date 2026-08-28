package com.suchitra.plantcarescheduler.dto.healthrecorddto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HealthRecordResponseDTO {

    private Long id;

    private Long plantId;

    private String plantNickname;

    private LocalDateTime assessmentDate;

    private String overallHealth;

    private String symptoms;

    private String diagnosedIssues;

    private String treatmentsApplied;

    private String photos;

    private String growthMeasurements;

    private String notes;

    private LocalDateTime followUpDate;

    private String recoveryStatus;

    private Long specialistId;

    private String specialistName;
}