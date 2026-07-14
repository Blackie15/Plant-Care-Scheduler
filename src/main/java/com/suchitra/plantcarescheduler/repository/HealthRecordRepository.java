package com.suchitra.plantcarescheduler.repository;

import com.suchitra.plantcarescheduler.entity.HealthRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.List;

@Repository
public interface HealthRecordRepository extends JpaRepository<HealthRecord, Long> {

    List<HealthRecord> findByPlantId(Long plantId);

    List<HealthRecord> findByOverallHealth(String health);
}