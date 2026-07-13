package com.suchitra.plantcarescheduler.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.suchitra.plantcarescheduler.dto.plantdto.PlantRequestDTO;
import com.suchitra.plantcarescheduler.dto.plantdto.PlantResponseDTO;
import com.suchitra.plantcarescheduler.entity.Plant;
import com.suchitra.plantcarescheduler.mapper.PlantMapper;
import com.suchitra.plantcarescheduler.service.PlantService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/plants")
@Validated
public class PlantController {

    private final PlantService plantService;
    private final PlantMapper plantMapper;

    public PlantController(PlantService plantService,
                           PlantMapper plantMapper) {
        this.plantService = plantService;
        this.plantMapper = plantMapper;
    }

    // Add Plant
    @PostMapping
    public ResponseEntity<PlantResponseDTO> addPlant(
            @Valid @RequestBody PlantRequestDTO requestDTO) {

        Plant plant = plantMapper.toEntity(requestDTO);

        Plant savedPlant = plantService.addPlant(
                plant,
                requestDTO.getOwnerId(),
                requestDTO.getSpeciesId());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(plantMapper.toResponseDTO(savedPlant));
    }

    // Get Plant By Id
    @GetMapping("/{id}")
    public ResponseEntity<PlantResponseDTO> getPlantById(
            @PathVariable Long id) {

        Plant plant = plantService.getPlantById(id);

        return ResponseEntity.ok(plantMapper.toResponseDTO(plant));
    }

    // Get All Plants
    @GetMapping
    public ResponseEntity<List<PlantResponseDTO>> getAllPlants() {

        List<PlantResponseDTO> plants = plantService.getAllPlants()
                .stream()
                .map(plantMapper::toResponseDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(plants);
    }

    // Update Plant
    @PutMapping("/{id}")
    public ResponseEntity<PlantResponseDTO> updatePlant(
            @PathVariable Long id,
            @Valid @RequestBody PlantRequestDTO requestDTO) {

        Plant plant = plantMapper.toEntity(requestDTO);

        Plant updatedPlant = plantService.updatePlant(
                id,
                plant,
                requestDTO.getOwnerId(),
                requestDTO.getSpeciesId());

        return ResponseEntity.ok(
                plantMapper.toResponseDTO(updatedPlant));
    }

    // Delete Plant
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePlant(
            @PathVariable Long id) {

        plantService.deletePlant(id);

        return ResponseEntity.ok("Plant deleted successfully");
    }
}