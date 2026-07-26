package com.suchitra.plantcarescheduler.service;

import com.suchitra.plantcarescheduler.mapper.SpeciesMapper;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.suchitra.plantcarescheduler.entity.Species;
import com.suchitra.plantcarescheduler.exception.ResourceNotFoundException;
import com.suchitra.plantcarescheduler.exception.ScientificNameAlreadyExistsException;
import com.suchitra.plantcarescheduler.repository.SpeciesRepository;

@Service
public class SpeciesService {

    private final SpeciesMapper speciesMapper;
    private final SpeciesRepository speciesRepository;

    public SpeciesService(SpeciesRepository speciesRepository, SpeciesMapper speciesMapper) {
        this.speciesRepository = speciesRepository;
        this.speciesMapper = speciesMapper;
    }

    // Add Species
    public Species addSpecies(Species species) {

        if (speciesRepository.findByScientificName(species.getScientificName()).isPresent()) {
            throw new ScientificNameAlreadyExistsException("Scientific name already exists: " + species.getScientificName());
        }

        species.setCreatedDate(LocalDateTime.now());

        return speciesRepository.save(species);
    }

    // Get Species By Id
    public Species getSpeciesById(Long id) {

        return speciesRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Species not found with id: " + id));
    }

    // Get All Species
    public List<Species> getAllSpecies() {

        return speciesRepository.findAll();
    }

    // Update Species
    public Species updateSpecies(Long id, Species species) {

        Species existingSpecies = speciesRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Species not found with id: " + id));

        speciesMapper.updateEntity(existingSpecies, species);
        return speciesRepository.save(existingSpecies);
    }

    // Delete Species
    public void deleteSpecies(Long id) {

        Species species = speciesRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Species not found with id: " + id));

        speciesRepository.delete(species);
    }
}