package com.jobportal.repository;

import com.jobportal.entity.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CandidateRepository extends JpaRepository<Candidate, Long> {
    Optional<Candidate> findByEmailIgnoreCase(String email);
    boolean existsByEmailIgnoreCase(String email);
}

