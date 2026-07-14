package com.suchitra.plantcarescheduler.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.suchitra.plantcarescheduler.entity.Consultation;
import com.suchitra.plantcarescheduler.entity.User;
import com.suchitra.plantcarescheduler.mapper.ConsultationMapper;
import com.suchitra.plantcarescheduler.repository.ConsultationRepository;
import com.suchitra.plantcarescheduler.repository.UserRepository;

@Service
public class ConsultationService {

    private final ConsultationRepository consultationRepository;

    private final UserRepository userRepository;

    private final ConsultationMapper consultationMapper;

    public ConsultationService(ConsultationRepository consultationRepository,
                               UserRepository userRepository,
                               ConsultationMapper consultationMapper) {
        this.consultationRepository = consultationRepository;
        this.userRepository = userRepository;
        this.consultationMapper = consultationMapper;
    }

    // Add Consultation
    public Consultation addConsultation(Consultation consultation) {

        Long userId = consultation.getUser().getId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        consultation.setUser(user);

        if (consultation.getSpecialist() != null) {

            Long specialistId = consultation.getSpecialist().getId();

            User specialist = userRepository.findById(specialistId)
                    .orElseThrow(() -> new RuntimeException("Specialist not found with id: " + specialistId));

            consultation.setSpecialist(specialist);
        }

        return consultationRepository.save(consultation);
    }

    // Get All Consultations
    public List<Consultation> getAllConsultations() {
        return consultationRepository.findAll();
    }

    // Get Consultation By Id
    public Optional<Consultation> getConsultationById(Long consultationId) {
        return consultationRepository.findById(consultationId);
    }

    // Get Consultations By User Id
    public List<Consultation> getConsultationsByUserId(Long userId) {

        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found with id: " + userId);
        }

        return consultationRepository.findByUserId(userId);
    }

    // Get Consultations By Specialist Id
    public List<Consultation> getConsultationsBySpecialistId(Long specialistId) {

        if (!userRepository.existsById(specialistId)) {
            throw new RuntimeException("Specialist not found with id: " + specialistId);
        }

        return consultationRepository.findBySpecialistId(specialistId);
    }

    // Get Consultations By Status
    public List<Consultation> getConsultationsByStatus(String consultationStatus) {
        return consultationRepository.findByConsultationStatus(consultationStatus);
    }

    // Update Consultation
    public Consultation updateConsultation(Long consultationId, Consultation updatedConsultation) {

        Consultation existingConsultation = consultationRepository.findById(consultationId)
                .orElseThrow(() -> new RuntimeException("Consultation not found with id: " + consultationId));

        Long userId = updatedConsultation.getUser().getId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        updatedConsultation.setUser(user);

        if (updatedConsultation.getSpecialist() != null) {

            Long specialistId = updatedConsultation.getSpecialist().getId();

            User specialist = userRepository.findById(specialistId)
                    .orElseThrow(() -> new RuntimeException("Specialist not found with id: " + specialistId));

            updatedConsultation.setSpecialist(specialist);
        }

        consultationMapper.updateEntity(existingConsultation, updatedConsultation);

        return consultationRepository.save(existingConsultation);
    }

    // Delete Consultation
    public void deleteConsultation(Long consultationId) {

        if (!consultationRepository.existsById(consultationId)) {
            throw new RuntimeException("Consultation not found with id: " + consultationId);
        }

        consultationRepository.deleteById(consultationId);
    }
}