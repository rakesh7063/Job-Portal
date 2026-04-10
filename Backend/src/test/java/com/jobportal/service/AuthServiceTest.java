package com.jobportal.service;

import com.jobportal.api.dto.AuthDtos;
import com.jobportal.entity.Candidate;
import com.jobportal.exception.BadRequestException;
import com.jobportal.repository.CandidateRepository;
import com.jobportal.repository.RecruiterRepository;
import com.jobportal.security.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {
    @Mock CandidateRepository candidateRepository;
    @Mock RecruiterRepository recruiterRepository;
    @Mock PasswordEncoder passwordEncoder;
    @Mock JwtService jwtService;

    @InjectMocks AuthService authService;

    @Test
    void registerCandidate_rejectsDuplicateEmail() {
        when(candidateRepository.existsByEmailIgnoreCase("a@test.com")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.registerCandidate(
                new AuthDtos.RegisterCandidateRequest("A", "a@test.com", "pw", 0, null, null)
        ));
    }

    @Test
    void login_candidate_success_returnsToken() {
        Candidate c = Candidate.builder()
                .id(10L)
                .name("Cand")
                .email("cand@test.com")
                .password("ENC")
                .experience(2)
                .build();

        when(candidateRepository.findByEmailIgnoreCase("cand@test.com")).thenReturn(Optional.of(c));
        when(recruiterRepository.findByEmailIgnoreCase("cand@test.com")).thenReturn(Optional.empty());
        when(passwordEncoder.matches("pw", "ENC")).thenReturn(true);
        when(jwtService.generateToken(any())).thenReturn("JWT");

        AuthDtos.AuthResponse resp = authService.login(new AuthDtos.LoginRequest("cand@test.com", "pw"));
        assertEquals("JWT", resp.token());
        assertEquals("ROLE_CANDIDATE", resp.role());
    }
}

