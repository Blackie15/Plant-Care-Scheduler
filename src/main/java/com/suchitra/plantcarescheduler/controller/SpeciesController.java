package com.suchitra.plantcarescheduler.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.suchitra.plantcarescheduler.dto.speciesdto.SpeciesRequestDTO;
import com.suchitra.plantcarescheduler.dto.speciesdto.SpeciesResponseDTO;
import com.suchitra.plantcarescheduler.entity.Species;
import com.suchitra.plantcarescheduler.mapper.SpeciesMapper;
import com.suchitra.plantcarescheduler.service.SpeciesService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/species")
@Validated
public class SpeciesController {

    private final SpeciesService speciesService;
    private final SpeciesMapper speciesMapper;

    public SpeciesController(SpeciesService speciesService,
                             SpeciesMapper speciesMapper) {
        this.speciesService = speciesService;
        this.speciesMapper = speciesMapper;
    }

    // Add Species
    @PostMapping
    public ResponseEntity<SpeciesResponseDTO> addSpecies(
            @Valid @RequestBody SpeciesRequestDTO requestDTO) {

        Species species = speciesMapper.toEntity(requestDTO);

        Species savedSpecies = speciesService.addSpecies(species);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(speciesMapper.toResponseDTO(savedSpecies));
    }

    // Get Species By Id
    @GetMapping("/{id}")
    public ResponseEntity<SpeciesResponseDTO> getSpeciesById(
            @PathVariable Long id) {

        Species species = speciesService.getSpeciesById(id);

        return ResponseEntity.ok(speciesMapper.toResponseDTO(species));
    }

    // Get All Species
    @GetMapping
    public ResponseEntity<List<SpeciesResponseDTO>> getAllSpecies() {

        List<SpeciesResponseDTO> speciesList = speciesService.getAllSpecies()
                .stream()
                .map(speciesMapper::toResponseDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(speciesList);
    }

    // Update Species
    @PutMapping("/{id}")
    public ResponseEntity<SpeciesResponseDTO> updateSpecies(
            @PathVariable Long id,
            @Valid @RequestBody SpeciesRequestDTO requestDTO) {

        Species species = speciesMapper.toEntity(requestDTO);

        Species updatedSpecies = speciesService.updateSpecies(id, species);

        return ResponseEntity.ok(speciesMapper.toResponseDTO(updatedSpecies));
    }

    // Delete Species
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSpecies(@PathVariable Long id) {

        speciesService.deleteSpecies(id);

        return ResponseEntity.ok("Species deleted successfully");
    }
}