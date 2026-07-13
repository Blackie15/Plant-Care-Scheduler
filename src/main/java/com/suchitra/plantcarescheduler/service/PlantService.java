package com.suchitra.plantcarescheduler.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.suchitra.plantcarescheduler.entity.Plant;
import com.suchitra.plantcarescheduler.entity.Species;
import com.suchitra.plantcarescheduler.entity.User;
import com.suchitra.plantcarescheduler.mapper.PlantMapper;
import com.suchitra.plantcarescheduler.repository.PlantRepository;
import com.suchitra.plantcarescheduler.repository.SpeciesRepository;
import com.suchitra.plantcarescheduler.repository.UserRepository;

@Service
public class PlantService {

    private final PlantRepository plantRepository;
    private final UserRepository userRepository;
    private final SpeciesRepository speciesRepository;
    private final PlantMapper plantMapper;

    public PlantService(PlantRepository plantRepository,
                        UserRepository userRepository,
                        SpeciesRepository speciesRepository,
                        PlantMapper plantMapper) {
        this.plantRepository = plantRepository;
        this.userRepository = userRepository;
        this.speciesRepository = speciesRepository;
        this.plantMapper = plantMapper;
    }

    // Add Plant
    public Plant addPlant(Plant plant, Long ownerId, Long speciesId) {

        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        Species species = speciesRepository.findById(speciesId)
                .orElseThrow(() -> new RuntimeException("Species not found"));

        plant.setOwner(owner);
        plant.setSpecies(species);
        plant.setCreatedDate(LocalDateTime.now());
        plant.setUpdatedDate(LocalDateTime.now());

        return plantRepository.save(plant);
    }

    // Get Plant By Id
    public Plant getPlantById(Long id) {

        return plantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plant not found"));
    }

    // Get All Plants
    public List<Plant> getAllPlants() {

        return plantRepository.findAll();
    }

    // Update Plant
    public Plant updatePlant(Long id, Plant plant, Long ownerId, Long speciesId) {

        Plant existingPlant = plantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plant not found"));

        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        Species species = speciesRepository.findById(speciesId)
                .orElseThrow(() -> new RuntimeException("Species not found"));

        plantMapper.updateEntity(existingPlant, plant);

        existingPlant.setOwner(owner);
        existingPlant.setSpecies(species);
        existingPlant.setUpdatedDate(LocalDateTime.now());

        return plantRepository.save(existingPlant);
    }

    // Delete Plant
    public void deletePlant(Long id) {

        Plant plant = plantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plant not found"));

        plantRepository.delete(plant);
    }
}