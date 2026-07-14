package com.suchitra.plantcarescheduler.mapper;

import org.springframework.stereotype.Component;

import com.suchitra.plantcarescheduler.dto.healthrecorddto.HealthRecordRequestDTO;
import com.suchitra.plantcarescheduler.dto.healthrecorddto.HealthRecordResponseDTO;
import com.suchitra.plantcarescheduler.entity.HealthRecord;

@Component
public class HealthRecordMapper {

    public HealthRecord toEntity(HealthRecordRequestDTO dto) {

        HealthRecord record = new HealthRecord();

        record.setAssessmentDate(dto.getAssessmentDate());
        record.setOverallHealth(dto.getOverallHealth());
        record.setSymptoms(dto.getSymptoms());
        record.setDiagnosedIssues(dto.getDiagnosedIssues());
        record.setTreatmentsApplied(dto.getTreatmentsApplied());
        record.setPhotos(dto.getPhotos());
        record.setGrowthMeasurements(dto.getGrowthMeasurements());
        record.setNotes(dto.getNotes());
        record.setFollowUpDate(dto.getFollowUpDate());
        record.setRecoveryStatus(dto.getRecoveryStatus());

        return record;
    }

    public HealthRecordResponseDTO toResponseDTO(HealthRecord record) {

        HealthRecordResponseDTO dto = new HealthRecordResponseDTO();

        dto.setId(record.getId());
        dto.setAssessmentDate(record.getAssessmentDate());
        dto.setOverallHealth(record.getOverallHealth());
        dto.setSymptoms(record.getSymptoms());
        dto.setDiagnosedIssues(record.getDiagnosedIssues());
        dto.setTreatmentsApplied(record.getTreatmentsApplied());
        dto.setPhotos(record.getPhotos());
        dto.setGrowthMeasurements(record.getGrowthMeasurements());
        dto.setNotes(record.getNotes());
        dto.setFollowUpDate(record.getFollowUpDate());
        dto.setRecoveryStatus(record.getRecoveryStatus());

        if (record.getPlant() != null) {
            dto.setPlantId(record.getPlant().getId());
        }

        return dto;
    }

    public void updateEntity(HealthRecord existingRecord, HealthRecord updatedRecord) {

        existingRecord.setAssessmentDate(updatedRecord.getAssessmentDate());
        existingRecord.setOverallHealth(updatedRecord.getOverallHealth());
        existingRecord.setSymptoms(updatedRecord.getSymptoms());
        existingRecord.setDiagnosedIssues(updatedRecord.getDiagnosedIssues());
        existingRecord.setTreatmentsApplied(updatedRecord.getTreatmentsApplied());
        existingRecord.setPhotos(updatedRecord.getPhotos());
        existingRecord.setGrowthMeasurements(updatedRecord.getGrowthMeasurements());
        existingRecord.setNotes(updatedRecord.getNotes());
        existingRecord.setFollowUpDate(updatedRecord.getFollowUpDate());
        existingRecord.setRecoveryStatus(updatedRecord.getRecoveryStatus());
        existingRecord.setPlant(updatedRecord.getPlant());
    }
}