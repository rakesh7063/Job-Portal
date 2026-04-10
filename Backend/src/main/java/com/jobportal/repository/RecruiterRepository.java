package com.jobportal.repository;

import com.jobportal.entity.Recruiter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RecruiterRepository extends JpaRepository<Recruiter, Long> {
    Optional<Recruiter> findByEmailIgnoreCase(String email);
    boolean existsByEmailIgnoreCase(String email);
}

