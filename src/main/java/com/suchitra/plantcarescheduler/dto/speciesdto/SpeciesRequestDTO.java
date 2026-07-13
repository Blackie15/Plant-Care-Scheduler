package com.suchitra.plantcarescheduler.dto.speciesdto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SpeciesRequestDTO {

    @NotBlank(message = "Common name is required")
    private String commonName;

    @NotBlank(message = "Scientific name is required")
    private String scientificName;

    private String familyName;

    private String careDifficulty;

    private String lightRequirements;

    @NotNull(message = "Water frequency is required")
    private Integer waterFrequencyDays;

    private Integer humidityMin;

    private Integer humidityMax;

    private BigDecimal temperatureMinCelsius;

    private BigDecimal temperatureMaxCelsius;

    private BigDecimal soilPhMin;

    private BigDecimal soilPhMax;

    private String growthRate;

    private Integer maxHeightCm;

    private Integer fertilizerFrequencyDays;

    private Integer pruningFrequencyDays;

    private Integer repottingFrequencyMonths;

    private String commonIssues;

    private String careTips;

}