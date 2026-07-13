package com.suchitra.plantcarescheduler.dto.plantdto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlantRequestDTO {

    @NotBlank(message = "Plant nickname is required")
    private String nickname;

    private String location;

    private LocalDate acquisitionDate;

    private BigDecimal currentHeightCm;

    private BigDecimal currentWidthCm;

    private String potSize;

    private String soilType;

    private LocalDateTime lastWateredDate;

    private LocalDateTime lastFertilizedDate;

    private LocalDateTime lastPrunedDate;

    private LocalDateTime lastRepottedDate;

    @NotBlank(message = "Health status is required")
    private String healthStatus;

    private String notes;

    @NotNull(message = "Owner is required")
    private Long ownerId;

    @NotNull(message = "Species is required")
    private Long speciesId;

}