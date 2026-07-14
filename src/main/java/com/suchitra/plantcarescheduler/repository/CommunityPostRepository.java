package com.suchitra.plantcarescheduler.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.suchitra.plantcarescheduler.entity.CommunityPost;

@Repository
public interface CommunityPostRepository extends JpaRepository<CommunityPost, Long> {

    List<CommunityPost> findByUserId(Long userId);

    List<CommunityPost> findByTitleContainingIgnoreCase(String title);

}