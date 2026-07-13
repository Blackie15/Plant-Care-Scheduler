package com.suchitra.plantcarescheduler.dto.environmentdatadto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnvironmentDataRequestDTO {

    @NotNull(message = "Plant ID is required")
    private Long plantId;

    private String locationId;

    private String sensorId;

    private BigDecimal temperatureCelsius;

    private Integer humidityPercentage;

    private Integer lightLevelLux;

    private Integer soilMoisturePercentage;

    private BigDecimal phLevel;

    @NotNull(message = "Recorded date is required")
    private LocalDateTime recordedDate;

    private String dataSource;
}