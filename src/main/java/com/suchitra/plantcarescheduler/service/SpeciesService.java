package com.suchitra.plantcarescheduler.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.suchitra.plantcarescheduler.entity.Species;
import com.suchitra.plantcarescheduler.repository.SpeciesRepository;

@Service
public class SpeciesService {

    private final SpeciesRepository speciesRepository;

    public SpeciesService(SpeciesRepository speciesRepository) {
        this.speciesRepository = speciesRepository;
    }

    // Add Species
    public Species addSpecies(Species species) {

        if (speciesRepository.findByScientificName(species.getScientificName()).isPresent()) {
            throw new RuntimeException("Scientific name already exists");
        }

        species.setCreatedDate(LocalDateTime.now());

        return speciesRepository.save(species);
    }

    // Get Species By Id
    public Species getSpeciesById(Long id) {

        return speciesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Species not found"));
    }

    // Get All Species
    public List<Species> getAllSpecies() {

        return speciesRepository.findAll();
    }

    // Update Species
    public Species updateSpecies(Long id, Species species) {

        Species existingSpecies = speciesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Species not found"));

        existingSpecies.setCommonName(species.getCommonName());
        existingSpecies.setScientificName(species.getScientificName());
        existingSpecies.setFamilyName(species.getFamilyName());
        existingSpecies.setCareDifficulty(species.getCareDifficulty());
        existingSpecies.setLightRequirements(species.getLightRequirements());
        existingSpecies.setWaterFrequencyDays(species.getWaterFrequencyDays());
        existingSpecies.setHumidityMin(species.getHumidityMin());
        existingSpecies.setHumidityMax(species.getHumidityMax());
        existingSpecies.setTemperatureMinCelsius(species.getTemperatureMinCelsius());
        existingSpecies.setTemperatureMaxCelsius(species.getTemperatureMaxCelsius());
        existingSpecies.setSoilPhMin(species.getSoilPhMin());
        existingSpecies.setSoilPhMax(species.getSoilPhMax());
        existingSpecies.setGrowthRate(species.getGrowthRate());
        existingSpecies.setMaxHeightCm(species.getMaxHeightCm());
        existingSpecies.setFertilizerFrequencyDays(species.getFertilizerFrequencyDays());
        existingSpecies.setPruningFrequencyDays(species.getPruningFrequencyDays());
        existingSpecies.setRepottingFrequencyMonths(species.getRepottingFrequencyMonths());
        existingSpecies.setCommonIssues(species.getCommonIssues());
        existingSpecies.setCareTips(species.getCareTips());

        return speciesRepository.save(existingSpecies);
    }

    // Delete Species
    public void deleteSpecies(Long id) {

        Species species = speciesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Species not found"));

        speciesRepository.delete(species);
    }
}