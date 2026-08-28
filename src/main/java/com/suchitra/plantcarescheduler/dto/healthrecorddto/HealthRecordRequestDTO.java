package com.suchitra.plantcarescheduler.dto.healthrecorddto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HealthRecordRequestDTO {

    @NotNull(message = "Plant ID is required")
    private Long plantId;

    @NotNull(message = "Assessment date is required")
    private LocalDateTime assessmentDate;

    @NotBlank(message = "Overall health condition is required")
    private String overallHealth;

    private String symptoms;

    private String diagnosedIssues;

    private String treatmentsApplied;

    private String photos;

    private String growthMeasurements;

    private String notes;

    private LocalDateTime followUpDate;

    private String recoveryStatus;

    private Long assessedById;
}