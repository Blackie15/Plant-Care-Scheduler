package com.suchitra.plantcarescheduler.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.suchitra.plantcarescheduler.dto.environmentdatadto.EnvironmentDataRequestDTO;
import com.suchitra.plantcarescheduler.dto.environmentdatadto.EnvironmentDataResponseDTO;
import com.suchitra.plantcarescheduler.entity.EnvironmentData;
import com.suchitra.plantcarescheduler.entity.Plant;
import com.suchitra.plantcarescheduler.mapper.EnvironmentDataMapper;
import com.suchitra.plantcarescheduler.repository.PlantRepository;
import com.suchitra.plantcarescheduler.service.EnvironmentDataService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/environment-data")
@Validated
public class EnvironmentDataController {

    @Autowired
    private EnvironmentDataService environmentDataService;

    @Autowired
    private EnvironmentDataMapper environmentDataMapper;

    @Autowired
    private PlantRepository plantRepository;

    // Add Environment Data
    @PostMapping
    public ResponseEntity<EnvironmentDataResponseDTO> addEnvironmentData(
            @Valid @RequestBody EnvironmentDataRequestDTO requestDTO) {

        EnvironmentData environmentData = environmentDataMapper.toEntity(requestDTO);

        Plant plant = plantRepository.findById(requestDTO.getPlantId())
                .orElseThrow(() -> new RuntimeException("Plant not found"));

        environmentData.setPlant(plant);

        EnvironmentData savedData = environmentDataService.addEnvironmentData(environmentData);

        return new ResponseEntity<>(
                environmentDataMapper.toResponseDTO(savedData),
                HttpStatus.CREATED);
    }

    // Get All Environment Data
    @GetMapping
    public ResponseEntity<List<EnvironmentDataResponseDTO>> getAllEnvironmentData() {

        List<EnvironmentDataResponseDTO> response = environmentDataService
                .getAllEnvironmentData()
                .stream()
                .map(environmentDataMapper::toResponseDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    // Get Environment Data By Id
    @GetMapping("/{id}")
    public ResponseEntity<EnvironmentDataResponseDTO> getEnvironmentDataById(
            @PathVariable Long id) {

        Optional<EnvironmentData> environmentData =
                environmentDataService.getEnvironmentDataById(id);

        return environmentData
                .map(data -> ResponseEntity.ok(environmentDataMapper.toResponseDTO(data)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Get Environment Data By Plant Id
    @GetMapping("/plant/{plantId}")
    public ResponseEntity<List<EnvironmentDataResponseDTO>> getEnvironmentDataByPlantId(
            @PathVariable Long plantId) {

        List<EnvironmentDataResponseDTO> response = environmentDataService
                .getEnvironmentDataByPlantId(plantId)
                .stream()
                .map(environmentDataMapper::toResponseDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    // Update Environment Data
    @PutMapping("/{id}")
    public ResponseEntity<EnvironmentDataResponseDTO> updateEnvironmentData(
            @PathVariable Long id,
            @Valid @RequestBody EnvironmentDataRequestDTO requestDTO) {

        EnvironmentData environmentData = environmentDataMapper.toEntity(requestDTO);

        Plant plant = plantRepository.findById(requestDTO.getPlantId())
                .orElseThrow(() -> new RuntimeException("Plant not found"));

        environmentData.setPlant(plant);

        EnvironmentData updatedData =
                environmentDataService.updateEnvironmentData(id, environmentData);

        return ResponseEntity.ok(environmentDataMapper.toResponseDTO(updatedData));
    }

    // Delete Environment Data
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEnvironmentData(@PathVariable Long id) {

        environmentDataService.deleteEnvironmentData(id);

        return ResponseEntity.ok("Task deleted successfully.");
    }
}