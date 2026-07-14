package com.suchitra.plantcarescheduler.dto.healthrecorddto;

import java.time.LocalDateTime;

public class HealthRecordRequestDTO {

    private LocalDateTime assessmentDate;
    private String overallHealth;
    private String symptoms;
    private String diagnosedIssues;
    private String treatmentsApplied;
    private String photos;
    private String growthMeasurements;
    private String notes;
    private LocalDateTime followUpDate;
    private String recoveryStatus;

    private Long plantId;
    private Long assessedById;

    public HealthRecordRequestDTO() {
    }

    public LocalDateTime getAssessmentDate() {
        return assessmentDate;
    }

    public void setAssessmentDate(LocalDateTime assessmentDate) {
        this.assessmentDate = assessmentDate;
    }

    public String getOverallHealth() {
        return overallHealth;
    }

    public void setOverallHealth(String overallHealth) {
        this.overallHealth = overallHealth;
    }

    public String getSymptoms() {
        return symptoms;
    }

    public void setSymptoms(String symptoms) {
        this.symptoms = symptoms;
    }

    public String getDiagnosedIssues() {
        return diagnosedIssues;
    }

    public void setDiagnosedIssues(String diagnosedIssues) {
        this.diagnosedIssues = diagnosedIssues;
    }

    public String getTreatmentsApplied() {
        return treatmentsApplied;
    }

    public void setTreatmentsApplied(String treatmentsApplied) {
        this.treatmentsApplied = treatmentsApplied;
    }

    public String getPhotos() {
        return photos;
    }

    public void setPhotos(String photos) {
        this.photos = photos;
    }

    public String getGrowthMeasurements() {
        return growthMeasurements;
    }

    public void setGrowthMeasurements(String growthMeasurements) {
        this.growthMeasurements = growthMeasurements;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getFollowUpDate() {
        return followUpDate;
    }

    public void setFollowUpDate(LocalDateTime followUpDate) {
        this.followUpDate = followUpDate;
    }

    public String getRecoveryStatus() {
        return recoveryStatus;
    }

    public void setRecoveryStatus(String recoveryStatus) {
        this.recoveryStatus = recoveryStatus;
    }

    public Long getPlantId() {
        return plantId;
    }

    public void setPlantId(Long plantId) {
        this.plantId = plantId;
    }

    public Long getAssessedById() {
        return assessedById;
    }

    public void setAssessedById(Long assessedById) {
        this.assessedById = assessedById;
    }
}