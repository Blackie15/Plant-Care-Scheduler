package com.suchitra.plantcarescheduler.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import jakarta.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "species")

@Data
@NoArgsConstructor
@AllArgsConstructor

public class Species {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Common name is required")
    @Column(name = "common_name", nullable = false)
    private String commonName;

    @NotBlank(message = "Scientific name is required")
    @Column(name = "scientific_name", nullable = false, unique = true)
    private String scientificName;

    @Column(name = "family_name")
    private String familyName;

    @Column(name = "care_difficulty")
    private String careDifficulty;

    @Column(name = "light_requirements")
    private String lightRequirements;

    @NotNull(message = "Water frequency is required")
    @Column(name = "water_frequency_days")
    private Integer waterFrequencyDays;

    @Column(name = "humidity_min")
    private Integer humidityMin;

    @Column(name = "humidity_max")
    private Integer humidityMax;

    @Column(name = "temperature_min_celsius")
    private BigDecimal temperatureMinCelsius;

    @Column(name = "temperature_max_celsius")
    private BigDecimal temperatureMaxCelsius;

    @Column(name = "soil_ph_min")
    private BigDecimal soilPhMin;

    @Column(name = "soil_ph_max")
    private BigDecimal soilPhMax;

    @Column(name = "growth_rate")
    private String growthRate;

    @Column(name = "max_height_cm")
    private Integer maxHeightCm;

    @Column(name = "fertilizer_frequency_days")
    private Integer fertilizerFrequencyDays;

    @Column(name = "pruning_frequency_days")
    private Integer pruningFrequencyDays;

    @Column(name = "repotting_frequency_months")
    private Integer repottingFrequencyMonths;

    @Column(name = "common_issues", columnDefinition = "TEXT")
    private String commonIssues;

    @Column(name = "care_tips", columnDefinition = "TEXT")
    private String careTips;

    @Column(name = "created_date")
    private LocalDateTime createdDate = LocalDateTime.now();

    @OneToMany(mappedBy = "species")
    private List<Plant> plants = new ArrayList<>();
    
}