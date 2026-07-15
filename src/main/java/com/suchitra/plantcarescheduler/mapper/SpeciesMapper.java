package com.suchitra.plantcarescheduler.mapper;

import org.springframework.stereotype.Component;

import com.suchitra.plantcarescheduler.dto.speciesdto.SpeciesRequestDTO;
import com.suchitra.plantcarescheduler.dto.speciesdto.SpeciesResponseDTO;
import com.suchitra.plantcarescheduler.entity.Species;

@Component
public class SpeciesMapper {

    // Convert RequestDTO -> Entity
    public Species toEntity(SpeciesRequestDTO requestDTO) {

        Species species = new Species();

        species.setCommonName(requestDTO.getCommonName());
        species.setScientificName(requestDTO.getScientificName());
        species.setFamilyName(requestDTO.getFamilyName());
        species.setCareDifficulty(requestDTO.getCareDifficulty());
        species.setLightRequirements(requestDTO.getLightRequirements());
        species.setWaterFrequencyDays(requestDTO.getWaterFrequencyDays());
        species.setHumidityMin(requestDTO.getHumidityMin());
        species.setHumidityMax(requestDTO.getHumidityMax());
        species.setTemperatureMinCelsius(requestDTO.getTemperatureMinCelsius());
        species.setTemperatureMaxCelsius(requestDTO.getTemperatureMaxCelsius());
        species.setSoilPhMin(requestDTO.getSoilPhMin());
        species.setSoilPhMax(requestDTO.getSoilPhMax());
        species.setGrowthRate(requestDTO.getGrowthRate());
        species.setMaxHeightCm(requestDTO.getMaxHeightCm());
        species.setFertilizerFrequencyDays(requestDTO.getFertilizerFrequencyDays());
        species.setPruningFrequencyDays(requestDTO.getPruningFrequencyDays());
        species.setRepottingFrequencyMonths(requestDTO.getRepottingFrequencyMonths());
        species.setCommonIssues(requestDTO.getCommonIssues());
        species.setCareTips(requestDTO.getCareTips());

        return species;
    }

    // Convert Entity -> ResponseDTO
    public SpeciesResponseDTO toResponseDTO(Species species) {

        SpeciesResponseDTO responseDTO = new SpeciesResponseDTO();

        responseDTO.setId(species.getId());
        responseDTO.setCommonName(species.getCommonName());
        responseDTO.setScientificName(species.getScientificName());
        responseDTO.setFamilyName(species.getFamilyName());
        responseDTO.setCareDifficulty(species.getCareDifficulty());
        responseDTO.setLightRequirements(species.getLightRequirements());
        responseDTO.setWaterFrequencyDays(species.getWaterFrequencyDays());
        responseDTO.setHumidityMin(species.getHumidityMin());
        responseDTO.setHumidityMax(species.getHumidityMax());
        responseDTO.setTemperatureMinCelsius(species.getTemperatureMinCelsius());
        responseDTO.setTemperatureMaxCelsius(species.getTemperatureMaxCelsius());
        responseDTO.setSoilPhMin(species.getSoilPhMin());
        responseDTO.setSoilPhMax(species.getSoilPhMax());
        responseDTO.setGrowthRate(species.getGrowthRate());
        responseDTO.setMaxHeightCm(species.getMaxHeightCm());
        responseDTO.setFertilizerFrequencyDays(species.getFertilizerFrequencyDays());
        responseDTO.setPruningFrequencyDays(species.getPruningFrequencyDays());
        responseDTO.setRepottingFrequencyMonths(species.getRepottingFrequencyMonths());
        responseDTO.setCommonIssues(species.getCommonIssues());
        responseDTO.setCareTips(species.getCareTips());
        responseDTO.setCreatedDate(species.getCreatedDate());

        return responseDTO;
    }

    // Update existing entity
    public void updateEntity(Species existingSpecies, Species updatedSpecies) {

        existingSpecies.setCommonName(updatedSpecies.getCommonName());
        existingSpecies.setScientificName(updatedSpecies.getScientificName());
        existingSpecies.setFamilyName(updatedSpecies.getFamilyName());
        existingSpecies.setCareDifficulty(updatedSpecies.getCareDifficulty());
        existingSpecies.setLightRequirements(updatedSpecies.getLightRequirements());
        existingSpecies.setWaterFrequencyDays(updatedSpecies.getWaterFrequencyDays());
        existingSpecies.setHumidityMin(updatedSpecies.getHumidityMin());
        existingSpecies.setHumidityMax(updatedSpecies.getHumidityMax());
        existingSpecies.setTemperatureMinCelsius(updatedSpecies.getTemperatureMinCelsius());
        existingSpecies.setTemperatureMaxCelsius(updatedSpecies.getTemperatureMaxCelsius());
        existingSpecies.setSoilPhMin(updatedSpecies.getSoilPhMin());
        existingSpecies.setSoilPhMax(updatedSpecies.getSoilPhMax());
        existingSpecies.setGrowthRate(updatedSpecies.getGrowthRate());
        existingSpecies.setMaxHeightCm(updatedSpecies.getMaxHeightCm());
        existingSpecies.setFertilizerFrequencyDays(updatedSpecies.getFertilizerFrequencyDays());
        existingSpecies.setPruningFrequencyDays(updatedSpecies.getPruningFrequencyDays());
        existingSpecies.setRepottingFrequencyMonths(updatedSpecies.getRepottingFrequencyMonths());
        existingSpecies.setCommonIssues(updatedSpecies.getCommonIssues());
        existingSpecies.setCareTips(updatedSpecies.getCareTips());
    }
}