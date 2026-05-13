package com.jobportal.service;

import com.jobportal.api.dto.CandidateDtos;

public interface CandidateService {
    public CandidateDtos.CandidateProfileResponse getProfile(Long candidateId);
    public CandidateDtos.CandidateProfileResponse updateProfile(Long candidateId, CandidateDtos.UpdateCandidateProfileRequest req);
    public void uploadResume(Long candidateId, byte[] resumeData, String fileName);
}
