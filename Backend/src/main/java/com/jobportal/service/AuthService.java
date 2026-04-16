package com.jobportal.service;

import com.jobportal.api.dto.AuthDtos;
import com.jobportal.entity.Candidate;
import com.jobportal.entity.Recruiter;
import com.jobportal.event.ProfileUpdateSubmissionEvent;
import com.jobportal.exception.BadRequestException;
import com.jobportal.repository.CandidateRepository;
import com.jobportal.repository.RecruiterRepository;
import com.jobportal.security.AuthenticatedUser;
import com.jobportal.security.JwtService;
import com.jobportal.security.UserRole;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    private final CandidateRepository candidateRepository;
    private final RecruiterRepository recruiterRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final ApplicationEventPublisher eventPublisher;

    public AuthService(
            CandidateRepository candidateRepository,
            RecruiterRepository recruiterRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            ApplicationEventPublisher eventPublisher
    ) {
        this.candidateRepository = candidateRepository;
        this.recruiterRepository = recruiterRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public void registerCandidate(AuthDtos.RegisterCandidateRequest req) {
        ensureEmailFree(req.email());
        Candidate c = Candidate.builder()
                .name(req.name())
                .email(req.email().trim().toLowerCase())
                .password(passwordEncoder.encode(req.password()))
                .experience(req.experience())
                .skills(req.skills())
                .location(req.location())
                .build();
        candidateRepository.save(c);
    }
    @Transactional
    public void updatePassword(AuthDtos.ForgotPasswordRequest req){
        String email = req.email().trim().toLowerCase();
        Candidate c = candidateRepository.findByEmailIgnoreCase(email).orElse(null);
        Recruiter r = recruiterRepository.findByEmailIgnoreCase(email).orElse(null);
        System.out.println(c+" --> " +r);
        if (c == null && r == null) {
            throw new BadRequestException("Invalid credentials");
        }
        if (c != null && r != null) {
            throw new BadRequestException("Ambiguous account; contact support");
        }

        if(c!=null){
            c.setPassword(passwordEncoder.encode(req.password()));
            candidateRepository.save(c);
            eventPublisher.publishEvent( new ProfileUpdateSubmissionEvent(c.getName(),c.getEmail(),c.getSkills(),c.getLocation()));

        }
        else {
            r.setPassword(passwordEncoder.encode(req.password()));
            recruiterRepository.save(r);
        }
        eventPublisher.publishEvent( new ProfileUpdateSubmissionEvent(r.getName(),r.getEmail(),"",""));
    }

    @Transactional
    public void registerRecruiter(AuthDtos.RegisterRecruiterRequest req) {
        ensureEmailFree(req.email());
        Recruiter r = Recruiter.builder()
                .name(req.name())
                .company(req.company())
                .email(req.email().trim().toLowerCase())
                .password(passwordEncoder.encode(req.password()))
                .build();
        recruiterRepository.save(r);
    }

    @Transactional(readOnly = true)
    public AuthDtos.AuthResponse login(AuthDtos.LoginRequest req) {
        String email = req.email().trim().toLowerCase();

        Candidate c = candidateRepository.findByEmailIgnoreCase(email).orElse(null);
        Recruiter r = recruiterRepository.findByEmailIgnoreCase(email).orElse(null);

        if (c == null && r == null) {
            throw new BadRequestException("Invalid credentials");
        }
        if (c != null && r != null) {
            throw new BadRequestException("Ambiguous account; contact support");
        }

        if (c != null) {
            if (!passwordEncoder.matches(req.password(), c.getPassword())) {
                throw new BadRequestException("Invalid credentials");
            }
            AuthenticatedUser user = new AuthenticatedUser(c.getId(), c.getEmail(), UserRole.ROLE_CANDIDATE);
            return new AuthDtos.AuthResponse(jwtService.generateToken(user), user.role().name());
        }

        if (!passwordEncoder.matches(req.password(), r.getPassword())) {
            throw new BadRequestException("Invalid credentials");
        }
        AuthenticatedUser user = new AuthenticatedUser(r.getId(), r.getEmail(), UserRole.ROLE_RECRUITER);
        return new AuthDtos.AuthResponse(jwtService.generateToken(user), user.role().name());
    }

    private void ensureEmailFree(String email) {
        String normalized = email.trim().toLowerCase();
        if (candidateRepository.existsByEmailIgnoreCase(normalized) || recruiterRepository.existsByEmailIgnoreCase(normalized)) {
            throw new BadRequestException("Email already registered");
        }
    }
}

