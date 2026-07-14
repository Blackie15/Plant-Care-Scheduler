package com.suchitra.plantcarescheduler.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.suchitra.plantcarescheduler.dto.consultationdto.ConsultationRequestDTO;
import com.suchitra.plantcarescheduler.dto.consultationdto.ConsultationResponseDTO;
import com.suchitra.plantcarescheduler.entity.Consultation;
import com.suchitra.plantcarescheduler.entity.User;
import com.suchitra.plantcarescheduler.mapper.ConsultationMapper;
import com.suchitra.plantcarescheduler.service.ConsultationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/consultations")
public class ConsultationController {

    private final ConsultationService consultationService;

    private final ConsultationMapper consultationMapper;

    public ConsultationController(ConsultationService consultationService,
                                  ConsultationMapper consultationMapper) {
        this.consultationService = consultationService;
        this.consultationMapper = consultationMapper;
    }

    // Add Consultation
    @PostMapping
    public ResponseEntity<ConsultationResponseDTO> addConsultation(
            @Valid @RequestBody ConsultationRequestDTO requestDTO) {

        User user = new User();
        user.setId(requestDTO.getUserId());

        User specialist = null;
        if (requestDTO.getSpecialistId() != null) {
            specialist = new User();
            specialist.setId(requestDTO.getSpecialistId());
        }

        Consultation consultation = consultationMapper.toEntity(requestDTO, user, specialist);

        Consultation savedConsultation = consultationService.addConsultation(consultation);

        return new ResponseEntity<>(
                consultationMapper.toResponseDTO(savedConsultation),
                HttpStatus.CREATED);
    }

    // Get All Consultations
    @GetMapping
    public ResponseEntity<List<ConsultationResponseDTO>> getAllConsultations() {

        List<ConsultationResponseDTO> consultations =
                consultationService.getAllConsultations()
                        .stream()
                        .map(consultationMapper::toResponseDTO)
                        .collect(Collectors.toList());

        return ResponseEntity.ok(consultations);
    }

    // Get Consultation By Id
    @GetMapping("/{id}")
    public ResponseEntity<ConsultationResponseDTO> getConsultationById(@PathVariable Long id) {

        Consultation consultation = consultationService.getConsultationById(id)
                .orElseThrow(() -> new RuntimeException("Consultation not found with id: " + id));

        return ResponseEntity.ok(consultationMapper.toResponseDTO(consultation));
    }

    // Get Consultations By User Id
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ConsultationResponseDTO>> getConsultationsByUserId(
            @PathVariable Long userId) {

        List<ConsultationResponseDTO> consultations =
                consultationService.getConsultationsByUserId(userId)
                        .stream()
                        .map(consultationMapper::toResponseDTO)
                        .collect(Collectors.toList());

        return ResponseEntity.ok(consultations);
    }

    // Get Consultations By Specialist Id
    @GetMapping("/specialist/{specialistId}")
    public ResponseEntity<List<ConsultationResponseDTO>> getConsultationsBySpecialistId(
            @PathVariable Long specialistId) {

        List<ConsultationResponseDTO> consultations =
                consultationService.getConsultationsBySpecialistId(specialistId)
                        .stream()
                        .map(consultationMapper::toResponseDTO)
                        .collect(Collectors.toList());

        return ResponseEntity.ok(consultations);
    }

    // Get Consultations By Status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<ConsultationResponseDTO>> getConsultationsByStatus(
            @PathVariable String status) {

        List<ConsultationResponseDTO> consultations =
                consultationService.getConsultationsByStatus(status)
                        .stream()
                        .map(consultationMapper::toResponseDTO)
                        .collect(Collectors.toList());

        return ResponseEntity.ok(consultations);
    }

    // Update Consultation
    @PutMapping("/{id}")
    public ResponseEntity<ConsultationResponseDTO> updateConsultation(
            @PathVariable Long id,
            @Valid @RequestBody ConsultationRequestDTO requestDTO) {

        User user = new User();
        user.setId(requestDTO.getUserId());

        User specialist = null;
        if (requestDTO.getSpecialistId() != null) {
            specialist = new User();
            specialist.setId(requestDTO.getSpecialistId());
        }

        Consultation consultation = consultationMapper.toEntity(requestDTO, user, specialist);

        Consultation updatedConsultation =
                consultationService.updateConsultation(id, consultation);

        return ResponseEntity.ok(
                consultationMapper.toResponseDTO(updatedConsultation));
    }

    // Delete Consultation
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteConsultation(@PathVariable Long id) {

        consultationService.deleteConsultation(id);

        return ResponseEntity.ok("Consultation deleted successfully");
    }
}