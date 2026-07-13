package com.suchitra.plantcarescheduler.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.suchitra.plantcarescheduler.entity.Plant;
import com.suchitra.plantcarescheduler.entity.Species;
import com.suchitra.plantcarescheduler.entity.User;

@Repository
public interface PlantRepository extends JpaRepository<Plant, Long> {

    List<Plant> findByOwner(User owner);

    List<Plant> findBySpecies(Species species);

}