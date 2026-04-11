package com.jobportal.service;

import com.jobportal.api.dto.CandidateDtos;
import com.jobportal.entity.Candidate;
import com.jobportal.exception.NotFoundException;
import com.jobportal.repository.CandidateRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CandidateServiceImpl implements CandidateService {
    private final CandidateRepository candidateRepository;

    public CandidateServiceImpl(CandidateRepository candidateRepository) {
        this.candidateRepository = candidateRepository;
    }

    @Transactional(readOnly = true)
    @Override
    public CandidateDtos.CandidateProfileResponse getProfile(Long candidateId) {
        Candidate c = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new NotFoundException("Candidate not found"));
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

