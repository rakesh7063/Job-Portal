package com.jobportal.service;

import com.jobportal.api.dto.CandidateDtos;
import com.jobportal.entity.Candidate;
import com.jobportal.event.ProfileUpdateSubmissionEvent;
import com.jobportal.exception.NotFoundException;
import com.jobportal.repository.CandidateRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CandidateServiceImpl implements CandidateService {
    private final CandidateRepository candidateRepository;
    private final ApplicationEventPublisher eventPublisher;

    public CandidateServiceImpl(CandidateRepository candidateRepository, ApplicationEventPublisher eventPublisher) {
        this.candidateRepository = candidateRepository;
        this.eventPublisher = eventPublisher;
    }

    @Transactional(readOnly = true)
    @Override
    public CandidateDtos.CandidateProfileResponse getProfile(Long candidateId) {
        Candidate c = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new NotFoundException("Candidate not found"));
//        eventPublisher.publishEvent( new ProfileUpdateSubmissionEvent(c.getName(),c.getEmail(),c.getSkills(),c.getLocation()));
        return toProfile(c);
    }

    @Transactional
    @Override
    public CandidateDtos.CandidateProfileResponse updateProfile(Long candidateId, CandidateDtos.UpdateCandidateProfileRequest req) {
        Candidate c = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new NotFoundException("Candidate not found"));
        c.setName(req.name());
        c.setExperience(req.experience());
        c.setSkills(req.skills());
        c.setLocation(req.location());
        return toProfile(c);
    }

    private static CandidateDtos.CandidateProfileResponse toProfile(Candidate c) {
        return new CandidateDtos.CandidateProfileResponse(
                c.getId(),
                c.getName(),
                c.getEmail(),
                c.getExperience(),
                c.getSkills(),
                c.getLocation()
        );
    }
}

