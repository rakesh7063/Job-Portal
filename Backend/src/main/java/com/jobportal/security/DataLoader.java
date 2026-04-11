package com.jobportal.security;

import com.jobportal.entity.Candidate;
import com.jobportal.entity.Recruiter;
import com.jobportal.repository.CandidateRepository;
import com.jobportal.repository.RecruiterRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;


@Component
@Profile("!test")
@Slf4j
public class DataLoader implements CommandLineRunner {

    public static final String SAMPLE_CANDIDATE_EMAIL = "candidate@test.com";
    public static final String SAMPLE_RECRUITER_EMAIL = "recruiter@test.com";

    public static final String SAMPLE_PASSWORD = "Pass@123";

    private final CandidateRepository candidateRepository;
    private final RecruiterRepository recruiterRepository;
    private final PasswordEncoder passwordEncoder;

    public DataLoader(
            CandidateRepository candidateRepository,
            RecruiterRepository recruiterRepository,
            PasswordEncoder passwordEncoder) {
        this.candidateRepository = candidateRepository;
        this.recruiterRepository = recruiterRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (!candidateRepository.existsByEmailIgnoreCase(SAMPLE_CANDIDATE_EMAIL)) {
            candidateRepository.save(Candidate.builder()
                    .name("Sample Candidate")
                    .email(SAMPLE_CANDIDATE_EMAIL)
                    .password(passwordEncoder.encode(SAMPLE_PASSWORD))
                    .experience(2)
                    .skills("Java, Spring Boot")
                    .location("Kolkata")
                    .build());
            log.info("Seeded sample candidate account ({})", SAMPLE_CANDIDATE_EMAIL);
        }

        if (!recruiterRepository.existsByEmailIgnoreCase(SAMPLE_RECRUITER_EMAIL)) {
            recruiterRepository.save(Recruiter.builder()
                    .name("Sample Recruiter")
                    .company("R.K Tech Software")
                    .email(SAMPLE_RECRUITER_EMAIL)
                    .password(passwordEncoder.encode(SAMPLE_PASSWORD))
                    .build());
            log.info("Seeded sample recruiter account ({})", SAMPLE_RECRUITER_EMAIL);
        }
    }
}
