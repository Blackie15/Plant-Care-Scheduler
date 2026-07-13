package com.suchitra.plantcarescheduler.entity;

import java.math.BigDecimal;
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
import jakarta.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "environment_data")

@Data
@NoArgsConstructor
@AllArgsConstructor

public class EnvironmentData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "location_id")
    private String locationId;

    @Column(name = "sensor_id")
    private String sensorId;

    @Column(name = "temperature_celsius", precision = 5, scale = 2)
    private BigDecimal temperatureCelsius;

    @Column(name = "humidity_percentage")
    private Integer humidityPercentage;

    @Column(name = "light_level_lux")
    private Integer lightLevelLux;

    @Column(name = "soil_moisture_percentage")
    private Integer soilMoisturePercentage;

    @Column(name = "ph_level", precision = 4, scale = 2)
    private BigDecimal phLevel;

    @NotNull(message = "Recorded date is required")
    @Column(name = "recorded_date", nullable = false)
    private LocalDateTime recordedDate;

    @Column(name = "data_source")
    private String dataSource;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plant_id", nullable = false)
    @JsonIgnoreProperties({"environmentData"})
    private Plant plant;
}