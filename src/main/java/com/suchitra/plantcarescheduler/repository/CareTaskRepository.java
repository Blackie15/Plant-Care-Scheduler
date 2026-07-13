package com.suchitra.plantcarescheduler.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.suchitra.plantcarescheduler.entity.CareTask;

@Repository
public interface CareTaskRepository extends JpaRepository<CareTask, Long> {

    List<CareTask> findByPlantId(Long plantId);

    List<CareTask> findByStatus(String status);

    List<CareTask> findByScheduledDate(LocalDateTime scheduledDate);

}