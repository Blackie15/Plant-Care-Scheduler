package com.suchitra.plantcarescheduler.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.suchitra.plantcarescheduler.dto.healthrecorddto.HealthRecordRequestDTO;
import com.suchitra.plantcarescheduler.dto.healthrecorddto.HealthRecordResponseDTO;
import com.suchitra.plantcarescheduler.entity.HealthRecord;
import com.suchitra.plantcarescheduler.entity.Plant;
import com.suchitra.plantcarescheduler.mapper.HealthRecordMapper;
import com.suchitra.plantcarescheduler.service.HealthRecordService;

@RestController
@RequestMapping("/api/health-records")
public class HealthRecordController {

    private final HealthRecordService healthRecordService;

    private final HealthRecordMapper healthRecordMapper;

    HealthRecordController(HealthRecordService healthRecordService, HealthRecordMapper healthRecordMapper) {
        this.healthRecordService = healthRecordService;
        this.healthRecordMapper = healthRecordMapper;
    }

    // Add Health Record
    @PostMapping
    public ResponseEntity<HealthRecordResponseDTO> addHealthRecord(
            @RequestBody HealthRecordRequestDTO requestDTO) {

        HealthRecord healthRecord = healthRecordMapper.toEntity(requestDTO);

        Plant plant = new Plant();
        plant.setId(requestDTO.getPlantId());
        healthRecord.setPlant(plant);

        HealthRecord savedRecord = healthRecordService.addHealthRecord(healthRecord);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(healthRecordMapper.toResponseDTO(savedRecord));
    }

    // Get All Health Records
    @GetMapping
    public ResponseEntity<List<HealthRecordResponseDTO>> getAllHealthRecords() {

        List<HealthRecordResponseDTO> records = healthRecordService.getAllHealthRecords()
                .stream()
                .map(healthRecordMapper::toResponseDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(records);
    }

    // Get Health Record By Id
    @GetMapping("/{id}")
    public ResponseEntity<HealthRecordResponseDTO> getHealthRecordById(
            @PathVariable Long id) {

        Optional<HealthRecord> record = healthRecordService.getHealthRecordById(id);

        return record
                .map(value -> ResponseEntity.ok(healthRecordMapper.toResponseDTO(value)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Get Health Records By Plant Id
    @GetMapping("/plant/{plantId}")
    public ResponseEntity<List<HealthRecordResponseDTO>> getHealthRecordsByPlantId(
            @PathVariable Long plantId) {

        List<HealthRecordResponseDTO> records = healthRecordService
                .getHealthRecordsByPlantId(plantId)
                .stream()
                .map(healthRecordMapper::toResponseDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(records);
    }

    // Update Health Record
    @PutMapping("/{id}")
    public ResponseEntity<HealthRecordResponseDTO> updateHealthRecord(
            @PathVariable Long id,
            @RequestBody HealthRecordRequestDTO requestDTO) {

        HealthRecord healthRecord = healthRecordMapper.toEntity(requestDTO);

        Plant plant = new Plant();
        plant.setId(requestDTO.getPlantId());
        healthRecord.setPlant(plant);

        HealthRecord updatedRecord = healthRecordService.updateHealthRecord(id, healthRecord);

        return ResponseEntity.ok(
                healthRecordMapper.toResponseDTO(updatedRecord));
    }

    //Delete Mapping
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteHealthRecord(@PathVariable Long id) {
        healthRecordService.deleteHealthRecord(id);
        return ResponseEntity.ok("Health record deleted successfully.");
    }
}