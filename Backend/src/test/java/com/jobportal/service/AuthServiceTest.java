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

import com.jobportal.entity.Recruiter;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
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
    void registerCandidate_persistsBcryptedPassword() {
        when(candidateRepository.existsByEmailIgnoreCase("new@test.com")).thenReturn(false);
        when(recruiterRepository.existsByEmailIgnoreCase("new@test.com")).thenReturn(false);
        when(passwordEncoder.encode("secret")).thenReturn("ENC_HASH");

        authService.registerCandidate(new AuthDtos.RegisterCandidateRequest(
                "Name", "new@test.com", "secret", 1, "Java", "Kolkata"));

        verify(passwordEncoder).encode("secret");
        verify(candidateRepository).save(argThat(c -> "ENC_HASH".equals(c.getPassword())
                && "new@test.com".equals(c.getEmail())));
    }

    @Test
    void registerRecruiter_rejectsDuplicateEmail() {
        when(recruiterRepository.existsByEmailIgnoreCase("r@test.com")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.registerRecruiter(
                new AuthDtos.RegisterRecruiterRequest("R", "Co", "r@test.com", "pw")
        ));
    }

    @Test
    void registerRecruiter_persistsBcryptedPassword() {
        when(candidateRepository.existsByEmailIgnoreCase("rec@corp.com")).thenReturn(false);
        when(recruiterRepository.existsByEmailIgnoreCase("rec@corp.com")).thenReturn(false);
        when(passwordEncoder.encode("pw")).thenReturn("R_ENC");

        authService.registerRecruiter(new AuthDtos.RegisterRecruiterRequest(
                "Rec Name", "Corp", "rec@corp.com", "pw"));

        verify(recruiterRepository).save(argThat(r -> "R_ENC".equals(r.getPassword())));
    }

    @Test
    void login_unknownEmail_throws() {
        when(candidateRepository.findByEmailIgnoreCase("x@test.com")).thenReturn(Optional.empty());
        when(recruiterRepository.findByEmailIgnoreCase("x@test.com")).thenReturn(Optional.empty());

        assertThrows(BadRequestException.class, () ->
                authService.login(new AuthDtos.LoginRequest("x@test.com", "pw")));
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

    @Test
    void login_recruiter_success_returnsToken() {
        Recruiter r = Recruiter.builder()
                .id(20L)
                .name("Rec")
                .company("Co")
                .email("rec@test.com")
                .password("ENC")
                .build();

        when(candidateRepository.findByEmailIgnoreCase("rec@test.com")).thenReturn(Optional.empty());
        when(recruiterRepository.findByEmailIgnoreCase("rec@test.com")).thenReturn(Optional.of(r));
        when(passwordEncoder.matches("pw", "ENC")).thenReturn(true);
        when(jwtService.generateToken(any())).thenReturn("JWT_R");

        AuthDtos.AuthResponse resp = authService.login(new AuthDtos.LoginRequest("rec@test.com", "pw"));
        assertEquals("JWT_R", resp.token());
        assertEquals("ROLE_RECRUITER", resp.role());
    }

    @Test
    void login_invalidPassword_shouldFail() {

        Candidate candidate = Candidate.builder()
                .id(1L)
                .name("Test")
                .email("test@test.com")
                .password("ENC")
                .build();

        when(candidateRepository.findByEmailIgnoreCase("test@test.com"))
                .thenReturn(Optional.of(candidate));

        when(recruiterRepository.findByEmailIgnoreCase("test@test.com"))
                .thenReturn(Optional.empty());

        when(passwordEncoder.matches(any(), any())).thenReturn(false);

        assertThrows(BadRequestException.class, () ->
                authService.login(new AuthDtos.LoginRequest("test@test.com", "wrong"))
        );
    }
}

