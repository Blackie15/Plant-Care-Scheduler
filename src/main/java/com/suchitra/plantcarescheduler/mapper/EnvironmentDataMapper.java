package com.suchitra.plantcarescheduler.mapper;

import org.springframework.stereotype.Component;

import com.suchitra.plantcarescheduler.dto.environmentdatadto.EnvironmentDataRequestDTO;
import com.suchitra.plantcarescheduler.dto.environmentdatadto.EnvironmentDataResponseDTO;
import com.suchitra.plantcarescheduler.entity.EnvironmentData;

@Component
public class EnvironmentDataMapper {

    // RequestDTO -> Entity
    public EnvironmentData toEntity(EnvironmentDataRequestDTO requestDTO) {

        EnvironmentData environmentData = new EnvironmentData();

        environmentData.setLocationId(requestDTO.getLocationId());
        environmentData.setSensorId(requestDTO.getSensorId());
        environmentData.setTemperatureCelsius(requestDTO.getTemperatureCelsius());
        environmentData.setHumidityPercentage(requestDTO.getHumidityPercentage());
        environmentData.setLightLevelLux(requestDTO.getLightLevelLux());
        environmentData.setSoilMoisturePercentage(requestDTO.getSoilMoisturePercentage());
        environmentData.setPhLevel(requestDTO.getPhLevel());
        environmentData.setRecordedDate(requestDTO.getRecordedDate());
        environmentData.setDataSource(requestDTO.getDataSource());

        return environmentData;
    }

    // Entity -> ResponseDTO
    public EnvironmentDataResponseDTO toResponseDTO(EnvironmentData environmentData) {

        EnvironmentDataResponseDTO responseDTO = new EnvironmentDataResponseDTO();

        responseDTO.setId(environmentData.getId());
        responseDTO.setPlantId(environmentData.getPlant().getId());
        responseDTO.setLocationId(environmentData.getLocationId());
        responseDTO.setSensorId(environmentData.getSensorId());
        responseDTO.setTemperatureCelsius(environmentData.getTemperatureCelsius());
        responseDTO.setHumidityPercentage(environmentData.getHumidityPercentage());
        responseDTO.setLightLevelLux(environmentData.getLightLevelLux());
        responseDTO.setSoilMoisturePercentage(environmentData.getSoilMoisturePercentage());
        responseDTO.setPhLevel(environmentData.getPhLevel());
        responseDTO.setRecordedDate(environmentData.getRecordedDate());
        responseDTO.setDataSource(environmentData.getDataSource());

        return responseDTO;
    }

    // Update existing entity
    public void updateEntity(EnvironmentData existingData, EnvironmentData updatedData) {

        existingData.setPlant(updatedData.getPlant());
        existingData.setLocationId(updatedData.getLocationId());
        existingData.setSensorId(updatedData.getSensorId());
        existingData.setTemperatureCelsius(updatedData.getTemperatureCelsius());
        existingData.setHumidityPercentage(updatedData.getHumidityPercentage());
        existingData.setLightLevelLux(updatedData.getLightLevelLux());
        existingData.setSoilMoisturePercentage(updatedData.getSoilMoisturePercentage());
        existingData.setPhLevel(updatedData.getPhLevel());
        existingData.setRecordedDate(updatedData.getRecordedDate());
        existingData.setDataSource(updatedData.getDataSource());
    }
}