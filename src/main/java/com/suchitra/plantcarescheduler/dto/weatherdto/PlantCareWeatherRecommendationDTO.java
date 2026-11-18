package com.suchitra.plantcarescheduler.dto.weatherdto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlantCareWeatherRecommendationDTO {
    private String category; // "OUTDOOR_OPEN", "OUTDOOR_SHELTERED", "INDOOR", "GENERAL"
    private String title;
    private String advice;
    private String severity; // "INFO", "WARNING", "SUCCESS"
}
