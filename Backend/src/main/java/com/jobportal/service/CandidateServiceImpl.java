package com.jobportal.service;

import com.jobportal.api.dto.CandidateDtos;
import com.jobportal.entity.Candidate;
import com.jobportal.event.ProfileUpdateSubmissionEvent;
import com.jobportal.exception.NotFoundException;
import com.jobportal.repository.CandidateRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

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

    @Transactional
    @Override
    public void uploadResume(Long candidateId, byte[] resumeData, String fileName) {
        Candidate c = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new NotFoundException("Candidate not found"));

        try {
            // Create uploads/resumes directory if it doesn't exist
            Path uploadDir = Paths.get("uploads", "resumes");
            Files.createDirectories(uploadDir);

            // Generate unique filename
            String extension = getFileExtension(fileName);
            String uniqueFileName = candidateId + "_" + System.currentTimeMillis() + "." + extension;
            Path filePath = uploadDir.resolve(uniqueFileName);

            // Save file
            Files.write(filePath, resumeData);

            // Update candidate with resume path
            c.setResumePath(filePath.toString());
        } catch (IOException e) {
            throw new RuntimeException("Failed to save resume file", e);
        }
    }

    private String getFileExtension(String fileName) {
        int lastDotIndex = fileName.lastIndexOf('.');
        return lastDotIndex > 0 ? fileName.substring(lastDotIndex + 1) : "pdf";
    }

    private static CandidateDtos.CandidateProfileResponse toProfile(Candidate c) {
        return new CandidateDtos.CandidateProfileResponse(
                c.getId(),
                c.getName(),
                c.getEmail(),
                c.getExperience(),
                c.getSkills(),
                c.getLocation(),
                c.getResumePath()
        );
    }
}

