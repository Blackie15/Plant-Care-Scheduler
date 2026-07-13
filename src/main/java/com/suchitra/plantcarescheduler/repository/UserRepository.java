package com.suchitra.plantcarescheduler.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.suchitra.plantcarescheduler.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Find a user by email.
    Optional<User> findByEmail(String email);

    // Check whether an email already exists.
    boolean existsByEmail(String email);

    // Check whether a username already exists.
    boolean existsByUsername(String username);

}