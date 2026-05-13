package com.jobportal.repository;

import com.jobportal.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    boolean existsByJobIdAndCandidateId(Long jobId, Long candidateId);
    
    @Query("SELECT ja FROM JobApplication ja JOIN FETCH ja.candidate WHERE ja.job.id = :jobId ORDER BY ja.id DESC")
    List<JobApplication> findByJobIdOrderByIdDesc(Long jobId);
    
    @Query("SELECT ja FROM JobApplication ja JOIN FETCH ja.candidate WHERE ja.job.id = :jobId AND ja.candidate.id = :candidateId")
    java.util.Optional<JobApplication> findByJobIdAndCandidateId(Long jobId, Long candidateId);
}

