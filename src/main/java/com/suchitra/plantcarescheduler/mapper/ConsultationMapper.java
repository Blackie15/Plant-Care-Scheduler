package com.suchitra.plantcarescheduler.mapper;

import org.springframework.stereotype.Component;

import com.suchitra.plantcarescheduler.dto.consultationdto.ConsultationRequestDTO;
import com.suchitra.plantcarescheduler.dto.consultationdto.ConsultationResponseDTO;
import com.suchitra.plantcarescheduler.entity.Consultation;
import com.suchitra.plantcarescheduler.entity.User;

@Component
public class ConsultationMapper {

    public Consultation toEntity(ConsultationRequestDTO dto, User user, User specialist) {

        Consultation consultation = new Consultation();

        consultation.setUser(user);
        consultation.setSpecialist(specialist);
        consultation.setRequestDate(dto.getRequestDate());
        consultation.setAppointmentDate(dto.getAppointmentDate());
        consultation.setProblemDescription(dto.getProblemDescription());
        consultation.setConsultationStatus(dto.getConsultationStatus());
        consultation.setMeetingLink(dto.getMeetingLink());

        return consultation;
    }

    public ConsultationResponseDTO toResponseDTO(Consultation consultation) {

        ConsultationResponseDTO dto = new ConsultationResponseDTO();

        dto.setConsultationId(consultation.getConsultationId());

        if (consultation.getUser() != null) {
            dto.setUserId(consultation.getUser().getId());
            dto.setUserName(consultation.getUser().getUsername());
        }

        if (consultation.getSpecialist() != null) {
            dto.setSpecialistId(consultation.getSpecialist().getId());
            dto.setSpecialistName(consultation.getSpecialist().getUsername());
        }

        dto.setRequestDate(consultation.getRequestDate());
        dto.setAppointmentDate(consultation.getAppointmentDate());
        dto.setProblemDescription(consultation.getProblemDescription());
        dto.setConsultationStatus(consultation.getConsultationStatus());
        dto.setMeetingLink(consultation.getMeetingLink());
        dto.setCreatedDate(consultation.getCreatedDate());

        return dto;
    }

    public void updateEntity(Consultation existingConsultation, Consultation updatedConsultation) {

        existingConsultation.setUser(updatedConsultation.getUser());
        existingConsultation.setSpecialist(updatedConsultation.getSpecialist());
        existingConsultation.setRequestDate(updatedConsultation.getRequestDate());
        existingConsultation.setAppointmentDate(updatedConsultation.getAppointmentDate());
        existingConsultation.setProblemDescription(updatedConsultation.getProblemDescription());
        existingConsultation.setConsultationStatus(updatedConsultation.getConsultationStatus());
        existingConsultation.setMeetingLink(updatedConsultation.getMeetingLink());
    }
}