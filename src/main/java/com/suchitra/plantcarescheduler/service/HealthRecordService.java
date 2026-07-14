package com.suchitra.plantcarescheduler.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.suchitra.plantcarescheduler.entity.HealthRecord;
import com.suchitra.plantcarescheduler.entity.Plant;
import com.suchitra.plantcarescheduler.mapper.HealthRecordMapper;
import com.suchitra.plantcarescheduler.repository.HealthRecordRepository;
import com.suchitra.plantcarescheduler.repository.PlantRepository;

@Service
public class HealthRecordService {

    private final HealthRecordRepository healthRecordRepository;

    private final PlantRepository plantRepository;

    private final HealthRecordMapper healthRecordMapper;

    HealthRecordService(HealthRecordRepository healthRecordRepository, PlantRepository plantRepository, HealthRecordMapper healthRecordMapper) {
        this.healthRecordRepository = healthRecordRepository;
        this.plantRepository = plantRepository;
        this.healthRecordMapper = healthRecordMapper;
    }

    // Add Health Record
    public HealthRecord addHealthRecord(HealthRecord healthRecord) {

        Long plantId = healthRecord.getPlant().getId();

        Plant plant = plantRepository.findById(plantId)
                .orElseThrow(() -> new RuntimeException("Plant not found with id: " + plantId));

        healthRecord.setPlant(plant);

        return healthRecordRepository.save(healthRecord);
    }

    // Get All Health Records
    public List<HealthRecord> getAllHealthRecords() {
        return healthRecordRepository.findAll();
    }

    // Get Health Record By Id
    public Optional<HealthRecord> getHealthRecordById(Long id) {
        return healthRecordRepository.findById(id);
    }

    // Get Health Records By Plant Id
    public List<HealthRecord> getHealthRecordsByPlantId(Long plantId) {

        if (!plantRepository.existsById(plantId)) {
            throw new RuntimeException("Plant not found with id: " + plantId);
        }

        return healthRecordRepository.findByPlantId(plantId);
    }

    // Update Health Record
    public HealthRecord updateHealthRecord(Long id, HealthRecord updatedRecord) {

        HealthRecord existingRecord = healthRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Health record not found with id: " + id));

        Long plantId = updatedRecord.getPlant().getId();

        Plant plant = plantRepository.findById(plantId)
                .orElseThrow(() -> new RuntimeException("Plant not found with id: " + plantId));

        updatedRecord.setPlant(plant);

        healthRecordMapper.updateEntity(existingRecord, updatedRecord);

        return healthRecordRepository.save(existingRecord);
    }

    // Delete Health Record
    public void deleteHealthRecord(Long id) {

        if (!healthRecordRepository.existsById(id)) {
            throw new RuntimeException("Health record not found with id: " + id);
        }

        healthRecordRepository.deleteById(id);
    }
}