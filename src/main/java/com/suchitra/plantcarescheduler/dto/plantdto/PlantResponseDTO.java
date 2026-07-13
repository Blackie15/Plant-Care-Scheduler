package com.suchitra.plantcarescheduler.dto.plantdto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlantResponseDTO {

    private Long id;

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

    private String healthStatus;

    private String notes;

    private Boolean isActive;

    private LocalDateTime createdDate;

    private LocalDateTime updatedDate;

    // Owner details
    private Long ownerId;
    private String ownerName;

    // Species details
    private Long speciesId;
    private String speciesCommonName;
    private String speciesScientificName;

}