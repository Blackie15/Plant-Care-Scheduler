package com.suchitra.plantcarescheduler.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.suchitra.plantcarescheduler.entity.EnvironmentData;
import com.suchitra.plantcarescheduler.entity.Plant;
import com.suchitra.plantcarescheduler.mapper.EnvironmentDataMapper;
import com.suchitra.plantcarescheduler.repository.EnvironmentDataRepository;
import com.suchitra.plantcarescheduler.repository.PlantRepository;

@Service
public class EnvironmentDataService {

    private final EnvironmentDataRepository environmentDataRepository;

    private final PlantRepository plantRepository;

    private final EnvironmentDataMapper environmentDataMapper;

    EnvironmentDataService(EnvironmentDataRepository environmentDataRepository, PlantRepository plantRepository, EnvironmentDataMapper environmentDataMapper) {
        this.environmentDataRepository = environmentDataRepository;
        this.plantRepository = plantRepository;
        this.environmentDataMapper = environmentDataMapper;
    }

    // Add Environment Data
    public EnvironmentData addEnvironmentData(EnvironmentData environmentData) {

        Long plantId = environmentData.getPlant().getId();

        Plant plant = plantRepository.findById(plantId)
                .orElseThrow(() -> new RuntimeException("Plant not found with id: " + plantId));

        environmentData.setPlant(plant);

        return environmentDataRepository.save(environmentData);
    }

    // Get All Environment Data
    public List<EnvironmentData> getAllEnvironmentData() {
        return environmentDataRepository.findAll();
    }

    // Get Environment Data By Id
    public Optional<EnvironmentData> getEnvironmentDataById(Long id) {
        return environmentDataRepository.findById(id);
    }

    // Get Environment Data By Plant Id
    public List<EnvironmentData> getEnvironmentDataByPlantId(Long plantId) {

        if (!plantRepository.existsById(plantId)) {
            throw new RuntimeException("Plant not found with id: " + plantId);
        }

        return environmentDataRepository.findByPlantId(plantId);
    }

    // Update Environment Data
    public EnvironmentData updateEnvironmentData(Long id, EnvironmentData updatedData) {

        EnvironmentData existingData = environmentDataRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Environment data not found with id: " + id));

        Long plantId = updatedData.getPlant().getId();

        Plant plant = plantRepository.findById(plantId)
                .orElseThrow(() -> new RuntimeException("Plant not found with id: " + plantId));

        updatedData.setPlant(plant);

        environmentDataMapper.updateEntity(existingData, updatedData);

        return environmentDataRepository.save(existingData);
    }

    // Delete Environment Data
    public void deleteEnvironmentData(Long id) {

        if (!environmentDataRepository.existsById(id)) {
            throw new RuntimeException("Environment data not found with id: " + id);
        }

        environmentDataRepository.deleteById(id);
    }
}