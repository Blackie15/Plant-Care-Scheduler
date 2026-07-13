package com.suchitra.plantcarescheduler.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

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

import jakarta.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "plants")

@Data
@NoArgsConstructor
@AllArgsConstructor

public class Plant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Plant nickname is required")
    @Column(nullable = false)
    private String nickname;

    @Column(length = 200)
    private String location;

    @Column(name = "acquisition_date")
    private LocalDate acquisitionDate;

    @Column(name = "current_height_cm", precision = 5, scale = 1)
    private BigDecimal currentHeightCm;

    @Column(name = "current_width_cm", precision = 5, scale = 1)
    private BigDecimal currentWidthCm;

    @Column(name = "pot_size")
    private String potSize;

    @Column(name = "soil_type")
    private String soilType;

    @Column(name = "last_watered_date")
    private LocalDateTime lastWateredDate;

    @Column(name = "last_fertilized_date")
    private LocalDateTime lastFertilizedDate;

    @Column(name = "last_pruned_date")
    private LocalDateTime lastPrunedDate;

    @Column(name = "last_repotted_date")
    private LocalDateTime lastRepottedDate;

    @NotBlank(message = "Health status is required")
    @Column(name = "health_status")
    private String healthStatus;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_date")
    private LocalDateTime createdDate = LocalDateTime.now();

    @Column(name = "updated_date")
    private LocalDateTime updatedDate = LocalDateTime.now();
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    @JsonIgnoreProperties({"plants"})
    private User owner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "species_id", nullable = false)
    @JsonIgnoreProperties({"plants"})
    private Species species;

    @OneToMany(mappedBy = "plant")
    private List<CareTask> careTasks = new ArrayList<>();

    @OneToMany(mappedBy = "plant")
    private List<EnvironmentData> environmentData = new ArrayList<>();

    @OneToMany(mappedBy = "plant")
    private List<HealthRecord> healthRecords = new ArrayList<>();
}