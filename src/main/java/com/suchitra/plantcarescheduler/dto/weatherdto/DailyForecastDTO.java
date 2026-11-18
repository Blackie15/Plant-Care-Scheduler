package com.suchitra.plantcarescheduler.dto.weatherdto;

import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyForecastDTO {
    private LocalDate date;
    private BigDecimal tempMaxCelsius;
    private BigDecimal tempMinCelsius;
    private BigDecimal precipitationSumMm;
    private Integer precipitationProbabilityMax;
    private Integer weatherCode;
    private String weatherDescription;
}
