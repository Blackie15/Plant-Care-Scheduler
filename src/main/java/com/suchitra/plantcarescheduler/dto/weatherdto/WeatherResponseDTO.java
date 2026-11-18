package com.suchitra.plantcarescheduler.dto.weatherdto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeatherResponseDTO {
    private Boolean locationConfigured;
    private String locationName;
    private Double latitude;
    private Double longitude;
    private String timezone;
    private LocalDateTime fetchedAt;

    // Current conditions
    private BigDecimal currentTemperatureCelsius;
    private Integer currentHumidityPercentage;
    private BigDecimal currentApparentTempCelsius;
    private BigDecimal currentPrecipitationMm;
    private BigDecimal currentWindSpeedKmH;
    private Integer currentWeatherCode;
    private String currentWeatherDescription;
    private Boolean isRaining;

    // 7-day daily forecast
    private List<DailyForecastDTO> dailyForecast;

    // Placement-aware plant care recommendations
    private List<PlantCareWeatherRecommendationDTO> recommendations;

    private String statusMessage;
}
