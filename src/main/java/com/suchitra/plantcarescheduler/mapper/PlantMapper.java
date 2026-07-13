package com.suchitra.plantcarescheduler.mapper;

import org.springframework.stereotype.Component;

import com.suchitra.plantcarescheduler.dto.plantdto.PlantRequestDTO;
import com.suchitra.plantcarescheduler.dto.plantdto.PlantResponseDTO;
import com.suchitra.plantcarescheduler.entity.Plant;

@Component
public class PlantMapper {

    // Convert RequestDTO -> Entity
    public Plant toEntity(PlantRequestDTO requestDTO) {

        Plant plant = new Plant();

        plant.setNickname(requestDTO.getNickname());
        plant.setLocation(requestDTO.getLocation());
        plant.setAcquisitionDate(requestDTO.getAcquisitionDate());
        plant.setCurrentHeightCm(requestDTO.getCurrentHeightCm());
        plant.setCurrentWidthCm(requestDTO.getCurrentWidthCm());
        plant.setPotSize(requestDTO.getPotSize());
        plant.setSoilType(requestDTO.getSoilType());
        plant.setLastWateredDate(requestDTO.getLastWateredDate());
        plant.setLastFertilizedDate(requestDTO.getLastFertilizedDate());
        plant.setLastPrunedDate(requestDTO.getLastPrunedDate());
        plant.setLastRepottedDate(requestDTO.getLastRepottedDate());
        plant.setHealthStatus(requestDTO.getHealthStatus());
        plant.setNotes(requestDTO.getNotes());

        // owner and species are set in the service

        return plant;
    }

    // Convert Entity -> ResponseDTO
    public PlantResponseDTO toResponseDTO(Plant plant) {

        PlantResponseDTO responseDTO = new PlantResponseDTO();

        responseDTO.setId(plant.getId());
        responseDTO.setNickname(plant.getNickname());
        responseDTO.setLocation(plant.getLocation());
        responseDTO.setAcquisitionDate(plant.getAcquisitionDate());
        responseDTO.setCurrentHeightCm(plant.getCurrentHeightCm());
        responseDTO.setCurrentWidthCm(plant.getCurrentWidthCm());
        responseDTO.setPotSize(plant.getPotSize());
        responseDTO.setSoilType(plant.getSoilType());
        responseDTO.setLastWateredDate(plant.getLastWateredDate());
        responseDTO.setLastFertilizedDate(plant.getLastFertilizedDate());
        responseDTO.setLastPrunedDate(plant.getLastPrunedDate());
        responseDTO.setLastRepottedDate(plant.getLastRepottedDate());
        responseDTO.setHealthStatus(plant.getHealthStatus());
        responseDTO.setNotes(plant.getNotes());
        responseDTO.setIsActive(plant.getIsActive());
        responseDTO.setCreatedDate(plant.getCreatedDate());
        responseDTO.setUpdatedDate(plant.getUpdatedDate());

        // Owner details
        responseDTO.setOwnerId(plant.getOwner().getId());
        responseDTO.setOwnerName(plant.getOwner().getUsername());

        // Species details
        responseDTO.setSpeciesId(plant.getSpecies().getId());
        responseDTO.setSpeciesCommonName(plant.getSpecies().getCommonName());
        responseDTO.setSpeciesScientificName(plant.getSpecies().getScientificName());

        return responseDTO;
    }

    // Update existing entity
    public void updateEntity(Plant existingPlant, Plant updatedPlant) {

        existingPlant.setNickname(updatedPlant.getNickname());
        existingPlant.setLocation(updatedPlant.getLocation());
        existingPlant.setAcquisitionDate(updatedPlant.getAcquisitionDate());
        existingPlant.setCurrentHeightCm(updatedPlant.getCurrentHeightCm());
        existingPlant.setCurrentWidthCm(updatedPlant.getCurrentWidthCm());
        existingPlant.setPotSize(updatedPlant.getPotSize());
        existingPlant.setSoilType(updatedPlant.getSoilType());
        existingPlant.setLastWateredDate(updatedPlant.getLastWateredDate());
        existingPlant.setLastFertilizedDate(updatedPlant.getLastFertilizedDate());
        existingPlant.setLastPrunedDate(updatedPlant.getLastPrunedDate());
        existingPlant.setLastRepottedDate(updatedPlant.getLastRepottedDate());
        existingPlant.setHealthStatus(updatedPlant.getHealthStatus());
        existingPlant.setNotes(updatedPlant.getNotes());

        // Owner and Species are updated in the service
    }
}