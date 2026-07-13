package com.suchitra.plantcarescheduler.dto.speciesdto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SpeciesResponseDTO {

    private Long id;

    private String commonName;

    private String scientificName;

    private String familyName;

    private String careDifficulty;

    private String lightRequirements;

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

    private LocalDateTime createdDate;

}