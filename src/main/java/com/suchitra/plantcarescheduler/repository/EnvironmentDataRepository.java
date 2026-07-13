package com.suchitra.plantcarescheduler.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.suchitra.plantcarescheduler.entity.EnvironmentData;

@Repository
public interface EnvironmentDataRepository extends JpaRepository<EnvironmentData, Long> {

    List<EnvironmentData> findByPlantId(Long plantId);

    List<EnvironmentData> findByRecordedDate(LocalDateTime recordedDate);

}