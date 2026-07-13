package com.suchitra.plantcarescheduler.dto.environmentdatadto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnvironmentDataResponseDTO {

    private Long id;

    private Long plantId;

    private String locationId;

    private String sensorId;

    private BigDecimal temperatureCelsius;

    private Integer humidityPercentage;

    private Integer lightLevelLux;

    private Integer soilMoisturePercentage;

    private BigDecimal phLevel;

    private LocalDateTime recordedDate;

    private String dataSource;
}