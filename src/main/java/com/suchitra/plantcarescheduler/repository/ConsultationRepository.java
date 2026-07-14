package com.suchitra.plantcarescheduler.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.suchitra.plantcarescheduler.entity.Consultation;

@Repository
public interface ConsultationRepository extends JpaRepository<Consultation, Long> {

    List<Consultation> findByUserId(Long userId);

    List<Consultation> findBySpecialistId(Long specialistId);

    List<Consultation> findByConsultationStatus(String status);
}