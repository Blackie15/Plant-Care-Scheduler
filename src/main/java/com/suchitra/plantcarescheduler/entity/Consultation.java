package com.suchitra.plantcarescheduler.entity;

import java.time.LocalDateTime;

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
@Table(name = "consultations")

@Data
@NoArgsConstructor
@AllArgsConstructor

public class Consultation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "consultation_id")
    private Long consultationId;

    @NotNull(message = "Request date is required")
    @Column(name = "request_date", nullable = false)
    private LocalDateTime requestDate;

    @Column(name = "appointment_date")
    private LocalDateTime appointmentDate;

    @NotBlank(message = "Problem description is required")
    @Column(name = "problem_description", columnDefinition = "TEXT", nullable = false)
    private String problemDescription;

    @NotBlank(message = "Consultation status is required")
    @Column(name = "consultation_status", nullable = false)
    private String consultationStatus;

    @Column(name = "meeting_link")
    private String meetingLink;

    @Column(name = "created_date")
    private LocalDateTime createdDate = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"consultationsRequested"})
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "specialist_id")
    @JsonIgnoreProperties({"consultationsAssigned"})
    private User specialist;

}