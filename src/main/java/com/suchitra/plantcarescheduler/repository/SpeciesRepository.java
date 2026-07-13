package com.suchitra.plantcarescheduler.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.suchitra.plantcarescheduler.entity.Species;

@Repository
public interface SpeciesRepository extends JpaRepository<Species, Long> {

    Optional<Species> findByScientificName(String scientificName);

}