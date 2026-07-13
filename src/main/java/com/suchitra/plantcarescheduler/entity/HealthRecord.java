package com.suchitra.plantcarescheduler.entity;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "health_records")

@Data
@NoArgsConstructor
@AllArgsConstructor

public class HealthRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Assessment date is required")
    @Column(name = "assessment_date", nullable = false)
    private LocalDate assessmentDate;

    @NotBlank(message = "Overall health is required")
    @Column(name = "overall_health", nullable = false)
    private String overallHealth;

    @Column(columnDefinition = "TEXT")
    private String symptoms;

    @Column(name = "diagnosed_issues", columnDefinition = "TEXT")
    private String diagnosedIssues;

    @Column(name = "treatments_applied", columnDefinition = "TEXT")
    private String treatmentsApplied;

    @Column(columnDefinition = "TEXT")
    private String photos;

    @Column(name = "growth_measurements")
    private String growthMeasurements;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "follow_up_date")
    private LocalDate followUpDate;

    @Column(name = "recovery_status")
    private String recoveryStatus;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plant_id", nullable = false)
    @JsonIgnoreProperties({"healthRecords"})
    private Plant plant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "specialist_id")
    @JsonIgnoreProperties({"healthRecords"})
    private User specialist;
}